'use client'

import { createContext, ReactNode, useContext, useState } from 'react'

interface ChatContextType {
  isHubPage: boolean
  setIsHubPage: (value: boolean) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isHubPage, setIsHubPage] = useState(false)

  return (
    <ChatContext.Provider value={{ isHubPage, setIsHubPage }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChatContext() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider')
  }
  return context
}
