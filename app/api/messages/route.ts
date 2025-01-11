import { NextResponse } from 'next/server'
import { PrismaClient, Prisma, Message as PrismaMessage, User as PrismaUser } from '@prisma/client'

const prisma = new PrismaClient()

type MessageWithRelations = PrismaMessage & {
  user: PrismaUser;
  reactions: { emoji: string }[];
  file: { id: string; name: string; type: string; url: string } | null;
  thread: { replies: any[] } | null;
}

// GET /api/messages?channelId=xxx or /api/messages?avatarId=xxx
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const channelId = searchParams.get('channelId')
    const avatarId = searchParams.get('avatarId')

    if (!channelId && !avatarId) {
      return NextResponse.json({ error: 'Either channelId or avatarId is required' }, { status: 400 })
    }

    const messages = await prisma.message.findMany({
      where: {
        ...(channelId ? { channelId } : {}),
        ...(avatarId ? { avatarId } : {}),
      },
      include: {
        user: true,
        reactions: true,
        file: true,
        thread: {
          include: {
            replies: true,
          },
        },
      },
      orderBy: {
        timestamp: 'asc',
      },
    }) as MessageWithRelations[]

    // Transform the data to match the frontend structure
    const transformedMessages = messages.map((message) => ({
      id: message.id,
      user: message.user.name,
      userImage: message.user.profileImage,
      content: message.content,
      timestamp: message.timestamp.toLocaleTimeString(),
      reactions: message.reactions.map((r) => r.emoji),
      replyCount: message.thread?.replies.length || 0,
      file: message.file ? {
        id: message.file.id,
        name: message.file.name,
        type: message.file.type,
        url: `/api/files/${message.file.id}`
      } : undefined,
    }))

    return NextResponse.json(transformedMessages)
  } catch (error) {
    console.error('Failed to fetch messages:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const requestUrl = new URL(request.url)
    return NextResponse.json({ 
      error: 'Failed to fetch messages',
      details: errorMessage,
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}

// POST /api/messages
export async function POST(request: Request) {
  try {
    const { content, userId, channelId, avatarId, file } = await request.json()

    if (!userId || (!channelId && !avatarId)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    let fileData
    if (file) {
      // Add file size validation (5MB limit)
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ 
          error: 'File size exceeds limit',
          details: 'Maximum file size is 5MB'
        }, { status: 400 })
      }

      fileData = {
        create: {
          name: file.name,
          type: file.type,
          url: file.url // Already base64 from frontend
        }
      }
    }

    const messageData: Prisma.MessageCreateInput = {
      content,
      timestamp: new Date(),
      user: { connect: { id: userId } },
      ...(channelId ? { channel: { connect: { id: channelId } } } : {}),
      ...(avatarId ? { avatarId } : {}),
      ...(fileData ? { file: fileData } : {}),
    }

    const message = await prisma.message.create({
      data: messageData,
      include: {
        user: true,
        file: true,
      },
    })

    return NextResponse.json({
      id: message.id,
      user: message.user.name,
      userImage: message.user.profileImage,
      content: message.content,
      timestamp: message.timestamp.toLocaleTimeString(),
      reactions: [],
      replyCount: 0,
      file: message.file ? {
        id: message.file.id,
        name: message.file.name,
        type: message.file.type,
        url: `/api/files/${message.file.id}`
      } : undefined,
    })
  } catch (error) {
    console.error('Failed to create message:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ 
      error: 'Failed to create message',
      details: errorMessage,
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
} 