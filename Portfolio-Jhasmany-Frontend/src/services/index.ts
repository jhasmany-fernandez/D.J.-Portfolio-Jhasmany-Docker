import { Project, Testimonial } from '@/lib/types'
import { promises as fs } from 'fs'
import { unstable_cache } from 'next/cache'
import path from 'path'

// Note: fs and path imports still needed for testimonials

// Internal function to fetch all projects from API
const fetchAllProjectsFromAPI = async (): Promise<Project[]> => {
  try {
    // Check if we're running server-side (inside Docker container)
    const isServer = typeof window === 'undefined'

    // Server-side: call backend directly using Docker service name
    // Client-side: use the frontend's API route proxy
    const apiUrl = isServer
      ? (process.env.API_URL || 'http://backend:3001')  // Direct backend call during SSR
      : (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3002') // Frontend proxy for client

    console.log('[fetchAllProjectsFromAPI] Fetching from:', `${apiUrl}/api/projects`, 'isServer:', isServer)

    const response = await fetch(`${apiUrl}/api/projects`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store' // Always get fresh data for SSR
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[fetchAllProjectsFromAPI] API error:', response.status, errorText)
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()

    // Handle different response formats:
    // - Backend returns array directly: [{...}]
    // - Frontend API route returns object: {projects: [{...}]}
    const projects = Array.isArray(data) ? data : (data.projects || [])

    console.log('[fetchAllProjectsFromAPI] Received projects:', projects.length)
    return projects
  } catch (error) {
    console.error('[fetchAllProjectsFromAPI] Fatal error - NO FALLBACK:', error)
    // NO FALLBACK - Force using the database
    return []
  }
}

// REMOVED: Fallback function - We now always use the database
// const fetchAllProjectsFromFiles = async (): Promise<Project[]> => { ... }

// NO CACHE - Always fetch fresh data from database
const getAllProjects = fetchAllProjectsFromAPI

// Internal function to fetch all testimonials (not cached)
const fetchAllTestimonials = async (): Promise<Testimonial[]> => {
  try {
    const testimonialsPath = path.join(process.cwd(), '/content/testimonials')
    const testimonialsName = await fs.readdir(testimonialsPath)

    const testimonials = await Promise.all(
      testimonialsName.map(async (testimonialName) => {
        const filePath = path.join(testimonialsPath, testimonialName)
        const testimonialDetails = await fs.readFile(filePath, 'utf8')
        return JSON.parse(testimonialDetails)
      }),
    )

    // Sort testimonials by date
    testimonials.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return testimonials
  } catch (error) {
    // Handle errors
    console.error('[getAllTestimonials] Error loading testimonials:', error)
    return []
  }
}

// Cached version - revalidates every hour (3600 seconds)
const getAllTestimonials = unstable_cache(fetchAllTestimonials, ['all-testimonials'], {
  revalidate: 3600, // Cache for 1 hour
  tags: ['testimonials'],
})

export { getAllProjects, getAllTestimonials }
