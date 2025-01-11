import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// POST /api/users/upload
export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const userId = formData.get('userId') as string

    if (!file || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // In a real app, you would upload the file to a storage service like S3
    // For this example, we'll use a data URL
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const dataUrl = `data:${file.type};base64,${buffer.toString('base64')}`

    // Update the user's profile image
    const user = await prisma.user.update({
      where: { id: userId },
      data: { profileImage: dataUrl },
    })

    return NextResponse.json({
      id: user.id,
      name: user.name,
      status: user.status,
      statusMessage: user.statusMessage,
      profileImage: user.profileImage,
    })
  } catch (error) {
    console.error('Failed to upload profile image:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ 
      error: 'Failed to upload profile image',
      details: errorMessage,
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
} 