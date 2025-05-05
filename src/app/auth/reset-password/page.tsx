'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Layout from '@/components/Layout'
import Link from 'next/link'

// Component that uses searchParams
function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Invalid reset link')
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      setStatus('error')
      setMessage('Passwords do not match')
      return
    }

    setStatus('loading')

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password: formData.password
        })
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage('Password reset successful. Redirecting to login...')
        setTimeout(() => router.push('/auth/login'), 2000)
      } else {
        setStatus('error')
        setMessage(data.error)
      }
    } catch (error) {
      setStatus('error')
      setMessage('An error occurred. Please try again.')
    }
  }

  return (
    <div className="bg-gray-800 rounded-2xl p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">
          Create new password
        </h1>
        <p className="text-gray-400">
          Enter your new password below
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label 
            htmlFor="password" 
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            New Password
          </label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20"
            required
            disabled={status === 'loading' || !token}
            minLength={8}
          />
        </div>

        <div>
          <label 
            htmlFor="confirmPassword" 
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20"
            required
            disabled={status === 'loading' || !token}
            minLength={8}
          />
        </div>

        {message && (
          <div className={`p-4 rounded-lg ${
            status === 'success' ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'
          }`}>
            {message}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-white text-gray-900 py-2 px-4 rounded-full hover:bg-gray-100 transition-colors font-medium disabled:opacity-50"
          disabled={status === 'loading' || !token}
        >
          {status === 'loading' ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-gray-400">
        Remember your password?{' '}
        <Link href="/auth/login" className="text-white hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}

// Loading fallback
function LoadingFallback() {
  return (
    <div className="bg-gray-800 rounded-2xl p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">
          Create new password
        </h1>
        <p className="text-gray-400">
          Loading...
        </p>
      </div>
      <div className="flex justify-center py-6">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
      </div>
    </div>
  )
}

export default function ResetPassword() {
  return (
    <Layout>
      <main className="min-h-screen bg-gray-900 pt-32">
        <div className="max-w-md mx-auto px-6">
          <Suspense fallback={<LoadingFallback />}>
            <ResetPasswordContent />
          </Suspense>
        </div>
      </main>
    </Layout>
  )
} 