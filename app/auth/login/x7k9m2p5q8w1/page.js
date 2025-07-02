"use client"

import { signIn, useSession } from "next-auth/react"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Github, Terminal, Lock, ArrowRight, AlertCircle } from "lucide-react"

function LoginContent() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // If already authenticated, redirect to content
    if (status === 'authenticated' && session) {
      router.replace('/content')
      return
    }

    // Check for auth errors
    const errorParam = searchParams.get('error')
    if (errorParam) {
      setError(errorParam)
    }
  }, [session, status, router, searchParams])

  const handleGitHubSignIn = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Use signIn with explicit redirect: false to prevent redirect loops
      const result = await signIn('github', { 
        redirect: false
      })
      
      if (result?.error) {
        setError(result.error)
        setLoading(false)
      } else if (result?.ok) {
        // Successful sign in, redirect manually
        router.push('/content')
      }
    } catch (error) {
      console.error('Sign in error:', error)
      setError('An unexpected error occurred during sign in')
      setLoading(false)
    }
  }

  // Show loading while checking session
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="font-mono text-gray-400">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // If authenticated, show redirecting message
  if (status === 'authenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="font-mono text-gray-400">Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white relative overflow-hidden">
      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23059669&quot; fill-opacity=&quot;0.03&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;1&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] pointer-events-none animate-pulse-slow"></div>

      {/* Main Content */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-md mx-auto">

          {/* Lock Icon */}
          <div className="mb-8">
            <div className="mx-auto w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
              <Lock className="text-green-400" size={36} />
            </div>
            <h1 className="text-3xl md:text-4xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-300 to-green-500 mb-2">
              Access Required
            </h1>
            <p className="text-gray-400 font-mono text-sm">
              Sign in to manage content on IGAP.club
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-600/20 border border-red-500/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="text-red-400" size={20} />
                <p className="text-red-400 font-mono text-sm">
                  {error === 'OAuthSignin' ? 'Error with GitHub OAuth configuration' :
                   error === 'OAuthCallback' ? 'Error during GitHub callback' :
                   error === 'OAuthCreateAccount' ? 'Could not create account' :
                   error === 'EmailCreateAccount' ? 'Could not create account' :
                   error === 'Callback' ? 'Error in callback' :
                   error === 'OAuthAccountNotLinked' ? 'Account not linked' :
                   error === 'EmailSignin' ? 'Check your email for sign in link' :
                   error === 'CredentialsSignin' ? 'Invalid credentials' :
                   error === 'SessionRequired' ? 'Please sign in to access this page' :
                   'Authentication error occurred'}
                </p>
              </div>
            </div>
          )}

          {/* GitHub Sign In */}
          <div className="space-y-4">
            <button
              onClick={handleGitHubSignIn}
              disabled={loading}
              className="group w-full flex items-center justify-center space-x-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 hover:border-green-500/50 rounded-xl px-6 py-4 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Github className="text-white group-hover:text-green-400 transition-colors" size={24} />
              <span className="font-mono font-semibold text-white group-hover:text-green-400 transition-colors">
                {loading ? 'Signing in...' : 'Continue with GitHub'}
              </span>
              {!loading && <ArrowRight className="text-gray-400 group-hover:text-green-400 transition-colors" size={20} />}
              {loading && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-400"></div>}
            </button>

            {/* Info */}
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Terminal className="text-green-400 mt-1" size={16} />
                <div className="text-left">
                  <p className="text-gray-300 font-mono text-sm leading-relaxed">
                    Only authorized developers can create and manage content. 
                    Your GitHub username will be used as your author name.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Back to Content */}
          <div className="mt-8">
            <a
              href="/content"
              className="inline-flex items-center space-x-2 text-gray-400 hover:text-green-400 font-mono text-sm transition-colors"
            >
              <span>← Back to Content</span>
            </a>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-6 left-0 right-0 text-center z-20">
        <div className="flex items-center justify-center space-x-2">
          <Terminal className="text-green-400" size={16} />
          <span className="font-mono text-gray-500">Secured by NextAuth.js</span>
        </div>
      </footer>
    </div>
  )
}

export default function SecretLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="font-mono text-gray-400">Loading...</p>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}