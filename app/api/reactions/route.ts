import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// POST /api/reactions
export async function POST(request: Request) {
  try {
    const { messageId, userId, emoji } = await request.json()

    if (!messageId || !userId || !emoji) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if reaction already exists
    const existingReaction = await prisma.reaction.findFirst({
      where: {
        messageId,
        userId,
        emoji,
      },
    })

    if (existingReaction) {
      // Remove reaction if it exists
      await prisma.reaction.delete({
        where: {
          id: existingReaction.id,
        },
      })
      return NextResponse.json({ removed: true })
    } else {
      // Add new reaction
      const reaction = await prisma.reaction.create({
        data: {
          messageId,
          userId,
          emoji,
        },
      })
      return NextResponse.json(reaction)
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to toggle reaction' }, { status: 500 })
  }
} 