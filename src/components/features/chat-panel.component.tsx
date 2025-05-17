'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Message } from '@/types/chat.types'
import { Send } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ChatHeader } from './chat-header.component'
import { ChatMessage } from './chat-message.component'

interface ChatPanelProps {
  messages: Message[]
  onSendMessage: (content: string) => void
  connectionStatus: 'connected' | 'disconnected'
  isSending: boolean
  sendError: string | null
}

const ChatPanel = ({
  messages,
  onSendMessage,
  connectionStatus,
  isSending,
  sendError,
}: ChatPanelProps) => {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onSendMessage(input.trim())
      setInput('')
    }
  }

  const isDisabled = !input.trim() || connectionStatus === 'disconnected'

  return (
    <div className="bg-background border-border fixed right-6 bottom-24 z-40 flex h-[500px] w-[350px] flex-col overflow-hidden rounded-lg border shadow-lg">
      {/* Header */}
      <ChatHeader slug="goker" connectionStatus={connectionStatus} />

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="text-muted-foreground flex h-full items-center justify-center text-center">
            <p className="max-w-[80%]">
              Send a message to start the conversation.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              isAnswer={message.sender !== 'admin'}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error message */}
      {sendError && (
        <div className="bg-destructive text-destructive-foreground p-2 text-center text-xs">
          {sendError}
        </div>
      )}

      {/* Sending indicator */}
      {isSending && (
        <div className="text-muted-foreground p-2 text-center text-xs">
          Sending...
        </div>
      )}

      {/* Input area */}
      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex items-center gap-2">
          <Input
            autoComplete="off"
            name="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
            disabled={connectionStatus === 'disconnected' || isSending}
          />
          <Button type="submit" size="icon" disabled={isDisabled || isSending}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ChatPanel
