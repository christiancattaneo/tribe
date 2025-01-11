import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/channels
export async function GET() {
  try {
    const channels = await prisma.channel.findMany({
      select: {
        id: true,
        name: true,
      },
    })
    return NextResponse.json(channels)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch channels' }, { status: 500 })
  }
}

// POST /api/channels
export async function POST(request: Request) {
  try {
    const { name } = await request.json()
    console.log('Creating channel with name:', name)
    const channel = await prisma.channel.create({
      data: {
        name,
      },
    })
    console.log('Channel created:', channel)
    return NextResponse.json(channel)
  } catch (error) {
    console.error('Failed to create channel:', error)
    return NextResponse.json({ error: 'Failed to create channel' }, { status: 500 })
  }
} 