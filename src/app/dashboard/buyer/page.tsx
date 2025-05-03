'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Bars3Icon,
  XMarkIcon,
  ChartBarIcon,
  ShoppingBagIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  CreditCardIcon,
  ChartPieIcon,
  QuestionMarkCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline'
import Image from 'next/image'

// Define types for our data
interface Notification {
  id: string;
  type: string;
  message: string;
  createdAt: string;
}

interface DashboardData {
  orders: {
    total: number;
    pending: number;
    completed: number;
    canceled: number;
  };
  balance: {
    outstanding: number;
    credit: number;
  };
  notifications: Notification[];
}

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
}

const navigation = [
  { name: 'Overview', href: '/dashboard/buyer', icon: ChartBarIcon },
  { name: 'Order Management', href: '/dashboard/buyer/orders', icon: ShoppingBagIcon },
  { name: 'Product Catalog', href: '/dashboard/buyer/products', icon: MagnifyingGlassIcon },
  { name: 'Supplier Management', href: '/dashboard/buyer/suppliers', icon: UserGroupIcon },
  { name: 'Payments & Billing', href: '/dashboard/buyer/payments', icon: CreditCardIcon },
  { name: 'Reports & Analytics', href: '/dashboard/buyer/reports', icon: ChartPieIcon },
  { name: 'Support & Help', href: '/dashboard/buyer/support', icon: QuestionMarkCircleIcon },
  { name: 'Settings', href: '/dashboard/buyer/settings', icon: Cog6ToothIcon },
]

export default function BuyerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const router = useRouter()
  const [userData, setUserData] = useState<UserData>({
    firstName: '',
    lastName: '',
    email: ''
  })
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    orders: {
      total: 0,
      pending: 0,
      completed: 0,
      canceled: 0
    },
    balance: {
      outstanding: 0,
      credit: 0
    },
    notifications: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchUserData() {
      try {
        console.log('Fetching user profile data...');
        const response = await fetch('/api/user/profile', {
          credentials: 'include',
        })
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Profile API error:', response.status, errorData);
          
          if (response.status === 401) {
            console.log('User not authenticated, redirecting to login');
            router.push('/auth/login')
            return
          }
          throw new Error(`Failed to fetch user data: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('User data loaded:', data);
        setUserData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || ''
        });
      } catch (error) {
        console.error('Error fetching user data:', error)
        setError('Failed to load user information')
      }
    }
    
    async function fetchDashboardData() {
      try {
        const response = await fetch('/api/dashboard/buyer', {
          credentials: 'include',
        })
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Dashboard API error:', response.status, errorData);
          throw new Error(`Failed to fetch dashboard data: ${response.status}`);
        }
        
        const data = await response.json()
        console.log('Dashboard data loaded:', data)
        
        // Validate and ensure proper data structure
        const processedData: DashboardData = {
          orders: {
            total: data.orders?.total || 0,
            pending: data.orders?.pending || 0,
            completed: data.orders?.completed || 0,
            canceled: data.orders?.canceled || 0
          },
          balance: {
            outstanding: data.balance?.outstanding || 0,
            credit: data.balance?.credit || 0
          },
          notifications: Array.isArray(data.notifications) ? data.notifications : []
        }
        
        setDashboardData(processedData)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }
    
    // Call both fetch functions
    console.log('Dashboard component mounted - fetching data');
    fetchUserData();
    fetchDashboardData();

    return () => {
      console.log('Dashboard component unmounted');
    };
  }, [router])

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })

      if (response.ok) {
        router.push('/auth/login')
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Toggle Button - YouTube Style */}
      <div className={`fixed top-0 ${sidebarOpen ? 'left-64' : 'left-0'} z-50 h-14 transition-all duration-300`}>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="h-14 w-14 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors duration-200 focus:outline-none"
          aria-label="Toggle sidebar"
        >
          <Bars3Icon className="w-6 h-6 text-gray-900" />
        </button>
      </div>

      {/* Dark Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 border-r border-gray-800 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <div className="h-full flex flex-col">
          {/* Logo and Title */}
          <div className="h-14 px-4 flex items-center border-b border-gray-800">
            <Image src="/logo.jpg" alt="Logo" width={30} height={30} className="rounded" />
            <span className="ml-4 text-lg font-medium text-white">
              <span className="text-blue-400">e</span>-ecm
            </span>
          </div>

          {/* User Info */}
          {userData.firstName && (
            <div className="px-4 py-3 border-b border-gray-800">
              <p className="text-sm text-gray-400">Logged in as</p>
              <p className="text-white font-medium truncate">{userData.firstName} {userData.lastName}</p>
              <p className="text-xs text-gray-500 truncate">{userData.email}</p>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-2">
            <ul className="space-y-1 px-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <a 
                    href={item.href} 
                    className="flex items-center px-3 py-2 text-gray-300 rounded-lg hover:bg-gray-800"
                  >
                    <item.icon className="w-5 h-5 mr-3 text-gray-400" />
                    <span>{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-800">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-gray-300 rounded-lg hover:bg-gray-800"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3 text-gray-400" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content - YouTube Style */}
      <div className={`pt-14 ${sidebarOpen ? 'ml-64' : 'ml-0'} transition-all duration-300`}>
        <main className="p-8">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-2 text-gray-900">
                Welcome, {userData.firstName || 'User'}
              </h1>
              <p className="text-gray-600 mb-6">Here's an overview of your activity</p>
              
              {/* Order Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gray-900 p-6 rounded-lg shadow">
                  <h3 className="text-gray-400 mb-2">Total Orders</h3>
                  <p className="text-3xl font-bold text-white">{dashboardData.orders.total}</p>
                </div>
                <div className="bg-gray-900 p-6 rounded-lg shadow">
                  <h3 className="text-gray-400 mb-2">Pending Orders</h3>
                  <p className="text-3xl font-bold text-yellow-400">{dashboardData.orders.pending}</p>
                </div>
                <div className="bg-gray-900 p-6 rounded-lg shadow">
                  <h3 className="text-gray-400 mb-2">Completed Orders</h3>
                  <p className="text-3xl font-bold text-green-400">{dashboardData.orders.completed}</p>
                </div>
                <div className="bg-gray-900 p-6 rounded-lg shadow">
                  <h3 className="text-gray-400 mb-2">Canceled Orders</h3>
                  <p className="text-3xl font-bold text-red-400">{dashboardData.orders.canceled}</p>
                </div>
              </div>

              {/* Balance Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-900 p-6 rounded-lg shadow">
                  <h3 className="text-gray-400 mb-2">Outstanding Payments</h3>
                  <p className="text-3xl font-bold text-white">${dashboardData.balance.outstanding.toFixed(2)}</p>
                </div>
                <div className="bg-gray-900 p-6 rounded-lg shadow">
                  <h3 className="text-gray-400 mb-2">Credit Balance</h3>
                  <p className="text-3xl font-bold text-green-400">${dashboardData.balance.credit.toFixed(2)}</p>
                </div>
              </div>

              {/* Recent Notifications */}
              <div className="bg-gray-900 rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4 text-white">Recent Notifications</h2>
                {dashboardData.notifications && dashboardData.notifications.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.notifications.map((notification) => (
                      <div key={notification.id} className="flex items-center p-4 bg-gray-800 rounded-lg">
                        {notification.type === 'offer' ? (
                          <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                        ) : (
                          <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                        )}
                        <p className="text-gray-300">{notification.message}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No notifications to display</p>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
} 