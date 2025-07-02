"use client"

import { useState, useEffect } from "react"
import { X, Eye, FileText, AlertCircle, Tag, Plus, Code } from "lucide-react"
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

export default function AddPostModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    tags: []
  })
  const [newTag, setNewTag] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [errors, setErrors] = useState({})

  const MAX_WORDS = 300
  const MAX_TITLE_LENGTH = 100
  const MAX_DESCRIPTION_LENGTH = 200

  // Simple word counting function - just ignore backticks
  const countWords = (content) => {
    // Remove backticks but keep all the content
    const cleanContent = content.replace(/`/g, '')
    const words = cleanContent.trim().split(/\s+/).filter(word => word.length > 0)
    return words.length
  }

  useEffect(() => {
    const count = countWords(formData.content)
    setWordCount(count)
  }, [formData.content])

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

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.length > MAX_TITLE_LENGTH) {
      newErrors.title = `Title must be ${MAX_TITLE_LENGTH} characters or less`
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.length > MAX_DESCRIPTION_LENGTH) {
      newErrors.description = `Description must be ${MAX_DESCRIPTION_LENGTH} characters or less`
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required'
    } else if (wordCount > MAX_WORDS) {
      newErrors.content = `Content must be ${MAX_WORDS} words or less (currently ${wordCount} words)`
    }

    if (formData.tags.length === 0) {
      newErrors.tags = 'At least one tag is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit({
        ...formData,
        author: 'akm-xdd', // Default author as requested
        wordCount
      })
    }
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim().toLowerCase())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim().toLowerCase()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  const CodeBlock = ({ children, className, ...props }) => {
    const match = /language-(\w+)/.exec(className || '')
    const language = match ? match[1] : ''
    const code = String(children).replace(/\n$/, '')

    return match ? (
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
      <div className="relative bg-gray-800/95 backdrop-blur-md border border-gray-700/50 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="sticky top-0 bg-gray-800/95 backdrop-blur-md border-b border-gray-700/50 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="text-green-400" size={24} />
              <h2 className="text-2xl font-mono font-bold text-white">
                Add New Content
              </h2>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-mono text-sm transition-all duration-300 ${
                  showPreview
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/50'
                    : 'bg-gray-700/50 text-gray-300 border border-gray-600/50 hover:bg-gray-700'
                }`}
              >
                {showPreview ? ( <Code size={16} /> ) : ( <Eye size={16} /> )}
                <span>{showPreview ? 'Edit' : 'Preview'}</span>
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
        <div className="flex h-[calc(90vh-140px)]">
          {/* Form Panel */}
          <div className={`${showPreview ? 'w-1/2' : 'w-full'} overflow-y-auto p-6 border-r border-gray-700/50`}>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Title */}
              <div>
                <label className="block font-mono text-sm font-semibold text-gray-300 mb-2">
                  Title*
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 font-mono text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
                  placeholder="Enter a catchy title for your content..."
                  maxLength={MAX_TITLE_LENGTH}
                />
                <div className="flex justify-between mt-1">
                  {errors.title && (
                    <p className="text-red-400 text-xs font-mono flex items-center space-x-1">
                      <AlertCircle size={12} />
                      <span>{errors.title}</span>
                    </p>
                  )}
                  <p className="text-gray-500 text-xs font-mono ml-auto">
                    {formData.title.length}/{MAX_TITLE_LENGTH}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-mono text-sm font-semibold text-gray-300 mb-2">
                  Description*
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 font-mono text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors resize-none"
                  placeholder="Brief description for the card preview..."
                  maxLength={MAX_DESCRIPTION_LENGTH}
                />
                <div className="flex justify-between mt-1">
                  {errors.description && (
                    <p className="text-red-400 text-xs font-mono flex items-center space-x-1">
                      <AlertCircle size={12} />
                      <span>{errors.description}</span>
                    </p>
                  )}
                  <p className="text-gray-500 text-xs font-mono ml-auto">
                    {formData.description.length}/{MAX_DESCRIPTION_LENGTH}
                  </p>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block font-mono text-sm font-semibold text-gray-300 mb-2">
                  Tags*
                </label>
                <div className="flex space-x-2 mb-3">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 font-mono text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
                    placeholder="Add a tag..."
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/50 rounded-lg text-green-400 font-mono text-sm transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                {/* Tag Display */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center space-x-2 bg-green-600/20 text-green-400 text-sm font-mono px-3 py-1 rounded-md"
                    >
                      <Tag size={12} />
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-green-400 hover:text-red-400 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                
                {errors.tags && (
                  <p className="text-red-400 text-xs font-mono flex items-center space-x-1">
                    <AlertCircle size={12} />
                    <span>{errors.tags}</span>
                  </p>
                )}
              </div>

              {/* Content */}
              <div>
                <label className="block font-mono text-sm font-semibold text-gray-300 mb-2">
                  Content* (Markdown supported)
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  rows={12}
                  className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 font-mono text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors resize-none"
                  placeholder={`Write your content here using Markdown...

Examples:
# Heading
**Bold text**
\`inline code\`
\`\`\`javascript
// Code block
function example() {
  return "Hello World";
}
\`\`\`

- List item
- Another item`}
                />
                <div className="flex justify-between mt-1">
                  {errors.content && (
                    <p className="text-red-400 text-xs font-mono flex items-center space-x-1">
                      <AlertCircle size={12} />
                      <span>{errors.content}</span>
                    </p>
                  )}
                  <p className={`text-xs font-mono ml-auto ${
                    wordCount > MAX_WORDS ? 'text-red-400' : 'text-gray-500'
                  }`}>
                    {wordCount}/{MAX_WORDS} words
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-green-600/20 hover:bg-green-600/30 border border-green-500/50 hover:border-green-400 rounded-lg px-6 py-3 font-mono font-semibold text-green-400 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  Publish Content
                </button>
              </div>
            </form>
          </div>

          {/* Preview Panel */}
          {showPreview && (
            <div className="w-1/2 overflow-y-auto p-6 bg-gray-900/50">
              <h3 className="font-mono text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <Eye size={20} />
                <span>Preview</span>
              </h3>
              
              <div className="space-y-4">
                {/* Preview Title */}
                <div>
                  <h4 className="text-2xl font-mono font-bold text-white mb-2">
                    {formData.title || 'Your Title Here'}
                  </h4>
                  <p className="text-gray-400 font-mono text-sm">
                    {formData.description || 'Your description here...'}
                  </p>
                  
                  {/* Preview Tags */}
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.tags.map((tag, index) => (
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

                {/* Preview Content */}
                <div className="border-t border-gray-700/50 pt-4">
                  <div className="prose prose-invert prose-green max-w-none">
                    <ReactMarkdown
                      components={{
                        code: CodeBlock,
                        h1: ({ children }) => (
                          <h1 className="text-2xl font-mono font-bold text-white mb-3 border-b border-gray-700 pb-2">
                            {children}
                          </h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-xl font-mono font-bold text-white mb-2 mt-6">
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-lg font-mono font-bold text-white mb-2 mt-4">
                            {children}
                          </h3>
                        ),
                        p: ({ children }) => (
                          <p className="text-gray-300 font-mono leading-relaxed mb-3 text-sm">
                            {children}
                          </p>
                        ),
                        ul: ({ children }) => (
                          <ul className="text-gray-300 font-mono space-y-1 mb-3 pl-4 text-sm">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="text-gray-300 font-mono space-y-1 mb-3 pl-4 text-sm">
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => (
                          <li className="list-disc list-inside">
                            {children}
                          </li>
                        ),
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-4 border-green-500 pl-3 py-2 bg-gray-700/30 rounded-r-lg mb-3 italic text-sm">
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
                      {formData.content || '*Start typing to see your content preview...*'}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}