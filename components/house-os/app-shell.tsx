"use client"

import { cn } from '@/lib/utils'
import { ReactNode, useState } from 'react'
import { useHouseOS } from '@/lib/house-os-context'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  Building2,
  FileText,
  Moon,
  Settings,
  Activity,
  ClipboardCheck,
  ClipboardList,
  Wifi,
  ChevronLeft,
  ChevronRight,
  Bell,
  LogOut,
  BarChart3,
} from 'lucide-react'
import { StatusBadge } from './status-badge'
import { Button } from '@/components/ui/button'
import { DemoGuideButton } from './demo-guide-overlay'

interface AppShellProps {
  children: ReactNode
}

const navItems = [
  { label: 'EXECUTIVE', items: [
    { href: '/portfolio', label: 'Portfolio', icon: LayoutDashboard },
    { href: '/multi-site', label: 'Multi-Site View', icon: Building2 },
  ]},
  { label: 'OPERATIONS', items: [
    { href: '/ops', label: 'Daily Ops Report', icon: FileText },
    { href: '/floor', label: 'Shift Dashboard', icon: ClipboardList },
    { href: '/gm', label: 'GM Dashboard', icon: Activity },
    { href: '/data-feed', label: 'Live Data Feed', icon: Wifi, badge: 3 },
  ]},
  { label: 'FINANCE', items: [
    { href: '/audit', label: 'Night Audit', icon: Moon },
    { href: '/reconciliation', label: 'Reconciliation', icon: ClipboardCheck, badge: 2 },
    { href: '/finance-ops', label: 'Cross-Property', icon: BarChart3 },
    { href: '/offline', label: 'Offline Checker', icon: Settings },
  ]},
]

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { state, logout } = useHouseOS()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const oracleStatusLabel = {
    synced: 'Oracle Fusion Sync',
    posting: 'Posting to Oracle...',
    held: '1 Property Held',
    offline: 'Oracle Offline',
  }[state.oracleStatus]

  const oracleStatusColor = {
    synced: 'green',
    posting: 'gold',
    held: 'amber',
    offline: 'red',
  }[state.oracleStatus] as 'green' | 'gold' | 'amber' | 'red'

  // Get current page title
  const getPageTitle = () => {
    const flatItems = navItems.flatMap(g => g.items)
    const current = flatItems.find(item => pathname.startsWith(item.href))
    return current?.label || 'Dashboard'
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen flex flex-col border-r border-[rgba(255,255,255,0.07)] bg-surface-1 transition-all duration-300 z-30",
          isCollapsed ? "w-14" : "w-[220px]"
        )}
      >
        {/* Logo */}
        <div className={cn("flex items-center gap-3 px-4 py-5 border-b border-[rgba(255,255,255,0.07)]", isCollapsed && "justify-center")}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold to-gold-dim flex items-center justify-center flex-shrink-0">
            <span className="text-background font-bold text-sm">H</span>
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-sm font-semibold text-text">House OS</h1>
              <p className="text-[10px] text-text-muted">UK Properties</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          {navItems.map((group) => (
            <div key={group.label} className="mb-4">
              {!isCollapsed && (
                <span className="uppercase-label px-3 py-2 text-text-faint block">
                  {group.label}
                </span>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname.startsWith(item.href)
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative",
                        isActive
                          ? "bg-gold-glow text-gold border-l-2 border-gold"
                          : "text-text-muted hover:bg-surface-3 hover:text-text",
                        isCollapsed && "justify-center px-2"
                      )}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      {!isCollapsed && (
                        <>
                          <span className="text-sm">{item.label}</span>
                          {item.badge && (
                            <span className="ml-auto bg-red text-background text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User footer */}
        <div className={cn("border-t border-[rgba(255,255,255,0.07)] p-3", isCollapsed && "flex flex-col items-center gap-2")}>
          {state.user && (
            <div className={cn("flex items-center gap-3 mb-3", isCollapsed && "mb-0")}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-surface-3 to-surface-4 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-bold text-text-muted">{state.user.initials}</span>
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text truncate">{state.user.name}</p>
                  <p className="text-[10px] text-text-faint uppercase">{state.user.role}</p>
                </div>
              )}
            </div>
          )}
          <div className={cn("flex gap-2", isCollapsed && "flex-col")}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-text-muted hover:text-text hover:bg-surface-3 flex-1"
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
            {!isCollapsed && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-text-muted hover:text-text hover:bg-surface-3"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className={cn("flex-1 flex flex-col transition-all duration-300", isCollapsed ? "ml-14" : "ml-[220px]")}>
        {/* Top bar */}
        <header className="sticky top-0 z-20 h-[60px] flex items-center justify-between px-6 border-b border-[rgba(255,255,255,0.07)] bg-background/80 backdrop-blur-md">
          <div>
            <h2 className="font-serif text-lg text-text">{getPageTitle()}</h2>
            <p className="text-xs text-text-muted">9 UK Properties · Live</p>
          </div>

<div className="flex items-center gap-3">
          {/* Demo Mode Button */}
          <DemoGuideButton />
          
          {/* Oracle status pill */}
            <div className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs",
              "bg-surface-3 border-[rgba(255,255,255,0.07)]"
            )}>
              <span className={cn(
                "w-2 h-2 rounded-full",
                oracleStatusColor === 'green' && "bg-green animate-pulse-dot",
                oracleStatusColor === 'gold' && "bg-gold animate-pulse-dot",
                oracleStatusColor === 'amber' && "bg-amber animate-pulse-dot",
                oracleStatusColor === 'red' && "bg-red"
              )} />
              <span className="text-text-muted">{oracleStatusLabel}</span>
            </div>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-surface-3 transition-colors">
              <Bell className="w-5 h-5 text-text-muted" />
              {state.auditExceptions.filter(e => e.status === 'open').length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red" />
              )}
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
