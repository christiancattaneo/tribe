import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const file = await prisma.file.findUnique({
      where: { id: params.id }
    })

    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    try {
      // The url field contains the base64 data
      let buffer: Buffer
      
      // Check if the url is already a base64 string
      if (file.url.startsWith('data:')) {
        // Extract base64 data from data URL
        const base64Data = file.url.split(',')[1]
        buffer = Buffer.from(base64Data, 'base64')
      } else {
        // Assume it's raw base64 data
        buffer = Buffer.from(file.url, 'base64')
      }

      // Create response with proper headers
      const response = new NextResponse(buffer)
      response.headers.set('Content-Type', file.type || 'application/octet-stream')
      response.headers.set('Content-Disposition', `inline; filename="${file.name}"`)
      response.headers.set('Cache-Control', 'public, max-age=31536000') // Cache for 1 year
      
      return response
    } catch (error) {
      console.error('Failed to process file data:', error)
      return NextResponse.json({ 
        error: 'Failed to process file data',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Failed to fetch file:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch file',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 