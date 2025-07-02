"use client"

import { useEffect, useState } from "react"
import { Github, Linkedin, Terminal, Code2, Zap, ArrowRight } from "lucide-react"
import CodeRain from './CodeRain'
import FloatingElements from './FloatingElements'
import FeatureCard from './FeatureCard'
import SocialIcon from './SocialIcon'

export default function ComingSoon() {
  const [text, setText] = useState("")
  const [showCursor, setShowCursor] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const targetText = "IGAP.club"

  // Simplified typing animation for IGAP.club only
  useEffect(() => {
    if (isPaused) {
      const pauseTimer = setTimeout(() => {
        setIsPaused(false)
        setIsDeleting(true)
      }, 3000)
      return () => clearTimeout(pauseTimer)
    }

    const timer = setTimeout(
      () => {
        if (!isDeleting && text === targetText) {
          setIsPaused(true)
        } else if (isDeleting && text === "") {
          setIsDeleting(false)
        } else if (isDeleting) {
          setText(targetText.substring(0, text.length - 1))
        } else {
          setText(targetText.substring(0, text.length + 1))
        }
      },
      isDeleting ? 80 : 120,
    )

    return () => clearTimeout(timer)
  }, [text, isDeleting, isPaused, targetText])

  // Cursor blinking effect
  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)
    return () => clearInterval(cursorTimer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white relative overflow-hidden">
      {/* Enhanced Code Rain Background */}
      <CodeRain />

      {/* Floating Code Snippets */}
      <FloatingElements />

      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23059669&quot; fill-opacity=&quot;0.03&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;1&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] pointer-events-none animate-pulse-slow"></div>

      {/* Main Content */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-6xl mx-auto">

          {/* Main Headline - Clean without shadow */}
          <div className="relative mb-16">
            <h1 className="text-5xl md:text-7xl lg:text-9xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-300 to-green-500">
              {text}
              <span
                className={`${showCursor ? "opacity-100" : "opacity-0"} transition-opacity duration-100 text-green-400`}
              >
                |
              </span>
            </h1>
          </div>

          {/* Hero Statement */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-mono font-bold text-white mb-6 animate-fade-in-up">
              I&apos;m Good At Programming
            </h2>
            <div className="flex items-center justify-center space-x-4 text-xl md:text-2xl text-gray-300 font-mono animate-fade-in-up-delay">
              <span>Put your code where your mouth is</span>
              <ArrowRight className="text-green-400 animate-pulse" size={24} />
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-5xl mx-auto">
            <FeatureCard
              icon={<Code2 className="text-green-400" size={28} />}
              title="Peer Recognition"
              description="Show what you know, earn the respect you deserve"
              delay="0s"
            />
            <FeatureCard
              icon={<Zap className="text-yellow-400" size={28} />}
              title="Proven Pros"
              description="Learn from developers who've been there, done that"
              delay="0.3s"
            />
            <FeatureCard
              icon={<Terminal className="text-blue-400" size={28} />}
              title="Real Solutions"
              description="No theory, just battle-tested code tricks"
              delay="0.6s"
            />
          </div>

          {/* Call to Action */}
          <div className="mb-12">
            <p className="text-lg md:text-xl font-mono text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in-up-delay-2">
              A place for proven pros to showcase their best tricks — launching soon.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex justify-center space-x-12 mb-16">
            <SocialIcon href="https://www.github.com/akm-xdd" icon={<Github size={36} />} label="GitHub" />
            <SocialIcon href="https://www.linkedin.com/in/akm-glhf" icon={<Linkedin size={36} />} label="LinkedIn" />
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-6 left-0 right-0 text-center z-20">
        <div className="flex items-center justify-center space-x-2 animate-fade-in-delay">
          <Terminal className="text-green-400" size={16} />
          <span className="font-mono text-gray-500">Powered by devs, for devs.</span>
        </div>
      </footer>
    </div>
  )
}