"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Moon,
  Activity,
  LayoutDashboard,
  ChevronDown,
  Play,
  Sparkles,
  ArrowRight,
  Check,
  Globe,
  Shield,
  Zap,
  Brain,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  HeroVisual,
  AnimatedLogoMark,
  TextReveal,
  AnimatedStat,
  ScrollIndicator
} from "@/components/house-os/hero-visual"

const features = [
  {
    icon: Moon,
    title: "Finance — Continuous Close",
    headline: "Close the books while the kettle's on",
    body: "600-store automated audit runs continuously. SAP S/4 HANA posts journals automatically. Finance reviews exceptions only — period close drops from 11 days to 1.",
    cta: "See Audit Workflow",
    href: "/login?role=auditor",
    gradient: "from-blue/20 to-blue/5",
    visual: [
      { step: 1, label: "POS / Nectar Pull", done: true },
      { step: 2, label: "Cash Office Sync", done: true },
      { step: 3, label: "SAP S/4 Post", done: false },
    ],
  },
  {
    icon: Activity,
    title: "Supply Chain — Invoice→PO→GRN",
    headline: "3-way match in seconds, not weeks",
    body: "Supplier invoices auto-matched against purchase orders and goods receipts in real time. Working capital recovered, exceptions surfaced live, payment runs cleared with confidence.",
    cta: "See Match Engine",
    href: "/login?role=finance-ops",
    gradient: "from-green/20 to-green/5",
    visual: [
      { time: "06:32", text: "Britvic Inv #BRT-99412", amount: "£18,420" },
      { time: "06:34", text: "Bakkavor Inv #BKV-22781", amount: "£42,108" },
      { time: "06:37", text: "Müller Inv #MLR-55619", amount: "£9,640" },
    ],
  },
  {
    icon: LayoutDashboard,
    title: "CFO — Portfolio P&L",
    headline: "600 stores. One ledger.",
    body: "Live P&L by store and region, period close status, working capital impact, and shrinkage exposure — all real-time, all in one view.",
    cta: "See Portfolio",
    href: "/login?role=cfo",
    gradient: "from-gold/20 to-gold/5",
    visual: [
      { name: "Potters Bar", status: "green", value: "104%" },
      { name: "Whitechapel", status: "amber", value: "87%" },
      { name: "Nine Elms", status: "green", value: "112%" },
    ],
  },
]

const capabilities = [
  { icon: Brain, label: "AI-Powered Insights", desc: "Proactive intelligence that works 24/7" },
  { icon: Globe, label: "Portfolio-Wide View", desc: "600+ stores unified in one platform" },
  { icon: Shield, label: "Enterprise Security", desc: "SOC 2 compliant, bank-level encryption" },
  { icon: Zap, label: "Real-Time Operations", desc: "Live data from every store and system" },
]

const integrations = ["SAP S/4 HANA", "Blue Yonder", "Manhattan Active WMS", "Nectar360", "Salesforce"]

export default function HeroLanding() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set())
  const [videoPlaying, setVideoPlaying] = useState(false)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(entry.target.getAttribute("data-index") || "0")
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, index]))
          }
        })
      },
      { threshold: 0.2 }
    )

    document.querySelectorAll("[data-section]").forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Animated background */}
        <HeroVisual />

        {/* Content */}
        <motion.div
          className="relative z-10 max-w-5xl mx-auto text-center"
          style={{ opacity: heroOpacity }}
        >
          {/* Logo */}
          <motion.div
            className="flex items-center justify-center gap-4 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <AnimatedLogoMark />
            <div className="flex flex-col items-start">
              <span className="uppercase-label tracking-[0.3em] text-text-muted">Store OS</span>
              <span className="text-[10px] text-text-faint">by Sainsbury&apos;s</span>
            </div>
          </motion.div>

          {/* Headline */}
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light text-text leading-[1.05] mb-8">
            <TextReveal delay={0.4}>One platform.</TextReveal>
            <br />
            <TextReveal delay={0.6}>Every store.</TextReveal>
            <br />
            <motion.span
              className="text-gold inline-block"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              Every close.
            </motion.span>
          </h1>

          {/* Subtext */}
          <motion.p
            className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto mb-6 text-balance leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            The unified operating system for finance and supply chain —
            powered by AI that closes the books, reconciles invoices, and surfaces shrinkage in real time.
          </motion.p>

          {/* Companion link */}
          <motion.div
            className="mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.1 }}
          >
            <a
              href="https://v0-sainsbury-s-market-analysis.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-text-faint hover:text-gold transition-colors inline-flex items-center"
            >
              Live store-intelligence companion
              <ArrowRight className="w-3 h-3 ml-1" />
            </a>
          </motion.div>

          {/* CTAs */}
          <motion.div
            className="flex items-center justify-center gap-4 flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <Link href="/login">
              <Button className="bg-gold hover:bg-gold/90 text-background px-8 py-6 text-base font-medium rounded-xl shadow-lg shadow-gold/20 hover:shadow-gold/30 transition-all hover:scale-105">
                Enter Platform
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Button
              variant="outline"
              className="border-border-mid hover:bg-surface-2 text-text px-8 py-6 text-base rounded-xl hover:border-gold/30 transition-all"
              onClick={() => setVideoPlaying(true)}
            >
              <Play className="w-4 h-4 mr-2" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Live indicator */}
          <motion.div
            className="mt-12 flex items-center justify-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.6 }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green" />
            </span>
            <span className="text-xs text-text-faint">
              600+ Stores Connected · Argos AI on watch · Live
            </span>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          style={{ opacity: heroOpacity }}
        >
          <ScrollIndicator />
        </motion.div>
      </section>

      {/* Stats Strip */}
      <section
        data-section
        data-index="1"
        className={cn(
          "py-20 border-y border-border bg-surface-1/50 backdrop-blur-sm transition-all duration-700",
          visibleSections.has(1) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}
      >
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-8">
          <AnimatedStat value={1} label="day period close (from 11)" delay={0} suffix="d" />
          <AnimatedStat value={97.4} label="auto-matched invoices" delay={0.2} suffix="%" />
          <AnimatedStat value={600} label="stores unified" delay={0.4} suffix="+" />
          <AnimatedStat value={24} label="Argos AI on watch" delay={0.6} suffix="/7" />
        </div>
      </section>

      {/* Capabilities Section */}
      <section
        data-section
        data-index="2"
        className={cn(
          "py-24 px-6 transition-all duration-700",
          visibleSections.has(2) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="uppercase-label text-gold mb-4 block">Capabilities</span>
              <h2 className="font-serif text-4xl md:text-5xl text-text mb-6">
                Intelligence that never sleeps
              </h2>
              <p className="text-text-muted max-w-xl mx-auto">
                Store OS combines real-time finance and supply chain operations with proactive AI to transform how Sainsbury&apos;s closes, reconciles, and reports.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {capabilities.map((cap, i) => {
              const Icon = cap.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group p-6 rounded-2xl bg-surface-1 border border-border hover:border-gold/30 transition-all hover:shadow-lg hover:shadow-gold/5"
                >
                  <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                    <Icon className="w-6 h-6 text-gold" />
                  </div>
                  <h3 className="font-medium text-text mb-2">{cap.label}</h3>
                  <p className="text-sm text-text-muted">{cap.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-24 px-6 bg-surface-1/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="uppercase-label text-gold mb-4 block">Three Perspectives</span>
            <h2 className="font-serif text-4xl md:text-5xl text-text">
              Built for the office of the CFO
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={i}
                  data-section
                  data-index={i + 3}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className="group relative rounded-2xl overflow-hidden bg-surface-1 border border-border hover:border-gold/30 transition-all duration-300 hover:shadow-xl hover:shadow-gold/5"
                >
                  {/* Gradient header */}
                  <div className={cn("h-32 bg-gradient-to-br relative", feature.gradient)}>
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-4 left-6">
                      <div className="w-12 h-12 rounded-xl bg-surface-1/90 backdrop-blur flex items-center justify-center shadow-lg">
                        <Icon className="w-6 h-6 text-gold" />
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Title */}
                    <span className="uppercase-label text-text-faint block mb-3">{feature.title}</span>

                    {/* Headline */}
                    <h3 className="font-serif text-xl text-text mb-3">{feature.headline}</h3>

                    {/* Body */}
                    <p className="text-sm text-text-muted mb-6 leading-relaxed">{feature.body}</p>

                    {/* Visual */}
                    <div className="mb-6 p-4 rounded-xl bg-surface-2 border border-border/50">
                      {i === 0 && (
                        <div className="space-y-2">
                          {(feature.visual as { step: number; label: string; done: boolean }[]).map((step) => (
                            <div key={step.step} className="flex items-center gap-3">
                              <div
                                className={cn(
                                  "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold",
                                  step.done ? "bg-green text-background" : "bg-gold text-background"
                                )}
                              >
                                {step.done ? <Check className="w-3 h-3" /> : step.step}
                              </div>
                              <span className="text-xs text-text-muted">{step.label}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {i === 1 && (
                        <div className="space-y-2">
                          {(feature.visual as { time: string; text: string; amount: string }[]).map((item, j) => (
                            <div key={j} className="flex items-center justify-between text-xs">
                              <span className="text-text-faint font-mono">{item.time}</span>
                              <span className="text-text-muted flex-1 mx-3 truncate">{item.text}</span>
                              <span className="text-gold tabular-nums font-medium">{item.amount}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {i === 2 && (
                        <div className="flex gap-2">
                          {(feature.visual as { name: string; status: string; value: string }[]).map((prop, j) => (
                            <div key={j} className="flex-1 p-3 rounded-lg bg-surface-3 text-center">
                              <div
                                className={cn(
                                  "w-2 h-2 rounded-full mx-auto mb-2",
                                  prop.status === "green" ? "bg-green" : "bg-amber"
                                )}
                              />
                              <span className="text-[10px] text-text-muted block">{prop.name}</span>
                              <span className="text-xs text-gold font-medium">{prop.value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* CTA */}
                    <Link
                      href={feature.href}
                      className="inline-flex items-center text-sm text-gold hover:text-gold/80 transition-colors group/link"
                    >
                      {feature.cta}
                      <ArrowRight className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Argos AI Section */}
      <section
        data-section
        data-index="6"
        className={cn(
          "py-32 px-6 relative overflow-hidden transition-all duration-700",
          visibleSections.has(6) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}
      >
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-8">
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="text-sm text-gold">Introducing Argos AI</span>
            </div>

            <h2 className="font-serif text-4xl md:text-5xl text-text mb-6">
              Your 24/7 finance co-pilot
            </h2>

            <p className="text-lg text-text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
              Argos works while the stores trade. It monitors invoice variance, surfaces shrinkage exposure,
              progresses period-close tasks, and tells you exactly what needs CFO attention —
              with a clear path to closure.
            </p>

            {/* Sample notification */}
            <motion.div
              className="max-w-lg mx-auto p-5 rounded-2xl bg-surface-1 border border-border shadow-2xl text-left"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-text">Argos Update</span>
                    <span className="text-xs text-text-faint">Just now</span>
                  </div>
                  <p className="text-sm text-text-muted leading-relaxed">
                    <strong className="text-text">Period 04 Close:</strong> 597 of 600 stores reconciled.
                    3 exceptions (Bakkavor invoice variance £42k, Whitechapel shrinkage spike, Nine Elms cash short).
                    Drafts ready for review. Target close: tomorrow 09:00.
                  </p>
                  <button className="mt-3 text-sm text-gold hover:text-gold/80 transition-colors inline-flex items-center">
                    Review now <ArrowRight className="w-3 h-3 ml-1" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Integration Strip */}
      <section
        data-section
        data-index="7"
        className={cn(
          "py-16 border-y border-border bg-surface-1/50 transition-all duration-700",
          visibleSections.has(7) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}
      >
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm text-text-muted mb-8">Seamlessly integrates with your existing stack</p>
          <div className="flex items-center justify-center gap-8 md:gap-12 flex-wrap opacity-60">
            {integrations.map((name) => (
              <span key={name} className="text-text-faint text-sm font-medium">
                {name}
              </span>
            ))}
          </div>
          <p className="text-xs text-text-faint mt-8 max-w-lg mx-auto">
            API integration layer bridges legacy POS, WMS, and ERP. Long-term: Store OS becomes the system of record.
          </p>
        </div>
      </section>

      {/* Priya's Story Section */}
      <section
        data-section
        data-index="8"
        className={cn(
          "py-24 px-6 relative overflow-hidden transition-all duration-700",
          visibleSections.has(8) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-background to-surface-1" />
        <div className="relative max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="uppercase-label text-gold mb-4 block">The Journey</span>
                <h2 className="font-serif text-4xl md:text-5xl text-text mb-6">
                  Meet Priya
                </h2>
                <p className="text-text-muted mb-6 leading-relaxed">
                  Priya is the Daily Audit Lead at the Whitechapel store. She reconciles takings,
                  shrinkage, and supplier deliveries every day across her store and her cluster.
                  Follow her journey from manual reconciliation to AI-powered oversight — a three-state evolution
                  that transforms not just how Priya works, but how the entire business closes.
                </p>
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red" />
                    <span className="text-sm text-text-muted">Today</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-text-faint" />
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber" />
                    <span className="text-sm text-text-muted">Tomorrow</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-text-faint" />
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green" />
                    <span className="text-sm text-text-muted">Beyond</span>
                  </div>
                </div>
                <Link href="/story">
                  <Button className="bg-gold hover:bg-gold/90 text-background px-8 py-6 text-base">
                    Read Priya&apos;s Story
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-border bg-surface-1 p-8 flex flex-col justify-center">
                {/* Abstract journey visualization */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-red/20 border-2 border-red flex items-center justify-center mb-2">
                      <span className="text-2xl font-serif text-red">1</span>
                    </div>
                    <span className="text-xs text-text-muted">Today</span>
                    <span className="text-xs text-red">Manual</span>
                  </div>
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-red via-amber to-green mx-4" />
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-amber/20 border-2 border-amber flex items-center justify-center mb-2">
                      <span className="text-2xl font-serif text-amber">2</span>
                    </div>
                    <span className="text-xs text-text-muted">Tomorrow</span>
                    <span className="text-xs text-amber">Assisted</span>
                  </div>
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-amber to-green mx-4" />
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-green/20 border-2 border-green flex items-center justify-center mb-2">
                      <span className="text-2xl font-serif text-green">3</span>
                    </div>
                    <span className="text-xs text-text-muted">Beyond</span>
                    <span className="text-xs text-green">Intelligent</span>
                  </div>
                </div>
                <div className="bg-surface-2 border border-border rounded-xl p-4 text-center">
                  <p className="text-sm text-text font-medium mb-1">Daily Audit & Close Process</p>
                  <p className="text-xs text-text-muted">From manual close to intelligent oversight: a three-state journey</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section
        data-section
        data-index="9"
        className={cn(
          "py-32 px-6 text-center transition-all duration-700",
          visibleSections.has(9) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-serif text-4xl md:text-5xl text-text mb-4">Ready to see it live?</h2>
          <p className="text-text-muted mb-10 max-w-md mx-auto">
            Experience how Store OS transforms Sainsbury&apos;s finance and supply chain — from continuous close to live portfolio P&amp;L.
          </p>
          <Link href="/login">
            <Button className="bg-gold hover:bg-gold/90 text-background px-10 py-6 text-base font-medium rounded-xl shadow-lg shadow-gold/20 hover:shadow-gold/30 transition-all hover:scale-105">
              Enter Platform
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-text-faint">
          <span>&copy; Sainsbury&apos;s Store OS &middot; CFO Briefing Demo &middot; {new Date().getFullYear()}</span>
          <a
            href="https://v0-sainsbury-s-market-analysis.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gold transition-colors"
          >
            Live store-intelligence companion &rarr;
          </a>
        </div>
      </footer>

      {/* Video Modal */}
      <AnimatePresence>
        {videoPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
            onClick={() => setVideoPlaying(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl aspect-video bg-surface-1 rounded-2xl border border-border shadow-2xl flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <Play className="w-16 h-16 text-gold mx-auto mb-4" />
                <p className="text-text-muted">Demo video placeholder &mdash; Sainsbury&apos;s Store OS in action</p>
                <p className="text-xs text-text-faint mt-2">Click outside to close</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
