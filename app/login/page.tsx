"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { Eye, EyeOff, Building2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { HouseOSProvider, useHouseOS, getRoleDefaultRoute, type UserRole } from '@/lib/house-os-context'

// Floating orb component matching hero visual
function FloatingOrb({ 
  delay = 0, 
  duration = 20, 
  size = 300, 
  color = "rgba(201,168,76,0.08)",
  startX = 0,
  startY = 0,
}: { 
  delay?: number
  duration?: number
  size?: number
  color?: string
  startX?: number
  startY?: number
}) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at center, ${color} 0%, transparent 70%)`,
        filter: "blur(40px)",
        left: `${startX}%`,
        top: `${startY}%`,
      }}
      animate={{
        x: [0, 50, -30, 40, 0],
        y: [0, -40, 30, -20, 0],
        scale: [1, 1.1, 0.95, 1.05, 1],
        opacity: [0.6, 0.8, 0.5, 0.7, 0.6],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  )
}

// Grid lines matching hero visual
function GridLines() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-[0.03]">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="loginGrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#loginGrid)" className="text-gold" />
      </svg>
    </div>
  )
}

// Particle field matching hero visual
function ParticleField() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * 5,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-gold/30"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -80, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

// Connection lines matching hero visual
function ConnectionLines() {
  const paths = [
    "M 10 80 Q 30 50 50 70 T 90 40",
    "M 5 40 Q 25 20 45 35 T 95 25",
  ]

  return (
    <div className="absolute inset-0 overflow-hidden opacity-[0.12]">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {paths.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            fill="none"
            stroke="url(#loginGoldGradient)"
            strokeWidth="0.3"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              pathLength: { duration: 3, delay: i * 0.5, ease: "easeInOut" },
              opacity: { duration: 0.5, delay: i * 0.5 },
            }}
          />
        ))}
        <defs>
          <linearGradient id="loginGoldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(201,168,76,0)" />
            <stop offset="50%" stopColor="rgba(201,168,76,1)" />
            <stop offset="100%" stopColor="rgba(201,168,76,0)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

// Data nodes showing property status
function DataNodes() {
  const nodes = [
    { x: 20, y: 25, label: "Soho House London", status: "online" },
    { x: 70, y: 35, label: "76 Dean Street", status: "online" },
    { x: 35, y: 65, label: "Shoreditch House", status: "online" },
    { x: 75, y: 70, label: "White City House", status: "audit" },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden">
      {nodes.map((node, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 + i * 0.2, ease: "backOut" }}
        >
          <motion.div
            className="absolute inset-0 rounded-full border border-gold/20"
            style={{ width: 40, height: 40, marginLeft: -20, marginTop: -20 }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
          />
          <div className="relative flex flex-col items-center">
            <div className={cn(
              "w-2 h-2 rounded-full shadow-lg",
              node.status === "online" ? "bg-status-success shadow-status-success/30" : "bg-gold shadow-gold/30"
            )} />
            <motion.div 
              className="absolute top-4 whitespace-nowrap"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 1.5 + i * 0.2 }}
            >
              <span className="text-[9px] text-text-muted/70">{node.label}</span>
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

const demoRoles = [
  {
    id: 'floor',
    label: 'Floor Manager',
    description: 'Shift summary, commentary capture, event logging',
    email: 'james.liu@sohohouse.com',
  },
  {
    id: 'finance',
    label: 'Night Supervisor',
    description: 'Revenue audit workflow, reconciliation, Oracle posting',
    email: 'dave@sohohouse.com',
  },
  {
    id: 'gm',
    label: 'Property GM',
    description: 'Morning dashboard, performance, floor commentary',
    email: 'emma.park@sohohouse.com',
  },
  {
    id: 'finance-ops',
    label: 'Finance Director - Operations',
    description: 'Cross-property patterns, variance tracking',
    email: 'rachel.thompson@sohohouse.com',
  },
  {
    id: 'exco',
    label: 'Executive',
    description: 'Portfolio overview, AI insights, full traceability',
    email: 'sarah.mitchell@sohohouse.com',
  },
]

function LoginForm() {
  const router = useRouter()
  const { login } = useHouseOS()
  const [selectedRole, setSelectedRole] = useState<string>('finance')
  const [email, setEmail] = useState('dave@sohohouse.com')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId)
    const role = demoRoles.find((r) => r.id === roleId)
    if (role) {
      setEmail(role.email)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate login
    await new Promise((resolve) => setTimeout(resolve, 800))

    login(selectedRole as UserRole)
    const defaultRoute = getRoleDefaultRoute(selectedRole as UserRole)
    router.push(defaultRoute)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel - Brand with Hero Visual */}
      <div className="hidden lg:flex lg:w-[55%] relative bg-background flex-col items-center justify-center p-12 overflow-hidden">
        {/* Grid lines */}
        <GridLines />
        
        {/* Floating orbs */}
        <FloatingOrb delay={0} duration={25} size={350} color="rgba(201,168,76,0.06)" startX={5} startY={15} />
        <FloatingOrb delay={2} duration={30} size={280} color="rgba(201,168,76,0.04)" startX={60} startY={55} />
        <FloatingOrb delay={4} duration={22} size={300} color="rgba(90,135,196,0.03)" startX={40} startY={5} />
        
        {/* Particle field */}
        <ParticleField />
        
        {/* Connection lines */}
        <ConnectionLines />
        
        {/* Data nodes */}
        <DataNodes />
        
        {/* Central glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none">
          <motion.div
            className="w-full h-full rounded-full"
            style={{
              background: "radial-gradient(circle at center, rgba(201,168,76,0.08) 0%, transparent 60%)",
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
        
        <div className="relative z-10 text-center max-w-md">
          {/* Animated Logo */}
          <motion.div 
            className="flex items-center justify-center gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div 
              className="relative w-14 h-14"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: "backOut" }}
            >
              <motion.div
                className="absolute inset-0 rounded-xl border border-gold/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute inset-1 rounded-lg bg-gradient-to-br from-gold to-gold-dim flex items-center justify-center shadow-lg shadow-gold/30">
                <span className="text-background font-serif text-2xl font-bold">H</span>
              </div>
            </motion.div>
            <div className="text-left">
              <h1 className="font-serif text-2xl text-text">House OS</h1>
              <p className="text-xs text-text-muted">Unified Operations Platform</p>
            </div>
          </motion.div>

          <motion.h2 
            className="font-serif text-4xl text-text leading-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            The command centre for every Soho House
          </motion.h2>
          <motion.p 
            className="text-text-muted text-sm leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            From remote revenue audits to portfolio intelligence, House OS brings all your property operations into one premium, AI-powered platform.
          </motion.p>
        </div>

        <motion.div 
          className="absolute bottom-8 text-xs text-text-faint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          Soho House · United Kingdom · 9 Properties Connected
        </motion.div>
        
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </div>

      {/* Right panel - Login form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold to-gold-dim flex items-center justify-center">
              <span className="text-background font-bold">H</span>
            </div>
            <span className="font-serif text-lg text-text">House OS</span>
          </div>

          <h2 className="font-serif text-3xl text-text mb-2">Welcome back</h2>
          <p className="text-sm text-text-muted mb-10">Sign in to House OS</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-text-muted text-sm">Email address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-surface-3 border-[rgba(255,255,255,0.07)] focus:border-gold-dim text-text h-12"
                placeholder="you@sohohouse.com"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-text-muted text-sm">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  defaultValue="••••••••"
                  className="bg-surface-3 border-[rgba(255,255,255,0.07)] focus:border-gold-dim text-text h-12 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-faint hover:text-text-muted"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Sign in button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gold hover:bg-gold/90 text-background h-12 text-sm font-medium"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[rgba(255,255,255,0.07)]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-background px-4 text-text-faint">or continue with</span>
              </div>
            </div>

            {/* SSO button */}
            <Button
              type="button"
              variant="outline"
              className="w-full border-[rgba(255,255,255,0.12)] hover:bg-surface-3 text-text h-12 text-sm"
            >
              <Building2 className="w-4 h-4 mr-2" />
              Sign in with Soho House SSO
            </Button>
          </form>

          {/* Demo role selector */}
          <div className="mt-10 pt-8 border-t border-[rgba(255,255,255,0.07)]">
            <span className="uppercase-label text-text-faint block mb-4">Demo as:</span>
            <div className="space-y-2">
              {demoRoles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => handleRoleSelect(role.id)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border transition-all duration-200",
                    selectedRole === role.id
                      ? "bg-gold-glow border-gold-dim"
                      : "bg-surface-2 border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.12)]"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className={cn(
                      "font-medium text-sm",
                      selectedRole === role.id ? "text-gold" : "text-text"
                    )}>
                      {role.label}
                    </span>
                    {selectedRole === role.id && (
                      <span className="w-2 h-2 rounded-full bg-gold" />
                    )}
                  </div>
                  <p className="text-xs text-text-muted mt-1">{role.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs text-text-faint mt-8">
            <a href="#" className="hover:text-text-muted transition-colors">Forgot password?</a>
            <span className="text-border">|</span>
            <a href="/story" className="hover:text-gold transition-colors">Read Dave&apos;s Story</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <HouseOSProvider>
      <LoginForm />
    </HouseOSProvider>
  )
}
