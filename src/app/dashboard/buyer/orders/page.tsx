'use client'
import { useState, useEffect, Fragment, useCallback } from 'react'
import { Dialog, Transition, Listbox, Tab, Disclosure } from '@headlessui/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { format, parseISO, isAfter, isBefore, isEqual } from 'date-fns'
import {
  ShoppingBagIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronDownIcon,
  XMarkIcon,
  CheckIcon,
  AdjustmentsHorizontalIcon,
  ArrowDownTrayIcon,
  DocumentDuplicateIcon,
  EyeIcon,
  TruckIcon,
  ClockIcon,
  PaperAirplaneIcon,
  TagIcon,
  CreditCardIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  ChevronUpDownIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserIcon,
  MapPinIcon,
  BuildingStorefrontIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  ArrowPathIcon,
  ChevronUpIcon,
  ChevronRightIcon,
  PlusIcon,
  PrinterIcon,
  CalculatorIcon,
  ArrowLeftIcon,
  ArrowUturnLeftIcon,
  StarIcon,
  CalendarIcon,
  BanknotesIcon,
  ClipboardDocumentCheckIcon,
  InformationCircleIcon
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

const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    product: 'Premium Eyewear Lens',
    supplier: 'OptiCraft Solutions',
    date: '2024-01-15',
    status: 'delivered',
    total: 299.99
  },
  {
    id: 'ORD-002',
    product: 'Designer Frames Bundle',
    supplier: 'VisionPro International',
    date: '2024-01-18',
    status: 'processing',
    total: 549.99
  },
  // Add more mock orders as needed
]

// Mock data for orders
const generateMockOrders = (): Order[] => {
  return [
    {
      id: 'ORD-10247',
      reference: 'EYEWR-10247',
      customer: {
        id: 'CUST-1028',
        name: 'John Martinez',
        email: 'john.martinez@example.com',
        phone: '+1 (555) 123-4567',
        customerSince: '2023-05-12',
        totalOrders: 3
      },
      supplier: {
        id: 'SUP-124',
        name: 'OptiCraft Solutions',
        email: 'orders@opticraft.com',
        phone: '+1 (555) 987-6543'
      },
      items: [
        {
          id: 'ITEM-1',
          product: 'Premium Titanium Aviator Frames',
          productId: 'PROD-327',
          image: '/frames/titanium-aviator.jpg',
          variant: 'Gunmetal Gray',
          prescription: {
            rightEye: {
              sphere: '-2.50',
              cylinder: '-0.75',
              axis: '180',
              pd: '32'
            },
            leftEye: {
              sphere: '-2.25',
              cylinder: '-0.50',
              axis: '175',
              pd: '32'
            },
            type: 'single-vision'
          },
          price: 199.99,
          quantity: 1,
          subtotal: 199.99
        },
        {
          id: 'ITEM-2',
          product: 'Blue Light Blocking Coating',
          productId: 'PROD-112',
          image: '/add-ons/blue-light.jpg',
          variant: 'Standard',
          price: 49.99,
          quantity: 1,
          subtotal: 49.99
        }
      ],
      shippingAddress: {
        name: 'John Martinez',
        line1: '123 Main Street',
        line2: 'Apt 4B',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'United States',
        phone: '+1 (555) 123-4567',
        email: 'john.martinez@example.com',
        isDefault: true
      },
      billingAddress: {
        name: 'John Martinez',
        line1: '123 Main Street',
        line2: 'Apt 4B',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'United States',
        phone: '+1 (555) 123-4567',
        email: 'john.martinez@example.com',
        isDefault: true
      },
      shippingMethod: {
        id: 'SHP-1',
        name: 'Priority Shipping',
        estimatedDelivery: '2-3 Business Days',
        price: 9.99,
        trackingNumber: '9400111899562738274651',
        trackingUrl: 'https://tools.usps.com/go/TrackConfirmAction?tLabels=9400111899562738274651',
        carrier: 'USPS'
      },
      payment: {
        method: {
          id: 'PAY-1',
          type: 'credit_card',
          lastFour: '4242',
          expiryDate: '05/25',
          cardType: 'Visa',
          holderName: 'John Martinez'
        },
        status: 'paid',
        total: 259.97,
        currency: 'USD',
        datePaid: '2024-01-15T10:32:48Z',
        transactionId: 'txn_1Ms9y7KL8M7xdhYU12345678'
      },
      status: 'delivered',
      statusLabel: 'Delivered',
      placedAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-21T14:22:17Z',
      timeline: [
        {
          id: 'TL-1',
          status: 'order_placed',
          date: '2024-01-15T10:30:00Z',
          description: 'Order placed and payment received'
        },
        {
          id: 'TL-2',
          status: 'processing',
          date: '2024-01-16T09:15:22Z',
          description: 'Order processing started'
        },
        {
          id: 'TL-3',
          status: 'prescription_verified',
          date: '2024-01-16T11:42:05Z',
          description: 'Prescription verified',
          agent: 'Dr. Sarah Johnson'
        },
        {
          id: 'TL-4',
          status: 'manufacturing',
          date: '2024-01-17T08:30:12Z',
          description: 'Lenses being manufactured'
        },
        {
          id: 'TL-5',
          status: 'quality_check',
          date: '2024-01-18T14:22:37Z',
          description: 'Quality control passed'
        },
        {
          id: 'TL-6',
          status: 'shipped',
          date: '2024-01-19T09:45:10Z',
          description: 'Order shipped via USPS Priority'
        },
        {
          id: 'TL-7',
          status: 'delivered',
          date: '2024-01-21T14:22:17Z',
          description: 'Order delivered'
        }
      ],
      notes: [
        {
          id: 'NOTE-1',
          date: '2024-01-16T09:20:15Z',
          author: 'System',
          content: 'Prescription requires verification before processing',
          isInternal: true
        },
        {
          id: 'NOTE-2',
          date: '2024-01-16T11:42:05Z',
          author: 'Dr. Sarah Johnson',
          content: 'Prescription verified and approved',
          isInternal: true
        }
      ],
      tags: ['premium', 'expedited'],
      subtotal: 249.98,
      tax: 20.00,
      shipping: 9.99,
      discount: 20.00,
      total: 259.97,
      invoiceUrl: '/invoices/INV-10247.pdf',
      returnsAllowed: true,
      returnsWindow: '2024-02-21',
      reorder: true
    },
    {
      id: 'ORD-10248',
      reference: 'EYEWR-10248',
      customer: {
        id: 'CUST-8734',
        name: 'Emma Wilson',
        email: 'emma.wilson@example.com',
        phone: '+1 (555) 987-6543',
        customerSince: '2023-10-05',
        totalOrders: 1
      },
      supplier: {
        id: 'SUP-156',
        name: 'VisionPro International',
        email: 'support@visionpro.com',
        phone: '+1 (555) 456-7890'
      },
      items: [
        {
          id: 'ITEM-1',
          product: 'Designer Cat-Eye Frames',
          productId: 'PROD-534',
          image: '/frames/cat-eye-designer.jpg',
          variant: 'Tortoise Shell',
          prescription: {
            rightEye: {
              sphere: '+1.75',
              cylinder: '0.00',
              axis: '0',
              add: '+2.50',
              pd: '30'
            },
            leftEye: {
              sphere: '+2.00',
              cylinder: '0.00',
              axis: '0',
              add: '+2.50',
              pd: '30'
            },
            type: 'progressive',
            notes: 'Patient prefers enhanced reading area'
          },
          price: 299.99,
          quantity: 1,
          subtotal: 299.99
        },
        {
          id: 'ITEM-2',
          product: 'Anti-Glare Premium Coating',
          productId: 'PROD-115',
          image: '/add-ons/anti-glare.jpg',
          variant: 'Premium',
          price: 79.99,
          quantity: 1,
          subtotal: 79.99
        },
        {
          id: 'ITEM-3',
          product: 'Designer Case & Cloth Set',
          productId: 'PROD-223',
          image: '/accessories/designer-case.jpg',
          variant: 'Brown Leather',
          price: 39.99,
          quantity: 1,
          subtotal: 39.99
        }
      ],
      shippingAddress: {
        name: 'Emma Wilson',
        line1: '456 Park Avenue',
        city: 'Boston',
        state: 'MA',
        postalCode: '02108',
        country: 'United States',
        phone: '+1 (555) 987-6543',
        email: 'emma.wilson@example.com',
        isDefault: true
      },
      billingAddress: {
        name: 'Emma Wilson',
        line1: '456 Park Avenue',
        city: 'Boston',
        state: 'MA',
        postalCode: '02108',
        country: 'United States',
        phone: '+1 (555) 987-6543',
        email: 'emma.wilson@example.com',
        isDefault: true
      },
      shippingMethod: {
        id: 'SHP-2',
        name: 'Standard Shipping',
        estimatedDelivery: '5-7 Business Days',
        price: 4.99,
        trackingNumber: '9405511899223875983122',
        trackingUrl: 'https://tools.usps.com/go/TrackConfirmAction?tLabels=9405511899223875983122',
        carrier: 'USPS'
      },
      payment: {
        method: {
          id: 'PAY-2',
          type: 'paypal',
          email: 'emma.wilson@example.com'
        },
        status: 'paid',
        total: 424.96,
        currency: 'USD',
        datePaid: '2024-01-18T15:45:22Z',
        transactionId: 'PAY-9HK38508BN993294'
      },
      status: 'processing',
      statusLabel: 'Processing',
      placedAt: '2024-01-18T15:45:22Z',
      updatedAt: '2024-01-19T10:12:33Z',
      timeline: [
        {
          id: 'TL-1',
          status: 'order_placed',
          date: '2024-01-18T15:45:22Z',
          description: 'Order placed and payment received via PayPal'
        },
        {
          id: 'TL-2',
          status: 'processing',
          date: '2024-01-19T10:12:33Z',
          description: 'Order processing started'
        }
      ],
      notes: [
        {
          id: 'NOTE-1',
          date: '2024-01-18T16:05:10Z',
          author: 'Customer Service',
          content: 'Customer requested priority processing if possible',
          isInternal: true
        }
      ],
      tags: ['premium', 'progressive'],
      subtotal: 419.97,
      tax: 33.60,
      shipping: 4.99,
      discount: 33.60,
      total: 424.96,
      invoiceUrl: '/invoices/INV-10248.pdf',
      returnsAllowed: true,
      returnsWindow: '2024-03-18',
      reorder: false
    },
    {
      id: 'ORD-10246',
      reference: 'EYEWR-10246',
      customer: {
        id: 'CUST-1028',
        name: 'John Martinez',
        email: 'john.martinez@example.com',
        phone: '+1 (555) 123-4567',
        customerSince: '2023-05-12',
        totalOrders: 3
      },
      supplier: {
        id: 'SUP-124',
        name: 'OptiCraft Solutions',
        email: 'orders@opticraft.com',
        phone: '+1 (555) 987-6543'
      },
      items: [
        {
          id: 'ITEM-1',
          product: 'Classic Round Frames',
          productId: 'PROD-256',
          image: '/frames/round-classic.jpg',
          variant: 'Matte Black',
          prescription: {
            rightEye: {
              sphere: '-3.25',
              cylinder: '-1.00',
              axis: '90',
              pd: '31'
            },
            leftEye: {
              sphere: '-3.00',
              cylinder: '-0.75',
              axis: '85',
              pd: '31'
            },
            type: 'single-vision'
          },
          price: 149.99,
          quantity: 1,
          subtotal: 149.99
        }
      ],
      shippingAddress: {
        name: 'John Martinez',
        line1: '123 Main Street',
        line2: 'Apt 4B',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'United States',
        phone: '+1 (555) 123-4567',
        email: 'john.martinez@example.com',
        isDefault: true
      },
      billingAddress: {
        name: 'John Martinez',
        line1: '123 Main Street',
        line2: 'Apt 4B',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'United States',
        phone: '+1 (555) 123-4567',
        email: 'john.martinez@example.com',
        isDefault: true
      },
      shippingMethod: {
        id: 'SHP-1',
        name: 'Priority Shipping',
        estimatedDelivery: '2-3 Business Days',
        price: 9.99,
        trackingNumber: '9400111899562738271234',
        trackingUrl: 'https://tools.usps.com/go/TrackConfirmAction?tLabels=9400111899562738271234',
        carrier: 'USPS'
      },
      payment: {
        method: {
          id: 'PAY-1',
          type: 'credit_card',
          lastFour: '4242',
          expiryDate: '05/25',
          cardType: 'Visa',
          holderName: 'John Martinez'
        },
        status: 'refunded',
        total: 159.98,
        currency: 'USD',
        datePaid: '2023-12-10T14:22:38Z',
        transactionId: 'txn_1Ms9y7KL8M7xdhYU98765432'
      },
      status: 'returned',
      statusLabel: 'Returned',
      placedAt: '2023-12-10T14:22:38Z',
      updatedAt: '2023-12-28T11:14:55Z',
      timeline: [
        {
          id: 'TL-1',
          status: 'order_placed',
          date: '2023-12-10T14:22:38Z',
          description: 'Order placed and payment received'
        },
        {
          id: 'TL-2',
          status: 'processing',
          date: '2023-12-11T09:45:12Z',
          description: 'Order processing started'
        },
        {
          id: 'TL-3',
          status: 'shipped',
          date: '2023-12-13T10:32:44Z',
          description: 'Order shipped via USPS Priority'
        },
        {
          id: 'TL-4',
          status: 'delivered',
          date: '2023-12-15T16:18:22Z',
          description: 'Order delivered'
        },
        {
          id: 'TL-5',
          status: 'return_requested',
          date: '2023-12-20T11:05:37Z',
          description: 'Return requested by customer'
        },
        {
          id: 'TL-6',
          status: 'return_approved',
          date: '2023-12-21T09:12:18Z',
          description: 'Return approved'
        },
        {
          id: 'TL-7',
          status: 'returned',
          date: '2023-12-28T11:14:55Z',
          description: 'Return processed and refund issued'
        }
      ],
      notes: [
        {
          id: 'NOTE-1',
          date: '2023-12-20T11:10:22Z',
          author: 'Customer Service',
          content: 'Customer reported frames do not fit well - authorized return',
          isInternal: true
        },
        {
          id: 'NOTE-2',
          date: '2023-12-28T11:20:05Z',
          author: 'Returns Department',
          content: 'Return received in good condition, full refund processed',
          isInternal: true
        }
      ],
      tags: ['returned', 'refunded'],
      subtotal: 149.99,
      tax: 12.00,
      shipping: 9.99,
      discount: 12.00,
      total: 159.98,
      refundAmount: 159.98,
      invoiceUrl: '/invoices/INV-10246.pdf',
      returnsAllowed: false,
      reorder: false
    }
  ];
};

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
  const [itemsPerPage, setItemsPerPage] = useState(10)
  
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
    return styles[status] || 'bg-gray-100 text-gray-800'
  }
  
  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM d, yyyy h:mm a')
    } catch (e) {
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
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Back Navigation */}
          <button
            className="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            onClick={backToList}
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Orders
          </button>
          
          {/* Order Header */}
          <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center">
                    <h1 className="text-2xl font-bold text-gray-900 mr-3">{selectedOrder.reference}</h1>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeStyle(selectedOrder.status)}`}>
                      {selectedOrder.statusLabel}
                    </span>
                  </div>
                  <p className="text-gray-500 mt-1">Placed on {formatDate(selectedOrder.placedAt)}</p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {selectedOrder.invoiceUrl && (
                    <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center">
                      <ArrowDownTrayIcon className="h-5 w-5 mr-2 text-gray-500" />
                      Invoice
                    </button>
                  )}
                  
                  <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center">
                    <PrinterIcon className="h-5 w-5 mr-2 text-gray-500" />
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
                    <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center">
                      <ArrowUturnLeftIcon className="h-5 w-5 mr-2 text-gray-500" />
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
            <div className="p-6 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Progress</h2>
              <div className="relative">
                <div className="absolute top-0 left-5 h-full w-0.5 bg-gray-200"></div>
                <ul className="space-y-4 relative">
                  {selectedOrder.timeline.map((event, index) => (
                    <li key={event.id} className="flex items-start">
                      <div className={`relative flex items-center justify-center h-10 w-10 rounded-full mr-4 ${
                        index === 0 ? 'bg-blue-500 text-white' : 
                        event.status === 'delivered' || event.status === 'completed' ? 'bg-green-500 text-white' : 
                        event.status === 'return_requested' || event.status === 'return_approved' || event.status === 'returned' ? 'bg-red-500 text-white' : 
                        'bg-gray-200 text-gray-600'
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
                        <div className="text-sm font-medium text-gray-900">
                          {event.description}
                          {event.agent && <span className="ml-2 text-gray-500">by {event.agent}</span>}
                        </div>
                        <div className="text-xs text-gray-500">{formatDate(event.date)}</div>
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
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Order Items</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="p-6 flex flex-col md:flex-row">
                      <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                        <div className="h-24 w-24 bg-gray-200 rounded-lg overflow-hidden relative">
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
                            <h3 className="text-base font-medium text-gray-900">{item.product}</h3>
                            <p className="text-sm text-gray-600">{item.variant}</p>
                            
                            {item.prescription && (
                              <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                                <div className="text-xs font-medium text-blue-800 mb-1">Prescription Details</div>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                                  <div>
                                    <span className="font-medium text-gray-700">Right Eye: </span>
                                    <span className="text-gray-600">
                                      SPH {item.prescription.rightEye.sphere}{' '}
                                      CYL {item.prescription.rightEye.cylinder}{' '}
                                      AXIS {item.prescription.rightEye.axis}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-700">Left Eye: </span>
                                    <span className="text-gray-600">
                                      SPH {item.prescription.leftEye.sphere}{' '}
                                      CYL {item.prescription.leftEye.cylinder}{' '}
                                      AXIS {item.prescription.leftEye.axis}
                                    </span>
                                  </div>
                                  <div className="col-span-2">
                                    <span className="font-medium text-gray-700">Type: </span>
                                    <span className="text-gray-600 capitalize">{item.prescription.type.replace('-', ' ')}</span>
                                  </div>
                                  {item.prescription.notes && (
                                    <div className="col-span-2">
                                      <span className="font-medium text-gray-700">Notes: </span>
                                      <span className="text-gray-600">{item.prescription.notes}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="mt-2 md:mt-0 text-right">
                            <div className="text-sm font-medium text-gray-900">
                              {formatCurrency(item.price)} × {item.quantity}
                            </div>
                            <div className="text-base font-bold text-gray-900 mt-1">
                              {formatCurrency(item.subtotal)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Order Summary */}
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <div className="flow-root">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <p>Subtotal</p>
                      <p>{formatCurrency(selectedOrder.subtotal)}</p>
                    </div>
                    {selectedOrder.discount && selectedOrder.discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600 mb-2">
                        <p>Discount</p>
                        <p>-{formatCurrency(selectedOrder.discount)}</p>
                      </div>
                    )}
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <p>Shipping</p>
                      <p>{formatCurrency(selectedOrder.shipping)}</p>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mb-4">
                      <p>Tax</p>
                      <p>{formatCurrency(selectedOrder.tax)}</p>
                    </div>
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <p>Total</p>
                      <p>{formatCurrency(selectedOrder.total)}</p>
                    </div>
                    {selectedOrder.refundAmount && selectedOrder.refundAmount > 0 && (
                      <div className="flex justify-between text-sm text-red-600 mt-2">
                        <p>Refunded</p>
                        <p>-{formatCurrency(selectedOrder.refundAmount)}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Notes & Communication */}
              {selectedOrder.notes.length > 0 && (
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-lg font-medium text-gray-900">Order Notes</h2>
                    <button className="text-sm text-blue-600 hover:text-blue-800">Add Note</button>
                  </div>
                  <div className="p-6 space-y-4">
                    {selectedOrder.notes.map((note) => (
                      <div key={note.id} className="flex items-start">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                          <UserIcon className="h-5 w-5 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-900">
                              {note.author}
                              {note.isInternal && (
                                <span className="ml-2 px-2 py-0.5 inline-flex text-xs font-medium bg-gray-100 text-gray-800 rounded-md">
                                  Internal
                                </span>
                              )}
                            </h3>
                            <p className="text-xs text-gray-500">{formatDate(note.date)}</p>
                          </div>
                          <p className="mt-1 text-sm text-gray-600">{note.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Payment Details */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Payment Information</h2>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      {selectedOrder.payment.method.type === 'credit_card' && (
                        <>
                          <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                            <CreditCardIcon className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {selectedOrder.payment.method.cardType} •••• {selectedOrder.payment.method.lastFour}
                            </p>
                            <p className="text-xs text-gray-500">
                              Expires {selectedOrder.payment.method.expiryDate}
                            </p>
                          </div>
                        </>
                      )}
                      {selectedOrder.payment.method.type === 'paypal' && (
                        <>
                          <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                            <span className="text-blue-600 font-bold">P</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">PayPal</p>
                            <p className="text-xs text-gray-500">{selectedOrder.payment.method.email}</p>
                          </div>
                        </>
                      )}
                    </div>
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getPaymentBadgeStyle(selectedOrder.payment.status)}`}>
                      {selectedOrder.payment.status.charAt(0).toUpperCase() + selectedOrder.payment.status.slice(1).replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between mb-2">
                      <p className="text-sm text-gray-500">Transaction ID</p>
                      <p className="text-sm font-mono text-gray-900">{selectedOrder.payment.transactionId || 'N/A'}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-500">Payment Date</p>
                      <p className="text-sm text-gray-900">
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
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Customer</h2>
                  <span className="text-xs text-gray-500">Customer ID: {selectedOrder.customer.id}</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                      <UserIcon className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-gray-900">{selectedOrder.customer.name}</h3>
                      <p className="text-sm text-gray-600">Customer since {
                        (() => {
                          try {
                            return format(parseISO(selectedOrder.customer.customerSince), 'MMM yyyy')
                          } catch (e) {
                            return selectedOrder.customer.customerSince
                          }
                        })()
                      }</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <span className="text-sm text-gray-600">{selectedOrder.customer.email}</span>
                    </div>
                    {selectedOrder.customer.phone && (
                      <div className="flex items-start">
                        <PhoneIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                        <span className="text-sm text-gray-600">{selectedOrder.customer.phone}</span>
                      </div>
                    )}
                    <div className="flex items-start">
                      <ShoppingBagIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <span className="text-sm text-gray-600">
                        {selectedOrder.customer.totalOrders} {selectedOrder.customer.totalOrders === 1 ? 'order' : 'orders'} placed
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Shipping Information */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Shipping</h2>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Shipping Address</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-800 font-medium">{selectedOrder.shippingAddress.name}</p>
                      <p className="text-sm text-gray-600">{selectedOrder.shippingAddress.line1}</p>
                      {selectedOrder.shippingAddress.line2 && (
                        <p className="text-sm text-gray-600">{selectedOrder.shippingAddress.line2}</p>
                      )}
                      <p className="text-sm text-gray-600">
                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}
                      </p>
                      <p className="text-sm text-gray-600">{selectedOrder.shippingAddress.country}</p>
                      <p className="text-sm text-gray-600 mt-2">{selectedOrder.shippingAddress.phone}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Shipping Method</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <TruckIcon className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-600">{selectedOrder.shippingMethod.name}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-800">{formatCurrency(selectedOrder.shippingMethod.price)}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 ml-8">
                      Estimated delivery: {selectedOrder.shippingMethod.estimatedDelivery}
                    </p>
                  </div>
                  
                  {selectedOrder.shippingMethod.trackingNumber && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2">Tracking Information</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-800">{selectedOrder.shippingMethod.carrier}</span>
                          <a 
                            href={selectedOrder.shippingMethod.trackingUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-800"
                          >
                            Track
                          </a>
                        </div>
                        <p className="text-sm font-mono text-gray-600">{selectedOrder.shippingMethod.trackingNumber}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Billing Information */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Billing</h2>
                </div>
                <div className="p-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Billing Address</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-800 font-medium">{selectedOrder.billingAddress.name}</p>
                    <p className="text-sm text-gray-600">{selectedOrder.billingAddress.line1}</p>
                    {selectedOrder.billingAddress.line2 && (
                      <p className="text-sm text-gray-600">{selectedOrder.billingAddress.line2}</p>
                    )}
                    <p className="text-sm text-gray-600">
                      {selectedOrder.billingAddress.city}, {selectedOrder.billingAddress.state} {selectedOrder.billingAddress.postalCode}
                    </p>
                    <p className="text-sm text-gray-600">{selectedOrder.billingAddress.country}</p>
                    <p className="text-sm text-gray-600 mt-2">{selectedOrder.billingAddress.email}</p>
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white mb-6 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <ShoppingBagIcon className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">Orders</h1>
                <p className="text-blue-100">Manage and track your eyewear orders</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button 
                className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors flex items-center"
                onClick={() => {/* Export functionality */}}
              >
                <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                Export
              </button>
              <button 
                className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors flex items-center"
                onClick={() => {/* Download functionality */}}
              >
                <DocumentDuplicateIcon className="h-5 w-5 mr-2" />
                Download Report
              </button>
              <button 
                className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-medium flex items-center"
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
          <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ShoppingBagIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-green-600 flex items-center">
              <ArrowPathIcon className="h-3 w-3 mr-1" />
              Updated just now
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => ['processing', 'shipped', 'ready_to_ship'].includes(o.status)).length}
                </p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <ClockIcon className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-blue-600 flex items-center">
              <TruckIcon className="h-3 w-3 mr-1" />
              {orders.filter(o => o.status === 'shipped').length} shipped
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Delivered</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => o.status === 'delivered' || o.status === 'completed').length}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-600">
              Last delivery: {formatDate(orders.filter(o => o.status === 'delivered').sort((a, b) => 
                new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
              )[0]?.updatedAt || new Date().toISOString()).split(',')[0]}
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Issues</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => ['cancelled', 'refunded', 'returned', 'failed'].includes(o.status)).length}
                </p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                <ExclamationCircleIcon className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-red-600 flex items-center">
              <XCircleIcon className="h-3 w-3 mr-1" />
              {orders.filter(o => o.status === 'returned').length} returns
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl p-4 shadow-md mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search orders by ID, customer, product..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
                onClick={() => setFilterMenuOpen(!filterMenuOpen)}
              >
                <FunnelIcon className="h-5 w-5 mr-2 text-gray-500" />
                Filters
                <ChevronDownIcon className="h-5 w-5 ml-2 text-gray-500" />
              </button>
              
              <button
                className="flex items-center px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg text-gray-700 transition-colors"
                onClick={resetFilters}
              >
                <ArrowPathIcon className="h-5 w-5 mr-2 text-gray-500" />
                Reset
              </button>
            </div>
          </div>
          
          {/* Filter Menu */}
          {filterMenuOpen && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order Status</label>
                <select
                  className="block w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                <select
                  className="block w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                <input
                  type="date"
                  className="block w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={filterOptions.dateRange.from || ''}
                  onChange={(e) => setFilterOptions({
                    ...filterOptions,
                    dateRange: {...filterOptions.dateRange, from: e.target.value || null}
                  })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                <input
                  type="date"
                  className="block w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={filterOptions.dateRange.to || ''}
                  onChange={(e) => setFilterOptions({
                    ...filterOptions,
                    dateRange: {...filterOptions.dateRange, to: e.target.value || null}
                  })}
                />
              </div>
              
              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  className="block w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
          <div className="bg-white rounded-xl p-12 shadow-md flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading your orders...</p>
          </div>
        ) : currentOrders.length === 0 ? (
          <div className="bg-white rounded-xl p-12 shadow-md flex flex-col items-center justify-center">
            <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingBagIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No orders found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={resetFilters}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <ShoppingBagIcon className="h-5 w-5 text-gray-500" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{order.reference}</div>
                            <div className="text-xs text-gray-500">{order.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(order.placedAt).split(',')[0]}</div>
                        <div className="text-xs text-gray-500">{formatDate(order.placedAt).split(',')[1]}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{order.customer.name}</div>
                        <div className="text-xs text-gray-500">{order.customer.email}</div>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(order.total, order.payment.currency)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-3">
                          <button
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => viewOrderDetails(order)}
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                          {order.status === 'delivered' && (
                            <button className="text-gray-600 hover:text-gray-800">
                              <PaperAirplaneIcon className="h-5 w-5" />
                            </button>
                          )}
                          {order.status === 'shipped' && (
                            <button className="text-purple-600 hover:text-purple-800">
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
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstOrder + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(indexOfLastOrder, totalFilteredOrders)}</span> of{' '}
                  <span className="font-medium">{totalFilteredOrders}</span> orders
                </div>
                <div className="flex space-x-2">
                  <button
                    className={`px-3 py-1 border border-gray-300 rounded-md ${currentPage === 1 ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      className={`px-3 py-1 border rounded-md ${currentPage === i + 1 ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 hover:bg-gray-50'}`}
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    className={`px-3 py-1 border border-gray-300 rounded-md ${currentPage === totalPages ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-50'}`}
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