import { Suspense } from 'react'
import SlackInterface from '@/components/slack-interface'

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <SlackInterface />
    </Suspense>
  )
} 