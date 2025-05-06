'use client'
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { format, parseISO, isAfter, isBefore, isEqual } from 'date-fns'
import { useRouter } from 'next/navigation'
import {
  ShoppingBagIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronDownIcon,
  CheckIcon,
  ArrowDownTrayIcon,
  DocumentDuplicateIcon,
  EyeIcon,
  TruckIcon,
  ClockIcon,
  PaperAirplaneIcon,
  CreditCardIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserIcon,
  BuildingStorefrontIcon,
  ArrowPathIcon,
  PlusIcon,
  PrinterIcon,
  ArrowLeftIcon,
  ArrowUturnLeftIcon,
  ClipboardDocumentCheckIcon,
  HomeIcon,
} from '@heroicons/react/24/outline'

// Define types
interface OrderItem {
  id: string
  product: string
  productId: string
  image: string
  variant: string
  prescription?: {
    rightEye: {
      sphere: string
      cylinder: string
      axis: string
      add?: string
      pd?: string
    }
    leftEye: {
      sphere: string
      cylinder: string
      axis: string
      add?: string
      pd?: string
    }
    type: 'single-vision' | 'bifocal' | 'progressive' | 'reading'
    notes?: string
  }
  price: number
  quantity: number
  subtotal: number
}

interface Address {
  name: string
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone: string
  email: string
  isDefault?: boolean
}

interface PaymentMethod {
  id: string
  type: 'credit_card' | 'paypal' | 'bank_transfer' | 'other'
  lastFour?: string
  expiryDate?: string
  cardType?: string
  holderName?: string
  email?: string
}

interface Timeline {
  id: string
  status: string
  date: string
  description: string
  agent?: string
}

interface OrderNote {
  id: string
  date: string
  author: string
  content: string
  isInternal: boolean
}

type OrderStatus = 
  | 'pending' 
  | 'processing' 
  | 'awaiting_payment' 
  | 'on_hold' 
  | 'ready_to_ship'
  | 'shipped'
  | 'out_for_delivery' 
  | 'delivered' 
  | 'cancelled' 
  | 'refunded'
  | 'returned'
  | 'completed'
  | 'failed'

interface Order {
  id: string
  reference: string
  customer: {
    id: string
    name: string
    email: string
    phone?: string
    customerSince: string
    totalOrders: number
  }
  supplier?: {
    id: string
    name: string
    email?: string
    phone?: string
  }
  items: OrderItem[]
  shippingAddress: Address
  billingAddress: Address
  shippingMethod: {
    id: string
    name: string
    estimatedDelivery: string
    price: number
    trackingNumber?: string
    trackingUrl?: string
    carrier?: string
  }
  payment: {
    method: PaymentMethod
    status: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded'
    total: number
    currency: string
    datePaid?: string
    transactionId?: string
  }
  status: OrderStatus
  statusLabel: string
  placedAt: string
  updatedAt: string
  timeline: Timeline[]
  notes: OrderNote[]
  tags?: string[]
  subtotal: number
  tax: number
  shipping: number
  discount?: number
  total: number
  invoiceUrl?: string
  refundAmount?: number
  returnsAllowed: boolean
  returnsWindow?: string
  reorder?: boolean
}

interface FilterOptions {
  dateRange: {
    from: string | null
    to: string | null
  }
  status: OrderStatus | 'all'
  paymentStatus: 'all' | 'pending' | 'paid' | 'failed' | 'refunded'
  sortBy: 'date_desc' | 'date_asc' | 'total_desc' | 'total_asc'
}

// Mock data for orders
const generateMockOrders = (): Order[] => {
  return [];  // Return empty array for first-time user
}

export default function Orders() {
  // State management
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterMenuOpen, setFilterMenuOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailView, setIsDetailView] = useState(false)
  const router = useRouter()
  
  // Filter and sort options
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    dateRange: {
      from: null,
      to: null
    },
    status: 'all',
    paymentStatus: 'all',
    sortBy: 'date_desc'
  })
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  
  // Navigate back to dashboard
  const goToDashboard = () => {
    // Use window.location for navigation to ensure it works properly
    window.location.href = '/dashboard/buyer';
  }
  
  // Load orders
  useEffect(() => {
    // Simulate API call
    setIsLoading(true)
    setTimeout(() => {
      const mockOrders = generateMockOrders()
      setOrders(mockOrders)
      setIsLoading(false)
    }, 800)
  }, [])
  
  // Filter and search orders
  const filteredOrders = useCallback(() => {
    return orders.filter(order => {
      // Search term filter
      const searchMatch = 
        searchTerm === '' ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.supplier?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => item.product.toLowerCase().includes(searchTerm.toLowerCase()))
      
      // Status filter
      const statusMatch = filterOptions.status === 'all' || order.status === filterOptions.status
      
      // Payment status filter
      const paymentMatch = 
        filterOptions.paymentStatus === 'all' || 
        order.payment.status === filterOptions.paymentStatus
      
      // Date range filter
      let dateMatch = true
      if (filterOptions.dateRange.from) {
        const fromDate = new Date(filterOptions.dateRange.from)
        const orderDate = new Date(order.placedAt)
        dateMatch = dateMatch && (isAfter(orderDate, fromDate) || isEqual(orderDate, fromDate))
      }
      if (filterOptions.dateRange.to) {
        const toDate = new Date(filterOptions.dateRange.to)
        const orderDate = new Date(order.placedAt)
        dateMatch = dateMatch && (isBefore(orderDate, toDate) || isEqual(orderDate, toDate))
      }
      
      return searchMatch && statusMatch && paymentMatch && dateMatch
    }).sort((a, b) => {
      // Sort options
      switch (filterOptions.sortBy) {
        case 'date_desc':
          return new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime()
        case 'date_asc':
          return new Date(a.placedAt).getTime() - new Date(b.placedAt).getTime()
        case 'total_desc':
          return b.total - a.total
        case 'total_asc':
          return a.total - b.total
        default:
          return new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime()
      }
    })
  }, [orders, searchTerm, filterOptions])
  
  // Calculate pagination
  const totalFilteredOrders = filteredOrders().length
  const totalPages = Math.ceil(totalFilteredOrders / itemsPerPage)
  const indexOfLastOrder = currentPage * itemsPerPage
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage
  const currentOrders = filteredOrders().slice(indexOfFirstOrder, indexOfLastOrder)
  
  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }
  
  // Reset filters
  const resetFilters = () => {
    setFilterOptions({
      dateRange: {
        from: null,
        to: null
      },
      status: 'all',
      paymentStatus: 'all',
      sortBy: 'date_desc'
    })
    setSearchTerm('')
  }
  
  // View order details
  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsDetailView(true)
  }
  
  // Back to list view
  const backToList = () => {
    setIsDetailView(false)
    setSelectedOrder(null)
  }
  
  // Get status badge style
  const getStatusBadgeStyle = (status: OrderStatus) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      awaiting_payment: 'bg-orange-100 text-orange-800',
      on_hold: 'bg-gray-100 text-gray-800',
      ready_to_ship: 'bg-indigo-100 text-indigo-800',
      shipped: 'bg-purple-100 text-purple-800',
      out_for_delivery: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      refunded: 'bg-pink-100 text-pink-800',
      returned: 'bg-pink-100 text-pink-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800'
    }
    return styles[status] || 'bg-gray-100 text-gray-800'
  }
  
  // Get payment status badge style
  const getPaymentBadgeStyle = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-pink-100 text-pink-800',
      partially_refunded: 'bg-orange-100 text-orange-800'
    }
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'
  }
  
  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM d, yyyy h:mm a')
    } catch {
      // Ignore error and return original string
      return dateString
    }
  }
  
  // Format currency
  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }
  
  // If detail view is active, render order details
  if (isDetailView && selectedOrder) {
    return (
      <div className="p-6 bg-gray-800 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Navigation buttons */}
          <div className="flex items-center space-x-4 mb-6">
            <button
              className="flex items-center text-gray-300 hover:text-white transition-colors"
              onClick={backToList}
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Orders
            </button>
            
            <button
              onClick={goToDashboard}
              className="flex items-center text-gray-300 hover:text-white bg-gray-900 rounded-lg px-4 py-2"
            >
              <HomeIcon className="h-5 w-5 mr-2" />
              <span>Back to Dashboard</span>
            </button>
          </div>
          
          {/* Order Header */}
          <div className="bg-gray-900 rounded-xl shadow-md mb-6 overflow-hidden">
            <div className="p-6 border-b border-gray-700">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center">
                    <h1 className="text-2xl font-bold text-white mr-3">{selectedOrder.reference}</h1>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeStyle(selectedOrder.status)}`}>
                      {selectedOrder.statusLabel}
                    </span>
                  </div>
                  <p className="text-gray-400 mt-1">Placed on {formatDate(selectedOrder.placedAt)}</p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {selectedOrder.invoiceUrl && (
                    <button className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white hover:bg-gray-700 transition-colors flex items-center">
                      <ArrowDownTrayIcon className="h-5 w-5 mr-2 text-gray-400" />
                      Invoice
                    </button>
                  )}
                  
                  <button className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white hover:bg-gray-700 transition-colors flex items-center">
                    <PrinterIcon className="h-5 w-5 mr-2 text-gray-400" />
                    Print
                  </button>
                  
                  {selectedOrder.status === 'shipped' && selectedOrder.shippingMethod.trackingNumber && (
                    <a
                      href={selectedOrder.shippingMethod.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <TruckIcon className="h-5 w-5 mr-2" />
                      Track Package
                    </a>
                  )}
                  
                  {selectedOrder.returnsAllowed && (
                    <button className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white hover:bg-gray-700 transition-colors flex items-center">
                      <ArrowUturnLeftIcon className="h-5 w-5 mr-2 text-gray-400" />
                      Return Items
                    </button>
                  )}
                  
                  {selectedOrder.reorder && (
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center">
                      <ArrowPathIcon className="h-5 w-5 mr-2" />
                      Reorder
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Order Timeline */}
            <div className="p-6 bg-gray-800 border-b border-gray-700">
              <h2 className="text-lg font-medium text-white mb-4">Order Progress</h2>
              <div className="relative">
                <div className="absolute top-0 left-5 h-full w-0.5 bg-gray-700"></div>
                <ul className="space-y-4 relative">
                  {selectedOrder.timeline.map((event, index) => (
                    <li key={event.id} className="flex items-start">
                      <div className={`relative flex items-center justify-center h-10 w-10 rounded-full mr-4 ${
                        index === 0 ? 'bg-blue-500 text-white' : 
                        event.status === 'delivered' || event.status === 'completed' ? 'bg-green-500 text-white' : 
                        event.status === 'return_requested' || event.status === 'return_approved' || event.status === 'returned' ? 'bg-red-500 text-white' : 
                        'bg-gray-700 text-gray-300'
                      }`}>
                        {event.status.includes('order') && <DocumentDuplicateIcon className="h-5 w-5" />}
                        {event.status.includes('process') && <ClockIcon className="h-5 w-5" />}
                        {event.status.includes('prescription') && <ClipboardDocumentCheckIcon className="h-5 w-5" />}
                        {event.status.includes('manufacturing') && <BuildingStorefrontIcon className="h-5 w-5" />}
                        {event.status.includes('quality') && <CheckCircleIcon className="h-5 w-5" />}
                        {event.status.includes('shipped') && <TruckIcon className="h-5 w-5" />}
                        {event.status.includes('delivered') && <CheckIcon className="h-5 w-5" />}
                        {event.status.includes('return') && <ArrowUturnLeftIcon className="h-5 w-5" />}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">
                          {event.description}
                          {event.agent && <span className="ml-2 text-gray-400">by {event.agent}</span>}
                        </div>
                        <div className="text-xs text-gray-400">{formatDate(event.date)}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          {/* Order Details Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items */}
              <div className="bg-gray-900 rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-700">
                  <h2 className="text-lg font-medium text-white">Order Items</h2>
                </div>
                <div className="divide-y divide-gray-700">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="p-6 flex flex-col md:flex-row">
                      <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                        <div className="h-24 w-24 bg-gray-800 rounded-lg overflow-hidden relative">
                          <Image
                            src={item.image || '/placeholder-product.png'}
                            alt={item.product}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-lg"
                          />
                        </div>
                      </div>
                      <div className="flex-grow">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                          <div>
                            <h3 className="text-base font-medium text-white">{item.product}</h3>
                            <p className="text-sm text-gray-400">{item.variant}</p>
                            
                            {item.prescription && (
                              <div className="mt-2 p-3 bg-gray-800 rounded-lg">
                                <div className="text-xs font-medium text-blue-400 mb-1">Prescription Details</div>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                                  <div>
                                    <span className="font-medium text-gray-300">Right Eye: </span>
                                    <span className="text-gray-400">
                                      SPH {item.prescription.rightEye.sphere}{' '}
                                      CYL {item.prescription.rightEye.cylinder}{' '}
                                      AXIS {item.prescription.rightEye.axis}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-300">Left Eye: </span>
                                    <span className="text-gray-400">
                                      SPH {item.prescription.leftEye.sphere}{' '}
                                      CYL {item.prescription.leftEye.cylinder}{' '}
                                      AXIS {item.prescription.leftEye.axis}
                                    </span>
                                  </div>
                                  <div className="col-span-2">
                                    <span className="font-medium text-gray-300">Type: </span>
                                    <span className="text-gray-400 capitalize">{item.prescription.type.replace('-', ' ')}</span>
                                  </div>
                                  {item.prescription.notes && (
                                    <div className="col-span-2">
                                      <span className="font-medium text-gray-300">Notes: </span>
                                      <span className="text-gray-400">{item.prescription.notes}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="mt-2 md:mt-0 text-right">
                            <div className="text-sm font-medium text-white">
                              {formatCurrency(item.price)} × {item.quantity}
                            </div>
                            <div className="text-base font-bold text-white mt-1">
                              {formatCurrency(item.subtotal)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Order Summary */}
                <div className="p-6 bg-gray-800 border-t border-gray-700">
                  <div className="flow-root">
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                      <p>Subtotal</p>
                      <p>{formatCurrency(selectedOrder.subtotal)}</p>
                    </div>
                    {selectedOrder.discount && selectedOrder.discount > 0 && (
                      <div className="flex justify-between text-sm text-green-400 mb-2">
                        <p>Discount</p>
                        <p>-{formatCurrency(selectedOrder.discount)}</p>
                      </div>
                    )}
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                      <p>Shipping</p>
                      <p>{formatCurrency(selectedOrder.shipping)}</p>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400 mb-4">
                      <p>Tax</p>
                      <p>{formatCurrency(selectedOrder.tax)}</p>
                    </div>
                    <div className="flex justify-between text-base font-medium text-white">
                      <p>Total</p>
                      <p>{formatCurrency(selectedOrder.total)}</p>
                    </div>
                    {selectedOrder.refundAmount && selectedOrder.refundAmount > 0 && (
                      <div className="flex justify-between text-sm text-red-400 mt-2">
                        <p>Refunded</p>
                        <p>-{formatCurrency(selectedOrder.refundAmount)}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Notes & Communication */}
              {selectedOrder.notes.length > 0 && (
                <div className="bg-gray-900 rounded-xl shadow-md overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
                    <h2 className="text-lg font-medium text-white">Order Notes</h2>
                    <button className="text-sm text-blue-400 hover:text-blue-300">Add Note</button>
                  </div>
                  <div className="p-6 space-y-4">
                    {selectedOrder.notes.map((note) => (
                      <div key={note.id} className="flex items-start">
                        <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center mr-4">
                          <UserIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-white">
                              {note.author}
                              {note.isInternal && (
                                <span className="ml-2 px-2 py-0.5 inline-flex text-xs font-medium bg-gray-800 text-gray-300 rounded-md">
                                  Internal
                                </span>
                              )}
                            </h3>
                            <p className="text-xs text-gray-400">{formatDate(note.date)}</p>
                          </div>
                          <p className="mt-1 text-sm text-gray-400">{note.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Payment Details */}
              <div className="bg-gray-900 rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-700">
                  <h2 className="text-lg font-medium text-white">Payment Information</h2>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      {selectedOrder.payment.method.type === 'credit_card' && (
                        <>
                          <div className="h-10 w-10 bg-gray-800 rounded-lg flex items-center justify-center mr-4">
                            <CreditCardIcon className="h-6 w-6 text-blue-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">
                              {selectedOrder.payment.method.cardType} •••• {selectedOrder.payment.method.lastFour}
                            </p>
                            <p className="text-xs text-gray-400">
                              Expires {selectedOrder.payment.method.expiryDate}
                            </p>
                          </div>
                        </>
                      )}
                      {selectedOrder.payment.method.type === 'paypal' && (
                        <>
                          <div className="h-10 w-10 bg-gray-800 rounded-lg flex items-center justify-center mr-4">
                            <span className="text-blue-400 font-bold">P</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">PayPal</p>
                            <p className="text-xs text-gray-400">{selectedOrder.payment.method.email}</p>
                          </div>
                        </>
                      )}
                    </div>
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getPaymentBadgeStyle(selectedOrder.payment.status)}`}>
                      {selectedOrder.payment.status.charAt(0).toUpperCase() + selectedOrder.payment.status.slice(1).replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="border-t border-gray-700 pt-4">
                    <div className="flex justify-between mb-2">
                      <p className="text-sm text-gray-400">Transaction ID</p>
                      <p className="text-sm font-mono text-white">{selectedOrder.payment.transactionId || 'N/A'}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-400">Payment Date</p>
                      <p className="text-sm text-white">
                        {selectedOrder.payment.datePaid ? formatDate(selectedOrder.payment.datePaid) : 'Pending'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Side Panel for Customer & Shipping Info */}
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="bg-gray-900 rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
                  <h2 className="text-lg font-medium text-white">Customer</h2>
                  <span className="text-xs text-gray-400">Customer ID: {selectedOrder.customer.id}</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-gray-800 flex items-center justify-center mr-4">
                      <UserIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-white">{selectedOrder.customer.name}</h3>
                      <p className="text-sm text-gray-400">Customer since {
                        (() => {
                          try {
                            return format(parseISO(selectedOrder.customer.customerSince), 'MMM yyyy')
                          } catch {
                            return selectedOrder.customer.customerSince
                          }
                        })()
                      }</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <EnvelopeIcon className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                      <span className="text-sm text-gray-300">{selectedOrder.customer.email}</span>
                    </div>
                    {selectedOrder.customer.phone && (
                      <div className="flex items-start">
                        <PhoneIcon className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                        <span className="text-sm text-gray-300">{selectedOrder.customer.phone}</span>
                      </div>
                    )}
                    <div className="flex items-start">
                      <ShoppingBagIcon className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                      <span className="text-sm text-gray-300">
                        {selectedOrder.customer.totalOrders} {selectedOrder.customer.totalOrders === 1 ? 'order' : 'orders'} placed
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Shipping Information */}
              <div className="bg-gray-900 rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-700">
                  <h2 className="text-lg font-medium text-white">Shipping</h2>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-white mb-2">Shipping Address</h3>
                    <div className="bg-gray-800 rounded-lg p-4">
                      <p className="text-sm text-white font-medium">{selectedOrder.shippingAddress.name}</p>
                      <p className="text-sm text-gray-400">{selectedOrder.shippingAddress.line1}</p>
                      {selectedOrder.shippingAddress.line2 && (
                        <p className="text-sm text-gray-400">{selectedOrder.shippingAddress.line2}</p>
                      )}
                      <p className="text-sm text-gray-400">
                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}
                      </p>
                      <p className="text-sm text-gray-400">{selectedOrder.shippingAddress.country}</p>
                      <p className="text-sm text-gray-400 mt-2">{selectedOrder.shippingAddress.phone}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-white mb-2">Shipping Method</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <TruckIcon className="h-5 w-5 text-gray-500 mr-3" />
                        <span className="text-sm text-gray-300">{selectedOrder.shippingMethod.name}</span>
                      </div>
                      <span className="text-sm font-medium text-white">{formatCurrency(selectedOrder.shippingMethod.price)}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 ml-8">
                      Estimated delivery: {selectedOrder.shippingMethod.estimatedDelivery}
                    </p>
                  </div>
                  
                  {selectedOrder.shippingMethod.trackingNumber && (
                    <div>
                      <h3 className="text-sm font-medium text-white mb-2">Tracking Information</h3>
                      <div className="bg-gray-800 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-white">{selectedOrder.shippingMethod.carrier}</span>
                          <a 
                            href={selectedOrder.shippingMethod.trackingUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-blue-400 hover:text-blue-300"
                          >
                            Track
                          </a>
                        </div>
                        <p className="text-sm font-mono text-gray-400">{selectedOrder.shippingMethod.trackingNumber}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Billing Information */}
              <div className="bg-gray-900 rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-700">
                  <h2 className="text-lg font-medium text-white">Billing</h2>
                </div>
                <div className="p-6">
                  <h3 className="text-sm font-medium text-white mb-2">Billing Address</h3>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <p className="text-sm text-white font-medium">{selectedOrder.billingAddress.name}</p>
                    <p className="text-sm text-gray-400">{selectedOrder.billingAddress.line1}</p>
                    {selectedOrder.billingAddress.line2 && (
                      <p className="text-sm text-gray-400">{selectedOrder.billingAddress.line2}</p>
                    )}
                    <p className="text-sm text-gray-400">
                      {selectedOrder.billingAddress.city}, {selectedOrder.billingAddress.state} {selectedOrder.billingAddress.postalCode}
                    </p>
                    <p className="text-sm text-gray-400">{selectedOrder.billingAddress.country}</p>
                    <p className="text-sm text-gray-400 mt-2">{selectedOrder.billingAddress.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // List view UI
  return (
    <div className="p-6 bg-gray-800 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Back button to dashboard */}
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
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <ShoppingBagIcon className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">Orders</h1>
                <p className="text-gray-400">Manage and track your eyewear orders</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button 
                className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
                onClick={() => {/* Export functionality */}}
              >
                <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                Export
              </button>
              <button 
                className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
                onClick={() => {/* Download functionality */}}
              >
                <DocumentDuplicateIcon className="h-5 w-5 mr-2" />
                Download Report
              </button>
              <button 
                className="px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors font-medium flex items-center"
                onClick={() => {/* New order functionality */}}
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                New Order
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-900 p-4 rounded-xl shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Orders</p>
                <p className="text-2xl font-bold text-white">{orders.length}</p>
              </div>
              <div className="h-12 w-12 bg-gray-800 rounded-lg flex items-center justify-center">
                <ShoppingBagIcon className="h-6 w-6 text-blue-400" />
              </div>
            </div>
            <div className="mt-2 text-xs text-green-400 flex items-center">
              <ArrowPathIcon className="h-3 w-3 mr-1" />
              Updated just now
            </div>
          </div>
          
          <div className="bg-gray-900 p-4 rounded-xl shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">In Progress</p>
                <p className="text-2xl font-bold text-white">
                  {orders.filter(o => ['processing', 'shipped', 'ready_to_ship'].includes(o.status)).length}
                </p>
              </div>
              <div className="h-12 w-12 bg-gray-800 rounded-lg flex items-center justify-center">
                <ClockIcon className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
            <div className="mt-2 text-xs text-blue-400 flex items-center">
              <TruckIcon className="h-3 w-3 mr-1" />
              {orders.filter(o => o.status === 'shipped').length} shipped
            </div>
          </div>
          
          <div className="bg-gray-900 p-4 rounded-xl shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Delivered</p>
                <p className="text-2xl font-bold text-white">
                  {orders.filter(o => o.status === 'delivered' || o.status === 'completed').length}
                </p>
              </div>
              <div className="h-12 w-12 bg-gray-800 rounded-lg flex items-center justify-center">
                <CheckCircleIcon className="h-6 w-6 text-green-400" />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-400">
              Last delivery: {formatDate(orders.filter(o => o.status === 'delivered').sort((a, b) => 
                new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
              )[0]?.updatedAt || new Date().toISOString()).split(',')[0]}
            </div>
          </div>
          
          <div className="bg-gray-900 p-4 rounded-xl shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Issues</p>
                <p className="text-2xl font-bold text-white">
                  {orders.filter(o => ['cancelled', 'refunded', 'returned', 'failed'].includes(o.status)).length}
                </p>
              </div>
              <div className="h-12 w-12 bg-gray-800 rounded-lg flex items-center justify-center">
                <ExclamationCircleIcon className="h-6 w-6 text-red-400" />
              </div>
            </div>
            <div className="mt-2 text-xs text-red-400 flex items-center">
              <XCircleIcon className="h-3 w-3 mr-1" />
              {orders.filter(o => o.status === 'returned').length} returns
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
                placeholder="Search orders by ID, customer, product..."
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
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-700">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Order Status</label>
                <select
                  className="block w-full bg-gray-800 border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
                  value={filterOptions.status}
                  onChange={(e) => setFilterOptions({...filterOptions, status: e.target.value as OrderStatus | 'all'})}
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="awaiting_payment">Awaiting Payment</option>
                  <option value="on_hold">On Hold</option>
                  <option value="ready_to_ship">Ready to Ship</option>
                  <option value="shipped">Shipped</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                  <option value="returned">Returned</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              
              {/* Payment Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Payment Status</label>
                <select
                  className="block w-full bg-gray-800 border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
                  value={filterOptions.paymentStatus}
                  onChange={(e) => setFilterOptions({...filterOptions, paymentStatus: e.target.value as 'all' | 'pending' | 'paid' | 'failed' | 'refunded'})}
                >
                  <option value="all">All Payment Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
              
              {/* Date Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">From Date</label>
                <input
                  type="date"
                  className="block w-full bg-gray-800 border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
                  value={filterOptions.dateRange.from || ''}
                  onChange={(e) => setFilterOptions({
                    ...filterOptions,
                    dateRange: {...filterOptions.dateRange, from: e.target.value || null}
                  })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">To Date</label>
                <input
                  type="date"
                  className="block w-full bg-gray-800 border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
                  value={filterOptions.dateRange.to || ''}
                  onChange={(e) => setFilterOptions({
                    ...filterOptions,
                    dateRange: {...filterOptions.dateRange, to: e.target.value || null}
                  })}
                />
              </div>
              
              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Sort By</label>
                <select
                  className="block w-full bg-gray-800 border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
                  value={filterOptions.sortBy}
                  onChange={(e) => setFilterOptions({
                    ...filterOptions,
                    sortBy: e.target.value as 'date_desc' | 'date_asc' | 'total_desc' | 'total_asc'
                  })}
                >
                  <option value="date_desc">Newest First</option>
                  <option value="date_asc">Oldest First</option>
                  <option value="total_desc">Highest Total</option>
                  <option value="total_asc">Lowest Total</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Orders Table */}
        {isLoading ? (
          <div className="bg-gray-900 rounded-xl p-12 shadow-md flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
            <p className="mt-4 text-gray-300">Loading your orders...</p>
          </div>
        ) : currentOrders.length === 0 ? (
          <div className="bg-gray-900 rounded-xl p-12 shadow-md flex flex-col items-center justify-center">
            <div className="h-24 w-24 bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <ShoppingBagIcon className="h-12 w-12 text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-white mb-1">No orders found</h3>
            <p className="text-gray-400 mb-4">Try adjusting your search or filter criteria</p>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={resetFilters}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Order</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Customer</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Payment</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Total</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900 divide-y divide-gray-800">
                  {currentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-800 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-gray-800 rounded-full flex items-center justify-center">
                            <ShoppingBagIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">{order.reference}</div>
                            <div className="text-xs text-gray-400">{order.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{formatDate(order.placedAt).split(',')[0]}</div>
                        <div className="text-xs text-gray-400">{formatDate(order.placedAt).split(',')[1]}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{order.customer.name}</div>
                        <div className="text-xs text-gray-400">{order.customer.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getStatusBadgeStyle(order.status)}`}>
                          {order.statusLabel}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getPaymentBadgeStyle(order.payment.status)}`}>
                          {order.payment.status.charAt(0).toUpperCase() + order.payment.status.slice(1).replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {formatCurrency(order.total, order.payment.currency)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-3">
                          <button
                            className="text-blue-400 hover:text-blue-300"
                            onClick={() => viewOrderDetails(order)}
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                          {order.status === 'delivered' && (
                            <button className="text-gray-400 hover:text-gray-300">
                              <PaperAirplaneIcon className="h-5 w-5" />
                            </button>
                          )}
                          {order.status === 'shipped' && (
                            <button className="text-purple-400 hover:text-purple-300">
                              <TruckIcon className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 bg-gray-800 border-t border-gray-700 flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  Showing <span className="font-medium text-white">{indexOfFirstOrder + 1}</span> to{' '}
                  <span className="font-medium text-white">{Math.min(indexOfLastOrder, totalFilteredOrders)}</span> of{' '}
                  <span className="font-medium text-white">{totalFilteredOrders}</span> orders
                </div>
                <div className="flex space-x-2">
                  <button
                    className={`px-3 py-1 border border-gray-700 rounded-md text-white ${currentPage === 1 ? 'bg-gray-800 cursor-not-allowed' : 'hover:bg-gray-700'}`}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      className={`px-3 py-1 border rounded-md ${currentPage === i + 1 ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-700 text-white hover:bg-gray-700'}`}
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    className={`px-3 py-1 border border-gray-700 rounded-md text-white ${currentPage === totalPages ? 'bg-gray-800 cursor-not-allowed' : 'hover:bg-gray-700'}`}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 