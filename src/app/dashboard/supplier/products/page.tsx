'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  HomeIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronDownIcon,
  PencilIcon,
  TrashIcon,
  ShoppingBagIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  XMarkIcon,
  CheckIcon,
  ChevronUpDownIcon,
  ArrowsUpDownIcon
} from '@heroicons/react/24/outline'

// Types
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  image: string;
  category: string;
  brand: string;
  sku: string;
  tags: string[];
  stock: number;
  status: 'active' | 'draft' | 'archived';
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  variants?: {
    color: string;
    style: string;
    stock: number;
  }[];
}

// Supplier Product Management Page
export default function SupplierProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSort, setSelectedSort] = useState('newest');
  const [showAddModal, setShowAddModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const router = useRouter();

  // Go back to dashboard
  const goToDashboard = () => {
    window.location.href = '/dashboard/supplier';
  };

  // Categories derived from products
  const getCategories = () => {
    if (products.length === 0) return ['all'];
    const cats = products.map(product => product.category);
    return ['all', ...Array.from(new Set(cats))];
  };

  // Load products
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      // For first-time users or demo, you can start with empty or mock products
      const mockProducts: Product[] = [
        {
          id: 'P1001',
          name: 'Premium Titanium Frames',
          description: 'Lightweight titanium frames with adjustable nose pads.',
          price: 189.99,
          image: '/products/titanium-frames.jpg',
          category: 'Prescription Frames',
          brand: 'EyeCraft',
          sku: 'TF-PRE-001',
          tags: ['titanium', 'premium', 'lightweight'],
          stock: 45,
          status: 'active',
          featured: true,
          createdAt: '2023-12-10T14:30:00Z',
          updatedAt: '2024-01-15T09:20:00Z',
          variants: [
            { color: 'Silver', style: 'Round', stock: 15 },
            { color: 'Black', style: 'Square', stock: 20 },
            { color: 'Gold', style: 'Oval', stock: 10 }
          ]
        },
        {
          id: 'P1002',
          name: 'Deluxe Acetate Sunglasses',
          description: 'Handcrafted acetate frames with polarized lenses.',
          price: 129.99,
          discountPrice: 99.99,
          image: '/products/acetate-sunglasses.jpg',
          category: 'Sunglasses',
          brand: 'ShadeMaster',
          sku: 'SG-DLX-002',
          tags: ['acetate', 'polarized', 'UV protection'],
          stock: 28,
          status: 'active',
          featured: true,
          createdAt: '2023-11-05T10:15:00Z',
          updatedAt: '2024-02-01T11:45:00Z',
          variants: [
            { color: 'Tortoise', style: 'Aviator', stock: 10 },
            { color: 'Black', style: 'Wayfarer', stock: 18 }
          ]
        },
        {
          id: 'P1003',
          name: 'Basic Reading Glasses',
          description: 'Affordable reading glasses with various magnifications.',
          price: 39.99,
          image: '/products/reading-glasses.jpg',
          category: 'Reading Glasses',
          brand: 'ReadWell',
          sku: 'RG-BAS-003',
          tags: ['reading', 'affordable', 'magnification'],
          stock: 0,
          status: 'active',
          featured: false,
          createdAt: '2024-01-20T09:30:00Z',
          updatedAt: '2024-01-20T09:30:00Z',
          variants: [
            { color: 'Black', style: 'Rectangle', stock: 0 }
          ]
        }
      ];
      
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setIsLoading(false);
    }, 800);
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...products];
    
    // Search term filter
    if (searchTerm) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    // Status filter
    if (selectedStatus !== 'all') {
      result = result.filter(product => product.status === selectedStatus);
    }
    
    // Sorting
    result = result.sort((a, b) => {
      switch (selectedSort) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'price-low':
          return (a.discountPrice || a.price) - (b.discountPrice || b.price);
        case 'price-high':
          return (b.discountPrice || b.price) - (a.discountPrice || a.price);
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'stock-low':
          return a.stock - b.stock;
        case 'stock-high':
          return b.stock - a.stock;
        default:
          return 0;
      }
    });
    
    setFilteredProducts(result);
  }, [products, searchTerm, selectedCategory, selectedStatus, selectedSort]);

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
    setSelectedCategory('all');
    setSelectedStatus('all');
    setSelectedSort('newest');
  };

  // Delete product
  const deleteProduct = (productId: string) => {
    setProducts(products.filter(product => product.id !== productId));
    setConfirmDelete(null);
  };

  // Edit product
  const editProduct = (productId: string) => {
    // In a real app, you would navigate to an edit page or open an edit modal
    console.log(`Editing product ${productId}`);
  };

  // Placeholder for add product function
  const addNewProduct = () => {
    setShowAddModal(false);
    // In a real app, you would add the product to the database
    console.log('Adding new product');
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
              <h1 className="text-2xl font-bold mb-1">Product Management</h1>
              <p className="text-gray-400">Manage your eyewear products, inventory and pricing</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add New Product
            </button>
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
                placeholder="Search products by name, SKU, or tags..."
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
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-700">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                <select
                  className="block w-full bg-gray-800 border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {getCategories().map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
              
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
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
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
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                  <option value="stock-low">Stock: Low to High</option>
                  <option value="stock-high">Stock: High to Low</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Products Table */}
        {isLoading ? (
          <div className="bg-gray-900 rounded-xl p-12 shadow-md flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
            <p className="mt-4 text-gray-300">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-gray-900 rounded-xl p-12 shadow-md flex flex-col items-center justify-center">
            <div className="h-24 w-24 bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <ShoppingBagIcon className="h-12 w-12 text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-white mb-1">No products found</h3>
            <p className="text-gray-400 mb-4">
              {products.length === 0 
                ? "You haven't added any products yet" 
                : "Try adjusting your search or filter criteria"}
            </p>
            {products.length === 0 ? (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Your First Product
              </button>
            ) : (
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={resetFilters}
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div className="bg-gray-900 rounded-xl shadow-md overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    SKU
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Stock
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-800">
                {filteredProducts.map(product => (
                  <tr key={product.id} className="hover:bg-gray-800 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 bg-gray-800 rounded-md flex items-center justify-center">
                          <ShoppingBagIcon className="h-6 w-6 text-gray-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{product.name}</div>
                          <div className="text-sm text-gray-400 truncate max-w-xs">{product.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{product.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{product.sku}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.discountPrice ? (
                        <div>
                          <div className="text-sm text-gray-400 line-through">{formatCurrency(product.price)}</div>
                          <div className="text-sm text-white">{formatCurrency(product.discountPrice)}</div>
                        </div>
                      ) : (
                        <div className="text-sm text-white">{formatCurrency(product.price)}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${product.stock === 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {product.stock} units
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${product.status === 'active' ? 'bg-green-900 text-green-300' : 
                          product.status === 'draft' ? 'bg-gray-700 text-gray-300' : 
                          'bg-red-900 text-red-300'}`}>
                        {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => editProduct(product.id)}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(product.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h3 className="text-xl font-bold text-white">Add New Product</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-300 text-center mb-6">
                This would contain a full product form with fields for name, description, price, category, etc.
                For the demo, this is just a placeholder modal.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addNewProduct}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-center mb-4 text-red-500">
                <XCircleIcon className="h-16 w-16" />
              </div>
              <h3 className="text-xl font-bold text-white text-center mb-2">Confirm Deletion</h3>
              <p className="text-gray-300 text-center mb-6">
                Are you sure you want to delete this product? This action cannot be undone.
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteProduct(confirmDelete)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                >
                  <TrashIcon className="h-5 w-5 mr-2" />
                  Delete Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 