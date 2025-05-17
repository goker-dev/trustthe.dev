export interface Message {
  id: string
  content: string
  sender: 'user' | 'system' | 'admin'
  createdAt: Date
  isRead?: boolean
  isAdmin?: boolean
}

export interface UserInfo {
  id: string
  name: string
  email?: string
  browser: string
  os: string
  threadId?: string
}
