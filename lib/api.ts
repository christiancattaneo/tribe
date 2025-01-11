// API utility functions for the Slack Interface

// Channels
export async function getChannels() {
  const response = await fetch('/api/channels')
  if (!response.ok) throw new Error('Failed to fetch channels')
  return response.json()
}

export async function createChannel(name: string) {
  console.log('API: Creating channel with name:', name)
  const response = await fetch('/api/channels', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  })
  if (!response.ok) {
    console.error('API: Failed to create channel:', response.status, response.statusText)
    throw new Error('Failed to create channel')
  }
  const data = await response.json()
  console.log('API: Channel created successfully:', data)
  return data
}

// Messages
export async function getMessages(channelId?: string, dmPairId?: string, avatarId?: string) {
  const params = new URLSearchParams()
  if (channelId) params.append('channelId', channelId)
  if (dmPairId) params.append('dmPairId', dmPairId)
  if (avatarId) params.append('avatarId', avatarId)
  
  const response = await fetch(`/api/messages?${params}`)
  if (!response.ok) throw new Error('Failed to fetch messages')
  return response.json()
}

export async function sendMessage(data: {
  content: string
  userId: string
  channelId?: string
  dmPairId?: string
  avatarId?: string
  file?: {
    name: string
    type: string
    url: string
  }
}) {
  const response = await fetch('/api/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to send message')
  return response.json()
}

// Threads
export async function getThread(messageId: string) {
  const response = await fetch(`/api/threads?messageId=${messageId}`)
  if (!response.ok) throw new Error('Failed to fetch thread')
  const replies = await response.json()
  return {
    id: messageId,  // Use the message ID as the thread ID for now
    messageId,      // Add the message ID to the thread object
    messages: replies,
  }
}

export async function sendThreadReply(messageId: string, data: {
  content: string
  userId: string
  file?: {
    name: string
    type: string
    url: string
  }
}) {
  const response = await fetch(`/api/threads?messageId=${messageId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to send reply')
  return response.json()
}

// Reactions
export async function toggleReaction(data: {
  messageId: string
  userId: string
  emoji: string
}) {
  const response = await fetch('/api/reactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to toggle reaction')
  return response.json()
}

// Users
export async function getUsers() {
  const response = await fetch('/api/users')
  if (!response.ok) throw new Error('Failed to fetch users')
  return response.json()
}

export async function createUser(data: {
  name: string
  status?: string
  statusMessage?: string
}) {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to create user')
  return response.json()
}

export async function updateUserStatus(userId: string, data: {
  status?: string
  statusMessage?: string
}) {
  const response = await fetch(`/api/users?id=${userId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to update user status')
  return response.json()
}

export async function getDMPairs(userId: string) {
  const response = await fetch(`/api/dm-pairs?userId=${userId}`)
  if (!response.ok) {
    throw new Error('Failed to fetch DM pairs')
  }
  return response.json()
}

export async function uploadProfileImage(userId: string, file: File) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('userId', userId)

  const response = await fetch('/api/users/upload', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Failed to upload profile image')
  }

  return response.json()
} 