import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ 
        error: 'File too large',
        details: 'Maximum file size is 5MB'
      }, { status: 400 })
    }

    // Convert file to data URL
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const dataUrl = `data:${file.type};base64,${buffer.toString('base64')}`

    // Create file record in database
    const fileRecord = await prisma.file.create({
      data: {
        name: file.name,
        type: file.type,
        url: dataUrl
      }
    })

    return NextResponse.json({
      fileId: fileRecord.id,
      fileUrl: fileRecord.url
    })
  } catch (error) {
    console.error('Failed to upload file:', error)
    return NextResponse.json({ 
      error: 'Failed to upload file',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 