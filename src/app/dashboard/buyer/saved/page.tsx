'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  HeartIcon,
  TrashIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline'

interface SavedItem {
  id: string
  name: string
  supplier: string
  price: number
  image: string
  inStock: boolean
}

const mockSavedItems: SavedItem[] = [
  {
    id: '1',
    name: 'Premium Titanium Frames',
    supplier: 'OptiCraft Solutions',
    price: 299.99,
    image: '/placeholder.jpg',
    inStock: true
  },
  {
    id: '2',
    name: 'Blue Light Filter Lenses',
    supplier: 'VisionPro International',
    price: 149.99,
    image: '/placeholder.jpg',
    inStock: false
  }
]

export default function SavedItems() {
  const [savedItems, setSavedItems] = useState<SavedItem[]>(mockSavedItems)
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      if (response.ok) {
        router.push('/auth/login')
      } else {
        console.error('Logout failed')
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const removeItem = (id: string) => {
    setSavedItems(savedItems.filter(item => item.id !== id))
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <HeartIcon className="h-8 w-8" />
              <h1 className="text-2xl font-bold">Saved Items</h1>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedItems.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                {/* Replace with actual image */}
                <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">Product Image</span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {item.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                <p className="text-gray-500 mb-2">{item.supplier}</p>
                <p className="text-2xl font-bold text-blue-600 mb-4">${item.price.toFixed(2)}</p>
                <div className="flex space-x-2">
                  <button
                    className="flex-1 flex items-center justify-center space-x-2 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                    disabled={!item.inStock}
                  >
                    <ShoppingCartIcon className="h-5 w-5" />
                    <span>Add to Cart</span>
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {savedItems.length === 0 && (
          <div className="text-center py-12">
            <HeartIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No saved items</h2>
            <p className="text-gray-500">Items you save will appear here</p>
          </div>
        )}
      </div>
    </div>
  )
} 