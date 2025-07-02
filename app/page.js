"use client"

import ComingSoon from '@/components/ComingSoon'

export default function HomePage() {
  
  return <>
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
      <ComingSoon />
    </div>
  </>
}
