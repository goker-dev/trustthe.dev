'use client'

import { useChat } from '@/hooks/use-chat.hook'
import dynamic from 'next/dynamic'

interface ChatWidgetProps {
  onNewMessage?: () => void
  onClearUnread?: () => void
}

// Lazy load the chat components
const ChatPanel = dynamic(() => import('./chat-panel.component'), {
  loading: () => null,
})
const UserForm = dynamic(() => import('./user-form.component'), {
  loading: () => null,
})

const ChatWidget = ({ onNewMessage, onClearUnread }: ChatWidgetProps) => {
  const {
    messages,
    connectionStatus,
    sendMessage,
    handleStartChat,
    threadId,
    isSending,
    sendError,
  } = useChat({ onNewMessage, onClearUnread })

  const handleUserFormSubmit = async (name: string, email?: string) => {
    const success = await handleStartChat(name, email)
    if (success) {
      onClearUnread?.()
    }
  }

  console.log({ connectionStatus, sendError })

  return (
    <>
      {threadId ? (
        <ChatPanel
          messages={messages}
          onSendMessage={sendMessage}
          connectionStatus={connectionStatus}
          isSending={isSending}
          sendError={sendError}
        />
      ) : (
        <UserForm onSubmit={handleUserFormSubmit} onClose={() => {}} />
      )}
    </>
  )
}

export default ChatWidget
