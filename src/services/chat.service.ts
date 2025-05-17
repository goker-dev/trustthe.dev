'use client'

import { Message } from '@/types/chat.types'
import { createHash } from 'crypto'
import { io, Socket } from 'socket.io-client'
import { v4 as uuidv4 } from 'uuid'

// LocalStorage keys
const CHAT_HISTORY_KEY = 'chat_history'
const THREAD_ID_KEY = 'chat_thread_id'
const USER_INFO_KEY = 'chat_user_info'

export interface ChatThread {
  id: string
  lastMessage: string
  timestamp: Date
  unread: boolean
}

export interface UserInfo {
  name: string
  email?: string
  browser: string
  os: string
  ip?: string
  location?: {
    country?: string
    city?: string
  }
  id?: string
  browserId?: string
}

// Socket.IO connection
let socket: Socket | null = null
let messageCallbacks: ((messages: Message[]) => void)[] = []
let isConnected = false
// let pendingMessages: Message[] = [];

const KEY = process.env.CHAT_API_KEY
const URL = process.env.CHAT_API_URL

// Helper function to safely interact with localStorage
const safeStorage = {
  getItem: (key: string): string | null => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem(key)
    }
    return null
  },
  setItem: (key: string, value: string): void => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, value)
    }
  },
  removeItem: (key: string): void => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(key)
    }
  },
}

// Get browser and system info
const getBrowserInfo = (): Pick<UserInfo, 'browser' | 'os'> => {
  if (typeof window === 'undefined')
    return {
      browser: 'unknown',
      os: 'unknown',
    }

  const userAgent = window.navigator.userAgent
  const browserInfo = {
    browser: 'unknown' as string,
    os: 'unknown' as string,
  }

  // Detect browser
  if (userAgent.indexOf('Chrome') > -1) browserInfo.browser = 'Chrome'
  else if (userAgent.indexOf('Safari') > -1) browserInfo.browser = 'Safari'
  else if (userAgent.indexOf('Firefox') > -1) browserInfo.browser = 'Firefox'
  else if (userAgent.indexOf('MSIE') > -1 || userAgent.indexOf('Trident/') > -1)
    browserInfo.browser = 'IE'
  else if (userAgent.indexOf('Edge') > -1) browserInfo.browser = 'Edge'

  // Detect OS
  if (userAgent.indexOf('Windows') > -1) browserInfo.os = 'Windows'
  else if (userAgent.indexOf('Mac') > -1) browserInfo.os = 'MacOS'
  else if (userAgent.indexOf('Linux') > -1) browserInfo.os = 'Linux'
  else if (userAgent.indexOf('Android') > -1) browserInfo.os = 'Android'
  else if (userAgent.indexOf('iOS') > -1) browserInfo.os = 'iOS'

  return browserInfo
}

// Get user's IP and location
const getUserLocation = async (): Promise<Partial<UserInfo>> => {
  try {
    const response = await fetch('https://ipapi.co/json/')
    const data = await response.json()
    return {
      ip: data.ip,
      location: {
        country: data.country_name,
        city: data.city,
      },
    }
  } catch (error) {
    console.error('Failed to get location:', error)
    return {}
  }
}

// Create a system message
const createSystemMessage = (content: string): Message => ({
  id: uuidv4(),
  content,
  sender: 'system',
  createdAt: new Date(),
})

export const initSocket = async (): Promise<boolean> => {
  if (socket || typeof window === 'undefined') return false

  return new Promise((resolve) => {
    socket = io(URL, {
      extraHeaders: {
        apikey: KEY || '',
      },
      reconnection: true,
      reconnectionAttempts: 5,
    })

    socket.on('connect', () => {
      console.log('Socket.IO connection established')
      isConnected = true
      resolve(true)
    })

    socket.on('newMessage', (data: Message) => {
      const message = {
        ...data,
        createdAt: new Date(data.createdAt),
      }
      messageCallbacks.forEach((callback) => callback([message]))
    })

    socket.on('adminJoined', () => {
      const message = createSystemMessage('Admin joined the chat')
      messageCallbacks.forEach((callback) => callback([message]))
    })

    socket.on('adminLeft', () => {
      const message = createSystemMessage('Admin left the chat')
      messageCallbacks.forEach((callback) => callback([message]))
    })

    socket.on('disconnect', (reason: string) => {
      console.log('Socket.IO connection closed:', reason)
      isConnected = false
      socket = null
    })

    socket.on('connect_error', (error: Error) => {
      console.error('Socket.IO connection error:', error)
      resolve(false)
    })

    socket.on('error', (error: Error) => {
      console.error('Socket.IO error:', error)
      resolve(false)
    })

    socket.on('exception', (error: { message: string }) => {
      console.error('Socket.IO exception:', error.message)
      messageCallbacks.forEach((callback) =>
        callback([createSystemMessage(`Error: ${error.message}`)]),
      )
    })
  })
}

export const joinThread = async (
  threadId: string,
  userInfo: UserInfo,
): Promise<boolean> => {
  // Wait for socket connection if needed
  console.log('isConnected', isConnected)
  if (!isConnected) {
    return false
  }
  console.log('reconnectThread', threadId)
  return new Promise((resolve) => {
    socket?.emit(
      'reconnectThread',
      { threadId, userInfo },
      (response: { success: boolean }) => {
        console.log('reconnectThread response', response)
        if (response?.success) {
          // currentThreadId = threadId;
          safeStorage.setItem(THREAD_ID_KEY, threadId)

          resolve(true)
        } else {
          safeStorage.removeItem(THREAD_ID_KEY)
          resolve(false)
        }
      },
    )
  })
}

export const startNewChat = async (): Promise<string | null> => {
  // const socketConnected = await initSocket();
  // if (!socketConnected) return null;

  const userInfo = getSavedUserInfo()

  try {
    const response = await new Promise<{ threadId: string } | null>(
      (resolve) => {
        socket?.emit(
          'startChat',
          userInfo,
          (response: { threadId: string }) => {
            if (response?.threadId) {
              safeStorage.setItem(THREAD_ID_KEY, response.threadId)
              safeStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo))
              resolve(response)
            } else {
              resolve(null)
            }
          },
        )

        // Add timeout to prevent hanging
        setTimeout(() => resolve(null), 5000)
      },
    )

    if (response?.threadId) {
      safeStorage.setItem(THREAD_ID_KEY, response.threadId)
      safeStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo))
      return response.threadId
    }
  } catch (error) {
    console.error('Error starting chat:', error)
  }

  return null
}

export const closeSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
    isConnected = false
    safeStorage.removeItem(THREAD_ID_KEY)
    safeStorage.removeItem(USER_INFO_KEY)
  }
}

// Register a callback for new messages
export const onNewMessages = (callback: (messages: Message[]) => void) => {
  messageCallbacks.push(callback)

  // Return a function to unregister the callback
  return () => {
    messageCallbacks = messageCallbacks.filter((cb) => cb !== callback)
  }
}

// Save messages to local storage
export const saveMessages = (messages: Message[]) => {
  safeStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages))
}

// Load messages from local storage
export const loadMessages = (): Message[] => {
  const savedMessages = safeStorage.getItem(CHAT_HISTORY_KEY)
  return savedMessages ? JSON.parse(savedMessages) : []
}

// Send message to hub
export const sendMessageToHub = async (message: Message): Promise<boolean> => {
  const userInfo = getSavedUserInfo()
  // if (!isConnected || !userInfo) {
  //     pendingMessages.push(message);
  //     return false;
  // }

  return new Promise((resolve, reject) => {
    socket?.emit(
      'sendMessage',
      {
        id: userInfo?.id,
        threadId: getThreadId(),
        message: message.content,
      },
      (response: { success: boolean; error?: string }) => {
        if (response?.success) {
          resolve(true)
        } else {
          reject(new Error(response?.error || 'Failed to send message.'))
        }
      },
    )
  })
}

// Get saved user info
export const getSavedUserInfo = (): UserInfo | null => {
  const savedInfo = safeStorage.getItem(USER_INFO_KEY)
  return savedInfo ? JSON.parse(savedInfo) : null
}

// Get current thread ID
export const getThreadId = (): string | null => {
  return safeStorage.getItem(THREAD_ID_KEY)
}

// Generate a unique user ID
const generateUserId = (userInfo: UserInfo): string => {
  const data = `${userInfo.name}-${userInfo.email}-${userInfo.browser}-${userInfo.os}`
  return createHash('sha256').update(data).digest('hex')
}

// Initialize chat with user info
export const initializeChat = async (
  name: string,
  email?: string,
): Promise<UserInfo> => {
  const browserInfo = getBrowserInfo()
  const locationInfo = await getUserLocation()

  const userInfo: UserInfo = {
    name,
    email,
    ...browserInfo,
    ...locationInfo,
  }

  // Generate and save user ID
  const userId = generateUserId(userInfo)
  userInfo.id = userId
  safeStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo))

  // Initialize socket with user info
  await initSocket()

  return userInfo
}
