'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Layout from '@/components/Layout'

export default function RegistrationSuccess() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const [countdown, setCountdown] = useState(60)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleResendEmail = async () => {
    if (countdown > 0) return

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      if (response.ok) {
        setCountdown(60)
      }
    } catch (error) {
      console.error('Failed to resend verification email:', error)
    }
  }

  return (
    <Layout>
      <main className="min-h-screen bg-gray-900 pt-32">
        <div className="max-w-md mx-auto px-6">
          <div className="bg-gray-800 rounded-2xl p-8">
            <div className="text-center">
              {/* Success Icon */}
              <div className="mx-auto w-16 h-16 bg-green-900/50 rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h1 className="text-2xl font-bold text-white mb-4">
                Registration Successful!
              </h1>

              <div className="space-y-4 text-gray-300">
                <p>
                  Thank you for registering with Optical Eyewear. We've sent a verification 
                  email to{' '}
                  <span className="text-white font-medium">
                    {email || 'your email address'}
                  </span>
                </p>

                <p>
                  Please check your inbox and click the verification link to activate 
                  your account. The link will expire in 24 hours.
                </p>

                <div className="bg-gray-900/50 p-4 rounded-lg mt-6">
                  <p className="text-sm">
                    Didn't receive the email? Check your spam folder or{' '}
                    <button
                      onClick={handleResendEmail}
                      className={`text-white underline focus:outline-none ${
                        countdown > 0 ? 'opacity-50 cursor-not-allowed' : 'hover:text-gray-200'
                      }`}
                      disabled={countdown > 0}
                    >
                      click here to resend
                    </button>
                    {countdown > 0 && (
                      <span className="text-gray-400">
                        {' '}
                        ({countdown}s)
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <Link
                  href="/auth/login"
                  className="block w-full px-6 py-2 bg-white text-gray-900 rounded-full hover:bg-gray-100 transition-colors text-center font-medium"
                >
                  Go to Login
                </Link>

                <Link
                  href="/"
                  className="block w-full px-6 py-2 border border-gray-600 text-gray-300 rounded-full hover:border-gray-400 transition-colors text-center"
                >
                  Return to Home
                </Link>
              </div>

              <p className="mt-8 text-sm text-gray-400">
                Need help?{' '}
                <Link href="/contact" className="text-white hover:underline">
                  Contact Support
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  )
} 