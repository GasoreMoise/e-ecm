'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  HomeIcon,
  BuildingStorefrontIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronDownIcon,
  ShoppingBagIcon,
  ArrowPathIcon,
  StarIcon,
  ShoppingCartIcon,
  EyeIcon,
  HeartIcon,
  EnvelopeIcon,
  PhoneIcon,
  CheckIcon,
  XMarkIcon
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
  tags: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  supplierId: string;
}

interface Supplier {
  id: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  status: 'active' | 'pending' | 'inactive';
  logoUrl?: string;
  rating: number;
  totalProducts: number;
  description: string;
}

// Supplier Product Catalog Page
export default function SupplierProductCatalog({ params }: { params: { supplierId: string } }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500 });
  const [sorting, setSorting] = useState('featured');
  const router = useRouter();
  const supplierId = params.supplierId;

  // Navigate back to suppliers list
  const goToSuppliers = () => {
    window.location.href = '/dashboard/buyer/suppliers';
  };

  // Navigate back to dashboard
  const goToDashboard = () => {
    window.location.href = '/dashboard/buyer';
  };

  // Categories derived from products
  const categories = () => {
    const cats = products.map(product => product.category);
    return ['all', ...Array.from(new Set(cats))];
  };

  // Load supplier and their products
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Mock supplier data
      const mockSupplier: Supplier = {
        id: supplierId,
        name: 'OptiCraft Eyewear',
        company: 'OptiCraft Inc.',
        email: 'orders@opticraft.com',
        phone: '+1 (555) 123-4567',
        status: 'active',
        logoUrl: '/logos/opticraft.jpg',
        rating: 4.8,
        totalProducts: 78,
        description: 'Premium eyewear manufacturer specializing in titanium frames, sunglasses, and prescription eyewear. Known for quality craftsmanship and innovative designs.'
      };

      // Mock product data
      const mockProducts: Product[] = [
        {
          id: 'PROD-001',
          name: 'Classic Titanium Frames',
          description: 'Lightweight titanium frames with adjustable nose pads for all-day comfort.',
          price: 199.99,
          image: '/products/titanium-frames.jpg',
          category: 'Prescription Frames',
          brand: 'OptiCraft',
          tags: ['titanium', 'lightweight', 'durable', 'prescription'],
          rating: 4.7,
          reviewCount: 128,
          inStock: true,
          supplierId
        },
        {
          id: 'PROD-002',
          name: 'Designer Cat-Eye Frames',
          description: 'Elegant cat-eye frames with premium acetate material for a stylish look.',
          price: 249.99,
          discountPrice: 199.99,
          image: '/products/cat-eye-frames.jpg',
          category: 'Prescription Frames',
          brand: 'OptiCraft',
          tags: ['cat-eye', 'designer', 'stylish', 'acetate'],
          rating: 4.9,
          reviewCount: 84,
          inStock: true,
          supplierId
        },
        {
          id: 'PROD-003',
          name: 'Ultra-Slim Reading Glasses',
          description: 'Slim profile reading glasses with anti-glare coating for reduced eye strain.',
          price: 89.99,
          image: '/products/reading-glasses.jpg',
          category: 'Reading Glasses',
          brand: 'OptiCraft',
          tags: ['reading', 'anti-glare', 'slim', 'lightweight'],
          rating: 4.5,
          reviewCount: 62,
          inStock: true,
          supplierId
        },
        {
          id: 'PROD-004',
          name: 'Premium Blue Light Blocking Glasses',
          description: 'Protect your eyes from digital screens with these premium blue light blocking lenses.',
          price: 129.99,
          image: '/products/blue-light-glasses.jpg',
          category: 'Computer Glasses',
          brand: 'OptiCraft',
          tags: ['blue-light', 'computer', 'digital', 'eye-protection'],
          rating: 4.8,
          reviewCount: 156,
          inStock: true,
          supplierId
        },
        {
          id: 'PROD-005',
          name: 'Aviator Sunglasses',
          description: 'Classic aviator design with polarized lenses for superior sun protection.',
          price: 159.99,
          image: '/products/aviator-sunglasses.jpg',
          category: 'Sunglasses',
          brand: 'OptiCraft',
          tags: ['sunglasses', 'aviator', 'polarized', 'UV-protection'],
          rating: 4.6,
          reviewCount: 98,
          inStock: true,
          supplierId
        },
        {
          id: 'PROD-006',
          name: 'Wraparound Sports Glasses',
          description: 'Impact-resistant sports glasses with adjustable strap for active lifestyles.',
          price: 179.99,
          image: '/products/sports-glasses.jpg',
          category: 'Sports Eyewear',
          brand: 'OptiCraft',
          tags: ['sports', 'impact-resistant', 'wraparound', 'adjustable'],
          rating: 4.4,
          reviewCount: 47,
          inStock: false,
          supplierId
        }
      ];
      
      setSupplier(mockSupplier);
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setIsLoading(false);
    }, 800);
  }, [supplierId]);

  // Apply filters
  useEffect(() => {
    if (products.length === 0) return;

    let result = [...products];
    
    // Search term filter
    if (searchTerm) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    // Price range filter
    result = result.filter(product => {
      const price = product.discountPrice || product.price;
      return price >= priceRange.min && price <= priceRange.max;
    });
    
    // Sorting
    result = result.sort((a, b) => {
      switch (sorting) {
        case 'price-low':
          return (a.discountPrice || a.price) - (b.discountPrice || b.price);
        case 'price-high':
          return (b.discountPrice || b.price) - (a.discountPrice || a.price);
        case 'rating':
          return b.rating - a.rating;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
    
    setFilteredProducts(result);
  }, [products, searchTerm, selectedCategory, priceRange, sorting]);

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
    setPriceRange({ min: 0, max: 500 });
    setSorting('featured');
  };

  // Contact supplier
  const contactSupplier = () => {
    window.location.href = `/dashboard/buyer/messages?supplier=${supplierId}`;
  };

  // Add to cart handler
  const handleAddToCart = (productId: string) => {
    console.log(`Product ${productId} added to cart`);
    // Implement cart functionality here
  };

  // View product details handler
  const handleViewProduct = (productId: string) => {
    window.location.href = `/dashboard/buyer/products/${productId}`;
  };

  // Wishlist handler
  const handleAddToWishlist = (productId: string) => {
    console.log(`Product ${productId} added to wishlist`);
    // Implement wishlist functionality here
  };

  // Render stars for rating
  const renderStars = (rating: number) => {
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
        {/* Navigation */}
        <div className="flex items-center space-x-2 mb-4">
          <button
            onClick={goToDashboard}
            className="flex items-center text-gray-300 hover:text-white bg-gray-900 rounded-lg px-3 py-2 shadow-md"
          >
            <HomeIcon className="h-5 w-5" />
          </button>
          <span className="text-gray-500">/</span>
          <button
            onClick={goToSuppliers}
            className="flex items-center text-gray-300 hover:text-white bg-gray-900 rounded-lg px-4 py-2 shadow-md"
          >
            <BuildingStorefrontIcon className="h-5 w-5 mr-2" />
            <span>Suppliers</span>
          </button>
          <span className="text-gray-500">/</span>
          <span className="text-white bg-gray-900 rounded-lg px-4 py-2 shadow-md">
            {supplier?.company || 'Loading...'}
          </span>
        </div>
        
        {isLoading ? (
          <div className="bg-gray-900 rounded-xl p-12 shadow-md flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
            <p className="mt-4 text-gray-300">Loading supplier products...</p>
          </div>
        ) : (
          <>
            {/* Supplier Info Card */}
            <div className="bg-gray-900 rounded-2xl p-6 text-white mb-6 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="h-16 w-16 rounded-full bg-gray-800 flex items-center justify-center mr-6">
                  <BuildingStorefrontIcon className="h-8 w-8 text-gray-500" />
                </div>
                <div className="flex-grow mt-4 md:mt-0">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h1 className="text-2xl font-bold mb-1">{supplier?.company}</h1>
                      <p className="text-gray-400">{supplier?.name}</p>
                      <div className="flex items-center mt-2">
                        <div className="flex mr-1">
                          {renderStars(supplier?.rating || 0)}
                        </div>
                        <span className="text-sm text-gray-400">
                          {supplier?.rating.toFixed(1)} ({supplier?.totalProducts} products)
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <button
                        onClick={contactSupplier}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center"
                      >
                        <EnvelopeIcon className="h-5 w-5 mr-2" />
                        Contact Supplier
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {supplier?.description && (
                <div className="mt-4 p-4 bg-gray-800 rounded-lg text-gray-300">
                  {supplier.description}
                </div>
              )}
              {supplier?.phone && (
                <div className="mt-4 flex items-center text-gray-300">
                  <PhoneIcon className="h-5 w-5 mr-2 text-gray-500" />
                  <span>{supplier.phone}</span>
                </div>
              )}
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
                    placeholder="Search products by name, description, or tags..."
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
                      {categories().map(category => (
                        <option key={category} value={category}>
                          {category === 'all' ? 'All Categories' : category}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Price Range: {formatCurrency(priceRange.min)} - {formatCurrency(priceRange.max)}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="range"
                        min="0"
                        max="500"
                        step="10"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({...priceRange, min: parseInt(e.target.value)})}
                        className="w-full"
                      />
                      <input
                        type="range"
                        min="0"
                        max="500"
                        step="10"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({...priceRange, max: parseInt(e.target.value)})}
                        className="w-full"
                      />
                    </div>
                  </div>
                  
                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Sort By</label>
                    <select
                      className="block w-full bg-gray-800 border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
                      value={sorting}
                      onChange={(e) => setSorting(e.target.value)}
                    >
                      <option value="featured">Featured</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                      <option value="name-asc">Name: A to Z</option>
                      <option value="name-desc">Name: Z to A</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-gray-900 rounded-xl p-12 shadow-md flex flex-col items-center justify-center">
                <div className="h-24 w-24 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <ShoppingBagIcon className="h-12 w-12 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-white mb-1">No products found</h3>
                <p className="text-gray-400 mb-4">Try adjusting your search or filter criteria</p>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={resetFilters}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                  <div key={product.id} className="bg-gray-900 rounded-xl shadow-md overflow-hidden group">
                    <div className="relative h-64">
                      <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                        <ShoppingBagIcon className="h-12 w-12 text-gray-700" />
                      </div>
                      {/* Uncomment when you have actual images
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover w-full h-full"
                      />
                      */}
                      <div className="absolute top-0 right-0 p-2">
                        {product.discountPrice && (
                          <span className="bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
                            {Math.round((1 - product.discountPrice/product.price) * 100)}% OFF
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent p-4">
                        <h3 className="text-lg font-semibold text-white truncate">{product.name}</h3>
                        <p className="text-gray-400 text-sm truncate">{product.category}</p>
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button 
                          onClick={() => handleViewProduct(product.id)}
                          className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-200 transition-colors"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleAddToWishlist(product.id)}
                          className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-200 transition-colors"
                        >
                          <HeartIcon className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleAddToCart(product.id)}
                          className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                        >
                          <ShoppingCartIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          {renderStars(product.rating)}
                          <span className="text-xs text-gray-400 ml-1">({product.reviewCount})</span>
                        </div>
                        {product.inStock ? (
                          <span className="text-xs font-medium text-green-400 flex items-center">
                            <CheckIcon className="h-3 w-3 mr-1" /> In Stock
                          </span>
                        ) : (
                          <span className="text-xs font-medium text-red-400 flex items-center">
                            <XMarkIcon className="h-3 w-3 mr-1" /> Out of Stock
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div>
                          {product.discountPrice ? (
                            <div>
                              <span className="text-gray-400 line-through text-sm">
                                {formatCurrency(product.price)}
                              </span>
                              <span className="ml-2 text-white font-bold">
                                {formatCurrency(product.discountPrice)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-white font-bold">{formatCurrency(product.price)}</span>
                          )}
                        </div>
                        <button
                          onClick={() => handleAddToCart(product.id)}
                          disabled={!product.inStock}
                          className={`px-3 py-1 rounded-lg text-sm font-medium ${
                            product.inStock 
                              ? 'bg-blue-600 text-white hover:bg-blue-700' 
                              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                          } transition-colors`}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 