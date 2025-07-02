"use client"

import { useEffect, useState } from "react"
import { Terminal, Home, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  const [text, setText] = useState("")
  const [showCursor, setShowCursor] = useState(true)

  const targetText = "404"

  // Simple typing animation for 404
  useEffect(() => {
    if (text.length < targetText.length) {
      const timer = setTimeout(() => {
        setText(targetText.substring(0, text.length + 1))
      }, 150)
      return () => clearTimeout(timer)
    }
  }, [text, targetText])

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
      <nav className="absolute top-6 right-6 z-30">
        <div className="flex space-x-8">
          <a
            href="/content"
            className="font-mono text-lg text-gray-300 hover:text-green-400 transition-all duration-300 transform hover:scale-105"
          >
            Content
          </a>
          <a
            href="/courses"
            className="font-mono text-lg text-gray-300 hover:text-green-400 transition-all duration-300 transform hover:scale-105"
          >
            Courses
          </a>
        </div>
      </nav>

      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23059669&quot; fill-opacity=&quot;0.03&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;1&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] pointer-events-none animate-pulse-slow"></div>

      {/* Main Content */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-4xl mx-auto">

          {/* 404 Display */}
          <div className="relative mb-12">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-red-300 to-red-500">
              {text}
              <span
                className={`${showCursor ? "opacity-100" : "opacity-0"} transition-opacity duration-100 text-red-400`}
              >
                |
              </span>
            </h1>
          </div>

          {/* Error Message */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-mono font-bold text-white mb-4 animate-fade-in-up">
              Page Not Found
            </h2>
            <p className="text-lg md:text-xl font-mono text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in-up-delay">
              Looks like this page decided to{" "}
              <span className="text-green-400 font-semibold">git checkout</span>{" "}
              to another branch.
            </p>
          </div>

          {/* Navigation Options */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link
              href="/"
              className="group flex items-center space-x-3 bg-green-600/20 hover:bg-green-600/30 border border-green-500/50 hover:border-green-400 rounded-lg px-8 py-4 transition-all duration-300 transform hover:scale-105"
            >
              <Home className="text-green-400 group-hover:text-green-300" size={20} />
              <span className="font-mono text-green-400 group-hover:text-green-300 font-semibold">
                Back to Home
              </span>
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="group flex items-center space-x-3 bg-gray-700/30 hover:bg-gray-700/50 border border-gray-600/50 hover:border-gray-500 rounded-lg px-8 py-4 transition-all duration-300 transform hover:scale-105"
            >
              <ArrowLeft className="text-gray-400 group-hover:text-gray-300" size={20} />
              <span className="font-mono text-gray-400 group-hover:text-gray-300 font-semibold">
                Go Back
              </span>
            </button>
          </div>

          {/* Fun Code Snippet */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 max-w-2xl mx-auto animate-fade-in-up-delay-2">
            <pre className="font-mono text-sm text-gray-300 text-left overflow-x-auto">
              <code>
{`function findPage(url) {
  if (url === "/404") {
    return "You found it! 🎉";
  }
  throw new Error("404: Page not found");
}`}
              </code>
            </pre>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-6 left-0 right-0 text-center z-20">
        <div className="flex items-center justify-center space-x-2 animate-fade-in-delay">
          <Terminal className="text-green-400" size={16} />
          <span className="font-mono text-gray-500">404 - but still powered by devs, for devs.</span>
        </div>
      </footer>
    </div>
  )
}