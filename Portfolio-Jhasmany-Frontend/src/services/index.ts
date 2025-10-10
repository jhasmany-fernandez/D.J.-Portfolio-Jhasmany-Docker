import { Project, Testimonial } from '@/lib/types'
import { promises as fs } from 'fs'
import { unstable_cache } from 'next/cache'
import path from 'path'

// Function to read project file
const readProjectFile = async (filePath: string): Promise<Project> => {
  const projectData = await fs.readFile(filePath, 'utf8')
  return JSON.parse(projectData)
}

// Internal function to fetch all projects from API
const fetchAllProjectsFromAPI = async (): Promise<Project[]> => {
  try {
    const apiUrl = process.env.API_URL || 'http://localhost:3000'
    const response = await fetch(`${apiUrl}/api/projects`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store' // Always get fresh data for SSR
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return data.projects || []
  } catch (error) {
    console.error('[fetchAllProjectsFromAPI] Error:', error)
    // Fallback to file system if API fails
    return fetchAllProjectsFromFiles()
  }
}

// Fallback function to fetch projects from files (existing logic)
const fetchAllProjectsFromFiles = async (): Promise<Project[]> => {
  try {
    const projectsPath = path.join(process.cwd(), '/content/projects')
    const projectsName = await fs.readdir(projectsPath)

    const projects = await Promise.all(
      projectsName.map(async (projectName) => {
        const filePath = path.join(projectsPath, projectName)
        const projectDetails = await readProjectFile(filePath)
        return projectDetails
      }),
    )

    // Sort projects by priority
    projects.sort((a, b) => a.priority - b.priority)

    return projects
  } catch (error) {
    // Handle errors
    console.error('[fetchAllProjectsFromFiles] Error loading projects:', error)
    return []
  }
}

// Use API by default, with file fallback
const getAllProjects = unstable_cache(fetchAllProjectsFromAPI, ['all-projects'], {
  revalidate: 10, // Cache for 10 seconds to allow faster updates
  tags: ['projects'],
})

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
