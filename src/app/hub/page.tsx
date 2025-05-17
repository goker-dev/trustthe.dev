'use client'

import { ChatMessage } from '@/components/features/chat-message.component'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'

import { playNotificationSound } from '@/lib/notification'
import { cn } from '@/lib/utils'
import { Message } from '@/types/chat.types'
import { formatDistanceToNow } from 'date-fns'
import { Search, Send, Volume2, VolumeX } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'

interface UserInfo {
  id: string
  name: string
  email?: string
  browser: string
  os: string
  ip?: string
  location?: {
    country?: string
    city?: string
  }
}

interface Thread {
  _id: string
  userInfo: UserInfo
  createdAt: Date
  lastMessageAt: Date
  isAdmin: boolean
  hub: string
  hasNewMessage?: boolean
}

const ChatHub = () => {
  const [apiKey, setApiKey] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<
    'connected' | 'disconnected'
  >('disconnected')
  const [activeThreads, setActiveThreads] = useState<Map<string, Thread>>(
    new Map(),
  )
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [messageInput, setMessageInput] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  const [highlightedThreadId, setHighlightedThreadId] = useState<string | null>(
    null,
  )

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const initializeSocket = useCallback(
    (socket: Socket) => {
      socket.on('connect', () => {
        console.log('Connected to Socket.IO')
        setConnectionStatus('connected')
        // Request admin threads when connected
        socket.emit('getAdminThreads')
      })

      socket.on('adminThreads', (threads: Record<string, Thread>) => {
        console.log('Received admin threads:', threads)
        // Convert dates when setting initial threads
        const threadsWithDates = Object.entries(threads).map(([id, thread]) => [
          thread._id,
          {
            ...thread,
            _id: thread._id || id,
            createdAt: new Date(thread.createdAt),
            lastMessageAt: new Date(thread.lastMessageAt),
          } as Thread,
        ]) as [string, Thread][]
        setActiveThreads(new Map(threadsWithDates))
      })

      socket.on('newThread', (threadInfo) => {
        console.log('New thread created:', threadInfo)
        setActiveThreads((prev) => {
          const newMap = new Map(prev)
          newMap.set(threadInfo.threadId, {
            _id: threadInfo.threadId,
            userInfo: {
              id: threadInfo.clientId || uuidv4(),
              name: threadInfo.clientName,
              email: threadInfo.clientEmail,
              browser: '', // Add appropriate value if available
              os: '', // Add appropriate value if available
            },
            createdAt: new Date(threadInfo.createdAt),
            lastMessageAt: new Date(threadInfo.lastMessageAt),
            isAdmin: threadInfo.isAdmin,
            hub: threadInfo.hub,
          })
          return newMap
        })

        if (notificationsEnabled) {
          playNotificationSound()
          toast.success('New conversation', {
            description: `New chat from ${threadInfo.clientName}`,
          })
        }
      })

      socket.on('threadUpdate', (threadInfo) => {
        console.log('Thread updated:', threadInfo)
        setActiveThreads((prev) => {
          const newMap = new Map(prev)
          const existingThread = newMap.get(threadInfo.threadId)
          if (existingThread) {
            newMap.set(threadInfo.threadId, {
              ...existingThread,
              lastMessageAt: new Date(threadInfo.lastMessageAt || new Date()),
            })
          }
          return newMap
        })
      })

      socket.on('newMessage', (data) => {
        console.log('Received message:', data)

        // Update thread's last message time and highlight status
        setActiveThreads((prev) => {
          const newMap = new Map(prev)
          const thread = newMap.get(data.threadId)
          if (thread) {
            newMap.set(data.threadId, {
              ...thread,
              lastMessageAt: new Date(),
              hasNewMessage: currentThreadId !== data.threadId, // Only mark as new if not in current thread
            })
          }
          return newMap
        })

        // Add message to the messages state if not already present
        setMessages((prevMessages) => {
          // if (!prevMessages.some(msg => msg.id === data.id)) {
          return [
            ...prevMessages,
            {
              id: data.id,
              content: data.content,
              sender: data.sender === 'admin' ? 'admin' : 'user',
              createdAt: new Date(data.createdAt),
            },
          ]
          // }
          return prevMessages
        })

        // Play sound and highlight thread if it's not the current thread and sender is not 'admin'
        if (data.threadId !== currentThreadId && !data.isAdmin) {
          setHighlightedThreadId(data.threadId)
          if (notificationsEnabled) {
            playNotificationSound()
            toast.success('New message', {
              description: `New message from ${activeThreads.get(data.threadId)?.userInfo.name}: ${data.content.substring(0, 60)}${data.content.length > 60 ? '...' : ''}`,
            })
          }
        }
      })

      socket.on('disconnect', (reason) => {
        console.log('Connection closed:', reason)
        setConnectionStatus('disconnected')
        toast.error('Disconnected', {
          description: reason,
        })
      })

      socket.on('connect_error', (err) => {
        console.error('Socket.IO connection error:', err)
        setConnectionStatus('disconnected')
        toast.error('Connection Error', {
          description: err.message,
        })
      })

      return socket
    },
    [notificationsEnabled, currentThreadId, activeThreads],
  )

  // Check for existing API key in session storage
  useEffect(() => {
    console.log('Checking for existing API key')
    const storedApiKey = sessionStorage.getItem('chat_hub_apikey')
    if (storedApiKey) {
      setApiKey(storedApiKey)
      setIsAuthenticated(true)
    }
  }, [])

  const handleAuthenticate = () => {
    if (!apiKey.trim()) {
      toast.error('Error', {
        description: 'Please enter an API key',
      })
      return
    }

    sessionStorage.setItem('chat_hub_apikey', apiKey)
    setApiKey(apiKey)
    setIsAuthenticated(true)
  }

  useEffect(() => {
    if (apiKey && !isConnecting) {
      setIsConnecting(true)
      console.log('Connection attempt', apiKey)
      const newSocket = io(process.env.CHAT_API_URL, {
        extraHeaders: {
          apikey: apiKey,
        },
        reconnection: true,
        reconnectionAttempts: 5,
      })
      setSocket(newSocket)
      initializeSocket(newSocket)
    }
  }, [apiKey, isConnecting, initializeSocket])

  // Cleanup socket on unmount
  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect()
      }
    }
  }, [socket])

  // Add this effect to handle thread highlighting
  useEffect(() => {
    if (highlightedThreadId) {
      const timer = setTimeout(() => {
        setHighlightedThreadId(null)
      }, 2000) // Remove highlight after 2 seconds

      return () => clearTimeout(timer)
    }
  }, [highlightedThreadId])

  const handleJoinThread = (threadId: string) => {
    console.log('handleJoinThread', threadId)
    if (currentThreadId === threadId) return

    if (currentThreadId && socket) {
      socket.emit('leaveThread', currentThreadId)
    }

    // Clear new message status when joining thread
    setActiveThreads((prev) => {
      const newMap = new Map(prev)
      const thread = newMap.get(threadId)
      if (thread) {
        newMap.set(threadId, {
          ...thread,
          hasNewMessage: false,
        })
      }
      return newMap
    })

    setCurrentThreadId(threadId)
    socket?.emit('joinThread', threadId)
    setMessages([]) // Clear previous messages
  }

  const handleSendMessage = () => {
    if (!messageInput.trim() || !currentThreadId || !socket) return

    socket.emit('sendMessage', {
      id: 'admin',
      threadId: currentThreadId,
      message: messageInput.trim(),
    })

    setMessageInput('')
  }

  const toggleNotifications = () => {
    setNotificationsEnabled((prev) => !prev)
    toast(
      notificationsEnabled ? 'Notifications disabled' : 'Notifications enabled',
      {
        description: notificationsEnabled
          ? 'You will no longer receive sound notifications'
          : 'You will now receive sound notifications for new messages',
      },
    )
  }

  const filteredThreads = Array.from(activeThreads.values())
    .sort((a, b) => {
      const dateA = new Date(a.lastMessageAt)
      const dateB = new Date(b.lastMessageAt)
      return dateB.getTime() - dateA.getTime()
    })
    .filter(
      (thread) =>
        thread.userInfo.email
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        thread.userInfo.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )

  // Auto-scroll to the bottom when a new message is added

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Display user info at the top of the chat
  const renderUserInfo = (userInfo: UserInfo) => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Chat with {userInfo.name}</CardTitle>
        <CardDescription>
          Email: {userInfo.email || 'N/A'}
          <br />
          Browser: {userInfo.browser || 'N/A'}
          <br />
          OS: {userInfo.os || 'N/A'}
          <br />
          Location: {userInfo.location?.city || 'N/A'},{' '}
          {userInfo.location?.country || 'N/A'}
        </CardDescription>
      </CardHeader>
    </Card>
  )

  useEffect(() => {
    console.log('Current messages:', messages)
  }, [messages])

  if (!isAuthenticated) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center p-6">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Chat Hub Authentication</CardTitle>
            <CardDescription>
              Please enter your admin API key to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="Enter your API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <Button className="w-full" onClick={handleAuthenticate}>
                Connect to Hub
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="bg-background min-h-screen p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Chat Hub</h1>
            <p
              className={`text-sm ${connectionStatus === 'connected' ? 'text-green-600' : 'text-red-600'}`}
            >
              {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleNotifications}
              title={
                notificationsEnabled
                  ? 'Disable sound notifications'
                  : 'Enable sound notifications'
              }
            >
              {notificationsEnabled ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Threads Panel */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Active Threads</CardTitle>
              <CardDescription>All active chat threads</CardDescription>
              <div className="relative mt-2">
                <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
                <Input
                  placeholder="Search by name or email..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-2">
                  {filteredThreads.length === 0 ? (
                    <div className="text-muted-foreground py-8 text-center">
                      No active threads
                    </div>
                  ) : (
                    filteredThreads.map((thread, index) => (
                      <button
                        key={thread._id}
                        className={cn(
                          'block w-full cursor-pointer rounded-lg p-3 transition-all duration-300',
                          currentThreadId === thread._id
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-secondary',
                          thread.hasNewMessage &&
                            'bg-yellow-100 dark:bg-yellow-900',
                          highlightedThreadId === thread._id &&
                            'animate-pulse bg-yellow-200 dark:bg-yellow-800',
                        )}
                        onClick={() => handleJoinThread(thread._id)}
                        onKeyDown={(e) => {
                          if (e.key === (index + 1).toString() && e.ctrlKey) {
                            handleJoinThread(thread._id)
                          }
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="font-medium">
                              {thread.userInfo.name}
                            </div>
                            <div className="text-sm opacity-70">
                              {thread.userInfo.email}
                            </div>
                          </div>
                        </div>
                        <div className="mt-1 text-xs opacity-70">
                          {formatDistanceToNow(new Date(thread.lastMessageAt), {
                            addSuffix: true,
                          })}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Panel */}
          <Card className="lg:col-span-2">
            <CardHeader>
              {currentThreadId &&
                activeThreads.get(currentThreadId) &&
                renderUserInfo(activeThreads.get(currentThreadId)!.userInfo)}
            </CardHeader>
            <CardContent>
              <ScrollArea className="chat-container h-[500px] pr-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <ChatMessage
                      key={message.id}
                      message={message}
                      isAnswer={
                        message.sender === 'admin' || message.isAdmin || false
                      }
                    />
                  ))}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <div className="flex w-full items-center space-x-2">
                <Input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type your message..."
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={
                    !currentThreadId || connectionStatus === 'disconnected'
                  }
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={
                    !messageInput.trim() ||
                    !currentThreadId ||
                    connectionStatus === 'disconnected'
                  }
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ChatHub
