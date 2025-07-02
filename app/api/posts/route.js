import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Simple word counting function
function countWords(content) {
  const cleanContent = content.replace(/`/g, '')
  const words = cleanContent.trim().split(/\s+/).filter(word => word.length > 0)
  return words.length
}

// GET - Fetch all posts (public, no auth required)
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        tags: true,
        author: true,
        authorId: true,
        wordCount: true,
        createdAt: true,
        updatedAt: true,
        // Don't include content in list view for performance
      }
    })
    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

// POST - Create new post (requires authentication)
export async function POST(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, description, content, tags } = body

    // Validation
    if (!title?.trim() || !description?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: 'Title, description, and content are required' },
        { status: 400 }
      )
    }

    if (!tags || tags.length === 0) {
      return NextResponse.json(
        { error: 'At least one tag is required' },
        { status: 400 }
      )
    }

    // Check word count limit
    const calculatedWordCount = countWords(content.trim())
    if (calculatedWordCount > 300) {
      return NextResponse.json(
        { error: 'Content must be 300 words or less' },
        { status: 400 }
      )
    }

    // Create post in database
    const post = await prisma.post.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        content: content.trim(),
        tags: tags.map(tag => tag.toLowerCase().trim()),
        author: session.user.githubUsername || session.user.name || 'user',
        authorId: session.user.id,
        wordCount: calculatedWordCount,
      }
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}