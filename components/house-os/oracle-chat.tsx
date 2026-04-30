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
    title: "Hong Kong Recovery Strategy",
    message: "I've completed the competitive analysis and drafted 3 intervention options. Ready for your review.",
    action: "Review now",
    priority: "critical",
    timestamp: "2 min ago",
    taskId: "UT001",
    progress: 70,
    nextStep: "Review the proposed interventions and approve budget allocation",
    targetClosure: "Friday, 5pm GMT",
  },
  {
    id: 2,
    type: "insight",
    title: "Revenue Opportunity Detected",
    message: "Amsterdam's 18.9% growth pattern could be replicated in Berlin. I've identified 5 key success factors.",
    action: "See analysis",
    priority: "medium",
    timestamp: "15 min ago",
    impact: "+8-12% revenue potential",
  },
  {
    id: 3,
    type: "reminder",
    title: "Q2 Board Deck - Action Needed",
    message: "Slides 1-15 are ready. I need your feedback on the APAC section before finalizing the financial data.",
    action: "Review slides",
    priority: "high",
    timestamp: "1 hour ago",
    taskId: "UT002",
    progress: 55,
    nextStep: "Provide feedback on draft slides or approve for final data integration",
    targetClosure: "June 25, 2024",
  },
  {
    id: 4,
    type: "alert",
    title: "Hong Kong Payment Gateway",
    message: "Critical: Payment gateway outage affecting member billing. Finance team notified. I'm monitoring resolution progress.",
    action: "View details",
    priority: "critical",
    timestamp: "Just now",
  },
]

// Quick action cards for empty state
const quickActions = [
  {
    icon: AlertTriangle,
    label: "Hong Kong requires intervention",
    prompt: "Give me a full update on Hong Kong. What's the current situation and what are my options?",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
  },
  {
    icon: Target,
    label: "Q2 board deck ready for review",
    prompt: "Show me the Q2 board presentation progress and what needs my approval",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
  },
  {
    icon: TrendingUp,
    label: "Growth opportunity in Amsterdam",
    prompt: "Tell me about Amsterdam's success factors and how we can replicate them in other properties",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Building2,
    label: "Global portfolio overview",
    prompt: "Give me a quick snapshot of how all properties are performing right now",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: DollarSign,
    label: "Financial performance check",
    prompt: "What are the key financial metrics I should know about today? Any concerns?",
    color: "text-gold",
    bgColor: "bg-gold/10",
  },
  {
    icon: Users,
    label: "Member insights",
    prompt: "What's happening with our members? Any trends in satisfaction, churn, or new signups?",
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
                <span className="text-sm font-medium text-foreground">Oracle is working</span>
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
                Open Oracle AI Assistant
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
                  <h3 className="font-semibold text-foreground">Oracle</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Executive AI Assistant</span>
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
                    <h4 className="font-semibold text-foreground mb-2">Good afternoon</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      I&apos;ve been working on several initiatives while you were away. Here&apos;s what needs your attention:
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
                        I have {activeNotifications.length} items in progress. Ask me for updates on any of them.
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
                      <span className="text-sm text-muted-foreground">Analyzing data...</span>
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
                  placeholder="Ask about properties, financials, tasks..."
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
                <span>Connected to live Soho House data · 42 properties</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
