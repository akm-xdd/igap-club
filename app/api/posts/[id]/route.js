import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const POSTS_FILE = path.join(process.cwd(), 'data', 'posts.json')
const POSTS_DIR = path.join(process.cwd(), 'data', 'posts')

// Simple word counting function - just ignore backticks
function countWords(content) {
  // Remove backticks but keep all the content
  const cleanContent = content.replace(/`/g, '')
  const words = cleanContent.trim().split(/\s+/).filter(word => word.length > 0)
  return words.length
}

// Read posts metadata
async function readPostsMetadata() {
  try {
    const data = await fs.readFile(POSTS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

// GET - Fetch single post with full content
export async function GET(request, { params }) {
  try {
    const { id } = params
    
    // Find post metadata
    const posts = await readPostsMetadata()
    const post = posts.find(p => p.id === id)
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Read the markdown content
    const contentPath = path.join(POSTS_DIR, post.filename)
    let content = ''
    
    try {
      content = await fs.readFile(contentPath, 'utf-8')
    } catch (error) {
      console.error('Error reading post content:', error)
      return NextResponse.json(
        { error: 'Post content not found' },
        { status: 404 }
      )
    }

    // Return post with content
    const fullPost = {
      ...post,
      content
    }

    return NextResponse.json(fullPost)
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    )
  }
}

// PUT - Update post (for future use)
export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    
    // Find and update post
    const posts = await readPostsMetadata()
    const postIndex = posts.findIndex(p => p.id === id)
    
    if (postIndex === -1) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    const existingPost = posts[postIndex]
    const { title, description, content, tags } = body

    // Validation
    if (title !== undefined && !title.trim()) {
      return NextResponse.json(
        { error: 'Title cannot be empty' },
        { status: 400 }
      )
    }

    if (content !== undefined) {
      const wordCount = countWords(content.trim())
      if (wordCount > 300) {
        return NextResponse.json(
          { error: 'Content must be 300 words or less' },
          { status: 400 }
        )
      }
    }

    // Update metadata
    const updatedPost = {
      ...existingPost,
      ...(title !== undefined && { title: title.trim() }),
      ...(description !== undefined && { description: description.trim() }),
      ...(tags !== undefined && { tags: tags.map(tag => tag.toLowerCase().trim()) }),
      updatedAt: new Date().toISOString(),
      ...(content !== undefined && { 
        wordCount: countWords(content.trim())
      })
    }

    posts[postIndex] = updatedPost

    // Update content file if provided
    if (content !== undefined) {
      const contentPath = path.join(POSTS_DIR, existingPost.filename)
      await fs.writeFile(contentPath, content.trim())
    }

    // Save metadata
    await fs.writeFile(POSTS_FILE, JSON.stringify(posts, null, 2))

    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    )
  }
}

// DELETE - Delete post (for future use)
export async function DELETE(request, { params }) {
  try {
    const { id } = params
    
    // Find post
    const posts = await readPostsMetadata()
    const postIndex = posts.findIndex(p => p.id === id)
    
    if (postIndex === -1) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    const post = posts[postIndex]

    // Delete content file
    try {
      const contentPath = path.join(POSTS_DIR, post.filename)
      await fs.unlink(contentPath)
    } catch (error) {
      console.warn('Could not delete content file:', error)
    }

    // Remove from metadata
    posts.splice(postIndex, 1)
    await fs.writeFile(POSTS_FILE, JSON.stringify(posts, null, 2))

    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    )
  }
}