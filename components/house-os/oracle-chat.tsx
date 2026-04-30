"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport, type UIMessage } from "ai"
import { motion, AnimatePresence } from "framer-motion"
import {
  MessageSquare,
  Send,
  X,
  Sparkles,
  Minimize2,
  Maximize2,
  Bell,
  Clock,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Bot,
  User,
  TrendingUp,
  AlertTriangle,
  Target,
  Calendar,
  ArrowRight,
  Building2,
  DollarSign,
  Users,
  BarChart3,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

// Proactive notifications that simulate ongoing AI work
const proactiveNotifications = [
  {
    id: 1,
    type: "task-progress",
    title: "Period Close - Day 3 of 5",
    message: "I've reconciled 1,247 store ledgers and flagged 23 variances over £10k. Ready for your review before sign-off.",
    action: "Review variances",
    priority: "critical",
    timestamp: "2 min ago",
    taskId: "UT001",
    progress: 70,
    nextStep: "Approve material variance write-offs and confirm period close",
    targetClosure: "Friday, 5pm BST",
  },
  {
    id: 2,
    type: "insight",
    title: "Working Capital Opportunity",
    message: "Whitechapel's fresh ordering pattern is releasing £180k of trapped stock. The same playbook could free £2.1m across 12 inner-London stores.",
    action: "See analysis",
    priority: "medium",
    timestamp: "15 min ago",
    impact: "+£2.1m working capital release",
  },
  {
    id: 3,
    type: "reminder",
    title: "Q1 Board Pack - Action Needed",
    message: "Slides 1-15 are ready. I need your steer on the fuel margin commentary before finalising the P&L narrative.",
    action: "Review slides",
    priority: "high",
    timestamp: "1 hour ago",
    taskId: "UT002",
    progress: 55,
    nextStep: "Provide steer on draft commentary or approve for final consolidation",
    targetClosure: "May 8, 2026",
  },
  {
    id: 4,
    type: "alert",
    title: "POS Outage - Holborn",
    message: "Critical: Tellermate sync failed at 06:14. £47k of takings unposted to SAP S/4 HANA. Treasury notified, I'm tracking resolution.",
    action: "View details",
    priority: "critical",
    timestamp: "Just now",
  },
]

// Quick action cards for empty state
const quickActions = [
  {
    icon: AlertTriangle,
    label: "What is holding period close today?",
    prompt: "What is holding period close today? Walk me through the open items and what needs my sign-off.",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
  },
  {
    icon: Target,
    label: "Show me invoice exceptions over £10k",
    prompt: "Show me invoice exceptions over £10k - which suppliers, which stores, and what's the cash impact?",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
  },
  {
    icon: TrendingUp,
    label: "Top 5 stores by shrinkage today",
    prompt: "Top 5 stores by shrinkage today - what's driving the loss and what action have store managers taken?",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Building2,
    label: "Where is working capital trapped?",
    prompt: "Where is working capital trapped right now - across stock, debtors, and supplier terms?",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: DollarSign,
    label: "Today's cash position vs forecast",
    prompt: "What's our cash position today vs forecast? Any drift I need to act on before tomorrow's treasury call?",
    color: "text-gold",
    bgColor: "bg-gold/10",
  },
  {
    icon: Users,
    label: "Nectar margin impact this week",
    prompt: "How is the Nectar promotional margin tracking this week? Any baskets eroding profitability faster than planned?",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
  },
]

function getMessageText(message: UIMessage): string {
  if (!message.parts || !Array.isArray(message.parts)) return ""
  return message.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("")
}

interface OracleChatProps {
  defaultOpen?: boolean
}

export function OracleChat({ defaultOpen = false }: OracleChatProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showNotifications, setShowNotifications] = useState(true)
  const [dismissedNotifications, setDismissedNotifications] = useState<number[]>([])
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/oracle" }),
  })

  const isLoading = status === "streaming" || status === "submitted"
  const activeNotifications = proactiveNotifications.filter((n) => !dismissedNotifications.includes(n.id))

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSend = () => {
    if (!input.trim() || isLoading) return
    sendMessage({ text: input })
    setInput("")
  }

  const handleQuickAction = (prompt: string) => {
    sendMessage({ text: prompt })
  }

  const handleNotificationAction = (notification: (typeof proactiveNotifications)[0]) => {
    setDismissedNotifications([...dismissedNotifications, notification.id])
    setIsOpen(true)
    setTimeout(() => {
      if (notification.taskId) {
        sendMessage({ text: `Give me a detailed update on ${notification.title}. What progress have you made and what do you need from me?` })
      } else {
        sendMessage({ text: `Tell me more about: ${notification.title}` })
      }
    }, 300)
  }

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case "critical":
        return "border-l-red-500 bg-red-500/5"
      case "high":
        return "border-l-amber-500 bg-amber-500/5"
      default:
        return "border-l-gold bg-gold/5"
    }
  }

  const getPriorityIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <AlertCircle className="h-4 w-4 text-red-400" />
      case "task-progress":
        return <CheckCircle2 className="h-4 w-4 text-green-400" />
      case "insight":
        return <TrendingUp className="h-4 w-4 text-gold" />
      case "reminder":
        return <Calendar className="h-4 w-4 text-amber-400" />
      default:
        return <Sparkles className="h-4 w-4 text-gold" />
    }
  }

  return (
    <>
      {/* Floating notification panel */}
      <AnimatePresence>
        {showNotifications && activeNotifications.length > 0 && !isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed right-6 top-24 z-50 w-96 space-y-3"
          >
            <div className="flex items-center justify-between px-1 mb-2">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Bell className="h-4 w-4 text-gold" />
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-gold" />
                  </span>
                </div>
                <span className="text-sm font-medium text-foreground">Argos AI is working</span>
                <Badge variant="outline" className="border-gold/30 bg-gold/10 text-gold text-xs">
                  {activeNotifications.length} updates
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                onClick={() => setShowNotifications(false)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>

            {activeNotifications.slice(0, 3).map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20, x: 20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "rounded-xl border border-border/50 bg-card/95 backdrop-blur-xl shadow-2xl border-l-4 overflow-hidden",
                  getPriorityStyles(notification.priority)
                )}
              >
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">{getPriorityIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="font-medium text-foreground text-sm truncate">{notification.title}</h4>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">{notification.timestamp}</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-2">{notification.message}</p>

                      {/* Progress indicator for tasks */}
                      {notification.progress && (
                        <div className="mb-2">
                          <div className="flex items-center justify-between text-[10px] mb-1">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="text-gold font-medium">{notification.progress}%</span>
                          </div>
                          <Progress value={notification.progress} className="h-1" />
                        </div>
                      )}

                      {/* Next step and target closure */}
                      {notification.nextStep && (
                        <div className="text-[10px] text-muted-foreground mb-2">
                          <span className="text-gold">Next action:</span> {notification.nextStep}
                        </div>
                      )}
                      {notification.targetClosure && (
                        <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Target closure: <span className="text-foreground">{notification.targetClosure}</span>
                        </div>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 h-7 px-2 text-xs text-gold hover:text-gold hover:bg-gold/10"
                        onClick={() => handleNotificationAction(notification)}
                      >
                        {notification.action}
                        <ChevronRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground shrink-0"
                      onClick={() => setDismissedNotifications([...dismissedNotifications, notification.id])}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}

            {activeNotifications.length > 3 && (
              <button
                onClick={() => setIsOpen(true)}
                className="w-full text-center text-xs text-gold hover:text-gold/80 py-2"
              >
                +{activeNotifications.length - 3} more updates
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat trigger button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="h-14 w-14 rounded-full bg-gold text-background shadow-2xl shadow-gold/30 hover:bg-gold/90 hover:scale-105 transition-all group"
            >
              <div className="relative">
                <Sparkles className="h-6 w-6 group-hover:scale-110 transition-transform" />
                {activeNotifications.length > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white animate-pulse">
                    {activeNotifications.length}
                  </span>
                )}
              </div>
            </Button>
            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="bg-card border border-border rounded-lg px-3 py-2 text-xs text-foreground whitespace-nowrap shadow-lg">
                Open Argos AI Assistant
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "fixed z-50 flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card/95 backdrop-blur-xl shadow-2xl",
              isExpanded ? "inset-4 md:inset-8" : "bottom-6 right-6 h-[650px] w-[440px]"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/50 bg-gradient-to-r from-card to-surface-1 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 relative">
                  <Sparkles className="h-5 w-5 text-gold" />
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green border-2 border-card" />
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Argos AI</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">CFO Financial Co-Pilot</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="flex flex-col h-full">
                  {/* Welcome header */}
                  <div className="text-center px-4 mb-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10 mx-auto mb-4">
                      <Sparkles className="h-7 w-7 text-gold" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">Good afternoon, Bláthnaid</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      I&apos;ve been working through close, supplier exceptions and store performance overnight. Here&apos;s what needs your attention:
                    </p>
                  </div>

                  {/* Quick action grid */}
                  <div className="grid grid-cols-2 gap-2 flex-1">
                    {quickActions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => handleQuickAction(action.prompt)}
                        className="flex flex-col items-start gap-2 p-3 rounded-xl border border-border/50 bg-surface-1/50 hover:bg-surface-1 hover:border-gold/30 transition-all text-left group"
                      >
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", action.bgColor)}>
                          <action.icon className={cn("h-4 w-4", action.color)} />
                        </div>
                        <span className="text-xs text-foreground leading-tight group-hover:text-gold transition-colors">
                          {action.label}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Active tasks summary */}
                  {activeNotifications.length > 0 && (
                    <div className="mt-4 p-3 rounded-xl bg-gold/5 border border-gold/10">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="h-4 w-4 text-gold" />
                        <span className="text-xs font-medium text-gold">Active Tasks</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        I have {activeNotifications.length} items in progress. Ask me for an update on any of them.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {messages.map((message) => {
                const text = getMessageText(message)
                if (!text) return null

                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn("flex gap-3", message.role === "user" ? "flex-row-reverse" : "")}
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                        message.role === "user" ? "bg-gold text-background" : "bg-surface-2"
                      )}
                    >
                      {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-gold" />}
                    </div>
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl px-4 py-3",
                        message.role === "user"
                          ? "bg-gold text-background rounded-br-md"
                          : "bg-surface-2 border border-border/50 rounded-bl-md"
                      )}
                    >
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{text}</p>
                    </div>
                  </motion.div>
                )
              })}

              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-2">
                    <Bot className="h-4 w-4 text-gold" />
                  </div>
                  <div className="rounded-2xl rounded-bl-md bg-surface-2 border border-border/50 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-gold" />
                      <span className="text-sm text-muted-foreground">Analysing data...</span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-border/50 p-4 bg-surface-1/50">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSend()
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about close, stores, suppliers, cash..."
                  disabled={isLoading}
                  className="flex-1 rounded-xl border border-border/50 bg-surface-2/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/30 disabled:opacity-50"
                />
                <Button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="h-11 w-11 rounded-xl bg-gold text-background hover:bg-gold/90 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
              <div className="mt-2 flex items-center justify-center gap-1 text-[10px] text-muted-foreground">
                <div className="flex h-1.5 w-1.5 rounded-full bg-green" />
                <span>Connected to live Sainsbury&apos;s data · 1,450 stores · SAP S/4 HANA</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
