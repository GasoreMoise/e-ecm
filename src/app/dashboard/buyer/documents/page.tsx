'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  DocumentTextIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  ClockIcon,
  FolderIcon,
  PlusIcon
} from '@heroicons/react/24/outline'

interface Document {
  id: string
  name: string
  type: 'invoice' | 'contract' | 'report' | 'receipt'
  size: string
  lastModified: string
  status: 'signed' | 'pending' | 'draft'
}

const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Purchase Agreement - Jan 2024',
    type: 'contract',
    size: '2.4 MB',
    lastModified: '2024-01-15',
    status: 'signed'
  },
  {
    id: '2',
    name: 'Invoice #INV-001',
    type: 'invoice',
    size: '1.2 MB',
    lastModified: '2024-01-18',
    status: 'pending'
  },
  {
    id: '3',
    name: 'Monthly Report - December',
    type: 'report',
    size: '3.7 MB',
    lastModified: '2024-01-10',
    status: 'draft'
  }
]

export default function Documents() {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments)
  const [activeFilter, setActiveFilter] = useState<Document['type'] | 'all'>('all')
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })

      if (response.ok) {
        window.location.href = '/auth/login'
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const getStatusColor = (status: Document['status']) => {
    const colors = {
      signed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      draft: 'bg-gray-100 text-gray-800'
    }
    return colors[status]
  }

  const getTypeIcon = (type: Document['type']) => {
    const icons = {
      invoice: '📄',
      contract: '📝',
      report: '📊',
      receipt: '🧾'
    }
    return icons[type]
  }

  const filteredDocuments = documents.filter(
    doc => activeFilter === 'all' || doc.type === activeFilter
  )

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <DocumentTextIcon className="h-8 w-8" />
              <h1 className="text-2xl font-bold">Documents</h1>
            </div>
            <div className="flex space-x-4">
              <button
                className="px-4 py-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors flex items-center space-x-2"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Upload</span>
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Document Categories */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { type: 'all', label: 'All Files', count: documents.length },
            { type: 'contract', label: 'Contracts', count: documents.filter(d => d.type === 'contract').length },
            { type: 'invoice', label: 'Invoices', count: documents.filter(d => d.type === 'invoice').length },
            { type: 'report', label: 'Reports', count: documents.filter(d => d.type === 'report').length }
          ].map((category) => (
            <button
              key={category.type}
              onClick={() => setActiveFilter(category.type as any)}
              className={`p-6 rounded-2xl ${
                activeFilter === category.type
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-900 hover:bg-gray-50'
              } shadow-lg transition-all`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">
                    {category.label}
                  </p>
                  <p className="text-2xl font-bold mt-1">
                    {category.count}
                  </p>
                </div>
                <FolderIcon className="h-8 w-8 opacity-80" />
              </div>
            </button>
          ))}
        </div>

        {/* Documents List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Size</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Modified</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="text-xl mr-2">{getTypeIcon(doc.type)}</span>
                        <span className="text-sm font-medium text-gray-900">{doc.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 capitalize">{doc.type}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{doc.size}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {new Date(doc.lastModified).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                        {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex space-x-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                          <ArrowDownTrayIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No documents found</h2>
            <p className="text-gray-500">Upload some documents to get started</p>
          </div>
        )}
      </div>
    </div>
  )
} 