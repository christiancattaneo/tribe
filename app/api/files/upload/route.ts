import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { put } from '@vercel/blob'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'No valid file provided' }, { status: 400 })
    }

    // Get file details
    const filename = formData.get('filename') as string || 'uploaded-file'
    const mimeType = file.type || 'application/octet-stream'
    
    // Check file size (5MB limit)
    const MAX_FILE_SIZE = 5 * 1024 * 1024
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size exceeds 5MB limit' }, { status: 400 })
    }
    
    // Upload file to Vercel Blob Storage
    try {
      const blob = await put(filename, file, {
        access: 'public',
        contentType: mimeType
      })

      // Create file record in database with blob URL
      const fileRecord = await prisma.file.create({
        data: {
          name: filename,
          type: mimeType,
          url: blob.url
        }
      })
      
      return NextResponse.json({ 
        fileUrl: blob.url,
        fileId: fileRecord.id
      })
    } catch (uploadError) {
      console.error('Failed to upload to Blob Storage:', uploadError)
      throw uploadError
    }
  } catch (error) {
    console.error('Failed to upload file:', error)
    return NextResponse.json({ 
      error: 'Failed to upload file',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 