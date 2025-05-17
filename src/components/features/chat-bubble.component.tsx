'use client'

import { ChatProvider } from '@/contexts/chat.context'
import { cn } from '@/lib/utils'
import { MessageCircle, X } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useState } from 'react'

// Lazy load only when needed
const ChatWidget = dynamic(() => import('./chat-widget.component'), {
  loading: () => null,
  ssr: false,
})

export const ChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  return (
    <ChatProvider>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'bg-primary/20 fixed right-6 bottom-15 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-105',
          isOpen && 'rotate-90',
        )}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <>
            <MessageCircle className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </>
        )}
      </button>

      {isOpen && (
        <ChatWidget
          onNewMessage={() => setUnreadCount((prev) => prev + 1)}
          onClearUnread={() => setUnreadCount(0)}
        />
      )}
    </ChatProvider>
  )
}
