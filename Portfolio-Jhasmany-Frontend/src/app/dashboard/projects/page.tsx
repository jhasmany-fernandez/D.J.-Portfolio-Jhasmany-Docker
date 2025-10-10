'use client'

import { Project } from '@/lib/types'
import { useEffect, useState } from 'react'

interface ProjectWithId extends Project {
  id: string
}

export default function ProjectsPage() {
  console.log('ProjectsPage component rendering...')

  const [projects, setProjects] = useState<ProjectWithId[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingProject, setEditingProject] = useState<ProjectWithId | null>(null)
  const [editForm, setEditForm] = useState<ProjectWithId | null>(null)
  const [saving, setSaving] = useState(false)

  // Fetch projects
  const fetchProjects = async () => {
    try {
      console.log('Fetching projects from /api/projects...')
      const response = await fetch('/api/projects')
      console.log('Response status:', response.status)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('Projects data received:', data)
      console.log('Number of projects:', data.projects?.length)
      setProjects(data.projects || [])
      setError(null)
    } catch (error) {
      console.error('Error fetching projects:', error)
      setError(error instanceof Error ? error.message : 'Unknown error')
      setProjects([]) // Ensure projects is set to empty array on error
    } finally {
      setLoading(false)
    }
  }

  // Delete project
  const deleteProject = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este proyecto?')) return

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchProjects() // Refresh list
      } else {
        alert('Error al eliminar el proyecto')
      }
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Error al eliminar el proyecto')
    }
  }

  // Start editing project
  const startEditing = (project: ProjectWithId) => {
    setEditingProject(project)
    setEditForm({ ...project })
  }

  // Cancel editing
  const cancelEditing = () => {
    setEditingProject(null)
    setEditForm(null)
  }

  // Update form field
  const updateFormField = (field: keyof ProjectWithId, value: string | number | boolean) => {
    if (editForm) {
      setEditForm({
        ...editForm,
        [field]: value
      })
    }
  }

  // Save project changes
  const saveProject = async () => {
    if (!editForm || !editingProject) return

    console.log('Saving project:', editForm)
    setSaving(true)
    try {
      const response = await fetch(`/api/projects/${editingProject.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      })

      console.log('Save response status:', response.status)

      if (response.ok) {
        const result = await response.json()
        console.log('Save result:', result)

        console.log('Refreshing projects list...')
        await fetchProjects() // Refresh list

        cancelEditing() // Close modal
        alert('Proyecto actualizado exitosamente')
      } else {
        const errorText = await response.text()
        console.error('Save error response:', errorText)
        alert('Error al actualizar el proyecto')
      }
    } catch (error) {
      console.error('Error updating project:', error)
      alert('Error al actualizar el proyecto')
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])
  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral mb-2">Projects Management</h1>
          <p className="text-tertiary-content">Cargando proyectos...</p>
        </div>
        <div className="flex justify-center py-12">
          <div className="text-accent text-2xl">⏳ Cargando...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral mb-2">Projects Management</h1>
          <p className="text-tertiary-content">Error al cargar proyectos</p>
        </div>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
        </div>
        <button
          onClick={fetchProjects}
          className="bg-accent hover:bg-accent/80 text-secondary px-4 py-2 rounded-lg transition-colors duration-200"
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral mb-2">Projects Management</h1>
        <p className="text-tertiary-content">Gestiona todos tus proyectos del portfolio</p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-accent hover:bg-accent/80 text-secondary px-4 py-2 rounded-lg transition-colors duration-200"
        >
          + Nuevo Proyecto
        </button>
        <button className="bg-secondary hover:bg-secondary/80 text-primary-content border border-border px-4 py-2 rounded-lg transition-colors duration-200">
          Actualizar Cache
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div key={project.id} className="bg-secondary border-border rounded-lg border p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="text-accent text-2xl">
                {project.type?.includes('New') ? '🔥' :
                 project.type?.includes('Client') ? '👤' : '🚀'}
              </div>
              <span className="bg-accent/20 text-accent px-2 py-1 rounded-full text-xs">
                Prioridad {project.priority}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-neutral mb-2 truncate" title={project.title}>
              {project.title}
            </h3>
            <p className="text-tertiary-content text-sm mb-4 line-clamp-3">
              {project.shortDescription}
            </p>

            <div className="flex gap-2 mb-4 flex-wrap">
              <span className="bg-primary/50 text-primary-content px-2 py-1 rounded text-xs">
                {project.type || 'Sin categoría'}
              </span>
              {project.siteAge && (
                <span className="bg-primary/50 text-primary-content px-2 py-1 rounded text-xs">
                  {project.siteAge}
                </span>
              )}
              {project.visitors && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                  👥 {project.visitors}
                </span>
              )}
              {project.earned && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                  💰 {project.earned}
                </span>
              )}
              {project.githubStars && (
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                  ⭐ {project.githubStars}
                </span>
              )}
              {project.numberOfSales && (
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                  🛒 {project.numberOfSales}
                </span>
              )}
            </div>

            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => startEditing(project)}
                className="bg-accent hover:bg-accent/80 text-secondary px-3 py-1 rounded text-sm transition-colors duration-200"
              >
                Editar
              </button>
              {project.livePreview && (
                <a
                  href={project.livePreview}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-3 py-1 rounded text-sm transition-colors duration-200 border border-border ${
                    project.showLivePreviewInPortfolio
                      ? 'bg-primary hover:bg-primary/80 text-primary-content'
                      : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                  }`}
                  title={project.showLivePreviewInPortfolio ? 'Visible en portfolio público' : 'Solo visible en dashboard'}
                >
                  🌐 Ver {project.showLivePreviewInPortfolio ? '🌐' : '🔒'}
                </a>
              )}
              {project.githubLink && (
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-3 py-1 rounded text-sm transition-colors duration-200 ${
                    project.showGithubInPortfolio
                      ? 'bg-gray-800 hover:bg-gray-900 text-white'
                      : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                  }`}
                  title={project.showGithubInPortfolio ? 'Visible en portfolio público' : 'Solo visible en dashboard'}
                >
                  📁 GitHub {project.showGithubInPortfolio ? '🌐' : '🔒'}
                </a>
              )}
              <button
                onClick={() => deleteProject(project.id)}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="bg-secondary border-border rounded-lg border p-12 text-center">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-xl font-semibold text-neutral mb-2">No hay proyectos</h3>
          <p className="text-tertiary-content mb-6">
            Comienza creando tu primer proyecto para mostrarlo en tu portfolio.
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-accent hover:bg-accent/80 text-secondary px-6 py-2 rounded-lg transition-colors duration-200"
          >
            Crear Primer Proyecto
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="bg-secondary border-border rounded-lg border p-6">
        <h3 className="text-xl font-semibold text-neutral mb-4">Estadísticas de Proyectos</h3>
        <div className="grid gap-4 md:grid-cols-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">{projects.length}</div>
            <div className="text-sm text-tertiary-content">Total Proyectos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">
              {projects.filter(p => p.livePreview).length}
            </div>
            <div className="text-sm text-tertiary-content">Activos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">
              {projects.filter(p => p.type?.includes('New')).length}
            </div>
            <div className="text-sm text-tertiary-content">Nuevos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">
              {projects.filter(p => p.type?.includes('Client')).length}
            </div>
            <div className="text-sm text-tertiary-content">Cliente</div>
          </div>
        </div>
      </div>

      {/* TODO: Add Create/Edit forms */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-secondary border border-border rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-neutral mb-4">Crear Nuevo Proyecto</h3>
            <p className="text-tertiary-content mb-4">
              Funcionalidad de creación/edición próximamente...
            </p>
            <button
              onClick={() => setShowCreateForm(false)}
              className="bg-accent hover:bg-accent/80 text-secondary px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {editingProject && editForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-secondary border border-border rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-neutral mb-4">Editar Proyecto</h3>

            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); saveProject(); }}>
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-neutral mb-1">
                  Título del Proyecto *
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => updateFormField('title', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-sm font-medium text-neutral mb-1">
                  Descripción Corta *
                </label>
                <textarea
                  value={editForm.shortDescription}
                  onChange={(e) => updateFormField('shortDescription', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>

              {/* Priority and Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral mb-1">
                    Prioridad *
                  </label>
                  <input
                    type="number"
                    value={editForm.priority}
                    onChange={(e) => updateFormField('priority', parseInt(e.target.value))}
                    min="1"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral mb-1">
                    Tipo de Proyecto *
                  </label>
                  <select
                    value={editForm.type}
                    onChange={(e) => updateFormField('type', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                    required
                  >
                    <option value="Client Work 🙍‍♂️">Client Work 🙍‍♂️</option>
                    <option value="New 🔥">New 🔥</option>
                    <option value="Free 🔥">Free 🔥</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>
              </div>

              {/* Cover Image URL */}
              <div>
                <label className="block text-sm font-medium text-neutral mb-1">
                  URL de Imagen de Portada *
                </label>
                <input
                  type="url"
                  value={editForm.cover}
                  onChange={(e) => updateFormField('cover', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>

              {/* Live Preview and GitHub */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral mb-1">
                    URL de Vista Previa
                  </label>
                  <input
                    type="url"
                    value={editForm.livePreview || ''}
                    onChange={(e) => updateFormField('livePreview', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral mb-1">
                    URL de GitHub
                  </label>
                  <input
                    type="url"
                    value={editForm.githubLink || ''}
                    onChange={(e) => updateFormField('githubLink', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>

              {/* Live Preview Portfolio Visibility Toggle */}
              {editForm.livePreview && (
                <div className="bg-primary border border-border rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="showLivePreviewInPortfolio"
                      checked={editForm.showLivePreviewInPortfolio || false}
                      onChange={(e) => updateFormField('showLivePreviewInPortfolio', e.target.checked)}
                      className="w-4 h-4 text-accent bg-secondary border-border rounded focus:ring-accent focus:ring-2"
                    />
                    <label htmlFor="showLivePreviewInPortfolio" className="text-sm font-medium text-neutral">
                      Mostrar enlace de Vista Previa en el portfolio público
                    </label>
                  </div>
                  <p className="text-xs text-tertiary-content mt-1 ml-7">
                    {editForm.showLivePreviewInPortfolio
                      ? "✅ El enlace de Vista Previa será visible en tu portfolio público"
                      : "❌ El enlace de Vista Previa solo será visible en el dashboard"
                    }
                  </p>
                </div>
              )}

              {/* GitHub Portfolio Visibility Toggle */}
              {editForm.githubLink && (
                <div className="bg-primary border border-border rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="showGithubInPortfolio"
                      checked={editForm.showGithubInPortfolio || false}
                      onChange={(e) => updateFormField('showGithubInPortfolio', e.target.checked)}
                      className="w-4 h-4 text-accent bg-secondary border-border rounded focus:ring-accent focus:ring-2"
                    />
                    <label htmlFor="showGithubInPortfolio" className="text-sm font-medium text-neutral">
                      Mostrar enlace de GitHub en el portfolio público
                    </label>
                  </div>
                  <p className="text-xs text-tertiary-content mt-1 ml-7">
                    {editForm.showGithubInPortfolio
                      ? "✅ El enlace de GitHub será visible en tu portfolio público"
                      : "❌ El enlace de GitHub solo será visible en el dashboard"
                    }
                  </p>
                </div>
              )}

              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral mb-1">
                    👥 Visitantes del Sitio
                  </label>
                  <input
                    type="text"
                    value={editForm.visitors || ''}
                    onChange={(e) => updateFormField('visitors', e.target.value)}
                    placeholder="ej: 8K, 1.2M"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <p className="text-xs text-tertiary-content mt-1">Se mostrará como: "👥 [valor] Visitors"</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral mb-1">
                    💰 Ganancias del Proyecto
                  </label>
                  <input
                    type="text"
                    value={editForm.earned || ''}
                    onChange={(e) => updateFormField('earned', e.target.value)}
                    placeholder="ej: $400, €1,200"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <p className="text-xs text-tertiary-content mt-1">Se mostrará como: "💰 [valor] Earned"</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral mb-1">
                    ⭐ Estrellas en GitHub
                  </label>
                  <input
                    type="text"
                    value={editForm.githubStars || ''}
                    onChange={(e) => updateFormField('githubStars', e.target.value)}
                    placeholder="ej: 40, 156"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <p className="text-xs text-tertiary-content mt-1">Se mostrará como: "⭐ [valor] Stars"</p>
                </div>
              </div>

              {/* Additional Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral mb-1">
                    ⏰ Antigüedad del Sitio
                  </label>
                  <input
                    type="text"
                    value={editForm.siteAge || ''}
                    onChange={(e) => updateFormField('siteAge', e.target.value)}
                    placeholder="ej: 1 month, 2 years"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <p className="text-xs text-tertiary-content mt-1">Se mostrará como: "⏰ [valor] old"</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral mb-1">
                    ⭐ Calificaciones de Usuarios
                  </label>
                  <input
                    type="text"
                    value={editForm.ratings || ''}
                    onChange={(e) => updateFormField('ratings', e.target.value)}
                    placeholder="ej: 4.5/5, 4.8"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <p className="text-xs text-tertiary-content mt-1">Se mostrará como: "⭐ [valor] Rating"</p>
                </div>
              </div>

              {/* Number of Sales */}
              <div>
                <label className="block text-sm font-medium text-neutral mb-1">
                  🛒 Número de Ventas
                </label>
                <input
                  type="text"
                  value={editForm.numberOfSales || ''}
                  onChange={(e) => updateFormField('numberOfSales', e.target.value)}
                  placeholder="ej: 138, 250+"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <p className="text-xs text-tertiary-content mt-1">Se mostrará como: "🛒 [valor] Sales"</p>
              </div>

              {/* Statistics Visibility Toggles */}
              <div className="bg-primary border border-border rounded-lg p-4">
                <h4 className="text-sm font-semibold text-neutral mb-4">Controles de Visibilidad en Portfolio Público</h4>
                <div className="space-y-3">

                  {/* Visitors Toggle */}
                  {editForm.visitors && (
                    <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg border border-border">
                      <input
                        type="checkbox"
                        id="showVisitorsInPortfolio"
                        checked={editForm.showVisitorsInPortfolio || false}
                        onChange={(e) => updateFormField('showVisitorsInPortfolio', e.target.checked)}
                        className="w-4 h-4 text-accent bg-primary border-border rounded focus:ring-accent focus:ring-2 mt-0.5"
                      />
                      <div className="flex-1">
                        <label htmlFor="showVisitorsInPortfolio" className="text-sm font-medium text-neutral block">
                          👥 Mostrar Visitantes
                        </label>
                        <p className="text-xs text-tertiary-content">
                          Muestra: "👥 [valor] Visitors" en el portfolio público
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Earnings Toggle */}
                  {editForm.earned && (
                    <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg border border-border">
                      <input
                        type="checkbox"
                        id="showEarnedInPortfolio"
                        checked={editForm.showEarnedInPortfolio || false}
                        onChange={(e) => updateFormField('showEarnedInPortfolio', e.target.checked)}
                        className="w-4 h-4 text-accent bg-primary border-border rounded focus:ring-accent focus:ring-2 mt-0.5"
                      />
                      <div className="flex-1">
                        <label htmlFor="showEarnedInPortfolio" className="text-sm font-medium text-neutral block">
                          💰 Mostrar Ganancias
                        </label>
                        <p className="text-xs text-tertiary-content">
                          Muestra: "💰 [valor] Earned" en el portfolio público
                        </p>
                      </div>
                    </div>
                  )}

                  {/* GitHub Stars Toggle */}
                  {editForm.githubStars && (
                    <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg border border-border">
                      <input
                        type="checkbox"
                        id="showGithubStarsInPortfolio"
                        checked={editForm.showGithubStarsInPortfolio || false}
                        onChange={(e) => updateFormField('showGithubStarsInPortfolio', e.target.checked)}
                        className="w-4 h-4 text-accent bg-primary border-border rounded focus:ring-accent focus:ring-2 mt-0.5"
                      />
                      <div className="flex-1">
                        <label htmlFor="showGithubStarsInPortfolio" className="text-sm font-medium text-neutral block">
                          ⭐ Mostrar Estrellas GitHub
                        </label>
                        <p className="text-xs text-tertiary-content">
                          Muestra: "⭐ [valor] Stars" en el portfolio público
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Ratings Toggle */}
                  {editForm.ratings && (
                    <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg border border-border">
                      <input
                        type="checkbox"
                        id="showRatingsInPortfolio"
                        checked={editForm.showRatingsInPortfolio || false}
                        onChange={(e) => updateFormField('showRatingsInPortfolio', e.target.checked)}
                        className="w-4 h-4 text-accent bg-primary border-border rounded focus:ring-accent focus:ring-2 mt-0.5"
                      />
                      <div className="flex-1">
                        <label htmlFor="showRatingsInPortfolio" className="text-sm font-medium text-neutral block">
                          ⭐ Mostrar Calificaciones
                        </label>
                        <p className="text-xs text-tertiary-content">
                          Muestra: "⭐ [valor] Rating" en el portfolio público
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Number of Sales Toggle */}
                  {editForm.numberOfSales && (
                    <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg border border-border">
                      <input
                        type="checkbox"
                        id="showNumberOfSalesInPortfolio"
                        checked={editForm.showNumberOfSalesInPortfolio || false}
                        onChange={(e) => updateFormField('showNumberOfSalesInPortfolio', e.target.checked)}
                        className="w-4 h-4 text-accent bg-primary border-border rounded focus:ring-accent focus:ring-2 mt-0.5"
                      />
                      <div className="flex-1">
                        <label htmlFor="showNumberOfSalesInPortfolio" className="text-sm font-medium text-neutral block">
                          🛒 Mostrar Ventas
                        </label>
                        <p className="text-xs text-tertiary-content">
                          Muestra: "🛒 [valor] Sales" en el portfolio público
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Site Age Toggle */}
                  {editForm.siteAge && (
                    <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg border border-border">
                      <input
                        type="checkbox"
                        id="showSiteAgeInPortfolio"
                        checked={editForm.showSiteAgeInPortfolio || false}
                        onChange={(e) => updateFormField('showSiteAgeInPortfolio', e.target.checked)}
                        className="w-4 h-4 text-accent bg-primary border-border rounded focus:ring-accent focus:ring-2 mt-0.5"
                      />
                      <div className="flex-1">
                        <label htmlFor="showSiteAgeInPortfolio" className="text-sm font-medium text-neutral block">
                          ⏰ Mostrar Antigüedad
                        </label>
                        <p className="text-xs text-tertiary-content">
                          Muestra: "⏰ [valor] old" en el portfolio público
                        </p>
                      </div>
                    </div>
                  )}

                </div>
                <p className="text-xs text-tertiary-content mt-4 p-3 bg-accent/10 rounded-lg">
                  💡 Solo las estadísticas marcadas serán visibles en tu portfolio público. Las no marcadas permanecerán privadas en el dashboard.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-accent hover:bg-accent/80 disabled:opacity-50 text-secondary px-6 py-2 rounded-lg transition-colors duration-200"
                >
                  {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}