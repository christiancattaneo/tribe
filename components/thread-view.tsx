'use client'

import { useState, useRef } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { X, Paperclip, Send } from 'lucide-react'
import { Thread, User } from '@/lib/types'
import FileMessage from './file-message'

interface ThreadViewProps {
  thread: Thread;
  onClose: () => void;
  onSendReply: (content: string, file?: File) => void;
  currentUser: User;
}

interface FileType {
  id: string;
  name: string;
  type: string;
  url: string;
}

export default function ThreadView({ thread, onClose, onSendReply, currentUser }: ThreadViewProps) {
  const [newReply, setNewReply] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault()
    if (newReply.trim() || fileInputRef.current?.files?.[0]) {
      onSendReply(newReply, fileInputRef.current?.files?.[0])
      setNewReply('')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="w-96 border-l border-gray-700 flex flex-col h-full bg-background">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
        <h2 className="text-xl font-semibold">Thread</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      <ScrollArea className="flex-1 min-h-0">
        <div className="space-y-4 p-4">
          {thread.messages.map((message) => (
            <div key={message.id} className="mb-4">
              <div className="flex items-start">
                {message.user === currentUser.name ? (
                  <img
                    src={`https://api.dicebear.com/6.x/initials/svg?seed=${currentUser.name}`}
                    alt={`${currentUser.name}'s avatar`}
                    className="w-8 h-8 rounded mr-3"
                  />
                ) : message.user === thread.messages[0].user ? (
                  <div className="w-8 h-8 rounded mr-3 flex items-center justify-center text-xl">
                    🤖
                  </div>
                ) : (
                  <img
                    src={`https://api.dicebear.com/6.x/initials/svg?seed=${message.user}`}
                    alt={`${message.user}'s avatar`}
                    className="w-8 h-8 rounded mr-3"
                  />
                )}
                <div className="flex-grow">
                  <div className="flex items-center">
                    <span className="font-semibold">{message.user}</span>
                    <span className="text-gray-400 text-sm ml-2">
                      {message.timestamp}
                    </span>
                  </div>
                  {message.file ? (
                    <FileMessage file={message.file} />
                  ) : (
                    <p>{message.content}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <form onSubmit={handleSendReply} className="p-4 border-t border-gray-700 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Reply to thread..."
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            className="flex-grow"
          />
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={() => handleSendReply({ preventDefault: () => {} } as React.FormEvent)}
          />
          <Button variant="ghost" size="icon" type="button" onClick={handleFileUpload}>
            <Paperclip className="h-5 w-5" />
          </Button>
          <Button type="submit">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  )
}

