import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { put } from '@vercel/blob'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024

// Allowed MIME types
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]

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
    
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size exceeds 5MB limit' }, { status: 400 })
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(mimeType)) {
      return NextResponse.json({ error: 'File type not allowed' }, { status: 400 })
    }
    
    // Upload file to Vercel Blob Storage
    try {
      const blob = await put(filename, file, {
        access: 'public',
        contentType: mimeType,
        addRandomSuffix: true // Add random suffix to prevent filename collisions
      })

      // Create file record in database
      const fileRecord = await prisma.file.create({
        data: {
          name: filename,
          type: mimeType,
          url: blob.url
        }
      })
      
      return NextResponse.json({ 
        fileUrl: blob.url,
        fileId: fileRecord.id,
        name: filename,
        type: mimeType
      })
    } catch (uploadError) {
      console.error('Failed to upload to Blob Storage:', uploadError)
      return NextResponse.json({ 
        error: 'Failed to upload file to storage',
        details: uploadError instanceof Error ? uploadError.message : 'Unknown error'
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Failed to process file upload:', error)
    return NextResponse.json({ 
      error: 'Failed to process file upload',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 