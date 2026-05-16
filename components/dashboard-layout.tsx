'use client'

import { useState } from 'react'
import { Menu, X, FileText, Users, MessageSquare, Bot } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  { name: 'Tin đăng', href: '/dashboard/rooms', icon: FileText },
  { name: 'Người dùng', href: '/dashboard/users', icon: Users },
  { name: 'Tin nhắn', href: '/dashboard/messages', icon: MessageSquare },
  { name: 'Chat bot', href: '/dashboard/chatbot', icon: Bot },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card transition-transform duration-300 ease-in-out transform lg:relative lg:translate-x-0 lg:block ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary text-primary-foreground font-bold">
                A
              </div>
              <h1 className="text-lg font-bold text-foreground">Quản trị</h1>
            </div>
            <button
              className="lg:hidden p-2 text-foreground hover:bg-muted rounded-lg"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation links */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-muted'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon size={20} />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top header with mobile menu button */}
        <header className="sticky top-0 z-20 border-b border-border bg-card">
          <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <button
              className="lg:hidden p-2 text-foreground hover:bg-muted rounded-lg"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-foreground">Bảng điều khiển quản trị</h1>
            <div className="w-10" /> {/* Spacer for alignment */}
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
