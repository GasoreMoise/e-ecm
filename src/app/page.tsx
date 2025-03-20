import Image from 'next/image'
import Link from 'next/link'
import Layout from '@/components/Layout'
import photo1 from '../../public/eyewear.jpg.jpg'

export default function Home() {
  return (
    <Layout>
      <main className="min-h-screen bg-gray-900">
        {/* Hero Section */}
        <section className="relative h-[60vh]">
          {/* Background Image */}
          <Image 
            src={photo1} 
            alt="Person wearing stylish eyewear" 
            fill
            priority
            className="object-cover object-center brightness-150 contrast-100"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-gray-900/70 to-gray-900"></div>
        </section>

        {/* Content Section */}
        <section className="w-full max-w-4xl mx-auto px-6 -mt-20 relative z-10 pb-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white">
              A personalized optical products shopping experience
            </h1>
            
            <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              Connecting optical pharmacists with optometrists- Smarter Outsourcing, Faster Fullfilment
            </p>
            
            <div className="flex flex-col items-center space-y-4">
              <Link 
                href="/auth/register" 
                className="bg-white text-gray-900 px-8 py-3 rounded-full hover:bg-gray-100 transition-colors w-48 text-center font-medium"
              >
                Get Started
              </Link>
              
            </div>
          </div>
        </section>
      </main>
    </Layout>
  )
}