'use client'

import { Avatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { Message } from '@/types/chat.types'
import { formatDistanceToNow } from 'date-fns'
import { memo } from 'react'

interface ChatMessageProps {
  message: Message
  isAnswer: boolean
}

export const ChatMessage = memo(({ message, isAnswer }: ChatMessageProps) => {
  const isUser = message.sender !== 'admin' && message.sender !== 'system'
  const isSystem = message.sender === 'system'

  const avatarContent = isSystem ? (
    ''
  ) : isUser ? (
    <div className="text-primary flex aspect-square items-center justify-center text-xs font-semibold">
      {message.sender?.charAt(0).toUpperCase()}
    </div>
  ) : (
    <div className="text-primary flex aspect-square items-center justify-center text-xs font-semibold">
      G
    </div>
  )

  const messageClasses = cn(
    'rounded-lg py-2 px-3 text-sm',
    isUser
      ? 'bg-primary text-primary-foreground rounded-tr-none'
      : isSystem
        ? 'bg-muted/50 text-muted-foreground text-xs'
        : 'bg-secondary text-secondary-foreground rounded-tl-none',
  )

  const timestampClasses = cn(
    'text-xs text-muted-foreground/70 mt-1',
    isUser ? 'text-right' : 'text-left',
    isSystem && 'text-center',
  )

  return (
    <div
      className={cn(
        'group mb-4 flex items-start',
        isAnswer ? 'justify-end' : 'justify-start',
        isSystem && 'justify-center',
      )}
    >
      {!isUser && !isSystem && (
        <div className="mr-3 flex-shrink-0">
          <Avatar className="bg-primary/20 h-8 w-8">{avatarContent}</Avatar>
        </div>
      )}

      <div className="flex max-w-[75%] flex-col">
        <p className={messageClasses}>{message.content}</p>
        <span className={timestampClasses}>
          {formatDistanceToNow(message.createdAt, { addSuffix: true })}
        </span>
      </div>

      {isUser && (
        <div className="ml-3 flex-shrink-0">
          <Avatar className="bg-primary/10 h-8 w-8">{avatarContent}</Avatar>
        </div>
      )}
    </div>
  )
})

ChatMessage.displayName = 'ChatMessage'
