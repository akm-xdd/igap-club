"use client"

import { useState, useEffect } from "react"
import { BookOpen, Code, Zap, Users, ArrowRight, Clock, Star, Trophy, Play, Target, Coffee } from "lucide-react"
import Link from "next/link"
import FloatingElements from '@/components/FloatingElements'

export default function CoursesPage() {
  const [text, setText] = useState("")
  const [showCursor, setShowCursor] = useState(true)
  const [currentPhase, setCurrentPhase] = useState(0)

  const phases = [
    "MicroBuild",
    "Coming Soon!"
  ]

  // Typing animation with phase cycling
  useEffect(() => {
    const currentText = phases[currentPhase]
    
    if (text.length < currentText.length) {
      const timer = setTimeout(() => {
        setText(currentText.substring(0, text.length + 1))
      }, 100)
      return () => clearTimeout(timer)
    } else {
      // Pause before cycling to next phase
      const pauseTimer = setTimeout(() => {
        setText("")
        setCurrentPhase((prev) => (prev + 1) % phases.length)
      }, 2000)
      return () => clearTimeout(pauseTimer)
    }
  }, [text, currentPhase])

  // Cursor blinking effect
  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)
    return () => clearInterval(cursorTimer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white relative overflow-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="font-mono text-xl font-bold text-green-400 hover:text-green-300 transition-colors">
                IGAP.club
              </Link>
              <div className="flex space-x-6">
                <a href="/content" className="font-mono text-gray-300 hover:text-green-400 transition-colors">
                  Content
                </a>
                <a href="/courses" className="font-mono text-purple-400 font-semibold">
                  Courses
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Floating Code Snippets */}
      <FloatingElements />

      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23059669&quot; fill-opacity=&quot;0.03&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;1&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] pointer-events-none animate-pulse-slow"></div>

      {/* Main Content */}
      <div className="relative z-20 max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">

          {/* Main Headline with Typing Animation */}
          <div className="relative mb-16">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-purple-500 mb-6">
              {text}
              <span
                className={`${showCursor ? "opacity-100" : "opacity-0"} transition-opacity duration-100 text-purple-400`}
              >
                |
              </span>
            </h1>
          </div>

          {/* Hero Statement */}
          <div className="mb-16">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-mono font-bold text-white mb-6 animate-fade-in-up">
              Byte-Sized Courses
            </h2>
            <div className="flex items-center justify-center space-x-4 text-xl md:text-2xl text-gray-300 font-mono animate-fade-in-up-delay">
              <span>Build stuff, skip the fluff</span>
              <ArrowRight className="text-blue-400 animate-pulse" size={24} />
            </div>
          </div>

          {/* Status */}
          <div className="mb-16">
            <div className="bg-purple-600/20 backdrop-blur-sm border border-purple-500/50 rounded-xl p-8 mb-8 animate-fade-in-up-delay">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Clock className="text-purple-400" size={28} />
                <h3 className="text-2xl font-mono font-bold text-white">Under Development</h3>
              </div>
              <p className="text-gray-300 font-mono text-lg leading-relaxed">
                Quick, practical courses that teach you to build real things without sitting for hours.
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 transition-all duration-300 animate-slide-up-stagger hover:border-blue-500/50">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-3 bg-blue-600/20 rounded-lg">
                  <Target className="text-blue-400" size={24} />
                </div>
                <h3 className="font-mono text-lg font-semibold mb-2 text-white">Hands-On Projects</h3>
                <p className="text-gray-400 font-mono text-sm">Build actual stuff you can use</p>
              </div>
            </div>

            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 transition-all duration-300 animate-slide-up-stagger hover:border-purple-500/50" style={{ animationDelay: '0.2s' }}>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-3 bg-purple-600/20 rounded-lg">
                  <Play className="text-purple-400" size={24} />
                </div>
                <h3 className="font-mono text-lg font-semibold mb-2 text-white">Byte-Sized Chapters</h3>
                <p className="text-gray-400 font-mono text-sm">5-15 min focused lessons</p>
              </div>
            </div>

            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 transition-all duration-300 animate-slide-up-stagger hover:border-blue-500/50" style={{ animationDelay: '0.4s' }}>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-3 bg-blue-600/20 rounded-lg">
                  <Coffee className="text-blue-400" size={24} />
                </div>
                <h3 className="font-mono text-lg font-semibold mb-2 text-white">On-The-Go Learning</h3>
                <p className="text-gray-400 font-mono text-sm">Learn during coffee breaks</p>
              </div>
            </div>

            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 transition-all duration-300 animate-slide-up-stagger hover:border-purple-500/50" style={{ animationDelay: '0.6s' }}>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-3 bg-purple-600/20 rounded-lg">
                  <Star className="text-purple-400" size={24} />
                </div>
                <h3 className="font-mono text-lg font-semibold mb-2 text-white">Curated by Experts</h3>
                <p className="text-gray-400 font-mono text-sm">From proven pros who ship</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="animate-fade-in-up-delay-2">
            <p className="text-gray-400 font-mono text-lg mb-8">
              Meanwhile, check out our proven tricks and solutions
            </p>
            <Link
              href="/content"
              className="inline-flex items-center space-x-3 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/50 hover:border-purple-400 rounded-xl px-8 py-4 transition-all duration-300 transform hover:scale-105"
            >
              <BookOpen size={20} />
              <span className="font-mono font-semibold text-purple-400">Browse Content</span>
              <ArrowRight size={20} />
            </Link>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-20 border-t border-gray-700/50 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2">
            <Play className="text-purple-400" size={16} />
            <span className="font-mono text-gray-500">Quick courses, real results.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}