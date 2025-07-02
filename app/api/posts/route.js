import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

const POSTS_FILE = path.join(process.cwd(), 'data', 'posts.json')
const POSTS_DIR = path.join(process.cwd(), 'data', 'posts')

// Simple word counting function - just ignore backticks
function countWords(content) {
  // Remove backticks but keep all the content
  const cleanContent = content.replace(/`/g, '')
  const words = cleanContent.trim().split(/\s+/).filter(word => word.length > 0)
  return words.length
}

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(path.join(process.cwd(), 'data'))
  } catch {
    await fs.mkdir(path.join(process.cwd(), 'data'), { recursive: true })
  }
  
  try {
    await fs.access(POSTS_DIR)
  } catch {
    await fs.mkdir(POSTS_DIR, { recursive: true })
  }
}

// Read posts metadata
async function readPostsMetadata() {
  try {
    await ensureDataDir()
    const data = await fs.readFile(POSTS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    // If file doesn't exist, return empty array
    return []
  }
}

// Write posts metadata
async function writePostsMetadata(posts) {
  await ensureDataDir()
  await fs.writeFile(POSTS_FILE, JSON.stringify(posts, null, 2))
}

// GET - Fetch all posts
export async function GET() {
  try {
    const posts = await readPostsMetadata()
    // Sort by creation date, newest first
    const sortedPosts = posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    return NextResponse.json(sortedPosts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

// POST - Create new post
export async function POST(request) {
  try {
    const body = await request.json()
    const { title, description, content, tags, author, wordCount } = body

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

    // Ensure directories exist before creating post
    await ensureDataDir()

    // Create post object
    const postId = uuidv4()
    const filename = `${postId}.md`
    const now = new Date().toISOString()
    
    const postMetadata = {
      id: postId,
      title: title.trim(),
      description: description.trim(),
      tags: tags.map(tag => tag.toLowerCase().trim()),
      author: author || 'akm-xdd',
      createdAt: now,
      updatedAt: now,
      filename,
      wordCount: calculatedWordCount
    }

    // Save markdown content to file
    const postPath = path.join(POSTS_DIR, filename)
    await fs.writeFile(postPath, content.trim())

    // Update posts metadata
    const posts = await readPostsMetadata()
    posts.push(postMetadata)
    await writePostsMetadata(posts)

    return NextResponse.json(postMetadata, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}