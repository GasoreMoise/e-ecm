'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Layout from '@/components/Layout'
import { clientAuth } from '@/lib/auth'

export default function Login() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [isDevelopment, setIsDevelopment] = useState(false)

  // Check if we're in development mode
  useEffect(() => {
    setIsDevelopment(process.env.NODE_ENV === 'development');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      // Determine which endpoint to use based on environment
      const loginEndpoint = isDevelopment ? '/api/auth/mock-login' : '/api/auth/login';
      console.log(`Using ${isDevelopment ? 'mock' : 'real'} login endpoint:`, loginEndpoint);

      const response = await fetch(loginEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        // Store the JWT token
        if (data.token) {
          console.log('Storing authentication token')
          clientAuth.saveToken(data.token)
        }
        
        // Redirect based on user type
        if (data.userType === 'BUYER') {
          router.push('/dashboard/buyer')
        } else if (data.userType === 'SUPPLIER') {
          router.push('/dashboard/supplier')
        } else {
          router.push('/dashboard')
        }
      } else {
        setStatus('error')
        setErrorMessage(data.error || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error);
      setStatus('error')
      setErrorMessage('An error occurred. Please try again.')
    }
  }

  return (
    <Layout>
      <main className="min-h-screen bg-gray-900 pt-32">
        <div className="max-w-md mx-auto px-6">
          {/* Login Form Card */}
          <div className="bg-gray-800 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
              <p className="text-gray-400">
                Sign in to your account to continue
              </p>
              {isDevelopment && (
                <div className="mt-2 py-1 px-2 bg-purple-900/50 rounded text-purple-300 text-xs">
                  Development Mode: Mock authentication enabled
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="p-4 bg-red-900/50 text-red-300 rounded-lg">
                  {errorMessage}
                </div>
              )}

              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                  required
                  disabled={status === 'loading'}
                  placeholder={isDevelopment ? "Any email works in dev mode" : ""}
                />
              </div>

              <div>
                <label 
                  htmlFor="password" 
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                  required
                  disabled={status === 'loading'}
                  placeholder={isDevelopment ? "Any password works in dev mode" : ""}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={formData.remember}
                    onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-white focus:ring-white/20"
                    disabled={status === 'loading'}
                  />
                  <label 
                    htmlFor="remember" 
                    className="ml-2 block text-sm text-gray-300"
                  >
                    Remember me
                  </label>
                </div>

                <Link 
                  href="/auth/forgot-password"
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full bg-white text-gray-900 py-2 px-4 rounded-full hover:bg-gray-100 transition-colors font-medium disabled:opacity-50"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            {/* Social Login Options */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-800 text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className="w-full px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:border-gray-400 transition-colors flex items-center justify-center space-x-2"
                  disabled={status === 'loading'}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  className="w-full px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:border-gray-400 transition-colors flex items-center justify-center space-x-2"
                  disabled={status === 'loading'}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13.397,20.997v-8.196h2.765l0.411-3.209h-3.176V7.548c0-0.926,0.258-1.56,1.587-1.56h1.684V3.127C15.849,3.039,15.025,2.997,14.201,3c-2.444,0-4.122,1.492-4.122,4.231v2.355H7.332v3.209h2.753v8.202H13.397z"/>
                  </svg>
                  <span>Facebook</span>
                </button>
              </div>
            </div>

            {/* Sign Up Link */}
            <p className="mt-8 text-center text-sm text-gray-400">
              Don't have an account?{' '}
              <Link 
                href="/auth/register"
                className="text-white hover:underline"
              >
                Sign up now
              </Link>
            </p>
          </div>
        </div>
      </main>
    </Layout>
  )
} 