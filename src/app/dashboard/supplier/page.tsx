'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  HomeIcon,
  ChartBarIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  DocumentTextIcon,
  BanknotesIcon,
  Cog6ToothIcon,
  InboxIcon,
  CalendarIcon,
  TruckIcon
} from '@heroicons/react/24/outline'

// Types
interface SupplierDashboardData {
  totalProducts: number;
  totalOrders: number;
  revenue: number;
  pendingShipments: number;
  topProducts: {
    id: string;
    name: string;
    sales: number;
    inventory: number;
  }[];
  recentOrders: {
    id: string;
    customerName: string;
    date: string;
    status: string;
    amount: number;
  }[];
  inventory: {
    total: number;
    lowStock: number;
    outOfStock: number;
  };
}

export default function SupplierDashboard() {
  const [dashboardData, setDashboardData] = useState<SupplierDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Fetch dashboard data
  useEffect(() => {
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      // For first-time users, we show empty metrics
      const mockData: SupplierDashboardData = {
        totalProducts: 0,
        totalOrders: 0,
        revenue: 0,
        pendingShipments: 0,
        topProducts: [],
        recentOrders: [],
        inventory: {
          total: 0,
          lowStock: 0,
          outOfStock: 0
        }
      };
      setDashboardData(mockData);
      setIsLoading(false);
    }, 800);
  }, []);

  // Navigation helpers
  const navigateTo = (path: string) => {
    // Use window.location.href for reliable navigation
    window.location.href = path;
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Card component
  const StatCard = ({ title, value, icon, colorClass }: { title: string; value: string | number; icon: React.ReactNode; colorClass: string }) => (
    <div className="bg-gray-900 rounded-xl p-6 shadow-md">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${colorClass} mr-4`}>
          {icon}
        </div>
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <h3 className="text-white text-xl font-bold">{value}</h3>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-800 min-h-screen">
        <div className="max-w-7xl mx-auto flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-800 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gray-900 rounded-2xl p-6 text-white mb-6 shadow-xl">
          <h1 className="text-2xl font-bold">Supplier Dashboard</h1>
          <p className="text-gray-400">Manage your eyewear products, orders, and relationships with buyers</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard 
            title="Total Products" 
            value={dashboardData?.totalProducts || 0} 
            icon={<ShoppingBagIcon className="h-6 w-6 text-blue-100" />} 
            colorClass="bg-blue-600"
          />
          <StatCard 
            title="Total Orders" 
            value={dashboardData?.totalOrders || 0} 
            icon={<DocumentTextIcon className="h-6 w-6 text-green-100" />} 
            colorClass="bg-green-600"
          />
          <StatCard 
            title="Revenue" 
            value={formatCurrency(dashboardData?.revenue || 0)} 
            icon={<BanknotesIcon className="h-6 w-6 text-yellow-100" />} 
            colorClass="bg-yellow-600"
          />
          <StatCard 
            title="Pending Shipments" 
            value={dashboardData?.pendingShipments || 0} 
            icon={<TruckIcon className="h-6 w-6 text-red-100" />} 
            colorClass="bg-red-600"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Navigation Cards */}
          <div className="col-span-1 bg-gray-900 rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-bold text-white mb-4">Quick Links</h2>
            <div className="space-y-3">
              <button 
                onClick={() => navigateTo('/dashboard/supplier/products')}
                className="w-full flex items-center p-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors"
              >
                <ShoppingBagIcon className="h-5 w-5 mr-3 text-blue-400" />
                <span>Manage Products</span>
              </button>
              <button 
                onClick={() => navigateTo('/dashboard/supplier/orders')}
                className="w-full flex items-center p-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors"
              >
                <DocumentTextIcon className="h-5 w-5 mr-3 text-green-400" />
                <span>Orders</span>
              </button>
              <button 
                onClick={() => navigateTo('/dashboard/supplier/buyers')}
                className="w-full flex items-center p-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors"
              >
                <UserGroupIcon className="h-5 w-5 mr-3 text-yellow-400" />
                <span>Buyer Relationships</span>
              </button>
              <button 
                onClick={() => navigateTo('/dashboard/supplier/inventory')}
                className="w-full flex items-center p-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors"
              >
                <ChartBarIcon className="h-5 w-5 mr-3 text-purple-400" />
                <span>Inventory Management</span>
              </button>
              <button 
                onClick={() => navigateTo('/dashboard/supplier/messages')}
                className="w-full flex items-center p-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors"
              >
                <InboxIcon className="h-5 w-5 mr-3 text-indigo-400" />
                <span>Messages</span>
              </button>
              <button 
                onClick={() => navigateTo('/dashboard/supplier/settings')}
                className="w-full flex items-center p-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors"
              >
                <Cog6ToothIcon className="h-5 w-5 mr-3 text-gray-400" />
                <span>Settings</span>
              </button>
            </div>
          </div>

          {/* Inventory Summary */}
          <div className="col-span-1 bg-gray-900 rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-bold text-white mb-4">Inventory Summary</h2>
            {dashboardData?.inventory.total === 0 ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center rounded-full bg-gray-800 p-4 mb-4">
                  <ShoppingBagIcon className="h-8 w-8 text-gray-500" />
                </div>
                <p className="text-gray-400">No inventory data available yet</p>
                <button 
                  onClick={() => navigateTo('/dashboard/supplier/products')}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Products
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Total Items</span>
                    <span className="text-white font-bold">{dashboardData?.inventory.total}</span>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Low Stock</span>
                    <span className="text-yellow-400 font-bold">{dashboardData?.inventory.lowStock}</span>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Out of Stock</span>
                    <span className="text-red-400 font-bold">{dashboardData?.inventory.outOfStock}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Recent Orders */}
          <div className="col-span-1 bg-gray-900 rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-bold text-white mb-4">Recent Orders</h2>
            {dashboardData?.recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center rounded-full bg-gray-800 p-4 mb-4">
                  <DocumentTextIcon className="h-8 w-8 text-gray-500" />
                </div>
                <p className="text-gray-400">No orders received yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {dashboardData?.recentOrders.map(order => (
                  <div key={order.id} className="bg-gray-800 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-white font-medium">{order.customerName}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'Delivered' ? 'bg-green-900 text-green-300' :
                        order.status === 'Shipped' ? 'bg-blue-900 text-blue-300' :
                        order.status === 'Processing' ? 'bg-yellow-900 text-yellow-300' :
                        'bg-red-900 text-red-300'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">{order.date}</span>
                      <span className="text-white">{formatCurrency(order.amount)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Empty state for new suppliers */}
        {dashboardData && 
        dashboardData.totalProducts === 0 && 
        dashboardData.totalOrders === 0 && (
          <div className="bg-gray-900 rounded-xl p-8 shadow-md text-center">
            <div className="inline-flex items-center justify-center rounded-full bg-gray-800 p-6 mb-4">
              <ShoppingBagIcon className="h-12 w-12 text-gray-500" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Welcome to Your Supplier Dashboard</h2>
            <p className="text-gray-400 mb-6 max-w-lg mx-auto">
              Get started by adding your eyewear products to your catalog, managing your inventory, and connecting with buyers.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={() => navigateTo('/dashboard/supplier/products')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Products
              </button>
              <button 
                onClick={() => navigateTo('/dashboard/supplier/settings')}
                className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Setup Account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 