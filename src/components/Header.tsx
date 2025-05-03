'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/10 backdrop-blur-sm' : ''
    }`}>
      <div className="relative z-10 px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src="/logo.jpg"
            alt="E-ECM Logo"
            width={32}
            height={32}
            className="rounded-full"
          />
          <Link href="/" className="ml-2 font-medium text-white hover:text-white/90 transition-colors">
            E-ECM
          </Link>
        </div>
        
        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/about" className="text-white hover:text-white transition-colors">
            About us
          </Link>
          <Link href="/docs" className="text-white hover:text-white transition-colors">
            Documentation
          </Link>
          <Link href="/pricing" className="text-white hover:text-white transition-colors">
            Pricing
          </Link>
          <Link href="/contact" className="text-white hover:text-white transition-colors">
            Contact
          </Link>
        </nav>
        
        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link 
            href="/auth/login" 
            className="px-6 py-2 rounded-full text-white border border-white/30 hover:bg-white/10 transition-colors"
          >
            Login
          </Link>
          <Link 
            href="/auth/register" 
            className="px-6 py-2 rounded-full text-gray-900 bg-white/90 hover:bg-white transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  )
}