'use client'

import Link from 'next/link'
import Logo from '../Navbar/Logo'
import UserMenu from './UserMenu'

const DashboardNavbar = () => {
  return (
    <nav className="bg-primary border-border h-16 overflow-hidden border-b">
      <div className="mx-auto flex h-full w-dvw max-w-[1200px] items-center justify-between px-4 py-1">
        <Link href="/dashboard">
          <div className="animate-fade-up text-primary-content relative flex items-center gap-3 transition-all duration-300">
            <Logo />
            <span className="text-primary-content">Dashboard</span>
          </div>
        </Link>

        <UserMenu />
      </div>
    </nav>
  )
}

export default DashboardNavbar