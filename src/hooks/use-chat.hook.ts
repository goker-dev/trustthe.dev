import {
  getSavedUserInfo,
  getThreadId,
  initializeChat,
  joinThread,
  loadMessages,
  onNewMessages,
  sendMessageToHub,
  startNewChat,
} from '@/services/chat.service'
import { Message } from '@/types/chat.types'
import { useEffect, useState } from 'react'

interface UseChatProps {
  onNewMessage?: () => void
  onClearUnread?: () => void
}

export const useChat = ({ onNewMessage, onClearUnread }: UseChatProps = {}) => {
  const [isInitialized, setIsInitialized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  // const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [threadId, setThreadId] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<
    'connected' | 'disconnected'
  >('disconnected')
  const [isSending, setIsSending] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)

  useEffect(() => {
    const initChat = async () => {
      const savedInfo = getSavedUserInfo()
      const threadId = getThreadId()

      if (!savedInfo || !threadId) {
        return false
      }

      try {
        setThreadId(threadId)
        await initializeChat(savedInfo.name, savedInfo.email)
        const success = await joinThread(threadId, savedInfo)

        if (success) {
          setConnectionStatus('connected')
          const savedMessages = loadMessages()
          if (savedMessages?.length > 0) {
            setMessages(
              savedMessages.map((msg) => ({
                ...msg,
                createdAt: new Date(msg.createdAt),
              })),
            )
          }
          return true
        } else {
          await startNewChat()
        }
      } catch (error) {
        console.error('Failed to initialize chat:', error)
        if (error instanceof Error) {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              content: `Error: ${error.message}`,
              sender: 'system',
              createdAt: new Date(),
            },
          ])
        } else {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              content: 'An unknown error occurred.',
              sender: 'system',
              createdAt: new Date(),
            },
          ])
        }
      }
      return false
    }

    if (!isInitialized) {
      setIsInitialized(true)
      initChat()
    }
  }, [isInitialized])

  useEffect(() => {
    if (isInitialized) {
      return onNewMessages((newMessages) => {
        setMessages((prev) => {
          const newMessageIds = new Set(newMessages.map((msg) => msg.id))
          return [
            ...prev.filter((msg) => !newMessageIds.has(msg.id)),
            ...newMessages,
          ]
        })
        onNewMessage?.()
      })
    }
  }, [isInitialized, onNewMessage])

  const handleStartChat = async (name: string, email?: string) => {
    console.log('handleStartChat', { name, email })

    try {
      await initializeChat(name, email)
      const threadId = await startNewChat()
      console.log({ threadId })
      if (threadId) {
        setThreadId(threadId)
        setConnectionStatus('connected')
        onClearUnread?.()
        return threadId
      }
    } catch (error) {
      console.error('Failed to start chat:', error)
      if (error instanceof Error) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            content: `Error: ${error.message}`,
            sender: 'system',
            createdAt: new Date(),
          },
        ])
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            content: 'An unknown error occurred.',
            sender: 'system',
            createdAt: new Date(),
          },
        ])
      }
    }
    return false
  }

  const sendMessage = async (content: string) => {
    const message: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      createdAt: new Date(),
    }

    setIsSending(true)
    setSendError(null)

    try {
      await sendMessageToHub(message)
    } catch (error) {
      console.error('Failed to send message:', error)
      if (error instanceof Error) {
        setSendError(error.message)
      } else {
        setSendError('An unknown error occurred while sending the message.')
      }
    } finally {
      setIsSending(false)
    }
  }

  return {
    messages,
    // userInfo,
    connectionStatus,
    sendMessage,
    handleStartChat,
    threadId,
    isSending,
    sendError,
  }
}
