'use client'

import { ChatThread } from '@/services/chat.service'
import { Message } from '@/types/chat.types'

// In-memory storage for the chat hub
// This would normally be a database in a real application
const chatThreads: Map<string, ChatThread> = new Map()
const threadMessages: Map<string, Message[]> = new Map()
const activeConnections: Map<string, WebSocket> = new Map()

// Initialize with some example data if needed
const initializeData = () => {
  if (chatThreads.size === 0) {
    // Get chat threads from localStorage if available
    const savedThreads = localStorage.getItem('chat_hub_threads')
    if (savedThreads) {
      const parsedThreads = JSON.parse(savedThreads) as ChatThread[]
      parsedThreads.forEach((thread) => {
        chatThreads.set(thread.id, thread)
      })
    }

    // Get thread messages from localStorage if available
    const savedMessages = localStorage.getItem('chat_hub_messages')
    if (savedMessages) {
      const parsedMessages = JSON.parse(savedMessages) as Record<
        string,
        Message[]
      >
      Object.entries(parsedMessages).forEach(([threadId, messages]) => {
        threadMessages.set(threadId, messages)
      })
    }
  }
}

// Save data to localStorage
const saveData = () => {
  localStorage.setItem(
    'chat_hub_threads',
    JSON.stringify(Array.from(chatThreads.values())),
  )

  const messagesObject: Record<string, Message[]> = {}
  threadMessages.forEach((messages, threadId) => {
    messagesObject[threadId] = messages
  })
  localStorage.setItem('chat_hub_messages', JSON.stringify(messagesObject))
}

// Update or create a thread when a new message comes in
export const updateThreadWithMessage = (
  instanceId: string,
  message: Message,
): ChatThread => {
  initializeData()

  let thread = chatThreads.get(instanceId)

  if (!thread) {
    thread = {
      id: instanceId,
      lastMessage: message.content,
      timestamp: new Date(),
      unread: true,
    }
    chatThreads.set(instanceId, thread)
  } else {
    thread.lastMessage = message.content
    thread.timestamp = new Date()
    thread.unread = true
    chatThreads.set(instanceId, thread)
  }

  // Add message to the thread
  const messages = threadMessages.get(instanceId) || []
  threadMessages.set(instanceId, [...messages, message])

  saveData()

  // Broadcast message to the hub interface
  notifyHubOfChanges()

  return thread
}

// Register a WebSocket connection for a client
export const registerConnection = (instanceId: string, ws: WebSocket) => {
  activeConnections.set(instanceId, ws)

  // Send all existing messages for this thread to the client
  const messages = threadMessages.get(instanceId) || []
  const messagePayload = {
    type: 'messages',
    messages,
  }

  try {
    ws.send(JSON.stringify(messagePayload))
  } catch (error) {
    console.error('Error sending messages to client:', error)
  }
}

// Unregister a WebSocket connection
export const unregisterConnection = (instanceId: string) => {
  activeConnections.delete(instanceId)
}

// Notify a specific client of new messages
export const notifyClientOfMessages = (
  instanceId: string,
  messages: Message[],
) => {
  const ws = activeConnections.get(instanceId)
  if (ws && ws.readyState === WebSocket.OPEN) {
    const messagePayload = {
      type: 'messages',
      messages,
    }

    try {
      ws.send(JSON.stringify(messagePayload))
    } catch (error) {
      console.error('Error sending messages to client:', error)
    }
  }
}

// Notify hub interface of changes
const notifyHubOfChanges = () => {
  // The hub interface will poll for changes using the hubService methods below
}

// Handle WebSocket messages from clients
// export const handleWebSocketMessage = (data: any, ws: WebSocket) => {
//     try {
//         if (data.type === 'register') {
//             registerConnection(data.instanceId, ws);
//         } else if (data.type === 'message') {
//             const { instanceId, message } = data;
//             updateThreadWithMessage(instanceId, message);

//             // Play notification sound in the hub
//             playNotificationSound();
//         }
//     } catch (error) {
//         console.error('Error handling WebSocket message:', error);
//     }
// };

// Hub service for the frontend
export const hubService = {
  // Get all chat threads
  getThreads: async (): Promise<ChatThread[]> => {
    initializeData()
    return Array.from(chatThreads.values()).sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )
  },

  // Get messages for a specific thread
  getThreadMessages: async (threadId: string): Promise<Message[]> => {
    initializeData()
    return threadMessages.get(threadId) || []
  },

  // Mark a thread as read
  markThreadAsRead: async (threadId: string): Promise<void> => {
    initializeData()
    const thread = chatThreads.get(threadId)
    if (thread) {
      thread.unread = false
      chatThreads.set(threadId, thread)
      saveData()
    }
  },

  // Send a message to a thread
  sendMessage: async (threadId: string, message: Message): Promise<void> => {
    initializeData()
    const thread = chatThreads.get(threadId)
    if (thread) {
      thread.lastMessage = message.content
      thread.timestamp = new Date()
      chatThreads.set(threadId, thread)

      const messages = threadMessages.get(threadId) || []
      threadMessages.set(threadId, [...messages, message])

      saveData()

      // Notify client of new message
      const ws = activeConnections.get(threadId)
      if (ws && ws.readyState === WebSocket.OPEN) {
        const messagePayload = {
          type: 'messages',
          messages: [message],
        }

        try {
          ws.send(JSON.stringify(messagePayload))
        } catch (error) {
          console.error('Error sending message to client:', error)
        }
      }
    }
  },

  // Get new messages for a specific instance
  getNewMessages: (instanceId: string): Message[] => {
    initializeData()
    return threadMessages.get(instanceId) || []
  },
}

// API handlers for the chat clients
export const handleClientMessage = (
  instanceId: string,
  message: Message,
): boolean => {
  try {
    updateThreadWithMessage(instanceId, message)
    return true
  } catch (error) {
    console.error('Error handling client message:', error)
    return false
  }
}

export const getMessagesForClient = (instanceId: string): Message[] => {
  initializeData()
  return threadMessages.get(instanceId) || []
}

// WebSocket server handler (for server-side implementation)
// export const handleWebSocketServer = (ws: WebSocket) => {
//     ws.onmessage = (event) => {
//         try {
//             const data = JSON.parse(event.data as string);
//             handleWebSocketMessage(data, ws);
//         } catch (error) {
//             console.error('Error processing WebSocket message:', error);
//         }
//     };

//     ws.onclose = () => {
//         // Find and remove the connection
//         activeConnections.forEach((conn, id) => {
//             if (conn === ws) {
//                 activeConnections.delete(id);
//             }
//         });
//     };
// };
