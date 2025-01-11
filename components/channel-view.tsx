'use client'

import { useState, useRef } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Smile, Paperclip, Send, MessageSquare, Search, X } from 'lucide-react'
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'
import ReactionDisplay from './reaction-display'
import FileMessage from './file-message'
import { Message, User } from '@/lib/types'

interface ChannelViewProps {
  channel: string;
  directMessageUser: User | null;
  avatarChat: string | null;
  setSelectedThread: (threadId: string | null) => void;
  messages: Message[];
  onSendMessage: (content: string, file?: File) => void;
  onReaction: (messageId: string, emoji: string) => void;
  currentUser: User;
  onSearch: (query: string) => void;
}

export default function ChannelView({ 
  channel, 
  directMessageUser,
  avatarChat,
  setSelectedThread, 
  messages, 
  onSendMessage, 
  onReaction,
  currentUser,
  onSearch
}: ChannelViewProps) {
  const [newMessage, setNewMessage] = useState('')
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false)
  const [currentMessageId, setCurrentMessageId] = useState<string | null>(null)
  const [showInputEmojiPicker, setShowInputEmojiPicker] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    const file = selectedFile
    
    if (newMessage.trim() || file) {
      try {
        // Send message with raw file object
        await onSendMessage(newMessage, file || undefined)
        
        // Clear form
        setNewMessage('')
        setSelectedFile(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } catch (error) {
        console.error('Failed to send message:', error)
        alert(error instanceof Error ? error.message : 'Failed to send message. Please try again.')
      }
    }
  }

  const handleReaction = (messageId: string, emoji: string) => {
    onReaction(messageId, emoji)
    setEmojiPickerVisible(false)
  }

  const toggleEmojiPicker = (messageId: string) => {
    setCurrentMessageId(messageId)
    setEmojiPickerVisible(!emojiPickerVisible)
  }

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    if (currentMessageId !== null) {
      handleReaction(currentMessageId, emojiData.emoji)
    }
  }

  const handleInputEmojiClick = (emojiData: EmojiClickData) => {
    setNewMessage(prev => prev + emojiData.emoji)
    setShowInputEmojiPicker(false)
  }

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (5MB limit)
      const MAX_FILE_SIZE = 5 * 1024 * 1024
      if (file.size > MAX_FILE_SIZE) {
        alert('File size exceeds 5MB limit')
        e.target.value = ''
        setSelectedFile(null)
        return
      }
      // Set the selected file
      setSelectedFile(file)
    } else {
      setSelectedFile(null)
    }
  }

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (searchQuery.trim()) {
      onSearch(searchQuery)
      setIsSearching(true)
    }
  }

  const clearSearch = () => {
    setSearchQuery('')
    setIsSearching(false)
    onSearch('')
  }

  return (
    <div className="flex-grow flex flex-col h-[90vh]">
      <div className="p-4 border-b border-gray-700 flex-shrink-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            {avatarChat ? (
              <>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xl">
                  🤖
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Your AI</h2>
                </div>
              </>
            ) : directMessageUser ? (
              <>
                <img
                  src={directMessageUser.profileImage || `https://api.dicebear.com/6.x/initials/svg?seed=${directMessageUser.name}`}
                  alt={`${directMessageUser.name}'s avatar`}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <h2 className="text-xl font-semibold">{directMessageUser.name}</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <div className={`w-2 h-2 rounded-full ${
                      directMessageUser.status === 'online' ? 'bg-green-500' :
                      directMessageUser.status === 'away' ? 'bg-yellow-500' :
                      directMessageUser.status === 'busy' ? 'bg-red-500' :
                      'bg-gray-500'
                    }`} />
                    {directMessageUser.statusMessage || directMessageUser.status}
                  </div>
                </div>
              </>
            ) : (
              <h2 className="text-xl font-semibold">#{channel}</h2>
            )}
          </div>
          <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-4 relative">
            <Input
              type="text"
              placeholder="Search messages..."
              className="w-full pr-20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-12 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                onClick={clearSearch}
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8"
              disabled={!searchQuery.trim()}
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
      <ScrollArea className="flex-1 min-h-0">
        <div className="space-y-4 p-4">
          {isSearching && (
            <div className="flex items-center mb-4 bg-gray-800 p-3 rounded-lg">
              <h3 className="text-lg font-semibold">Search Results</h3>
              <span className="text-sm text-gray-400 ml-2">
                Press X to exit search
              </span>
            </div>
          )}
          {messages.length === 0 && directMessageUser ? (
            <p className="text-center text-gray-500">No messages yet. Start a conversation!</p>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="mb-4">
                <div className="flex items-start">
                  {message.user === currentUser.name ? (
                    <img
                      src={currentUser.profileImage || `https://api.dicebear.com/6.x/initials/svg?seed=${currentUser.name}`}
                      alt={`${currentUser.name}'s avatar`}
                      className="w-10 h-10 rounded mr-3"
                    />
                  ) : message.user === avatarChat ? (
                    <div className="w-10 h-10 rounded mr-3 flex items-center justify-center text-2xl">
                      🤖
                    </div>
                  ) : (
                    <img
                      src={message.userImage || `https://api.dicebear.com/6.x/initials/svg?seed=${message.user}`}
                      alt={`${message.user}'s avatar`}
                      className="w-10 h-10 rounded mr-3"
                    />
                  )}
                  <div className="flex-grow">
                    <div className="flex items-center">
                      <span className="font-semibold">{message.user}</span>
                      <span className="text-gray-400 text-sm ml-2">
                        {message.timestamp}
                      </span>
                    </div>
                    {message.content && <p className="mt-1">{message.content}</p>}
                    {message.file && (
                      <div className="mt-2">
                        <FileMessage file={message.file} />
                      </div>
                    )}
                    <div className="flex mt-2">
                      {message.reactions && (
                        <ReactionDisplay
                          reactions={message.reactions}
                          onReactionClick={(emoji) => handleReaction(message.id, emoji)}
                        />
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleEmojiPicker(message.id)}
                        aria-label="Add reaction"
                        aria-haspopup="dialog"
                        aria-expanded={emojiPickerVisible && currentMessageId === message.id}
                      >
                        <Smile className="h-4 w-4 mr-1" />
                        React
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedThread(message.id)}
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {message.replyCount > 0 
                          ? `${message.replyCount} ${message.replyCount === 1 ? 'reply' : 'replies'}`
                          : 'Reply'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
      {emojiPickerVisible && (
        <div className="absolute z-10 bottom-20 right-4" role="dialog" aria-label="Choose an emoji">
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            autoFocusSearch={false}
          />
        </div>
      )}
      {showInputEmojiPicker && (
        <div className="absolute z-10 bottom-20 right-4" role="dialog" aria-label="Choose an emoji">
          <EmojiPicker
            onEmojiClick={handleInputEmojiClick}
            autoFocusSearch={false}
          />
        </div>
      )}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700 flex-shrink-0">
        <div className="flex flex-col gap-2">
          {selectedFile && (
            <div className="px-3 py-1 relative">
              <FileMessage file={{
                name: selectedFile.name,
                type: selectedFile.type,
                url: URL.createObjectURL(selectedFile)
              }} />
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-1 right-1 h-6 w-6 p-0"
                onClick={() => {
                  setSelectedFile(null)
                  if (fileInputRef.current) {
                    fileInputRef.current.value = ''
                  }
                }}
              >
                ×
              </Button>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder={
                !currentUser ? "Loading..." :
                avatarChat ? `Message as ${currentUser.name}` :
                directMessageUser ? `Message ${directMessageUser}` : `Message #${channel}`
              }
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-grow"
            />
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.txt"
              onChange={handleFileChange}
            />
            <Button 
              variant="ghost" 
              size="icon" 
              type="button" 
              onClick={() => setShowInputEmojiPicker(!showInputEmojiPicker)}
            >
              <Smile className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" type="button" onClick={handleFileUpload}>
              <Paperclip className="h-5 w-5" />
            </Button>
            <Button type="submit">
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

