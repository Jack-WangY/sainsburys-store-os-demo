"use client"

// Dashboard layout for House OS - version 2.0
import { HouseOSProvider, useHouseOS } from '@/lib/house-os-context'
import { DemoGuideProvider } from '@/components/house-os/demo-guide-context'
import { AppShell } from '@/components/house-os/app-shell'
import DemoGuide from '@/components/house-os/demo-guide'
import { OracleChat } from '@/components/house-os/oracle-chat'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { state } = useHouseOS()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // For demo purposes, we'll auto-login as exco if not authenticated
  useEffect(() => {
    if (mounted && !state.isAuthenticated) {
      // Auto-login for demo
      // In production, this would redirect to /login
    }
  }, [mounted, state.isAuthenticated, router])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-gold border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <>
      <AppShell>{children}</AppShell>
      <DemoGuide />
      <OracleChat />
    </>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <HouseOSProvider>
      <DemoGuideProvider>
        <DashboardContent>{children}</DashboardContent>
      </DemoGuideProvider>
    </HouseOSProvider>
  )
}
