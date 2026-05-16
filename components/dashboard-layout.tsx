'use client'

import { useState } from 'react'
import { Menu, X, Mail, LucideIcon, Home, Users, MessageSquare, Bot } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface NavItem {
  name: string
  href: string
  icon: LucideIcon
}

const mainNav: NavItem[] = [
  { name: 'Tin đăng', href: '/dashboard/rooms', icon: Home },
  { name: 'Người dùng', href: '/dashboard/users', icon: Users },
  { name: 'Tin nhắn', href: '/dashboard/messages', icon: Mail },
  { name: 'Chatbot', href: '/dashboard/chatbot', icon: Bot },
]

function NavLink({ 
  item, 
  isActive, 
  onClick,
  sidebar = false
}: { 
  item: NavItem
  isActive: boolean
  onClick?: () => void
  sidebar?: boolean
}) {
  const Icon = item.icon
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
        sidebar
          ? isActive
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-foreground hover:bg-muted/50'
          : isActive
            ? 'bg-primary/10 text-primary border-l-2 border-primary'
            : 'text-foreground hover:bg-muted/30'
      )}
    >
      <Icon size={18} />
      <span>{item.name}</span>
    </Link>
  )
}

function isNavActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(href)
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const pathname = usePathname()

  const closeSidebar = () => setSidebarOpen(false)
  const currentPage = mainNav.find(item => isNavActive(pathname, item.href))

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:w-64 border-r border-border bg-card flex-col">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary text-primary-foreground font-bold text-lg">
              A
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-foreground">Quản trị</h1>
              <p className="text-xs text-muted-foreground">Dashboard</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {mainNav.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              isActive={isNavActive(pathname, item.href)}
              sidebar
            />
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">v1.0.0</p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-border bg-card">
          <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            {/* Mobile Logo & Menu Button */}
            <div className="flex items-center gap-3 lg:hidden">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 text-foreground hover:bg-muted rounded-lg"
                aria-label={sidebarOpen ? 'Đóng menu' : 'Mở menu'}
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary text-primary-foreground font-bold">
                  A
                </div>
                <span className="font-bold text-foreground">Quản trị</span>
              </div>
            </div>

            {/* Desktop Header - Hidden on Mobile */}
            <div className="hidden lg:block">
              <p className="text-sm text-muted-foreground">
                {currentPage ? `${currentPage.name}` : 'Bảng điều khiển'}
              </p>
            </div>

            {/* Mobile Dropdown */}
            <div className="lg:hidden relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 text-foreground text-sm font-medium transition-colors"
              >
                {currentPage && <currentPage.icon size={16} />}
                <span className="max-w-[100px] truncate">{currentPage?.name || 'Menu'}</span>
              </button>

              {/* Mobile Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-xl shadow-lg p-2 space-y-1 z-50">
                  {mainNav.map((item) => (
                    <NavLink
                      key={item.href}
                      item={item}
                      isActive={isNavActive(pathname, item.href)}
                      onClick={() => {
                        setDropdownOpen(false)
                        setSidebarOpen(false)
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Sidebar Menu */}
          {sidebarOpen && (
            <nav className="border-t border-border px-4 py-4 space-y-2 bg-muted/20 lg:hidden">
              {mainNav.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  isActive={isNavActive(pathname, item.href)}
                  onClick={closeSidebar}
                  sidebar
                />
              ))}
            </nav>
          )}
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
