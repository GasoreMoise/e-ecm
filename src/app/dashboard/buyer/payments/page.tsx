'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  HomeIcon,
  CreditCardIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  PlusIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ChevronDownIcon,
  BanknotesIcon,
  BuildingLibraryIcon,
  ReceiptRefundIcon
} from '@heroicons/react/24/outline'

// Types
interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'bank_account';
  name: string;
  lastFour: string;
  expiryDate?: string;
  isDefault: boolean;
}

interface Invoice {
  id: string;
  number: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  orderId: string;
  orderReference: string;
}

interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: 'payment' | 'refund' | 'credit';
  status: 'completed' | 'pending' | 'failed';
  description: string;
  paymentMethod?: string;
  invoiceId?: string;
}

// Buyer Payments Page
export default function BuyerPayments() {
  const [activeTab, setActiveTab] = useState('methods');
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddPaymentMethod, setShowAddPaymentMethod] = useState(false);
  const router = useRouter();

  // Go back to dashboard
  const goToDashboard = () => {
    window.location.href = '/dashboard/buyer';
  };

  // Load payment data
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Mock payment methods
      const mockPaymentMethods: PaymentMethod[] = [
        {
          id: 'pm_1001',
          type: 'credit_card',
          name: 'Visa ending in 4242',
          lastFour: '4242',
          expiryDate: '12/2025',
          isDefault: true
        },
        {
          id: 'pm_1002',
          type: 'credit_card',
          name: 'Mastercard ending in 8888',
          lastFour: '8888',
          expiryDate: '03/2024',
          isDefault: false
        },
        {
          id: 'pm_1003',
          type: 'bank_account',
          name: 'Chase Bank Account',
          lastFour: '6789',
          isDefault: false
        }
      ];
      
      // Mock invoices
      const mockInvoices: Invoice[] = [
        {
          id: 'inv_001',
          number: 'INV-2024-001',
          date: '2024-05-15T10:30:00Z',
          amount: 1249.99,
          status: 'paid',
          orderId: 'ord_001',
          orderReference: 'ORD-2024-001'
        },
        {
          id: 'inv_002',
          number: 'INV-2024-002',
          date: '2024-05-08T14:45:00Z',
          amount: 789.50,
          status: 'paid',
          orderId: 'ord_002',
          orderReference: 'ORD-2024-002'
        },
        {
          id: 'inv_003',
          number: 'INV-2024-003',
          date: '2024-05-22T09:15:00Z',
          amount: 349.99,
          status: 'pending',
          orderId: 'ord_003',
          orderReference: 'ORD-2024-003'
        },
        {
          id: 'inv_004',
          number: 'INV-2024-004',
          date: '2024-04-29T11:20:00Z',
          amount: 599.99,
          status: 'overdue',
          orderId: 'ord_004',
          orderReference: 'ORD-2024-004'
        }
      ];
      
      // Mock transactions
      const mockTransactions: Transaction[] = [
        {
          id: 'txn_001',
          date: '2024-05-15T10:30:00Z',
          amount: 1249.99,
          type: 'payment',
          status: 'completed',
          description: 'Payment for order #ORD-2024-001',
          paymentMethod: 'Visa ending in 4242',
          invoiceId: 'inv_001'
        },
        {
          id: 'txn_002',
          date: '2024-05-08T14:45:00Z',
          amount: 789.50,
          type: 'payment',
          status: 'completed',
          description: 'Payment for order #ORD-2024-002',
          paymentMethod: 'Mastercard ending in 8888',
          invoiceId: 'inv_002'
        },
        {
          id: 'txn_003',
          date: '2024-05-03T16:20:00Z',
          amount: 129.99,
          type: 'refund',
          status: 'completed',
          description: 'Refund for returned item SKU-12345',
          paymentMethod: 'Visa ending in 4242'
        },
        {
          id: 'txn_004',
          date: '2024-04-29T11:20:00Z',
          amount: 599.99,
          type: 'payment',
          status: 'failed',
          description: 'Failed payment attempt for order #ORD-2024-004',
          paymentMethod: 'Visa ending in 4242',
          invoiceId: 'inv_004'
        },
        {
          id: 'txn_005',
          date: '2024-04-22T09:15:00Z',
          amount: 50.00,
          type: 'credit',
          status: 'completed',
          description: 'Account credit for loyalty program',
          paymentMethod: 'Account Credit'
        }
      ];
      
      setPaymentMethods(mockPaymentMethods);
      setInvoices(mockInvoices);
      setTransactions(mockTransactions);
      setIsLoading(false);
    }, 800);
  }, []);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
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

  // Set payment method as default
  const setDefaultPaymentMethod = (id: string) => {
    setPaymentMethods(methods => 
      methods.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    );
  };

  // Remove payment method
  const removePaymentMethod = (id: string) => {
    setPaymentMethods(methods => methods.filter(method => method.id !== id));
  };

  // Download invoice
  const downloadInvoice = (invoiceId: string) => {
    console.log(`Downloading invoice ${invoiceId}`);
    // Implement download functionality here
  };

  // View order details
  const viewOrderDetails = (orderId: string) => {
    window.location.href = `/dashboard/buyer/orders/${orderId}`;
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
          <h1 className="text-2xl font-bold mb-1">Payments & Billing</h1>
          <p className="text-gray-400">Manage your payment methods, invoices, and transaction history</p>
        </div>

        {/* Tabs */}
        <div className="bg-gray-900 rounded-xl p-2 shadow-md mb-6">
          <div className="flex flex-wrap">
            <button
              className={`px-4 py-2.5 rounded-lg font-medium mr-2 mb-2 md:mb-0 transition-colors ${
                activeTab === 'methods' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
              onClick={() => setActiveTab('methods')}
            >
              <div className="flex items-center">
                <CreditCardIcon className="h-5 w-5 mr-2" />
                Payment Methods
              </div>
            </button>
            <button
              className={`px-4 py-2.5 rounded-lg font-medium mr-2 mb-2 md:mb-0 transition-colors ${
                activeTab === 'invoices' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
              onClick={() => setActiveTab('invoices')}
            >
              <div className="flex items-center">
                <DocumentTextIcon className="h-5 w-5 mr-2" />
                Invoices
              </div>
            </button>
            <button
              className={`px-4 py-2.5 rounded-lg font-medium mr-2 mb-2 md:mb-0 transition-colors ${
                activeTab === 'transactions' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
              onClick={() => setActiveTab('transactions')}
            >
              <div className="flex items-center">
                <ArrowPathIcon className="h-5 w-5 mr-2" />
                Transaction History
              </div>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {isLoading ? (
          <div className="bg-gray-900 rounded-xl p-12 shadow-md flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
            <p className="mt-4 text-gray-300">Loading payment information...</p>
          </div>
        ) : (
          <>
            {/* Payment Methods Tab */}
            {activeTab === 'methods' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-white">Your Payment Methods</h2>
                  <button
                    onClick={() => setShowAddPaymentMethod(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add Payment Method
                  </button>
                </div>

                {paymentMethods.length === 0 ? (
                  <div className="bg-gray-900 rounded-xl p-12 shadow-md flex flex-col items-center justify-center">
                    <div className="h-24 w-24 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                      <CreditCardIcon className="h-12 w-12 text-gray-500" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-1">No payment methods found</h3>
                    <p className="text-gray-400 mb-4">Add a payment method to make purchases easier</p>
                    <button
                      onClick={() => setShowAddPaymentMethod(true)}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <PlusIcon className="h-5 w-5 mr-2" />
                      Add Payment Method
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {paymentMethods.map(method => (
                      <div key={method.id} className="bg-gray-900 rounded-lg p-4 shadow-md border border-gray-800">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            {method.type === 'credit_card' ? (
                              <CreditCardIcon className="h-10 w-10 text-blue-500 mr-3" />
                            ) : (
                              <BuildingLibraryIcon className="h-10 w-10 text-green-500 mr-3" />
                            )}
                            <div>
                              <h3 className="text-white font-medium">{method.name}</h3>
                              {method.expiryDate && (
                                <p className="text-gray-400 text-sm">Expires: {method.expiryDate}</p>
                              )}
                              {method.isDefault && (
                                <span className="bg-blue-900 text-blue-300 text-xs px-2 py-0.5 rounded mt-1 inline-block">
                                  Default
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex">
                            {!method.isDefault && (
                              <button
                                onClick={() => setDefaultPaymentMethod(method.id)}
                                className="text-gray-400 hover:text-white mr-2"
                                title="Set as Default"
                              >
                                <CheckCircleIcon className="h-5 w-5" />
                              </button>
                            )}
                            <button
                              onClick={() => removePaymentMethod(method.id)}
                              className="text-gray-400 hover:text-red-500"
                              title="Remove"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Payment Method Form (hidden by default) */}
                {showAddPaymentMethod && (
                  <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full">
                      <h3 className="text-xl font-bold text-white mb-4">Add Payment Method</h3>
                      <form className="space-y-4">
                        <div>
                          <label className="block text-gray-300 mb-1">Payment Type</label>
                          <select className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white">
                            <option value="credit_card">Credit/Debit Card</option>
                            <option value="bank_account">Bank Account</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-gray-300 mb-1">Card Number</label>
                          <input 
                            type="text" 
                            placeholder="XXXX XXXX XXXX XXXX"
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-gray-300 mb-1">Expiry Date</label>
                            <input 
                              type="text" 
                              placeholder="MM/YY"
                              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-300 mb-1">CVC</label>
                            <input 
                              type="text" 
                              placeholder="CVC"
                              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-gray-300 mb-1">Name on Card</label>
                          <input 
                            type="text" 
                            placeholder="John Doe"
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white"
                          />
                        </div>
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            id="setDefault" 
                            className="mr-2"
                          />
                          <label htmlFor="setDefault" className="text-gray-300">Set as default payment method</label>
                        </div>
                        <div className="flex justify-end space-x-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setShowAddPaymentMethod(false)}
                            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Add Payment Method
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Invoices Tab */}
            {activeTab === 'invoices' && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">Your Invoices</h2>
                
                {invoices.length === 0 ? (
                  <div className="bg-gray-900 rounded-xl p-12 shadow-md flex flex-col items-center justify-center">
                    <div className="h-24 w-24 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                      <DocumentTextIcon className="h-12 w-12 text-gray-500" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-1">No invoices found</h3>
                    <p className="text-gray-400">Invoices will appear here after your first purchase</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead className="bg-gray-900">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Invoice #
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Order Reference
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Amount
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
                        {invoices.map(invoice => (
                          <tr key={invoice.id} className="hover:bg-gray-800">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                              {invoice.number}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {formatDate(invoice.date)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              <button 
                                className="text-blue-400 hover:text-blue-300"
                                onClick={() => viewOrderDetails(invoice.orderId)}
                              >
                                {invoice.orderReference}
                              </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                              {formatCurrency(invoice.amount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                invoice.status === 'paid' 
                                  ? 'bg-green-900 text-green-300' 
                                  : invoice.status === 'pending' 
                                    ? 'bg-yellow-900 text-yellow-300' 
                                    : 'bg-red-900 text-red-300'
                              }`}>
                                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => downloadInvoice(invoice.id)}
                                className="text-blue-400 hover:text-blue-300 mx-1"
                                title="Download Invoice"
                              >
                                <ArrowDownTrayIcon className="h-5 w-5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">Transaction History</h2>
                
                {transactions.length === 0 ? (
                  <div className="bg-gray-900 rounded-xl p-12 shadow-md flex flex-col items-center justify-center">
                    <div className="h-24 w-24 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                      <ArrowPathIcon className="h-12 w-12 text-gray-500" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-1">No transactions found</h3>
                    <p className="text-gray-400">Your transaction history will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {transactions.map(transaction => (
                      <div key={transaction.id} className="bg-gray-900 rounded-lg p-4 border border-gray-800">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div className="flex items-center mb-2 md:mb-0">
                            {transaction.type === 'payment' ? (
                              <BanknotesIcon className="h-8 w-8 text-blue-500 mr-3" />
                            ) : transaction.type === 'refund' ? (
                              <ReceiptRefundIcon className="h-8 w-8 text-green-500 mr-3" />
                            ) : (
                              <CreditCardIcon className="h-8 w-8 text-purple-500 mr-3" />
                            )}
                            <div>
                              <div className="flex items-center">
                                <h3 className="text-white font-medium mr-2">
                                  {transaction.type === 'payment' ? 'Payment' : 
                                   transaction.type === 'refund' ? 'Refund' : 'Account Credit'}
                                </h3>
                                <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  transaction.status === 'completed' 
                                    ? 'bg-green-900 text-green-300' 
                                    : transaction.status === 'pending' 
                                      ? 'bg-yellow-900 text-yellow-300' 
                                      : 'bg-red-900 text-red-300'
                                }`}>
                                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                                </span>
                              </div>
                              <p className="text-gray-400 text-sm">{transaction.description}</p>
                              {transaction.paymentMethod && (
                                <p className="text-gray-400 text-sm">Method: {transaction.paymentMethod}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className={`font-medium text-lg ${
                              transaction.type === 'refund' || transaction.type === 'credit'
                                ? 'text-green-400'
                                : 'text-white'
                            }`}>
                              {transaction.type === 'refund' || transaction.type === 'credit' ? '+' : ''}
                              {formatCurrency(transaction.amount)}
                            </span>
                            <span className="text-gray-400 text-sm">{formatDate(transaction.date)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 