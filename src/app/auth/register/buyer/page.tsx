'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Layout from '@/components/Layout'

export default function BuyerRegistration() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [formData, setFormData] = useState({
    // Business Information
    businessName: '',
    businessType: '',
    registrationNumber: '',
    website: '',
    
    // Contact Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Address
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    
    // Account Setup
    password: '',
    confirmPassword: '',
    terms: false
  })

  const validateStep = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        return formData.businessName && formData.businessType && formData.registrationNumber
      case 2:
        return formData.firstName && formData.lastName && formData.email && formData.phone
      case 3:
        return (
          formData.password &&
          formData.confirmPassword &&
          formData.password === formData.confirmPassword &&
          formData.terms
        )
      default:
        return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted', formData)
    
    if (!validateStep(step)) {
      setStatus('error')
      setErrorMessage('Please fill in all required fields')
      return
    }

    if (step < 3) {
      setStep(step + 1)
      setStatus('idle')
      setErrorMessage('')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setStatus('error')
      setErrorMessage('Passwords do not match')
      return
    }

    setStatus('loading')
    setErrorMessage('')

    try {
      console.log('Sending registration request')
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          type: 'BUYER',
          confirmPassword: undefined
        })
      })

      const data = await response.json()
      console.log('Registration response:', data)

      if (response.ok) {
        router.push(`/auth/registration-success?email=${encodeURIComponent(formData.email)}`)
      } else {
        setStatus('error')
        setErrorMessage(data.error || 'Registration failed')
      }
    } catch (error) {
      console.error('Registration error:', error)
      setStatus('error')
      setErrorMessage('An error occurred. Please try again.')
    }
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((number) => (
        <div key={number} className="flex items-center">
          <div className={`
            w-8 h-8 rounded-full flex items-center justify-center
            ${step >= number ? 'bg-white text-gray-900' : 'bg-gray-700 text-gray-400'}
          `}>
            {number}
          </div>
          {number < 3 && (
            <div className={`w-12 h-0.5 ${step > number ? 'bg-white' : 'bg-gray-700'}`} />
          )}
        </div>
      ))}
    </div>
  )

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <label htmlFor="businessName" className="block text-sm font-medium text-gray-300 mb-2">
          Business Name
        </label>
        <input
          type="text"
          id="businessName"
          value={formData.businessName}
          onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20"
          required
        />
      </div>

      <div>
        <label htmlFor="businessType" className="block text-sm font-medium text-gray-300 mb-2">
          Business Type
        </label>
        <select
          id="businessType"
          value={formData.businessType}
          onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20"
          required
        >
          <option value="">Select business type</option>
          <option value="optical_store">Optical Store</option>
          <option value="clinic">Eye Clinic</option>
          <option value="hospital">Hospital</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-300 mb-2">
          Business Registration Number
        </label>
        <input
          type="text"
          id="registrationNumber"
          value={formData.registrationNumber}
          onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20"
          required
        />
      </div>

      <div>
        <label htmlFor="website" className="block text-sm font-medium text-gray-300 mb-2">
          Website (Optional)
        </label>
        <input
          type="url"
          id="website"
          value={formData.website}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20"
        />
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20"
            required
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20"
          required
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20"
          required
        />
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20"
          required
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
          Confirm Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20"
          required
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="terms"
          checked={formData.terms}
          onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
          className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-white focus:ring-white/20"
          required
        />
        <label htmlFor="terms" className="ml-2 block text-sm text-gray-300">
          I agree to the{' '}
          <Link href="/terms" className="text-white hover:underline">
            Terms of Service
          </Link>
          {' '}and{' '}
          <Link href="/privacy" className="text-white hover:underline">
            Privacy Policy
          </Link>
        </label>
      </div>
    </div>
  )

  return (
    <Layout>
      <main className="min-h-screen bg-gray-900 pt-32">
        <div className="max-w-md mx-auto px-6">
          <div className="bg-gray-800 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">
                Register as a Buyer
              </h1>
              <p className="text-gray-400">
                {step === 1 && 'Tell us about your business'}
                {step === 2 && 'Your contact information'}
                {step === 3 && 'Set up your account'}
              </p>
            </div>

            {renderStepIndicator()}

            {errorMessage && (
              <div className="mb-6 p-4 bg-red-900/50 text-red-300 rounded-lg">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}

              <div className="mt-8 flex justify-between">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      setStep(step - 1)
                      setStatus('idle')
                      setErrorMessage('')
                    }}
                    className="px-6 py-2 border border-gray-600 rounded-full text-gray-300 hover:border-gray-400 transition-colors"
                    disabled={status === 'loading'}
                  >
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  className="px-6 py-2 bg-white text-gray-900 rounded-full hover:bg-gray-100 transition-colors ml-auto disabled:opacity-50"
                  disabled={status === 'loading'}
                  onClick={() => console.log('Button clicked')}
                >
                  {status === 'loading' 
                    ? 'Processing...' 
                    : step === 3 
                      ? 'Create Account' 
                      : 'Next'
                  }
                </button>
              </div>
            </form>

            <p className="mt-8 text-center text-sm text-gray-400">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-white hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </Layout>
  )
} 