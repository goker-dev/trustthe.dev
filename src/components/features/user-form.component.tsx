'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X } from 'lucide-react'
import { useState } from 'react'

interface UserFormProps {
  onSubmit: (name: string, email?: string) => void
  onClose: () => void
}

const UserForm: React.FC<UserFormProps> = ({ onSubmit, onClose }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Please enter your name')
      return
    }
    onSubmit(name.trim(), email.trim() || undefined)
  }

  return (
    <Card className="fixed right-6 bottom-24 z-40 w-[350px] shadow-lg">
      <CardHeader className="relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        <CardTitle>Start Chat</CardTitle>
        <CardDescription>
          Please enter your details to begin the conversation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setError('')
              }}
              placeholder="Enter your name"
              className={error ? 'border-destructive' : ''}
              autoComplete="on"
            />
            {error && <p className="text-destructive text-xs">{error}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email (optional)</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoComplete="on"
            />
          </div>
          <Button type="submit" className="w-full">
            Start Chat
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default UserForm
