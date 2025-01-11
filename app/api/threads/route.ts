import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/threads/:messageId
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const messageId = searchParams.get('messageId')

    if (!messageId) {
      return NextResponse.json({ error: 'Message ID is required' }, { status: 400 })
    }

    // Get or create thread
    let thread = await (prisma as any).thread.findUnique({
      where: { messageId },
      include: {
        message: true,
        replies: {
          include: {
            user: {
              select: {
                name: true,
              } as any,
            },
            file: true,
          },
          orderBy: {
            timestamp: 'asc',
          },
        },
      },
    })

    if (!thread) {
      thread = await (prisma as any).thread.create({
        data: {
          messageId,
        },
        include: {
          message: true,
          replies: {
            include: {
              user: {
                select: {
                  name: true,
                } as any,
              },
              file: true,
            },
          },
        },
      })
    }

    // Transform the data to match the frontend structure
    const transformedReplies = thread.replies.map((reply: any) => ({
      id: reply.id,
      user: reply.user.name,
      content: reply.content,
      timestamp: reply.timestamp.toLocaleTimeString(),
      file: reply.file ? {
        name: reply.file.name,
        type: reply.file.type,
        url: reply.file.url,
      } : undefined,
    }))

    return NextResponse.json(transformedReplies)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch thread' }, { status: 500 })
  }
}

// POST /api/threads/:messageId
export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const messageId = searchParams.get('messageId')
    const { content, userId, file } = await request.json()

    if (!messageId || !content || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get or create thread
    let thread = await (prisma as any).thread.findUnique({
      where: { messageId },
    })

    if (!thread) {
      thread = await (prisma as any).thread.create({
        data: {
          messageId,
        },
      })
    }

    // Create thread message
    const reply = await (prisma as any).threadMessage.create({
      data: {
        content,
        userId,
        threadId: thread.id,
        ...(file ? {
          file: {
            create: {
              name: file.name,
              type: file.type,
              url: file.url,
            },
          },
        } : {}),
      },
      include: {
        user: {
          select: {
            name: true,
          } as any,
        },
        file: true,
      },
    })

    return NextResponse.json({
      id: reply.id,
      user: reply.user.name,
      content: reply.content,
      timestamp: reply.timestamp.toLocaleTimeString(),
      file: reply.file ? {
        name: reply.file.name,
        type: reply.file.type,
        url: reply.file.url,
      } : undefined,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create reply' }, { status: 500 })
  }
} 