import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard | Jhasmany Fernandez',
  description: 'Welcome to your personal dashboard.',
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-primary pt-16">
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-secondary border-border rounded-lg border p-8">
          <div className="text-center">
            <div className="text-accent mb-4 text-6xl">🎉</div>
            <h2 className="text-neutral text-2xl font-semibold mb-4">
              Welcome to your Dashboard!
            </h2>
            <p className="text-tertiary-content mb-8">
              You have successfully logged in. This is a protected area where you can manage your content.
            </p>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-primary border-border rounded-lg border p-6">
                <h3 className="text-accent text-lg font-semibold mb-2">Analytics</h3>
                <p className="text-tertiary-content">View your portfolio analytics and visitor stats.</p>
              </div>

              <div className="bg-primary border-border rounded-lg border p-6">
                <h3 className="text-accent text-lg font-semibold mb-2">Projects</h3>
                <p className="text-tertiary-content">Manage your portfolio projects and content.</p>
              </div>

              <div className="bg-primary border-border rounded-lg border p-6">
                <h3 className="text-accent text-lg font-semibold mb-2">Settings</h3>
                <p className="text-tertiary-content">Configure your account and preferences.</p>
              </div>
            </div>

            <div className="mt-8 flex gap-4 justify-center">
              <Link
                href="/"
                className="bg-secondary hover:bg-secondary/80 text-primary-content border border-border inline-block px-6 py-2 rounded-lg transition-colors duration-300"
              >
                Back to Portfolio
              </Link>
              <Link
                href="/auth/login"
                className="bg-accent hover:bg-accent/80 text-secondary inline-block px-6 py-2 rounded-lg transition-colors duration-300"
              >
                Logout (Demo)
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}