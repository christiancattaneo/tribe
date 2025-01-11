'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Hash, MessageCircle, ChevronDown, Circle, Plus, Trash2, LogOut } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import UserProfile from './user-profile'
import { AddChannelDialog } from './add-channel-dialog'
import { SelectUserDialog } from './select-user-dialog'
import { CelticKnot } from './celtic-knot'
import { User } from '@/lib/types'
import { DMMessages } from '@/lib/types'
import { useRouter } from 'next/navigation'

interface Channel {
  id: string;
  name: string;
  isDM: boolean;
}

interface SidebarProps {
  channels: Channel[];
  users: User[];
  existingDMs: { userName: string }[];
  selectedChannel: string;
  setSelectedChannel: (channelName: string) => void;
  selectedDirectMessage: string | null;
  onSelectDirectMessage: (userName: string) => void;
  onAddDirectMessage: () => void;
  onDeleteDirectMessage: (userName: string) => void;
  onStatusChange: (status: string, statusMessage: string) => void;
  onAddChannel: (name: string) => void;
  onDeleteChannel: (channel: string) => void;
  currentUser: User;
  dmMessages: DMMessages;
  selectedAvatar: string | null;
  onSelectAvatar: (avatar: string) => void;
  onProfileImageChange: (file: File) => Promise<void>;
  onLogout: () => void;
}

export default function Sidebar({
  channels,
  users,
  existingDMs,
  selectedChannel,
  setSelectedChannel,
  selectedDirectMessage,
  onSelectDirectMessage,
  onAddDirectMessage,
  onDeleteDirectMessage,
  onStatusChange,
  onAddChannel,
  onDeleteChannel,
  currentUser,
  dmMessages,
  selectedAvatar,
  onSelectAvatar,
  onProfileImageChange,
  onLogout,
}: SidebarProps) {
  // Separate regular channels from DM channels
  const regularChannels = channels.filter(c => !c.isDM)
  const dmChannels = channels.filter(c => c.isDM)
  
  // Add state for section toggles
  const [isChannelsExpanded, setIsChannelsExpanded] = useState(true)
  const [isDMsExpanded, setIsDMsExpanded] = useState(true)
  const [isAvatarsExpanded, setIsAvatarsExpanded] = useState(true)

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CelticKnot className="h-8 w-8 text-emerald-500" />
            <span className="text-xl font-bold">Tribe</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:text-white/80"
            onClick={onLogout}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div 
                className="flex items-center cursor-pointer" 
                onClick={() => setIsChannelsExpanded(!isChannelsExpanded)}
              >
                <ChevronDown className={`h-3 w-3 mr-1 transform transition-transform ${
                  isChannelsExpanded ? '' : '-rotate-90'
                }`} />
                <h2 className="text-sm font-semibold">Channels</h2>
              </div>
              <AddChannelDialog onAddChannel={onAddChannel} />
            </div>
            {isChannelsExpanded && regularChannels.map((channel) => (
              <div
                key={channel.id}
                className={`flex items-center justify-between group cursor-pointer p-1 rounded ${
                  selectedChannel === channel.name ? 'bg-gray-700' : 'hover:bg-gray-700'
                }`}
                onClick={() => setSelectedChannel(channel.name)}
              >
                <div className="flex items-center">
                  <Hash className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-sm">{channel.name}</span>
                </div>
                {selectedChannel === channel.name && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteChannel(channel.name)
                    }}
                    className="opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-400" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div 
                className="flex items-center cursor-pointer"
                onClick={() => setIsDMsExpanded(!isDMsExpanded)}
              >
                <ChevronDown className={`h-3 w-3 mr-1 transform transition-transform ${
                  isDMsExpanded ? '' : '-rotate-90'
                }`} />
                <h2 className="text-sm font-semibold">Direct Messages</h2>
              </div>
              <button onClick={onAddDirectMessage}>
                <Plus className="h-4 w-4 text-gray-400 hover:text-white" />
              </button>
            </div>
            {isDMsExpanded && dmChannels.map((channel) => {
              const [_, ...participants] = channel.name.split('_')
              const otherUser = participants.find(name => name !== currentUser.name)
              if (!otherUser) return null

              return (
                <div
                  key={channel.id}
                  className={`flex items-center justify-between group cursor-pointer p-1 rounded ${
                    selectedDirectMessage === otherUser ? 'bg-gray-700' : 'hover:bg-gray-700'
                  }`}
                  onClick={() => setSelectedChannel(channel.name)}
                >
                  <div className="flex items-center">
                    <Circle className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm">{otherUser}</span>
                  </div>
                  {selectedDirectMessage === otherUser && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteDirectMessage(otherUser)
                      }}
                      className="opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-400" />
                    </button>
                  )}
                </div>
              )
            })}
          </div>
          <div className="mb-4">
            <div 
              className="flex items-center mb-2 cursor-pointer"
              onClick={() => setIsAvatarsExpanded(!isAvatarsExpanded)}
            >
              <ChevronDown className={`h-3 w-3 mr-1 transform transition-transform ${
                isAvatarsExpanded ? '' : '-rotate-90'
              }`} />
              <h2 className="text-sm font-semibold">Avatars</h2>
            </div>
            {isAvatarsExpanded && (
              <div
                className={`flex items-center cursor-pointer p-1 rounded ${
                  selectedAvatar === 'celtic' ? 'bg-gray-700' : 'hover:bg-gray-700'
                }`}
                onClick={() => onSelectAvatar('celtic')}
              >
                <div className="w-4 h-4 mr-2 flex items-center justify-center text-gray-400">
                  🤖
                </div>
                <span className="text-sm">Your AI</span>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
      <div className="p-4 border-t border-gray-700 mt-auto">
        <UserProfile 
          user={currentUser} 
          onStatusChange={onStatusChange}
          onProfileImageChange={onProfileImageChange}
        />
      </div>
    </div>
  )
}

