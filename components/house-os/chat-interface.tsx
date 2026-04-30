"use client"

import { cn } from '@/lib/utils'
import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Message {
  id: string
  content: string
  sender: 'user' | 'system'
  timestamp?: string
  avatar?: string
}

interface ChatInterfaceProps {
  messages: Message[]
  placeholder?: string
  onSend: (message: string) => void
  showAvatars?: boolean
  userInitials?: string
  className?: string
}

export function ChatInterface({
  messages,
  placeholder = "Type a message...",
  onSend,
  showAvatars = true,
  userInitials = "U",
  className,
}: ChatInterfaceProps) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onSend(input.trim())
      setInput('')
    }
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-2 animate-slide-in",
              message.sender === 'user' ? "justify-end" : "justify-start"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {showAvatars && message.sender === 'system' && (
              <div className="w-7 h-7 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-bold text-gold">AI</span>
              </div>
            )}
            
            <div
              className={cn(
                "max-w-[80%] px-4 py-2.5 rounded-2xl text-sm",
                message.sender === 'user'
                  ? "bg-surface-3 text-text rounded-br-md"
                  : "bg-gold-glow border border-gold-dim/50 text-text rounded-bl-md"
              )}
            >
              {message.content}
              {message.timestamp && (
                <span className="block text-[10px] text-text-faint mt-1">
                  {message.timestamp}
                </span>
              )}
            </div>

            {showAvatars && message.sender === 'user' && (
              <div className="w-7 h-7 rounded-full bg-surface-3 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-bold text-text-muted">{userInitials}</span>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "flex-1 px-4 py-2.5 rounded-xl text-sm",
            "bg-surface-3 border border-[rgba(255,255,255,0.07)]",
            "focus:border-gold-dim focus:outline-none focus:ring-1 focus:ring-gold/20",
            "placeholder:text-text-faint text-text"
          )}
        />
        <Button
          type="submit"
          size="icon"
          className="bg-gold hover:bg-gold/90 text-background rounded-xl w-10 h-10"
          disabled={!input.trim()}
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  )
}
