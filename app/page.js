"use client"

import { useEffect, useState } from "react"
import { Github, Linkedin, Terminal, Code2, Zap, ArrowRight } from "lucide-react"

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
            <SocialIcon href="https://www.linkedin.com/in/akm-glhf"  icon={<Linkedin size={36} />} label="LinkedIn" />
          </div>

          {/* Status Indicator */}
          
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

// Enhanced Code Rain Component
function CodeRain() {
  const [drops, setDrops] = useState([])

  useEffect(() => {
    const codeSnippets = [
      "const",
      "function",
      "=>",
      "{}",
      "[]",
      "()",
      "if",
      "else",
      "for",
      "while",
      "return",
      "import",
      "export",
      "class",
      "async",
      "await",
      "try",
      "catch",
      "console.log",
      "useState",
      "useEffect",
      "map",
      "filter",
      "reduce",
      "01010",
      "null",
      "undefined",
      "true",
      "false",
      "&&",
      "||",
      "===",
      "git",
      "npm",
      "yarn",
      "node",
      "react",
      "next",
      "js",
      "ts",
      "css",
      "html",
      "api",
      "json",
      "http",
      "dev",
      // Python
      "def",
      "print()",
      "range()",
      "len()",
      "lambda",
      "self",
      "__init__",
      "pip",
      "numpy",
      "pandas",
      "import *",
      "elif",
      // C++
      "#include",
      "std::",
      "cout",
      "cin",
      "int main()",
      "vector",
      "string",
      "new",
      "delete",
      "nullptr",
      "using namespace",
      // Java
      "public",
      "private",
      "static",
      "void",
      "String",
      "System.out",
      "ArrayList",
      "extends",
      "implements",
      "throws",
      "final",
      // General programming
      "malloc",
      "free",
      "sizeof",
      "struct",
      "typedef",
      "enum",
      "switch",
      "case",
      "break",
      "continue",
    ]

    const newDrops = []

    for (let i = 0; i < 100; i++) {
      newDrops.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        text: codeSnippets[Math.floor(Math.random() * codeSnippets.length)],
        speed: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.6 + 0.1,
        size: Math.random() * 0.4 + 0.6,
      })
    }

    setDrops(newDrops)

    const interval = setInterval(() => {
      setDrops((prevDrops) =>
        prevDrops.map((drop) => ({
          ...drop,
          y: drop.y > 105 ? -10 : drop.y + drop.speed,
          text: Math.random() > 0.992 ? codeSnippets[Math.floor(Math.random() * codeSnippets.length)] : drop.text,
        })),
      )
    }, 80)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {drops.map((drop) => (
        <div
          key={drop.id}
          className="absolute font-mono text-green-400/60 select-none transition-all duration-300"
          style={{
            left: `${drop.x}%`,
            top: `${drop.y}%`,
            opacity: drop.opacity,
            fontSize: `${drop.size}rem`,
            transform: "translateX(-50%)",
          }}
        >
          {drop.text}
        </div>
      ))}
    </div>
  )
}

// Floating Code Elements
function FloatingElements() {
  const elements = [
    "{ }",
    "< />",
    "( )",
    "[ ]",
    "=>",
    "&&",
    "||",
    "!==",
    "++",
    "--",
    "??",
    "?:",
    "...",
    "/**/",
    "//",
    "#",
  ]

  return (
    <div className="absolute inset-0 pointer-events-none">
      {elements.map((element, index) => (
        <div
          key={index}
          className="absolute text-green-400/15 font-mono text-xl md:text-3xl animate-float-random"
          style={{
            left: `${Math.random() * 90 + 5}%`,
            top: `${Math.random() * 90 + 5}%`,
            animationDelay: `${index * 0.8}s`,
            animationDuration: `${6 + Math.random() * 4}s`,
          }}
        >
          {element}
        </div>
      ))}
    </div>
  )
}

// Feature Card Component
function FeatureCard({ icon, title, description, delay }) {
  return (
    <div
      className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8 transition-all duration-500 animate-slide-up-stagger"
      style={{ animationDelay: delay }}
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 p-3 bg-gray-700/50 rounded-lg">{icon}</div>
        <h3 className="font-mono text-xl font-semibold mb-3 text-white">{title}</h3>
        <p className="text-gray-400 font-mono text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

// Social Icon Component
function SocialIcon({ href, icon, label }) {
  return (
    <a
      href={href}
      className="text-gray-400 hover:text-green-400 transition-all duration-300 transform hover:scale-110 p-2"
      aria-label={label}
    >
      {icon}
    </a>
  )
}
