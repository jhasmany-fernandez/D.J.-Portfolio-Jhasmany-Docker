import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects | Dashboard - Jhasmany Fernandez',
  description: 'Manage your portfolio projects.',
}

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral mb-2">Projects Management</h1>
        <p className="text-tertiary-content">Gestiona todos tus proyectos del portfolio</p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button className="bg-accent hover:bg-accent/80 text-secondary px-4 py-2 rounded-lg transition-colors duration-200">
          + Nuevo Proyecto
        </button>
        <button className="bg-secondary hover:bg-secondary/80 text-primary-content border border-border px-4 py-2 rounded-lg transition-colors duration-200">
          Importar Proyectos
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((project) => (
          <div key={project} className="bg-secondary border-border rounded-lg border p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="text-accent text-2xl">🚀</div>
              <span className="bg-accent/20 text-accent px-2 py-1 rounded-full text-xs">Activo</span>
            </div>

            <h3 className="text-lg font-semibold text-neutral mb-2">Proyecto #{project}</h3>
            <p className="text-tertiary-content text-sm mb-4">
              Descripción del proyecto que muestra las tecnologías y características principales.
            </p>

            <div className="flex gap-2 mb-4">
              <span className="bg-primary/50 text-primary-content px-2 py-1 rounded text-xs">React</span>
              <span className="bg-primary/50 text-primary-content px-2 py-1 rounded text-xs">Next.js</span>
              <span className="bg-primary/50 text-primary-content px-2 py-1 rounded text-xs">TypeScript</span>
            </div>

            <div className="flex gap-2">
              <button className="bg-accent hover:bg-accent/80 text-secondary px-3 py-1 rounded text-sm transition-colors duration-200">
                Editar
              </button>
              <button className="bg-primary hover:bg-primary/80 text-primary-content border border-border px-3 py-1 rounded text-sm transition-colors duration-200">
                Ver
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="bg-secondary border-border rounded-lg border p-6">
        <h3 className="text-xl font-semibold text-neutral mb-4">Estadísticas de Proyectos</h3>
        <div className="grid gap-4 md:grid-cols-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">12</div>
            <div className="text-sm text-tertiary-content">Total Proyectos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">8</div>
            <div className="text-sm text-tertiary-content">Activos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">3</div>
            <div className="text-sm text-tertiary-content">En Desarrollo</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">1</div>
            <div className="text-sm text-tertiary-content">Archivados</div>
          </div>
        </div>
      </div>
    </div>
  )
}