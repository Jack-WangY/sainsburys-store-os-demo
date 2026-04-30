"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion"

// Floating orb component with subtle glow
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
        x: [0, 100, -50, 80, 0],
        y: [0, -80, 60, -40, 0],
        scale: [1, 1.2, 0.9, 1.1, 1],
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

// Animated grid lines
function GridLines() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-[0.03]">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" className="text-gold" />
      </svg>
    </div>
  )
}

// Particle field
function ParticleField() {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 20 + 10,
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
            y: [0, -100, 0],
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

// Animated connecting lines between nodes
function ConnectionLines() {
  const paths = [
    "M 10 80 Q 30 50 50 70 T 90 40",
    "M 5 40 Q 25 20 45 35 T 95 25",
    "M 15 90 Q 35 70 55 85 T 85 60",
  ]

  return (
    <div className="absolute inset-0 overflow-hidden opacity-[0.15]">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {paths.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            fill="none"
            stroke="url(#goldGradient)"
            strokeWidth="0.2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              pathLength: { duration: 3, delay: i * 0.5, ease: "easeInOut" },
              opacity: { duration: 0.5, delay: i * 0.5 },
            }}
          />
        ))}
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(201,168,76,0)" />
            <stop offset="50%" stopColor="rgba(201,168,76,1)" />
            <stop offset="100%" stopColor="rgba(201,168,76,0)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

// Animated data visualization nodes
function DataNodes() {
  const nodes = [
    { x: 15, y: 25, label: "London", value: "104%", delay: 0 },
    { x: 75, y: 20, label: "Manchester", value: "97%", delay: 0.2 },
    { x: 85, y: 55, label: "Bristol", value: "92%", delay: 0.4 },
    { x: 25, y: 70, label: "Leeds", value: "101%", delay: 0.6 },
    { x: 60, y: 75, label: "Brighton", value: "87%", delay: 0.8 },
    { x: 45, y: 35, label: "Glasgow", value: "112%", delay: 1 },
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
          transition={{ duration: 0.6, delay: 2 + node.delay, ease: "backOut" }}
        >
          {/* Pulse ring */}
          <motion.div
            className="absolute inset-0 rounded-full border border-gold/30"
            style={{ width: 60, height: 60, marginLeft: -30, marginTop: -30 }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, delay: node.delay }}
          />
          
          {/* Node center */}
          <div className="relative flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-gold shadow-lg shadow-gold/30" />
            <motion.div 
              className="absolute top-5 whitespace-nowrap"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 2.5 + node.delay }}
            >
              <span className="text-[10px] text-text-muted block text-center">{node.label}</span>
              <span className="text-xs text-gold font-medium block text-center">{node.value}</span>
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// Main hero visualization
export function HeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])

  const springY = useSpring(y, { stiffness: 100, damping: 30 })
  const springOpacity = useSpring(opacity, { stiffness: 100, damping: 30 })
  const springScale = useSpring(scale, { stiffness: 100, damping: 30 })

  return (
    <motion.div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
      style={{ y: springY, opacity: springOpacity, scale: springScale }}
    >
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-surface-1" />
      
      {/* Grid lines */}
      <GridLines />
      
      {/* Floating orbs */}
      <FloatingOrb delay={0} duration={25} size={400} color="rgba(201,168,76,0.06)" startX={10} startY={20} />
      <FloatingOrb delay={2} duration={30} size={300} color="rgba(201,168,76,0.04)" startX={70} startY={60} />
      <FloatingOrb delay={4} duration={22} size={350} color="rgba(90,135,196,0.03)" startX={50} startY={10} />
      
      {/* Particle field */}
      <ParticleField />
      
      {/* Connection lines */}
      <ConnectionLines />
      
      {/* Data nodes - only visible on larger screens */}
      <div className="hidden lg:block">
        <DataNodes />
      </div>
      
      {/* Central glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]">
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
      
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </motion.div>
  )
}

// Animated logo mark
export function AnimatedLogoMark() {
  return (
    <motion.div
      className="relative w-14 h-14"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ duration: 0.8, ease: "backOut" }}
    >
      {/* Outer ring */}
      <motion.div
        className="absolute inset-0 rounded-xl border border-gold/30"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Inner glow */}
      <div className="absolute inset-1 rounded-lg bg-gradient-to-br from-gold to-gold-dim flex items-center justify-center shadow-lg shadow-gold/30">
        <motion.span 
          className="text-background font-serif text-2xl font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          S
        </motion.span>
      </div>
      
      {/* Sparkle accents */}
      {[0, 90, 180, 270].map((angle, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-gold rounded-full"
          style={{
            left: "50%",
            top: "50%",
            transformOrigin: "0 0",
          }}
          animate={{
            x: [0, Math.cos((angle * Math.PI) / 180) * 35],
            y: [0, Math.sin((angle * Math.PI) / 180) * 35],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            delay: 1 + i * 0.2,
            repeat: Infinity,
            repeatDelay: 3,
          }}
        />
      ))}
    </motion.div>
  )
}

// Animated text reveal
export function TextReveal({ 
  children, 
  delay = 0,
  className = "",
}: { 
  children: string
  delay?: number
  className?: string
}) {
  return (
    <motion.span
      className={`inline-block ${className}`}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.span>
  )
}

// Animated stat counter
export function AnimatedStat({ 
  value, 
  label, 
  delay = 0,
  suffix = "",
}: { 
  value: number
  label: string
  delay?: number
  suffix?: string
}) {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (hasAnimated) return
    
    const timeout = setTimeout(() => {
      setHasAnimated(true)
      const duration = 2000
      const steps = 60
      const increment = value / steps
      let current = 0
      
      const timer = setInterval(() => {
        current += increment
        if (current >= value) {
          setCount(value)
          clearInterval(timer)
        } else {
          setCount(Math.floor(current))
        }
      }, duration / steps)
      
      return () => clearInterval(timer)
    }, delay * 1000)
    
    return () => clearTimeout(timeout)
  }, [value, delay, hasAnimated])

  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: delay + 0.5 }}
    >
      <div className="font-serif text-5xl text-gold tabular-nums">
        {count.toLocaleString()}{suffix}
      </div>
      <p className="text-sm text-text-muted mt-2">{label}</p>
    </motion.div>
  )
}

// Scroll indicator with animation
export function ScrollIndicator() {
  return (
    <motion.div
      className="flex flex-col items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2, duration: 0.6 }}
    >
      <span className="text-[11px] text-text-faint uppercase tracking-wider">Discover</span>
      <motion.div
        className="w-6 h-10 rounded-full border border-border-mid flex items-start justify-center p-1"
        animate={{ borderColor: ["rgba(255,255,255,0.12)", "rgba(201,168,76,0.3)", "rgba(255,255,255,0.12)"] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <motion.div
          className="w-1.5 h-3 rounded-full bg-gold"
          animate={{ y: [0, 16, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </motion.div>
  )
}
