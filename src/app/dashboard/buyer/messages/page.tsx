'use client'
import { useState } from 'react'
import { 
  PaperAirplaneIcon,
  PaperClipIcon,
  EllipsisHorizontalIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

interface Message {
  id: string
  sender: string
  content: string
  timestamp: string
  isMe: boolean
  avatar: string
}

interface Chat {
  id: string
  name: string
  lastMessage: string
  timestamp: string
  unread: number
  avatar: string
  online: boolean
}

const mockChats: Chat[] = [
  {
    id: '1',
    name: 'OptiCraft Solutions',
    lastMessage: 'Your order has been shipped',
    timestamp: '10:30 AM',
    unread: 2,
    avatar: 'OS',
    online: true
  },
  {
    id: '2',
    name: 'VisionPro Support',
    lastMessage: 'Thank you for your inquiry',
    timestamp: 'Yesterday',
    unread: 0,
    avatar: 'VP',
    online: false
  },
]

const mockMessages: Message[] = [
  {
    id: '1',
    sender: 'OptiCraft Solutions',
    content: 'Hello! How can we help you today?',
    timestamp: '10:30 AM',
    isMe: false,
    avatar: 'OS'
  },
  {
    id: '2',
    sender: 'Me',
    content: 'I need information about my recent order #ORD-001',
    timestamp: '10:31 AM',
    isMe: true,
    avatar: 'ME'
  },
]

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState<string>('1')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [chats, setChats] = useState<Chat[]>(mockChats)

  const handleSendMessage = () => {
    if (!message.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'Me',
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      avatar: 'ME'
    }

    setMessages([...messages, newMessage])
    setMessage('')
  }

  return (
    <div className="h-screen bg-gray-50 pt-8 px-8">
      <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="flex h-full">
          {/* Chats Sidebar */}
          <div className="w-80 border-r border-gray-200 bg-gray-50">
            <div className="p-4">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="overflow-y-auto h-[calc(100%-5rem)]">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
                  className={`p-4 cursor-pointer hover:bg-gray-100 transition-colors ${
                    selectedChat === chat.id ? 'bg-gray-100' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {chat.avatar}
                      </div>
                      {chat.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{chat.name}</h3>
                        <span className="text-xs text-gray-500">{chat.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                    </div>
                    {chat.unread > 0 && (
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white">{chat.unread}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  OS
                </div>
                <div>
                  <h2 className="font-medium">OptiCraft Solutions</h2>
                  <p className="text-sm text-green-500">Online</p>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <EllipsisHorizontalIcon className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-end space-x-2 max-w-[70%] ${msg.isMe ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                      {msg.avatar}
                    </div>
                    <div className={`rounded-2xl p-4 ${
                      msg.isMe 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p>{msg.content}</p>
                      <p className={`text-xs mt-1 ${
                        msg.isMe ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-4">
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <PaperClipIcon className="h-6 w-6 text-gray-500" />
                </button>
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 p-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="p-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                >
                  <PaperAirplaneIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 