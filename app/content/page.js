"use client"

import { useState, useEffect } from "react"
import { Plus, X, Eye, FileText, Tag, User, Calendar } from "lucide-react"
import PostCard from './PostCard'
import PostModal from './PostModal'
import AddPostModal from './AddPostModal'
import Link from "next/link"

export default function ContentPage() {
  const [posts, setPosts] = useState([])
  const [selectedPost, setSelectedPost] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [loading, setLoading] = useState(true)

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts')
      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePostClick = async (post) => {
    try {
      const response = await fetch(`/api/posts/${post.id}`)
      if (response.ok) {
        const fullPost = await response.json()
        setSelectedPost(fullPost)
      }
    } catch (error) {
      console.error('Error fetching post details:', error)
    }
  }

  const handleAddPost = async (newPost) => {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPost)
      })

      if (response.ok) {
        await fetchPosts() // Refresh posts list
        setShowAddModal(false)
      }
    } catch (error) {
      console.error('Error adding post:', error)
    }
  }

  const handleDeletePost = (postId) => {
    // Remove the deleted post from the local state
    setPosts(prevPosts => prevPosts.filter(post => post.id !== postId))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="font-mono text-gray-400">Loading content...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="font-mono text-xl font-bold text-green-400 hover:text-green-300 transition-colors">
                IGAP.club
              </Link>
              <div className="flex space-x-6">
                <a href="/content" className="font-mono text-green-400 font-semibold">
                  Content
                </a>
                <a href="/courses" className="font-mono text-gray-300 hover:text-green-400 transition-colors">
                  Courses
                </a>
              </div>
            </div>
            
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/50 hover:border-green-400 rounded-lg px-4 py-2 transition-all duration-300 transform hover:scale-105"
            >
              <Plus size={18} />
              <span className="font-mono text-sm font-semibold">Add Content</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23059669&quot; fill-opacity=&quot;0.03&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;1&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] pointer-events-none animate-pulse-slow"></div>

      {/* Main Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-300 to-green-500 mb-4">
            Content Hub
          </h1>
          <p className="text-lg font-mono text-gray-400 max-w-2xl mx-auto">
            Discover proven programming tricks and solutions from experienced developers
          </p>
        </div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="text-gray-600 mx-auto mb-4" size={64} />
            <h3 className="text-xl font-mono text-gray-400 mb-2">No content yet</h3>
            <p className="text-gray-500 font-mono mb-6">Be the first to share your programming tricks!</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center space-x-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/50 hover:border-green-400 rounded-lg px-6 py-3 transition-all duration-300"
            >
              <Plus size={20} />
              <span className="font-mono font-semibold">Create First Post</span>
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onClick={() => handlePostClick(post)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Post Detail Modal */}
      {selectedPost && (
        <PostModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onDelete={handleDeletePost}
        />
      )}

      {/* Add Post Modal */}
      {showAddModal && (
        <AddPostModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddPost}
        />
      )}
    </div>
  )
}