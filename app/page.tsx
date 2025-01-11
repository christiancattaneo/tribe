'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import * as api from '@/lib/api'
import { User } from '@/lib/types'
import { CelticKnot } from '@/components/celtic-knot'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      // Try to find user first
      const users = await api.getUsers()
      const existingUser = users.find((u: User) => u.name === username)

      if (existingUser) {
        // Login logic here
        router.push(`/chat?username=${encodeURIComponent(username)}`)
      } else {
        // Register new user
        await api.createUser({
          name: username,
          status: 'online',
          statusMessage: '',
        })
        router.push(`/chat?username=${encodeURIComponent(username)}`)
      }
    } catch (error) {
      console.error('Failed to login/register:', error)
      setError('Failed to login/register. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <CelticKnot className="w-20 h-20 mb-4" />
          <h1 className="text-3xl font-bold text-white text-center">Tribe</h1>
        </div>
        {error && (
          <div className="bg-red-500 text-white p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full"
              required
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Login / Register
          </Button>
        </form>
      </div>
    </div>
  )
}

