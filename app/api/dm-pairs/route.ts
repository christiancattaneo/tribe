import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    // Find all channels that are DMs involving this user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const dmChannels = await prisma.channel.findMany({
      where: {
        name: {
          startsWith: 'dm_',
          contains: user.name
        }
      }
    })

    // Transform to match the expected format
    const transformedPairs = dmChannels.map(channel => {
      const [_, ...participants] = channel.name.split('_')
      const otherUser = participants.find(name => name !== user.name)
      return {
        id: channel.id,
        userName: otherUser || '',
      }
    })

    return NextResponse.json(transformedPairs)
  } catch (error) {
    console.error('Failed to fetch DM pairs:', error)
    return NextResponse.json({ error: 'Failed to fetch DM pairs' }, { status: 500 })
  }
} 