'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Bars3Icon as MenuIcon,
  XMarkIcon as XIcon,
  ChartBarIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  Cog6ToothIcon as CogIcon,
  ArrowRightOnRectangleIcon as LogoutIcon,
  HeartIcon,
  EnvelopeIcon as MailIcon,
  CalendarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'
import Image from 'next/image'

export default function BuyerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
      })

      if (response.ok) {
        // Clear any client-side state/storage
        localStorage.clear()
        sessionStorage.clear()
        
        // Force a complete page refresh to the login page
        window.location.replace('/auth/login')
      } else {
        console.error('Logout failed:', await response.text())
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className={`${
        sidebarOpen ? 'w-64' : 'w-20'
      } bg-gradient-to-b from-gray-900 to-gray-800 transition-all duration-300 ease-in-out`}>
        <div className="flex items-center p-4">
          <Image
            src="/logo.jpg"
            alt="E-ECM Logo"
            width={32}
            height={32}
            className="rounded-full"
          />
          {sidebarOpen && (
            <span className="ml-3 text-white text-lg font-semibold">E-ECM</span>
          )}
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700"
        >
          {sidebarOpen ? (
            <XIcon className="h-6 w-6 text-white" />
          ) : (
            <MenuIcon className="h-6 w-6 text-white" />
          )}
        </button>

        <nav className="mt-8">
          <div className="px-4 space-y-2">
            {[
              { name: 'Dashboard', icon: ChartBarIcon, href: '/dashboard/buyer' },
              { name: 'Orders', icon: ShoppingBagIcon, href: '/dashboard/buyer/orders' },
              { name: 'Saved Items', icon: HeartIcon, href: '/dashboard/buyer/saved' },
              { name: 'Messages', icon: MailIcon, href: '/dashboard/buyer/messages' },
              { name: 'Calendar', icon: CalendarIcon, href: '/dashboard/buyer/calendar' },
              { name: 'Documents', icon: DocumentTextIcon, href: '/dashboard/buyer/documents' },
              { name: 'Profile', icon: UserCircleIcon, href: '/dashboard/buyer/profile' },
              { name: 'Settings', icon: CogIcon, href: '/dashboard/buyer/settings' },
            ].map((item) => (
              <button
                key={item.name}
                className={`flex items-center w-full p-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors ${
                  !sidebarOpen && 'justify-center'
                }`}
                onClick={() => router.push(item.href)}
              >
                <item.icon className="h-6 w-6" />
                {sidebarOpen && <span className="ml-3">{item.name}</span>}
              </button>
            ))}

            <button
              onClick={handleLogout}
              className={`flex items-center w-full p-3 rounded-lg text-red-400 hover:bg-gray-800 transition-colors ${
                !sidebarOpen && 'justify-center'
              }`}
            >
              <LogoutIcon className="h-6 w-6" />
              {sidebarOpen && <span className="ml-3">Logout</span>}
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Stats Cards */}
            {[
              {
                title: 'Total Orders',
                value: 'CA$15,182,000',
                icon: ShoppingBagIcon,
                color: 'bg-blue-500'
              },
              {
                title: 'Units Sold',
                value: '28',
                icon: ChartBarIcon,
                color: 'bg-green-500'
              },
              {
                title: 'Avg Price',
                value: 'CA$42/sq ft',
                icon: CogIcon,
                color: 'bg-purple-500'
              },
              {
                title: 'Remaining Units',
                value: '18',
                icon: DocumentTextIcon,
                color: 'bg-yellow-500'
              }
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center">
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">{stat.title}</p>
                    <p className="text-xl font-semibold">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Units Status */}
          <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Units per Status</h2>
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Available Units', value: '18', color: 'bg-yellow-200' },
                { label: 'Reserved Units', value: '21', color: 'bg-blue-200' },
                { label: 'Offered Units', value: '11', color: 'bg-purple-200' },
                { label: 'Sold Units', value: '28', color: 'bg-green-200' }
              ].map((status, index) => (
                <div
                  key={index}
                  className={`${status.color} rounded-lg p-4 text-center`}
                >
                  <p className="text-2xl font-bold">{status.value}</p>
                  <p className="text-sm text-gray-600">{status.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {/* Add recent activity items here */}
              <p className="text-gray-500">No recent activity</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 