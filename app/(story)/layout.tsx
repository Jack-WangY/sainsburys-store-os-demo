"use client"

import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Home,
  BookOpen,
  ClipboardList,
  Sparkles,
  LayoutDashboard,
  X,
  Menu,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface StoryLayoutProps {
  children: ReactNode
}

const chapters = [
  {
    id: 'today',
    label: 'The Challenge',
    title: 'Today',
    subtitle: '',
    href: '/story/today',
    icon: ClipboardList,
    description: 'Manual processes, Excel spreadsheets, and hours of reconciliation',
  },
  {
    id: 'beyond',
    label: 'The Solution',
    title: 'Tomorrow',
    subtitle: 'AI-Driven Operating Model',
    href: '/story/beyond',
    icon: Sparkles,
    description: 'Real-time oversight with House OS',
  },
  {
    id: 'platform',
    label: 'Experience It',
    title: 'House OS Platform',
    href: '/story/platform',
    icon: LayoutDashboard,
    description: 'See the vision in action',
  },
]

export default function StoryLayout({ children }: StoryLayoutProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  const currentIndex = chapters.findIndex(c => c.href === pathname)
  const currentChapter = chapters[currentIndex] || chapters[0]
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null
  const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null

  return (
    <div className="min-h-screen bg-[#CEC0B2]">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white/50 border border-black/10 hover:bg-white/70 transition-colors"
      >
        <Menu className="w-5 h-5 text-black/60" />
      </button>

      {/* Sidebar overlay for mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen w-[280px] flex flex-col border-r border-black/10 bg-[#EBE3DB] z-50 transition-transform duration-300",
          "lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-black/10">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold to-gold-dim flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <div>
              <h1 className="text-sm font-semibold text-black">House OS</h1>
              <p className="text-[10px] text-black/60">Revenue Audit Story</p>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded hover:bg-black/10 transition-colors"
          >
            <X className="w-5 h-5 text-black/60" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <span className="uppercase-label px-3 py-2 text-black/50 block mb-2">
            The Journey
          </span>
          <div className="space-y-1">
            {chapters.map((chapter, idx) => {
              const isActive = pathname === chapter.href
              const Icon = chapter.icon
              const isPast = currentIndex > idx
              
              return (
                <Link
                  key={chapter.id}
                  href={chapter.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-start gap-3 px-3 py-3 rounded-xl transition-all duration-200 relative group",
                    isActive
                      ? "bg-gold/10 border border-gold/20"
                      : "hover:bg-black/5"
                  )}
                >
                  {/* Progress indicator */}
                  <div className="relative">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                        isActive && "bg-gold text-white",
                        isPast && !isActive && "bg-green/20 text-green",
                        !isActive && !isPast && "bg-black/10 text-black/60 group-hover:bg-black/15"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    {idx < chapters.length - 1 && (
                      <div
                        className={cn(
                          "absolute left-1/2 top-full w-0.5 h-4 -translate-x-1/2",
                          isPast ? "bg-green/30" : "bg-black/10"
                        )}
                      />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0 pt-0.5">
                    <span className="text-[10px] uppercase tracking-wide text-black/50 block">
                      {chapter.label}
                    </span>
                    <span
                      className={cn(
                        "text-sm font-medium block",
                        isActive ? "text-black" : "text-black"
                      )}
                    >
                      {chapter.title}
                    </span>
                    {chapter.subtitle && (
                      <span className="text-[11px] text-black/60">{chapter.subtitle}</span>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-black/10 p-4">
          <Link href="/">
            <Button
              variant="outline"
              className="w-full border-black/20 bg-white/50 hover:bg-white/70 text-black hover:text-black"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-[280px] min-h-screen flex flex-col">
        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Bottom navigation */}
        <footer className="sticky bottom-0 border-t border-black/10 bg-[#EBE3DB]/95 backdrop-blur-md px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            {prevChapter ? (
              <Link
                href={prevChapter.href}
                className="flex items-center gap-2 text-sm text-black/60 hover:text-black transition-colors group"
              >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="hidden sm:inline">{prevChapter.title}</span>
                <span className="sm:hidden">Previous</span>
              </Link>
            ) : (
              <div />
            )}
            
            <div className="flex items-center gap-2">
              {chapters.map((chapter, idx) => (
                <Link
                  key={chapter.id}
                  href={chapter.href}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    pathname === chapter.href
                      ? "bg-gold w-6"
                      : currentIndex > idx
                      ? "bg-green/50 hover:bg-green/70"
                      : "bg-black/20 hover:bg-black/30"
                  )}
                />
              ))}
            </div>

            {nextChapter ? (
              <Link
                href={nextChapter.href}
                className="flex items-center gap-2 text-sm text-gold hover:text-gold/80 transition-colors group"
              >
                <span className="hidden sm:inline">{nextChapter.title}</span>
                <span className="sm:hidden">Next</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 text-sm text-gold hover:text-gold/80 transition-colors group"
              >
                <span>Enter Platform</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>
        </footer>
      </div>
    </div>
  )
}
