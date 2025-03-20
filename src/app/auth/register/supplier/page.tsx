'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Layout from '@/components/Layout'

export default function SupplierRegistration() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [formData, setFormData] = useState({
    // Company Information
    companyName: '',
    companyType: '',
    registrationNumber: '',
    taxId: '',
    website: '',
    yearEstablished: '',
    
    // Business Details
    businessCategory: '',
    productCategories: [] as string[],
    manufacturingLocations: '',
    annualRevenue: '',
    
    // Contact Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    
    // Account Setup
    password: '',
    confirmPassword: '',
    terms: false
  })

  const validateStep = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        return (
          formData.companyName &&
          formData.companyType &&
          formData.registrationNumber &&
          formData.taxId
        )
      case 2:
        return (
          formData.businessCategory &&
          formData.productCategories.length > 0 &&
          formData.manufacturingLocations
        )
      case 3:
        return (
          formData.firstName &&
          formData.lastName &&
          formData.email &&
          formData.phone &&
          formData.position &&
          formData.password &&
          formData.confirmPassword &&
          formData.password === formData.confirmPassword &&
          formData.terms
        )
      default:
        return false
    }
  }

  const handleProductCategoryChange = (category: string) => {
    setFormData(prev => ({
      ...prev,
      productCategories: prev.productCategories.includes(category)
        ? prev.productCategories.filter(c => c !== category)
        : [...prev.productCategories, category]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
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
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          type: 'supplier',
          confirmPassword: undefined // Remove confirmPassword before sending
        })
      })

      const data = await response.json()

      if (response.ok) {
        // Show success message and redirect to verification page
        router.push('/auth/registration-success')
      } else {
        setStatus('error')
        setErrorMessage(data.error || 'Registration failed')
      }
    } catch (error) {
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
        <label htmlFor="companyName" className="block text-sm font-medium text-gray-300 mb-2">
          Company Name *
        </label>
        <input
          type="text"
          id="companyName"
          value={formData.companyName}
          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20"
          required
          disabled={status === 'loading'}
        />
      </div>

      <div>
        <label htmlFor="companyType" className="block text-sm font-medium text-gray-300 mb-2">
          Company Type *
        </label>
        <select
          id="companyType"
          value={formData.companyType}
          onChange={(e) => setFormData({ ...formData, companyType: e.target.value })}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20"
          required
          disabled={status === 'loading'}
        >
          <option value="">Select company type</option>
          <option value="manufacturer">Manufacturer</option>
          <option value="wholesaler">Wholesaler</option>
          <option value="distributor">Distributor</option>
          <option value="brand">Brand Owner</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-300 mb-2">
            Registration Number
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
          <label htmlFor="taxId" className="block text-sm font-medium text-gray-300 mb-2">
            Tax ID
          </label>
          <input
            type="text"
            id="taxId"
            value={formData.taxId}
            onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="website" className="block text-sm font-medium text-gray-300 mb-2">
          Company Website
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
      <div>
        <label htmlFor="businessCategory" className="block text-sm font-medium text-gray-300 mb-2">
          Business Category *
        </label>
        <select
          id="businessCategory"
          value={formData.businessCategory}
          onChange={(e) => setFormData({ ...formData, businessCategory: e.target.value })}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20"
          required
          disabled={status === 'loading'}
        >
          <option value="">Select category</option>
          <option value="eyewear">Eyewear</option>
          <option value="lenses">Lenses</option>
          <option value="accessories">Accessories</option>
          <option value="equipment">Equipment</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Product Categories *
        </label>
        <div className="space-y-2">
          {['Prescription Frames', 'Sunglasses', 'Contact Lenses', 'Reading Glasses'].map((category) => (
            <label key={category} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.productCategories.includes(category)}
                onChange={() => handleProductCategoryChange(category)}
                className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-white focus:ring-white/20"
                disabled={status === 'loading'}
              />
              <span className="ml-2 text-gray-300">{category}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="manufacturingLocations" className="block text-sm font-medium text-gray-300 mb-2">
          Manufacturing Locations
        </label>
        <input
          type="text"
          id="manufacturingLocations"
          value={formData.manufacturingLocations}
          onChange={(e) => setFormData({ ...formData, manufacturingLocations: e.target.value })}
          placeholder="e.g., USA, China, Italy"
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20"
        />
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20"
            required
            disabled={status === 'loading'}
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
        <label htmlFor="position" className="block text-sm font-medium text-gray-300 mb-2">
          Position in Company
        </label>
        <input
          type="text"
          id="position"
          value={formData.position}
          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
          Business Email
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
          Business Phone
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

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
          Password *
        </label>
        <input
          type="password"
          id="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20"
          required
          disabled={status === 'loading'}
          minLength={8}
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
          disabled={status === 'loading'}
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
                Register as a Supplier
              </h1>
              <p className="text-gray-400">
                {step === 1 && 'Company Information'}
                {step === 2 && 'Business Details'}
                {step === 3 && 'Contact Information'}
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