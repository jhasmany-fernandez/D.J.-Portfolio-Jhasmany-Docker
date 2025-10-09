import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Users | Dashboard - Jhasmany Fernandez',
  description: 'Manage users and permissions.',
}

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral mb-2">User Management</h1>
        <p className="text-tertiary-content">Administra usuarios y permisos del sistema</p>
      </div>

      <div className="bg-secondary border-border rounded-lg border p-12 text-center">
        <div className="text-6xl mb-4">👥</div>
        <h3 className="text-xl font-semibold text-neutral mb-2">User Administration</h3>
        <p className="text-tertiary-content mb-6">
          Gestiona usuarios, roles y permisos del dashboard de administración.
        </p>
        <button className="bg-accent hover:bg-accent/80 text-secondary px-6 py-2 rounded-lg transition-colors duration-200">
          Próximamente
        </button>
      </div>
    </div>
  )
}