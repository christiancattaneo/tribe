import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const file = await prisma.file.findUnique({
      where: { id: params.id }
    })

    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // Redirect to the Blob Storage URL
    return NextResponse.redirect(file.url)
  } catch (error) {
    console.error('Failed to fetch file:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch file',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 