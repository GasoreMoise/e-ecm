import Layout from '@/components/Layout'
import Link from 'next/link'

export default function RegisterChoice() {
  return (
    <Layout>
      <main className="min-h-screen bg-gray-900 pt-32">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Join Optical Eyewear
            </h1>
            <p className="text-gray-300 text-lg md:text-xl">
              Choose how you want to participate in our marketplace
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Buyer Card */}
            <div className="bg-gray-800 rounded-2xl p-8 hover:bg-gray-800/80 transition-colors">
              <div className="mb-6">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">Register as Buyer</h2>
                <p className="text-gray-300 mb-6">
                  For optical stores, clinics, and healthcare facilities looking to purchase eyewear products
                </p>
                <ul className="space-y-3 text-gray-300 mb-8">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Access to wholesale pricing
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Direct ordering system
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Inventory management tools
                  </li>
                </ul>
              </div>
              <Link 
                href="/auth/register/buyer"
                className="block w-full text-center px-6 py-3 bg-white text-gray-900 rounded-full hover:bg-gray-100 transition-colors font-medium"
              >
                Register as Buyer
              </Link>
            </div>

            {/* Supplier Card */}
            <div className="bg-gray-800 rounded-2xl p-8 hover:bg-gray-800/80 transition-colors">
              <div className="mb-6">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">Register as Supplier</h2>
                <p className="text-gray-300 mb-6">
                  For manufacturers, wholesalers, and brands looking to sell eyewear products
                </p>
                <ul className="space-y-3 text-gray-300 mb-8">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Reach verified buyers
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Streamlined order management
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Analytics and reporting
                  </li>
                </ul>
              </div>
              <Link 
                href="/auth/register/supplier"
                className="block w-full text-center px-6 py-3 bg-white text-gray-900 rounded-full hover:bg-gray-100 transition-colors font-medium"
              >
                Register as Supplier
              </Link>
            </div>
          </div>

          <p className="text-center mt-8 text-gray-400">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-white hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </Layout>
  )
} 