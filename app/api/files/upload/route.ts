import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { cwd } from 'process'
import { existsSync } from 'fs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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
    
    // Create a unique filename
    const timestamp = Date.now()
    const uniqueFilename = `${timestamp}-${filename}`
    
    // Convert file to buffer and then to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Data = buffer.toString('base64')
    
    // Ensure uploads directory exists
    const publicDir = join(cwd(), 'public')
    const uploadsDir = join(publicDir, 'uploads')
    
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }
    
    // Save to public directory
    const filePath = join(uploadsDir, uniqueFilename)
    await writeFile(filePath, buffer)
    
    // Create file record in database
    try {
      const fileRecord = await prisma.file.create({
        data: {
          name: filename,
          type: mimeType,
          url: base64Data
        }
      })
      
      return NextResponse.json({ 
        fileUrl: `/api/files/${fileRecord.id}`,
        fileId: fileRecord.id
      })
    } catch (dbError) {
      console.error('Database error:', dbError)
      throw dbError
    }
  } catch (error) {
    console.error('Failed to upload file:', error)
    return NextResponse.json({ 
      error: 'Failed to upload file',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 