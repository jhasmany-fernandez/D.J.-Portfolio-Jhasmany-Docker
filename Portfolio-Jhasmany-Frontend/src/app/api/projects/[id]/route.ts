import { Project } from '@/lib/types'
import { promises as fs } from 'fs'
import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import path from 'path'

const projectsPath = path.join(process.cwd(), '/content/projects')

// GET single project by ID
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const filename = `${id}.json`
    const filePath = path.join(projectsPath, filename)

    const projectData = await fs.readFile(filePath, 'utf8')
    const project = JSON.parse(projectData)

    return NextResponse.json({
      project: { id, ...project }
    })
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json({ error: 'Project not found' }, { status: 404 })
  }
}

// PUT update project
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const project: Project = body

    const filename = `${id}.json`
    const filePath = path.join(projectsPath, filename)

    // Check if project exists
    try {
      await fs.access(filePath)
    } catch {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Update project
    await fs.writeFile(filePath, JSON.stringify(project, null, 2))

    // Revalidate cache to show changes immediately
    revalidateTag('projects')

    return NextResponse.json({
      message: 'Project updated successfully',
      project: { id, ...project }
    })
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}

// DELETE project
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const filename = `${id}.json`
    const filePath = path.join(projectsPath, filename)

    // Check if project exists
    try {
      await fs.access(filePath)
    } catch {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Delete project
    await fs.unlink(filePath)

    // Revalidate cache to show changes immediately
    revalidateTag('projects')

    return NextResponse.json({
      message: 'Project deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
  }
}