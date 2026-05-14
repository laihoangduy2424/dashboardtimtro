'use client'

import { useState } from 'react'
import { Menu, X, MessageSquare, Mail, LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface NavItem {
  name: string
  href: string
  icon?: LucideIcon
}

const primaryNav: NavItem[] = [
  { name: 'Bảng điều khiển', href: '/dashboard' },
  { name: 'Chủ nhà', href: '/dashboard/landlords' },
  { name: 'Tin đăng', href: '/dashboard/rooms' },
  { name: 'Người dùng', href: '/dashboard/users' },
  { name: 'Tin nhắn', href: '/dashboard/messages', icon: Mail },
  { name: 'Báo cáo', href: '/dashboard/reports' },
]

const secondaryNav: NavItem[] = [
  { name: 'Quản lý Chatbot', href: '/dashboard/rooms/chatbot', icon: MessageSquare },
]

function NavLink({ 
  item, 
  isActive, 
  onClick,
  className 
}: { 
  item: NavItem
  isActive: boolean
  onClick?: () => void
  className?: string
}) {
  const Icon = item.icon
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'text-foreground hover:bg-muted',
        className
      )}
    >
      {Icon && <Icon size={16} />}
      {item.name}
    </Link>
  )
}

function isNavActive(pathname: string, href: string): boolean {
  if (href === '/dashboard') {
    return pathname === href
  }
  return pathname === href || pathname.startsWith(href)
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary text-primary-foreground font-bold">
              A
            </div>
            <h1 className="text-xl font-bold text-foreground">Bảng điều khiển quản trị</h1>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-foreground hover:bg-muted rounded-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {primaryNav.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                isActive={isNavActive(pathname, item.href)}
              />
            ))}
            
            <div className="h-6 w-px bg-border mx-2" aria-hidden="true" />
            
            {secondaryNav.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                isActive={isNavActive(pathname, item.href)}
              />
            ))}
          </nav>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <nav className="border-t border-border px-4 py-4 space-y-2 sm:px-6">
            {primaryNav.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                isActive={isNavActive(pathname, item.href)}
                onClick={closeMobileMenu}
              />
            ))}
            
            <div className="border-t border-border pt-2 mt-2 space-y-2">
              {secondaryNav.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  isActive={isNavActive(pathname, item.href)}
                  onClick={closeMobileMenu}
                />
              ))}
            </div>
          </nav>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
