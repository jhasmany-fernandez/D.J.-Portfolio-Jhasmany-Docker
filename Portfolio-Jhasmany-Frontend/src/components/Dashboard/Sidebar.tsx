'use client'

import { useState, type ReactElement } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Custom icons
const DashboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="9"></rect>
    <rect x="14" y="3" width="7" height="5"></rect>
    <rect x="14" y="12" width="7" height="9"></rect>
    <rect x="3" y="16" width="7" height="5"></rect>
  </svg>
)

const ProjectsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
  </svg>
)

const AnalyticsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"></polyline>
  </svg>
)

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M12 1v6m0 6v6"></path>
    <path d="m15.5 3.5l-7 7"></path>
    <path d="m6.5 6.5l7 7"></path>
  </svg>
)

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
)

const ContentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14,2 14,8 20,8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10,9 9,9 8,9"></polyline>
  </svg>
)

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
)

interface SidebarItem {
  label: string
  href?: string
  icon: () => ReactElement
  description: string
  submenu?: {
    label: string
    href: string
  }[]
}

const sidebarItems: SidebarItem[] = [
  {
    label: '_overview',
    href: '/dashboard',
    icon: DashboardIcon,
    description: 'Dashboard principal'
  },
  {
    label: '_projects',
    href: '/dashboard/projects',
    icon: ProjectsIcon,
    description: 'Gestión de proyectos'
  },
  {
    label: '_analytics',
    href: '/dashboard/analytics',
    icon: AnalyticsIcon,
    description: 'Estadísticas y métricas'
  },
  {
    label: '_content',
    href: '/dashboard/content',
    icon: ContentIcon,
    description: 'Gestión de contenido'
  },
  {
    label: '_users',
    icon: UsersIcon,
    description: 'Administrar usuarios',
    submenu: [
      { label: 'Lista de usuarios', href: '/dashboard/users' },
      { label: 'Registrar usuario', href: '/dashboard/users/register' }
    ]
  },
  {
    label: '_settings',
    href: '/dashboard/settings',
    icon: SettingsIcon,
    description: 'Configuración del sistema'
  }
]

const Sidebar = () => {
  const pathname = usePathname()
  const [openMenus, setOpenMenus] = useState<string[]>(['_users'])

  const toggleMenu = (label: string) => {
    setOpenMenus(prev =>
      prev.includes(label)
        ? prev.filter(item => item !== label)
        : [...prev, label]
    )
  }

  return (
    <aside className="bg-secondary border-border fixed left-0 top-16 h-[calc(100vh-4rem)] w-16 lg:w-64 border-r overflow-y-auto z-40 transition-all duration-300">
      <div className="p-4">
        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const { label, href, icon: Icon, description, submenu } = item
            const hasSubmenu = submenu && submenu.length > 0
            const isOpen = openMenus.includes(label)
            const isActive = href ? (pathname === href || (href !== '/dashboard' && pathname.startsWith(href))) : false
            const isAnySubmenuActive = hasSubmenu && submenu.some(sub => pathname === sub.href || pathname.startsWith(sub.href))

            if (hasSubmenu) {
              return (
                <div key={label}>
                  <button
                    onClick={() => toggleMenu(label)}
                    className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 group hover:bg-primary/10 ${
                      isAnySubmenuActive
                        ? 'bg-primary/20 text-accent border border-accent/30'
                        : 'text-primary-content hover:text-accent'
                    } justify-center lg:justify-start`}
                    title={description}
                  >
                    <Icon />
                    <div className="flex flex-col flex-1 hidden lg:flex">
                      <span className="font-medium">{label}</span>
                      <span className="text-xs text-tertiary-content group-hover:text-tertiary-content/80">
                        {description}
                      </span>
                    </div>
                    <div className={`hidden lg:block transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                      <ChevronDownIcon />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="ml-6 mt-1 space-y-1 hidden lg:block">
                      {submenu.map((subItem) => {
                        const isSubActive = pathname === subItem.href || pathname.startsWith(subItem.href)
                        return (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
                              isSubActive
                                ? 'bg-primary/10 text-accent'
                                : 'text-tertiary-content hover:text-accent hover:bg-primary/5'
                            }`}
                          >
                            <span className="text-xs">•</span>
                            <span>{subItem.label}</span>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            }

            return (
              <Link
                key={href}
                href={href!}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 group hover:bg-primary/10 ${
                  isActive
                    ? 'bg-primary/20 text-accent border border-accent/30'
                    : 'text-primary-content hover:text-accent'
                } justify-center lg:justify-start`}
                title={description}
              >
                <Icon />
                <div className="flex flex-col hidden lg:flex">
                  <span className="font-medium">{label}</span>
                  <span className="text-xs text-tertiary-content group-hover:text-tertiary-content/80">
                    {description}
                  </span>
                </div>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Footer del sidebar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-secondary hidden lg:block">
        <div className="text-xs text-tertiary-content text-center">
          <p>Admin Panel v1.0</p>
          <p className="text-accent">Jhasmany Fernández</p>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
