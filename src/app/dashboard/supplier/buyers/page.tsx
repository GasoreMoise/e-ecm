'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  HomeIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  ArrowTopRightOnSquareIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  FunnelIcon,
  ClockIcon,
  BellIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline'

// Types
interface Buyer {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  status: 'active' | 'pending' | 'inactive';
  avatar?: string;
  totalOrders: number;
  totalSpent: number;
  lastActive: string;
  tags: string[];
  hasUnreadMessages: boolean;
  pendingInquiries: number;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

// Supplier Buyer Management Page
export default function SupplierBuyers() {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [filteredBuyers, setFilteredBuyers] = useState<Buyer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSort, setSelectedSort] = useState('newest');
  const [selectedBuyer, setSelectedBuyer] = useState<Buyer | null>(null);
  const router = useRouter();

  // Go back to dashboard
  const goToDashboard = () => {
    window.location.href = '/dashboard/supplier';
  };

  // Load buyers
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      // For first-time users or demo, you can start with empty or mock buyers
      const mockBuyers: Buyer[] = [
        {
          id: 'B1001',
          name: 'Sarah Johnson',
          company: 'OptiVision Retail',
          email: 'sarah.johnson@optivision.com',
          phone: '+1 (555) 123-4567',
          status: 'active',
          avatar: '/avatars/sarah.jpg',
          totalOrders: 12,
          totalSpent: 5689.75,
          lastActive: '2024-05-20T14:30:00Z',
          tags: ['wholesale', 'premium', 'recurring'],
          hasUnreadMessages: true,
          pendingInquiries: 2,
          address: {
            street: '123 Retail Row',
            city: 'Boston',
            state: 'MA',
            zip: '02108',
            country: 'USA'
          }
        },
        {
          id: 'B1002',
          name: 'David Chen',
          company: 'EyeCare Solutions',
          email: 'david.chen@eyecare.com',
          phone: '+1 (555) 987-6543',
          status: 'active',
          avatar: '/avatars/david.jpg',
          totalOrders: 8,
          totalSpent: 3450.50,
          lastActive: '2024-05-15T09:45:00Z',
          tags: ['retail', 'sunglasses'],
          hasUnreadMessages: false,
          pendingInquiries: 0,
          address: {
            street: '456 Optician Avenue',
            city: 'San Francisco',
            state: 'CA',
            zip: '94103',
            country: 'USA'
          }
        },
        {
          id: 'B1003',
          name: 'Maria Rodriguez',
          company: 'Clear Vision Clinic',
          email: 'maria@clearvision.com',
          phone: '+1 (555) 222-3333',
          status: 'pending',
          avatar: '/avatars/maria.jpg',
          totalOrders: 0,
          totalSpent: 0,
          lastActive: '2024-05-18T16:20:00Z',
          tags: ['new', 'medical'],
          hasUnreadMessages: true,
          pendingInquiries: 1,
          address: {
            street: '789 Health Blvd',
            city: 'Miami',
            state: 'FL',
            zip: '33101',
            country: 'USA'
          }
        }
      ];
      
      setBuyers(mockBuyers);
      setFilteredBuyers(mockBuyers);
      setIsLoading(false);
    }, 800);
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...buyers];
    
    // Search term filter
    if (searchTerm) {
      result = result.filter(buyer => 
        buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (buyer.company && buyer.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
        buyer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        buyer.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Status filter
    if (selectedStatus !== 'all') {
      result = result.filter(buyer => buyer.status === selectedStatus);
    }
    
    // Sorting
    result = result.sort((a, b) => {
      switch (selectedSort) {
        case 'newest':
          return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
        case 'oldest':
          return new Date(a.lastActive).getTime() - new Date(b.lastActive).getTime();
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'orders-high':
          return b.totalOrders - a.totalOrders;
        case 'spent-high':
          return b.totalSpent - a.totalSpent;
        default:
          return 0;
      }
    });
    
    setFilteredBuyers(result);
  }, [buyers, searchTerm, selectedStatus, selectedSort]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('all');
    setSelectedSort('newest');
  };

  // Open buyer details
  const openBuyerDetails = (buyer: Buyer) => {
    setSelectedBuyer(buyer);
  };

  // Handle message buyer
  const messageBuyer = (buyerId: string) => {
    window.location.href = `/dashboard/supplier/messages?buyer=${buyerId}`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6 bg-gray-800 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Back button */}
        <button
          onClick={goToDashboard}
          className="mb-4 flex items-center text-gray-300 hover:text-white bg-gray-900 rounded-lg px-4 py-2 shadow-md"
        >
          <HomeIcon className="h-5 w-5 mr-2" />
          <span>Back to Dashboard</span>
        </button>

        {/* Header */}
        <div className="bg-gray-900 rounded-2xl p-6 text-white mb-6 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-1">Buyer Relationships</h1>
              <p className="text-gray-400">Manage your buyer accounts, inquiries, and communications</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <button
                onClick={() => window.location.href = '/dashboard/supplier/messages'}
                className="bg-gray-800 hover:bg-gray-700 text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center"
              >
                <EnvelopeIcon className="h-5 w-5 mr-2" />
                Messages
              </button>
              <button
                onClick={() => window.location.href = '/dashboard/supplier/inquiries'}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center"
              >
                <BellIcon className="h-5 w-5 mr-2" />
                Inquiries
                {buyers.reduce((total, buyer) => total + buyer.pendingInquiries, 0) > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {buyers.reduce((total, buyer) => total + buyer.pendingInquiries, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-900 rounded-xl p-4 shadow-md mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search buyers by name, company, or email..."
                className="block w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                className="flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition-colors"
                onClick={() => setFilterMenuOpen(!filterMenuOpen)}
              >
                <FunnelIcon className="h-5 w-5 mr-2 text-gray-400" />
                Filters
                <ChevronDownIcon className="h-5 w-5 ml-2 text-gray-400" />
              </button>
              
              <button
                className="flex items-center px-4 py-2 bg-gray-800 border border-gray-700 hover:bg-gray-700 rounded-lg text-white transition-colors"
                onClick={resetFilters}
              >
                <ArrowPathIcon className="h-5 w-5 mr-2 text-gray-400" />
                Reset
              </button>
            </div>
          </div>
          
          {/* Filter Menu */}
          {filterMenuOpen && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-700">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                <select
                  className="block w-full bg-gray-800 border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Sort By</label>
                <select
                  className="block w-full bg-gray-800 border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                >
                  <option value="newest">Last Active: Newest First</option>
                  <option value="oldest">Last Active: Oldest First</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                  <option value="orders-high">Most Orders</option>
                  <option value="spent-high">Highest Spending</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Buyers List */}
        {isLoading ? (
          <div className="bg-gray-900 rounded-xl p-12 shadow-md flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
            <p className="mt-4 text-gray-300">Loading buyers...</p>
          </div>
        ) : filteredBuyers.length === 0 ? (
          <div className="bg-gray-900 rounded-xl p-12 shadow-md flex flex-col items-center justify-center">
            <div className="h-24 w-24 bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <UserGroupIcon className="h-12 w-12 text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-white mb-1">No buyers found</h3>
            <p className="text-gray-400 mb-4">
              {buyers.length === 0 
                ? "You don't have any buyer relationships yet" 
                : "Try adjusting your search or filter criteria"}
            </p>
            {buyers.length === 0 && (
              <p className="text-gray-300 text-center max-w-md">
                Buyers will appear here once they connect with you or place orders for your products.
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBuyers.map(buyer => (
              <div key={buyer.id} className="bg-gray-900 rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full bg-gray-800 flex items-center justify-center mr-4">
                        <UserIcon className="h-6 w-6 text-gray-500" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{buyer.name}</h3>
                        {buyer.company && (
                          <p className="text-gray-400 text-sm">{buyer.company}</p>
                        )}
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium 
                      ${buyer.status === 'active' ? 'bg-green-900 text-green-300' : 
                        buyer.status === 'pending' ? 'bg-yellow-900 text-yellow-300' : 
                        'bg-red-900 text-red-300'}`}>
                      {buyer.status.charAt(0).toUpperCase() + buyer.status.slice(1)}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-gray-300">
                      <EnvelopeIcon className="h-5 w-5 mr-2 text-gray-500" />
                      <span className="text-sm truncate">{buyer.email}</span>
                    </div>
                    {buyer.phone && (
                      <div className="flex items-center text-gray-300">
                        <PhoneIcon className="h-5 w-5 mr-2 text-gray-500" />
                        <span className="text-sm">{buyer.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center text-gray-300">
                      <ClockIcon className="h-5 w-5 mr-2 text-gray-500" />
                      <span className="text-sm">Last active: {formatDate(buyer.lastActive)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-gray-800 p-3 rounded-lg">
                      <p className="text-gray-400 text-xs mb-1">Orders</p>
                      <p className="text-white font-semibold">{buyer.totalOrders}</p>
                    </div>
                    <div className="bg-gray-800 p-3 rounded-lg">
                      <p className="text-gray-400 text-xs mb-1">Total Spent</p>
                      <p className="text-white font-semibold">{formatCurrency(buyer.totalSpent)}</p>
                    </div>
                  </div>

                  {buyer.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {buyer.tags.map((tag, index) => (
                        <span key={index} className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <button
                      onClick={() => messageBuyer(buyer.id)}
                      className={`flex-1 py-2 px-3 rounded-lg text-white text-sm font-medium flex items-center justify-center ${
                        buyer.hasUnreadMessages 
                          ? 'bg-blue-600 hover:bg-blue-700' 
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1" />
                      {buyer.hasUnreadMessages ? 'New Message' : 'Message'}
                    </button>
                    <button
                      onClick={() => openBuyerDetails(buyer)}
                      className="flex-1 py-2 px-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm font-medium flex items-center justify-center"
                    >
                      <UserIcon className="h-4 w-4 mr-1" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Buyer Details Modal */}
      {selectedBuyer && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h3 className="text-xl font-bold text-white">Buyer Details</h3>
              <button
                onClick={() => setSelectedBuyer(null)}
                className="text-gray-400 hover:text-white"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                {/* Left side - Contact info */}
                <div className="flex-1">
                  <div className="flex items-center mb-4">
                    <div className="h-16 w-16 rounded-full bg-gray-800 flex items-center justify-center mr-4">
                      <UserIcon className="h-8 w-8 text-gray-500" />
                    </div>
                    <div>
                      <h3 className="text-white text-xl font-semibold">{selectedBuyer.name}</h3>
                      {selectedBuyer.company && (
                        <p className="text-gray-400">{selectedBuyer.company}</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4 mb-4">
                    <h4 className="text-white font-medium mb-3">Contact Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-300">
                        <EnvelopeIcon className="h-5 w-5 mr-2 text-gray-500" />
                        <span>{selectedBuyer.email}</span>
                      </div>
                      {selectedBuyer.phone && (
                        <div className="flex items-center text-gray-300">
                          <PhoneIcon className="h-5 w-5 mr-2 text-gray-500" />
                          <span>{selectedBuyer.phone}</span>
                        </div>
                      )}
                      {selectedBuyer.address && (
                        <div className="flex items-start text-gray-300">
                          <HomeIcon className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                          <div>
                            <div>{selectedBuyer.address.street}</div>
                            <div>{selectedBuyer.address.city}, {selectedBuyer.address.state} {selectedBuyer.address.zip}</div>
                            <div>{selectedBuyer.address.country}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-3">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedBuyer.tags.map((tag, index) => (
                        <span key={index} className="bg-gray-700 text-gray-300 px-2 py-1 rounded-md text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right side - Stats and actions */}
                <div className="flex-1">
                  <div className="bg-gray-800 rounded-lg p-4 mb-4">
                    <h4 className="text-white font-medium mb-3">Account Summary</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-700 p-3 rounded-lg">
                        <p className="text-gray-400 text-xs mb-1">Status</p>
                        <p className={`font-semibold ${
                          selectedBuyer.status === 'active' ? 'text-green-400' : 
                          selectedBuyer.status === 'pending' ? 'text-yellow-400' : 
                          'text-red-400'
                        }`}>
                          {selectedBuyer.status.charAt(0).toUpperCase() + selectedBuyer.status.slice(1)}
                        </p>
                      </div>
                      <div className="bg-gray-700 p-3 rounded-lg">
                        <p className="text-gray-400 text-xs mb-1">Last Active</p>
                        <p className="text-white font-semibold">{formatDate(selectedBuyer.lastActive)}</p>
                      </div>
                      <div className="bg-gray-700 p-3 rounded-lg">
                        <p className="text-gray-400 text-xs mb-1">Total Orders</p>
                        <p className="text-white font-semibold">{selectedBuyer.totalOrders}</p>
                      </div>
                      <div className="bg-gray-700 p-3 rounded-lg">
                        <p className="text-gray-400 text-xs mb-1">Total Spent</p>
                        <p className="text-white font-semibold">{formatCurrency(selectedBuyer.totalSpent)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button 
                      onClick={() => messageBuyer(selectedBuyer.id)}
                      className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center"
                    >
                      <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                      Send Message
                    </button>
                    <button 
                      onClick={() => window.location.href = `/dashboard/supplier/orders?buyer=${selectedBuyer.id}`}
                      className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center"
                    >
                      <DocumentTextIcon className="h-5 w-5 mr-2" />
                      View Orders
                    </button>
                    {selectedBuyer.pendingInquiries > 0 && (
                      <button 
                        onClick={() => window.location.href = `/dashboard/supplier/inquiries?buyer=${selectedBuyer.id}`}
                        className="w-full py-2 px-4 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors flex items-center justify-center"
                      >
                        <BellIcon className="h-5 w-5 mr-2" />
                        View Inquiries
                        <span className="ml-2 bg-yellow-800 text-yellow-200 text-xs rounded-full px-2 py-0.5">
                          {selectedBuyer.pendingInquiries}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 