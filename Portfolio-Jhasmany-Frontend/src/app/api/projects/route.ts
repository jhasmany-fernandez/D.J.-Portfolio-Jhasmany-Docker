import { Project } from '@/lib/types'
import { promises as fs } from 'fs'
import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import path from 'path'

const projectsPath = path.join(process.cwd(), '/content/projects')

// GET all projects
export async function GET() {
  try {
    const projectFiles = await fs.readdir(projectsPath)

    const projects = await Promise.all(
      projectFiles.map(async (filename) => {
        const filePath = path.join(projectsPath, filename)
        const projectData = await fs.readFile(filePath, 'utf8')
        const project = JSON.parse(projectData)
        return {
          id: filename.replace('.json', ''),
          ...project
        }
      })
    )

    // Sort by priority
    projects.sort((a, b) => a.priority - b.priority)

    return NextResponse.json({ projects })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

// POST create new project
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const project: Project = body

    // Generate ID based on title
    const id = project.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
    const filename = `${id}.json`
    const filePath = path.join(projectsPath, filename)

    // Check if project already exists
    try {
      await fs.access(filePath)
      return NextResponse.json({ error: 'Project already exists' }, { status: 409 })
    } catch {
      // File doesn't exist, continue
    }

    // Save project
    await fs.writeFile(filePath, JSON.stringify(project, null, 2))

    // Revalidate cache to show changes immediately
    revalidateTag('projects')

    return NextResponse.json({
      message: 'Project created successfully',
      project: { id, ...project }
    })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}