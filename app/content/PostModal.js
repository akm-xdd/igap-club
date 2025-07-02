"use client"

import { useState, useEffect } from "react"
import { X, User, Calendar, Tag, Copy, Check, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

export default function PostModal({ post, onClose, onDelete }) {
  const [copiedCode, setCopiedCode] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [onClose])

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      const response = await fetch(`/api/posts/${post.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        onDelete?.(post.id) // Notify parent component
        onClose() // Close modal
      } else {
        console.error('Failed to delete post')
        // Could add error toast here
      }
    } catch (error) {
      console.error('Error deleting post:', error)
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const copyToClipboard = async (code, index) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(index)
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  const CodeBlock = ({ children, className, ...props }) => {
    const match = /language-(\w+)/.exec(className || '')
    const language = match ? match[1] : ''
    const code = String(children).replace(/\n$/, '')
    const codeIndex = `${language}-${code.slice(0, 20)}`

    return match ? (
      <div className="relative group">
        <button
          onClick={() => copyToClipboard(code, codeIndex)}
          className="absolute top-3 right-3 z-10 p-2 bg-gray-700/80 hover:bg-gray-600/80 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          title="Copy code"
        >
          {copiedCode === codeIndex ? (
            <Check size={16} className="text-green-400" />
          ) : (
            <Copy size={16} className="text-gray-300" />
          )}
        </button>
        <SyntaxHighlighter
          style={oneDark}
          language={language}
          PreTag="div"
          className="rounded-lg !mt-0 !mb-4"
          customStyle={{
            margin: 0,
            padding: '1rem',
            fontSize: '0.875rem',
          }}
          {...props}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    ) : (
      <code className="bg-gray-700/50 text-green-400 px-2 py-1 rounded text-sm font-mono" {...props}>
        {children}
      </code>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-gray-800/95 backdrop-blur-md border border-gray-700/50 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="sticky top-0 bg-gray-800/95 backdrop-blur-md border-b border-gray-700/50 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <h2 className="text-2xl md:text-3xl font-mono font-bold text-white mb-3">
                {post.title}
              </h2>
              
                              <div className="flex flex-wrap items-center gap-4 text-sm font-mono text-gray-400">
                <div className="flex items-center space-x-1">
                  <User size={14} />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar size={14} />
                  <span>{formatDistanceToNow(new Date(post.createdAt))} ago</span>
                </div>
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center space-x-1 bg-green-600/20 text-green-400 text-xs font-mono px-2 py-1 rounded-md"
                    >
                      <Tag size={12} />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 hover:bg-red-600/20 rounded-lg transition-colors group"
                title="Delete post"
              >
                <Trash2 size={20} className="text-gray-400 group-hover:text-red-400" />
              </button>

              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-400 hover:text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="prose prose-invert prose-green max-w-none">
            <ReactMarkdown
              components={{
                code: CodeBlock,
                h1: ({ children }) => (
                  <h1 className="text-3xl font-mono font-bold text-white mb-4 border-b border-gray-700 pb-2">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-mono font-bold text-white mb-3 mt-8">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-mono font-bold text-white mb-2 mt-6">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-gray-300 font-mono leading-relaxed mb-4">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="text-gray-300 font-mono space-y-1 mb-4 pl-6">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="text-gray-300 font-mono space-y-1 mb-4 pl-6">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="list-disc list-inside">
                    {children}
                  </li>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-green-500 pl-4 py-2 bg-gray-700/30 rounded-r-lg mb-4 italic">
                    {children}
                  </blockquote>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    className="text-green-400 hover:text-green-300 underline transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-md mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <Trash2 className="text-red-400" size={24} />
              <h3 className="text-xl font-mono font-bold text-white">Delete Post</h3>
            </div>
            
            <p className="text-gray-300 font-mono text-sm mb-6 leading-relaxed">
              Are you sure you want to delete &quot;<strong>{post.title}</strong>&quot;? This action cannot be undone.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 hover:border-red-400 rounded-lg px-4 py-2 font-mono text-sm font-semibold text-red-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
              
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="flex-1 bg-gray-700/50 hover:bg-gray-700 border border-gray-600/50 hover:border-gray-500 rounded-lg px-4 py-2 font-mono text-sm font-semibold text-gray-300 transition-all duration-300 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}