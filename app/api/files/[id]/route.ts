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
      let base64Data = file.url

      // If it's a data URL, extract the base64 part
      if (base64Data.startsWith('data:')) {
        base64Data = base64Data.split(',')[1]
      }

      // Remove any whitespace, newlines, or special characters
      base64Data = base64Data.replace(/[\s\uFEFF\xA0]/g, '')

      // Convert to buffer
      const buffer = Buffer.from(base64Data, 'base64')

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