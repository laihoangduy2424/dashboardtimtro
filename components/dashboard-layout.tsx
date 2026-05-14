'use client'

import { useState } from 'react'
import { Menu, X, MessageSquare, Mail, LucideIcon, ChevronDown, LayoutDashboard, Users, Home, FileText, Bot, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface NavItem {
  name: string
  href: string
  icon: LucideIcon
}

const primaryNav: NavItem[] = [
  { name: 'Bảng điều khiển', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Chủ nhà', href: '/dashboard/landlords', icon: Users },
  { name: 'Tin đăng', href: '/dashboard/rooms', icon: Home },
  { name: 'Người dùng', href: '/dashboard/users', icon: Users },
  { name: 'Tin nhắn', href: '/dashboard/messages', icon: Mail },
  { name: 'Chatbot', href: '/dashboard/chatbot', icon: Bot },
  { name: 'Báo cáo', href: '/dashboard/reports', icon: BarChart3 },
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
        'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
        isActive
          ? 'bg-primary text-primary-foreground shadow-md scale-[1.02]'
          : 'text-foreground hover:bg-muted hover:scale-[1.02]',
        className
      )}
    >
      <Icon size={18} />
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

  // Get current page name for display
  const currentPage = primaryNav.find(item => isNavActive(pathname, item.href))

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

          {/* Desktop navigation - Hover dropdown */}
          <div className="hidden md:block relative group">
            {/* Trigger Button */}
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-medium transition-all duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
              {currentPage && <currentPage.icon size={18} />}
              <span>{currentPage?.name || 'Menu'}</span>
              <ChevronDown size={16} className="transition-transform duration-200 group-hover:rotate-180" />
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-1 group-hover:translate-y-0">
              <nav className="bg-card border border-border rounded-2xl shadow-lg p-2 space-y-1">
                {primaryNav.map((item) => (
                  <NavLink
                    key={item.href}
                    item={item}
                    isActive={isNavActive(pathname, item.href)}
                  />
                ))}
              </nav>
            </div>
          </div>
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
