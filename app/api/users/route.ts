import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Helper function to convert URL to data URL
async function urlToDataUrl(url: string) {
  const response = await fetch(url)
  const buffer = await response.arrayBuffer()
  const base64 = Buffer.from(buffer).toString('base64')
  return `data:image/svg+xml;base64,${base64}`
}

// GET /api/users
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        status: true,
        statusMessage: true,
        profileImage: true,
      } as any,
    })
    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

// POST /api/users
export async function POST(request: Request) {
  try {
    const { name, status, statusMessage } = await request.json()
    
    // Convert DiceBear URL to data URL
    const dicebearUrl = `https://api.dicebear.com/6.x/initials/svg?seed=${name}`
    const profileImage = await urlToDataUrl(dicebearUrl)
    
    const user = await prisma.user.create({
      data: {
        name,
        status: status || 'offline',
        statusMessage: statusMessage || '',
        profileImage,
      } as any,
    })
    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}

// PATCH /api/users/:id
export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const { status, statusMessage } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(statusMessage && { statusMessage }),
      },
    })
    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
} 