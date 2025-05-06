'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  HomeIcon,
  BuildingStorefrontIcon,
  MagnifyingGlassIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  FunnelIcon,
  ClockIcon,
  ShoppingBagIcon,
  DocumentTextIcon,
  XCircleIcon,
  StarIcon,
  PlusIcon
} from '@heroicons/react/24/outline'

// Types
interface Supplier {
  id: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  status: 'active' | 'pending' | 'inactive';
  logoUrl?: string;
  lastActive: string;
  tags: string[];
  rating: number;
  totalOrders: number;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  products: {
    count: number;
    categories: string[];
  };
  hasUnreadMessages: boolean;
  featured: boolean;
}

// Buyer Supplier Management Page
export default function BuyerSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSort, setSelectedSort] = useState('featured');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const router = useRouter();

  // Go back to dashboard
  const goToDashboard = () => {
    window.location.href = '/dashboard/buyer';
  };

  // Load suppliers
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Mock suppliers data
      const mockSuppliers: Supplier[] = [
        {
          id: 'S1001',
          name: 'OptiCraft Eyewear',
          company: 'OptiCraft Inc.',
          email: 'orders@opticraft.com',
          phone: '+1 (555) 123-4567',
          status: 'active',
          logoUrl: '/logos/opticraft.jpg',
          lastActive: '2024-05-22T09:30:00Z',
          tags: ['premium', 'sunglasses', 'prescription'],
          rating: 4.8,
          totalOrders: 15,
          address: {
            street: '123 Vision Blvd',
            city: 'Los Angeles',
            state: 'CA',
            zip: '90001',
            country: 'USA'
          },
          products: {
            count: 78,
            categories: ['Prescription Frames', 'Sunglasses', 'Specialty Eyewear']
          },
          hasUnreadMessages: true,
          featured: true
        },
        {
          id: 'S1002',
          name: 'Clear Vision Supplies',
          company: 'Clear Vision LLC',
          email: 'sales@clearvision.com',
          phone: '+1 (555) 987-6543',
          status: 'active',
          logoUrl: '/logos/clearvision.jpg',
          lastActive: '2024-05-20T14:15:00Z',
          tags: ['budget', 'reading glasses', 'accessories'],
          rating: 4.2,
          totalOrders: 8,
          address: {
            street: '456 Optical Drive',
            city: 'Chicago',
            state: 'IL',
            zip: '60601',
            country: 'USA'
          },
          products: {
            count: 45,
            categories: ['Reading Glasses', 'Accessories', 'Cleaning Supplies']
          },
          hasUnreadMessages: false,
          featured: false
        },
        {
          id: 'S1003',
          name: 'Elite Eyewear Manufacturing',
          company: 'Elite Eyewear',
          email: 'wholesale@eliteeyewear.com',
          phone: '+1 (555) 444-5555',
          status: 'pending',
          logoUrl: '/logos/eliteeyewear.jpg',
          lastActive: '2024-05-15T11:30:00Z',
          tags: ['luxury', 'designer', 'titanium'],
          rating: 0,
          totalOrders: 0,
          address: {
            street: '789 Designer Way',
            city: 'New York',
            state: 'NY',
            zip: '10001',
            country: 'USA'
          },
          products: {
            count: 120,
            categories: ['Luxury Frames', 'Designer Sunglasses', 'Sports Eyewear']
          },
          hasUnreadMessages: true,
          featured: false
        }
      ];
      
      setSuppliers(mockSuppliers);
      setFilteredSuppliers(mockSuppliers);
      setIsLoading(false);
    }, 800);
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...suppliers];
    
    // Search term filter
    if (searchTerm) {
      result = result.filter(supplier => 
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        supplier.products.categories.some(category => category.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Status filter
    if (selectedStatus !== 'all') {
      result = result.filter(supplier => supplier.status === selectedStatus);
    }
    
    // Sorting
    result = result.sort((a, b) => {
      switch (selectedSort) {
        case 'featured':
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        case 'rating':
          return b.rating - a.rating;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'newest':
          return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
        case 'oldest':
          return new Date(a.lastActive).getTime() - new Date(b.lastActive).getTime();
        default:
          return 0;
      }
    });
    
    setFilteredSuppliers(result);
  }, [suppliers, searchTerm, selectedStatus, selectedSort]);

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('all');
    setSelectedSort('featured');
  };

  // Open supplier details
  const openSupplierDetails = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
  };

  // Handle message supplier
  const messageSupplier = (supplierId: string) => {
    window.location.href = `/dashboard/buyer/messages?supplier=${supplierId}`;
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

  // Render supplier rating stars
  const renderRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<StarIcon key={i} className="h-4 w-4 text-yellow-400 fill-current" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<StarIcon key={i} className="h-4 w-4 text-yellow-400 fill-current opacity-50" />);
      } else {
        stars.push(<StarIcon key={i} className="h-4 w-4 text-gray-400" />);
      }
    }
    
    return stars;
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
              <h1 className="text-2xl font-bold mb-1">Supplier Management</h1>
              <p className="text-gray-400">Manage your eyewear suppliers and orders</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <button
                onClick={() => window.location.href = '/dashboard/buyer/orders'}
                className="bg-gray-800 hover:bg-gray-700 text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center"
              >
                <DocumentTextIcon className="h-5 w-5 mr-2" />
                Orders
              </button>
              <button
                onClick={() => window.location.href = '/dashboard/buyer/products'}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center"
              >
                <ShoppingBagIcon className="h-5 w-5 mr-2" />
                Products Catalog
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
                placeholder="Search suppliers by name, company, or product categories..."
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
                  <option value="featured">Featured</option>
                  <option value="rating">Highest Rated</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                  <option value="newest">Last Active: Newest First</option>
                  <option value="oldest">Last Active: Oldest First</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Suppliers List */}
        {isLoading ? (
          <div className="bg-gray-900 rounded-xl p-12 shadow-md flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
            <p className="mt-4 text-gray-300">Loading suppliers...</p>
          </div>
        ) : filteredSuppliers.length === 0 ? (
          <div className="bg-gray-900 rounded-xl p-12 shadow-md flex flex-col items-center justify-center">
            <div className="h-24 w-24 bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <BuildingStorefrontIcon className="h-12 w-12 text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-white mb-1">No suppliers found</h3>
            <p className="text-gray-400 mb-4">
              {suppliers.length === 0 
                ? "You don't have any supplier relationships yet" 
                : "Try adjusting your search or filter criteria"}
            </p>
            {suppliers.length === 0 && (
              <button
                onClick={() => window.location.href = '/dashboard/buyer/products'}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <ShoppingBagIcon className="h-5 w-5 mr-2" />
                Browse Product Catalog
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSuppliers.map(supplier => (
              <div key={supplier.id} className="bg-gray-900 rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full bg-gray-800 flex items-center justify-center mr-4">
                        <BuildingStorefrontIcon className="h-6 w-6 text-gray-500" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{supplier.company}</h3>
                        <p className="text-gray-400 text-sm">{supplier.name}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium 
                      ${supplier.status === 'active' ? 'bg-green-900 text-green-300' : 
                        supplier.status === 'pending' ? 'bg-yellow-900 text-yellow-300' : 
                        'bg-red-900 text-red-300'}`}>
                      {supplier.status.charAt(0).toUpperCase() + supplier.status.slice(1)}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-gray-300">
                      <EnvelopeIcon className="h-5 w-5 mr-2 text-gray-500" />
                      <span className="text-sm truncate">{supplier.email}</span>
                    </div>
                    {supplier.phone && (
                      <div className="flex items-center text-gray-300">
                        <PhoneIcon className="h-5 w-5 mr-2 text-gray-500" />
                        <span className="text-sm">{supplier.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center text-gray-300">
                      <ClockIcon className="h-5 w-5 mr-2 text-gray-500" />
                      <span className="text-sm">Last active: {formatDate(supplier.lastActive)}</span>
                    </div>
                  </div>

                  <div className="flex items-center mb-4">
                    <div className="flex mr-1">
                      {renderRating(supplier.rating)}
                    </div>
                    <span className="text-sm text-gray-400">
                      {supplier.rating > 0 ? supplier.rating.toFixed(1) : 'Not rated'}
                    </span>
                  </div>

                  <div className="bg-gray-800 p-3 rounded-lg mb-4">
                    <p className="text-gray-400 text-xs mb-1">Product Categories</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {supplier.products.categories.map((category, index) => (
                        <span key={index} className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-md">
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>

                  {supplier.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {supplier.tags.map((tag, index) => (
                        <span key={index} className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <button
                      onClick={() => messageSupplier(supplier.id)}
                      className={`flex-1 py-2 px-3 rounded-lg text-white text-sm font-medium flex items-center justify-center ${
                        supplier.hasUnreadMessages 
                          ? 'bg-blue-600 hover:bg-blue-700' 
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1" />
                      {supplier.hasUnreadMessages ? 'New Message' : 'Message'}
                    </button>
                    <button
                      onClick={() => openSupplierDetails(supplier)}
                      className="flex-1 py-2 px-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm font-medium flex items-center justify-center"
                    >
                      <BuildingStorefrontIcon className="h-4 w-4 mr-1" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Supplier Details Modal */}
      {selectedSupplier && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h3 className="text-xl font-bold text-white">Supplier Details</h3>
              <button
                onClick={() => setSelectedSupplier(null)}
                className="text-gray-400 hover:text-white"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                {/* Left side - Supplier info */}
                <div className="flex-1">
                  <div className="flex items-center mb-4">
                    <div className="h-16 w-16 rounded-full bg-gray-800 flex items-center justify-center mr-4">
                      <BuildingStorefrontIcon className="h-8 w-8 text-gray-500" />
                    </div>
                    <div>
                      <h3 className="text-white text-xl font-semibold">{selectedSupplier.company}</h3>
                      <p className="text-gray-400">{selectedSupplier.name}</p>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4 mb-4">
                    <h4 className="text-white font-medium mb-3">Contact Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-300">
                        <EnvelopeIcon className="h-5 w-5 mr-2 text-gray-500" />
                        <span>{selectedSupplier.email}</span>
                      </div>
                      {selectedSupplier.phone && (
                        <div className="flex items-center text-gray-300">
                          <PhoneIcon className="h-5 w-5 mr-2 text-gray-500" />
                          <span>{selectedSupplier.phone}</span>
                        </div>
                      )}
                      {selectedSupplier.address && (
                        <div className="flex items-start text-gray-300">
                          <HomeIcon className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                          <div>
                            <div>{selectedSupplier.address.street}</div>
                            <div>{selectedSupplier.address.city}, {selectedSupplier.address.state} {selectedSupplier.address.zip}</div>
                            <div>{selectedSupplier.address.country}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4 mb-4">
                    <h4 className="text-white font-medium mb-3">Product Information</h4>
                    <p className="text-gray-300 mb-2">Total Products: <span className="text-white font-medium">{selectedSupplier.products.count}</span></p>
                    <p className="text-gray-300 mb-2">Categories:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedSupplier.products.categories.map((category, index) => (
                        <span key={index} className="bg-gray-700 text-gray-300 px-2 py-1 rounded-md text-sm">
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right side - Stats and actions */}
                <div className="flex-1">
                  <div className="bg-gray-800 rounded-lg p-4 mb-4">
                    <h4 className="text-white font-medium mb-3">Supplier Summary</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-700 p-3 rounded-lg">
                        <p className="text-gray-400 text-xs mb-1">Status</p>
                        <p className={`font-semibold ${
                          selectedSupplier.status === 'active' ? 'text-green-400' : 
                          selectedSupplier.status === 'pending' ? 'text-yellow-400' : 
                          'text-red-400'
                        }`}>
                          {selectedSupplier.status.charAt(0).toUpperCase() + selectedSupplier.status.slice(1)}
                        </p>
                      </div>
                      <div className="bg-gray-700 p-3 rounded-lg">
                        <p className="text-gray-400 text-xs mb-1">Rating</p>
                        <div className="flex items-center">
                          <div className="flex">
                            {renderRating(selectedSupplier.rating)}
                          </div>
                          <span className="ml-1 text-white">
                            {selectedSupplier.rating > 0 ? selectedSupplier.rating.toFixed(1) : 'N/A'}
                          </span>
                        </div>
                      </div>
                      <div className="bg-gray-700 p-3 rounded-lg">
                        <p className="text-gray-400 text-xs mb-1">Total Orders</p>
                        <p className="text-white font-semibold">{selectedSupplier.totalOrders}</p>
                      </div>
                      <div className="bg-gray-700 p-3 rounded-lg">
                        <p className="text-gray-400 text-xs mb-1">Last Active</p>
                        <p className="text-white font-semibold">{formatDate(selectedSupplier.lastActive)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4 mb-4">
                    <h4 className="text-white font-medium mb-3">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedSupplier.tags.map((tag, index) => (
                        <span key={index} className="bg-gray-700 text-gray-300 px-2 py-1 rounded-md text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button 
                      onClick={() => messageSupplier(selectedSupplier.id)}
                      className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center"
                    >
                      <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                      Send Message
                    </button>
                    <button 
                      onClick={() => window.location.href = `/dashboard/buyer/products?supplier=${selectedSupplier.id}`}
                      className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center"
                    >
                      <ShoppingBagIcon className="h-5 w-5 mr-2" />
                      View Products
                    </button>
                    <button 
                      onClick={() => window.location.href = `/dashboard/buyer/orders?supplier=${selectedSupplier.id}`}
                      className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center"
                    >
                      <DocumentTextIcon className="h-5 w-5 mr-2" />
                      Order History
                    </button>
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