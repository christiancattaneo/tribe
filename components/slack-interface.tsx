'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Sidebar from './sidebar'
import Header from './header'
import ChannelView from './channel-view'
import ThreadView from './thread-view'
import SearchResults from './search-results'
import { SelectUserDialog } from './select-user-dialog'
import * as api from '@/lib/api'
import { Message, ThreadMessage, Thread, User, Notification } from '@/lib/types'

interface ChannelMessages {
  [channelId: string]: Message[];
}

interface DMMessages {
  [userPair: string]: Message[];
}

interface Channel {
  id: string;
  name: string;
}

export default function SlackInterface() {
  const searchParams = useSearchParams()
  const username = searchParams.get('username')
  const [channels, setChannels] = useState<Channel[]>([])
  const [selectedChannel, setSelectedChannel] = useState<string>('')
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null)
  const [searchResults, setSearchResults] = useState<(Message | ThreadMessage)[] | null>(null)
  const [channelMessages, setChannelMessages] = useState<ChannelMessages>({})
  const [dmMessages, setDMMessages] = useState<DMMessages>({})
  const [users, setUsers] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [selectedDirectMessage, setSelectedDirectMessage] = useState<string | null>(null)
  const [isSelectUserDialogOpen, setIsSelectUserDialogOpen] = useState(false)
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null)
  const [existingDMs, setExistingDMs] = useState<{userName: string}[]>([])
  const router = useRouter()

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [channelsData, usersData] = await Promise.all([
          api.getChannels(),
          api.getUsers(),
        ])
        setChannels(channelsData)
        setUsers(usersData)
        if (channelsData.length > 0) {
          setSelectedChannel(channelsData[0].id)
        }

        // Set current user (in a real app, this would come from authentication)
        if (username) {
          const existingUser = usersData.find((u: User) => u.name === username)
          if (existingUser) {
            setCurrentUser(existingUser)
            // Fetch existing DM pairs for the user
            const dmPairs = await api.getDMPairs(existingUser.id)
            setExistingDMs(dmPairs)
          } else {
            // Create a new user with the provided username
            const newUser = await api.createUser({
              name: username,
              status: 'online',
              statusMessage: '',
            })
            setCurrentUser(newUser)
            setUsers(prev => [...prev, newUser])
          }
        }
      } catch (error) {
        console.error('Failed to fetch initial data:', error)
      }
    }

    fetchInitialData()
  }, [])

  // Fetch messages when selected channel changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChannel || !currentUser) return

      try {
        const messages = await api.getMessages(selectedChannel)
        setChannelMessages(prev => ({
          ...prev,
          [selectedChannel]: messages,
        }))
      } catch (error) {
        console.error('Failed to fetch messages:', error)
      }
    }

    fetchMessages()
  }, [selectedChannel, currentUser])

  // Fetch DM messages when selected user changes
  useEffect(() => {
    const fetchDMMessages = async () => {
      if (!selectedDirectMessage || !currentUser) return

      try {
        // Find the selected user's ID
        const selectedUser = users.find(u => u.name === selectedDirectMessage)
        if (!selectedUser) return

        // Sort user IDs to ensure consistent dmPairId regardless of who's viewing
        const userIds = [currentUser.id, selectedUser.id].sort()
        const dmPairId = `${userIds[0]}_${userIds[1]}`
        const messages = await api.getMessages(undefined, dmPairId)
        
        // Store messages using the same dmPairId as the key
        setDMMessages(prev => ({
          ...prev,
          [dmPairId]: messages,
        }))
      } catch (error) {
        console.error('Failed to fetch DM messages:', error)
      }
    }

    fetchDMMessages()
  }, [selectedDirectMessage, currentUser, users])

  // Fetch avatar chat messages when selected avatar changes
  useEffect(() => {
    const fetchAvatarMessages = async () => {
      if (!selectedAvatar || !currentUser) return

      try {
        // Include userId in the avatarId to make it unique per user
        const userSpecificAvatarId = `${selectedAvatar}_${currentUser.id}`
        const messages = await api.getMessages(undefined, undefined, userSpecificAvatarId)
        const avatarKey = `avatar_${userSpecificAvatarId}`
        setDMMessages(prev => ({
          ...prev,
          [avatarKey]: messages,
        }))
      } catch (error) {
        console.error('Failed to fetch avatar messages:', error)
      }
    }

    fetchAvatarMessages()
  }, [selectedAvatar, currentUser])

  const handleSearch = (query: string) => {
    if (query.trim() === '') {
      setSearchResults(null)
      return
    }

    const lowercaseQuery = query.toLowerCase()

    const allMessages = [
      ...Object.values(channelMessages).flat(),
      ...Object.values(dmMessages).flat(),
    ]

    const results = allMessages.filter((message) => {
      const contentMatch = message.content.toLowerCase().includes(lowercaseQuery)
      const filenameMatch = message.file && message.file.name.toLowerCase().includes(lowercaseQuery)
      return contentMatch || filenameMatch
    })

    setSearchResults(results)
  }

  const handleSearchResultClick = (result: Message | ThreadMessage) => {
    // Find the channel or DM containing this message
    for (const [channel, messages] of Object.entries(channelMessages)) {
      if (messages.some(m => m.id === result.id)) {
        setSelectedChannel(channel)
        setSelectedDirectMessage(null)
        setSearchResults(null)
        return
      }
    }

    for (const [dmKey, messages] of Object.entries(dmMessages)) {
      if (messages.some(m => m.id === result.id)) {
        const [user1, user2] = dmKey.split('_')
        const otherUser = user1 === currentUser?.name ? user2 : user1
        setSelectedDirectMessage(otherUser)
        setSelectedChannel('')
        setSearchResults(null)
        return
      }
    }
  }

  const handleSendMessage = async (content: string, file?: File) => {
    if (!currentUser) return

    try {
      let fileData
      if (file) {
        // Create FormData and append file
        const formData = new FormData()
        formData.append('file', file)
        formData.append('filename', file.name)
        
        // Upload file first
        const uploadResponse = await fetch('/api/files/upload', {
          method: 'POST',
          body: formData
        })
        
        if (!uploadResponse.ok) {
          const error = await uploadResponse.json()
          throw new Error(error.details || 'Failed to upload file')
        }
        
        const { fileUrl, fileId } = await uploadResponse.json()
        
        // Create file data structure
        fileData = {
          id: fileId,
          name: file.name,
          type: file.type,
          url: fileUrl
        }
      }

      // Update user status to show activity
      if (currentUser && selectedAvatar) {
        await api.updateUserStatus(currentUser.id, {
          status: 'active',
          statusMessage: `Chatting with ${selectedAvatar}`,
        })
        setUsers(prev => prev.map(user => 
          user.id === currentUser.id 
            ? { ...user, status: 'active', statusMessage: `Chatting with ${selectedAvatar}` }
            : user
        ))
      }

      // Find the selected user's ID for DMs
      const selectedUser = selectedDirectMessage ? users.find(u => u.name === selectedDirectMessage) : null

      // Construct message data
      const messageData = {
        content,
        userId: currentUser.id,
        ...(selectedChannel ? { channelId: selectedChannel } : {}),
        ...(selectedDirectMessage && selectedUser ? { 
          dmPairId: `${[currentUser.id, selectedUser.id].sort()[0]}_${[currentUser.id, selectedUser.id].sort()[1]}`
        } : {}),
        ...(selectedAvatar ? { avatarId: `${selectedAvatar}_${currentUser.id}` } : {}),
        ...(fileData ? { file: fileData } : {}),
      }

      const newMessage = await api.sendMessage(messageData)

      if (selectedChannel) {
        setChannelMessages(prev => ({
          ...prev,
          [selectedChannel]: [...(prev[selectedChannel] || []), newMessage],
        }))
      } else if (selectedDirectMessage && selectedUser) {
        const userIds = [currentUser.id, selectedUser.id].sort()
        const dmPairId = `${userIds[0]}_${userIds[1]}`
        setDMMessages(prev => ({
          ...prev,
          [dmPairId]: [...(prev[dmPairId] || []), newMessage],
        }))
      } else if (selectedAvatar) {
        // Handle avatar chat messages
        const avatarKey = `avatar_${selectedAvatar}`
        setDMMessages(prev => ({
          ...prev,
          [avatarKey]: [...(prev[avatarKey] || []), newMessage],
        }))
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const handleReaction = async (messageId: string, emoji: string) => {
    if (!currentUser) return

    try {
      await api.toggleReaction({
        messageId,
        userId: currentUser.id,
        emoji,
      })

      // Update the UI optimistically
      const updateMessages = (messages: Message[]) =>
        messages.map(msg =>
          msg.id === messageId
            ? {
                ...msg,
                reactions: msg.reactions.includes(emoji)
                  ? msg.reactions.filter(r => r !== emoji)
                  : [...msg.reactions, emoji],
              }
            : msg
        )

      if (selectedChannel) {
        setChannelMessages(prev => ({
          ...prev,
          [selectedChannel]: updateMessages(prev[selectedChannel] || []),
        }))
      } else if (selectedDirectMessage) {
        const selectedUser = users.find(u => u.name === selectedDirectMessage)
        if (!selectedUser) return
        const userIds = [currentUser.id, selectedUser.id].sort()
        const dmPairId = `${userIds[0]}_${userIds[1]}`
        setDMMessages(prev => ({
          ...prev,
          [dmPairId]: updateMessages(prev[dmPairId] || []),
        }))
      }
    } catch (error) {
      console.error('Failed to toggle reaction:', error)
    }
  }

  const handleAddChannel = async (name: string) => {
    try {
      console.log('Attempting to create channel:', name)
      const newChannel = await api.createChannel(name)
      console.log('Channel created successfully:', newChannel)
      setChannels(prev => [...prev, newChannel])
      setSelectedChannel(newChannel.id)
    } catch (error) {
      console.error('Failed to create channel:', error)
    }
  }

  const handleAddDirectMessage = async (userName: string) => {
    if (!currentUser) return
    
    try {
      // Find the selected user
      const selectedUser = users.find(u => u.name === userName)
      if (!selectedUser) return

      // Create a channel name for the DM that's consistent regardless of who creates it
      const participants = [currentUser.name, userName].sort()
      const channelName = `dm_${participants.join('_')}`

      // Check if the channel already exists
      const existingChannel = channels.find(c => c.name === channelName)
      if (existingChannel) {
        setSelectedChannel(existingChannel.id)
        setSelectedDirectMessage(userName)
        return
      }

      // Create a new channel for the DM
      const newChannel = await api.createChannel(channelName)
      setChannels(prev => [...prev, newChannel])
      setSelectedChannel(newChannel.id)
      setSelectedDirectMessage(userName)
      
      // Add to existing DMs list
      setExistingDMs(prev => [...prev, { userName }])
    } catch (error) {
      console.error('Failed to create DM channel:', error)
    }
  }

  // Update the SelectUserDialog handler
  const handleSelectUser = (userName: string) => {
    handleAddDirectMessage(userName)
    setIsSelectUserDialogOpen(false)
  }

  // Add handleLogout function
  const handleLogout = () => {
    // Close any open dialogs
    setIsSelectUserDialogOpen(false)
    
    // Clear user state
    setCurrentUser(null)
    setChannelMessages({})
    setDMMessages({})
    setSelectedChannel('')
    setSelectedDirectMessage(null)
    setSelectedThread(null)
    setSearchResults(null)
    
    // Redirect to login page
    router.push('/')
  }

  return (
    <div className="flex h-screen">
      {currentUser && (
        <Sidebar
          channels={channels.map(c => ({
            id: c.id,
            name: c.name,
            isDM: c.name.startsWith('dm_')
          }))}
          users={users}
          existingDMs={existingDMs}
          selectedChannel={selectedChannel ? channels.find(c => c.id === selectedChannel)?.name || '' : ''}
          setSelectedChannel={async (channelName) => {
            const channel = channels.find(c => c.name === channelName)
            if (channel) {
              setSelectedChannel(channel.id)
              // If it's a DM channel, set the selectedDirectMessage
              if (channel.name.startsWith('dm_')) {
                const [_, ...participants] = channel.name.split('_')
                const otherUser = participants.find(name => name !== currentUser.name)
                setSelectedDirectMessage(otherUser || null)
              } else {
                setSelectedDirectMessage(null)
              }
              setSelectedAvatar(null)
              
              // Reset user status when leaving avatar chat
              if (currentUser && selectedAvatar) {
                await api.updateUserStatus(currentUser.id, {
                  status: 'online',
                  statusMessage: '',
                })
                setUsers(prev => prev.map(user => 
                  user.id === currentUser.id 
                    ? { ...user, status: 'online', statusMessage: '' }
                    : user
                ))
              }
            }
          }}
          selectedDirectMessage={selectedDirectMessage}
          onSelectDirectMessage={handleSelectUser}
          onAddDirectMessage={() => setIsSelectUserDialogOpen(true)}
          onDeleteDirectMessage={async (userName: string) => {
            // Find the DM channel
            const participants = [currentUser.name, userName].sort()
            const channelName = `dm_${participants.join('_')}`
            const channel = channels.find(c => c.name === channelName)
            
            if (channel) {
              // Remove the channel
              setChannels(prev => prev.filter(c => c.id !== channel.id))
              // Remove from existingDMs
              setExistingDMs(prev => prev.filter(dm => dm.userName !== userName))
              // Clear selection if needed
              if (selectedChannel === channel.id) {
                setSelectedChannel('')
                setSelectedDirectMessage(null)
              }
            }
          }}
          onStatusChange={async (status: string, statusMessage: string) => {
            if (!currentUser) return
            
            try {
              await api.updateUserStatus(currentUser.id, { status, statusMessage })
              setUsers(prev => prev.map(user => 
                user.id === currentUser.id 
                  ? { ...user, status, statusMessage }
                  : user
              ))
            } catch (error) {
              console.error('Failed to update status:', error)
            }
          }}
          onProfileImageChange={async (file: File) => {
            if (!currentUser) return
            
            try {
              const updatedUser = await api.uploadProfileImage(currentUser.id, file)
              setUsers(prev => prev.map(user => 
                user.id === currentUser.id 
                  ? { ...user, profileImage: updatedUser.profileImage }
                  : user
              ))
              setCurrentUser(prev => prev ? { ...prev, profileImage: updatedUser.profileImage } : null)
            } catch (error) {
              console.error('Failed to update profile image:', error)
            }
          }}
          onAddChannel={handleAddChannel}
          onDeleteChannel={(channel: string) => {
            setChannels(prev => prev.filter(c => c.name !== channel))
          }}
          currentUser={currentUser}
          dmMessages={dmMessages}
          selectedAvatar={selectedAvatar}
          onSelectAvatar={async (avatar) => {
            setSelectedAvatar(avatar)
            setSelectedChannel('')
            setSelectedDirectMessage(null)
            
            // Update user status when selecting an avatar
            if (currentUser) {
              await api.updateUserStatus(currentUser.id, {
                status: 'active',
                statusMessage: `Chatting with ${avatar}`,
              })
              setUsers(prev => prev.map(user => 
                user.id === currentUser.id 
                  ? { ...user, status: 'active', statusMessage: `Chatting with ${avatar}` }
                  : user
              ))
            }
          }}
          onLogout={handleLogout}
        />
      )}
      <div className="flex-1 flex flex-col">
        {currentUser && (
          <Header
            notifications={notifications}
            clearSearch={() => setSearchResults(null)}
            currentUser={currentUser}
            onLogout={handleLogout}
          />
        )}
        {searchResults ? (
          <SearchResults
            results={searchResults}
            onResultClick={handleSearchResultClick}
            onClearSearch={() => setSearchResults(null)}
          />
        ) : currentUser ? (
          <div className="flex-1 flex">
            {!selectedThread ? (
              <ChannelView
                channel={selectedChannel ? channels.find(c => c.id === selectedChannel)?.name || '' : ''}
                directMessageUser={selectedDirectMessage ? users.find(u => u.name === selectedDirectMessage) || null : null}
                avatarChat={selectedAvatar}
                setSelectedThread={(messageId) => {
                  if (!messageId) {
                    setSelectedThread(null);
                    return;
                  }
                  const message = [...Object.values(channelMessages).flat(), ...Object.values(dmMessages).flat()]
                    .find(m => m.id === messageId)
                  if (message) {
                    setSelectedThread({
                      id: messageId,
                      messageId: messageId,
                      messages: [{
                        id: messageId,
                        user: message.user,
                        content: message.content,
                        timestamp: message.timestamp,
                        file: message.file,
                      }],
                    })
                  }
                }}
                messages={
                  selectedChannel
                    ? channelMessages[selectedChannel] || []
                    : selectedDirectMessage
                      ? (() => {
                          const dmUser = users.find(u => u.name === selectedDirectMessage)
                          if (!dmUser) return []
                          const dmPairId = `${[currentUser.id, dmUser.id].sort()[0]}_${[currentUser.id, dmUser.id].sort()[1]}`
                          return dmMessages[dmPairId] || []
                        })()
                      : selectedAvatar
                        ? dmMessages[`avatar_${selectedAvatar}_${currentUser.id}`] || []
                        : []
                }
                onSendMessage={handleSendMessage}
                onReaction={handleReaction}
                currentUser={currentUser}
                onSearch={handleSearch}
              />
            ) : (
              <ThreadView
                thread={selectedThread}
                onClose={() => setSelectedThread(null)}
                currentUser={currentUser}
                onSendReply={async (content: string, file?: File) => {
                  if (!currentUser || !selectedThread?.messageId) return
                  try {
                    const reply = await api.sendThreadReply(selectedThread.messageId, {
                      content,
                      userId: currentUser.id,
                      ...(file ? {
                        file: {
                          name: file.name,
                          type: file.type,
                          url: URL.createObjectURL(file),
                        },
                      } : {}),
                    })
                    setSelectedThread(prev => prev ? {
                      ...prev,
                      messages: [...prev.messages, reply],
                    } : null)
                  } catch (error) {
                    console.error('Failed to send reply:', error)
                  }
                }}
              />
            )}
          </div>
        ) : null}
      </div>
      <SelectUserDialog
        isOpen={isSelectUserDialogOpen}
        onClose={() => setIsSelectUserDialogOpen(false)}
        users={users}
        onSelectUser={handleSelectUser}
        currentUser={currentUser!}
      />
    </div>
  )
}

