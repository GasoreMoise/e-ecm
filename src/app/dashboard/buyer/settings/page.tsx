'use client'
import React from 'react'
import { useState } from 'react'
import { 
  Cog6ToothIcon as CogIcon,
  BellIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  SwatchIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline'

interface NotificationSetting {
  id: string
  title: string
  description: string
  enabled: boolean
}

interface SecuritySetting {
  id: string
  title: string
  description: string
  enabled: boolean
}

const SettingsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    {
      id: 'order_updates',
      title: 'Order Updates',
      description: 'Receive notifications about your order status',
      enabled: true
    },
    {
      id: 'promotions',
      title: 'Promotions',
      description: 'Get notified about new deals and discounts',
      enabled: false
    },
    {
      id: 'inventory',
      title: 'Inventory Alerts',
      description: 'Notifications when items are back in stock',
      enabled: true
    }
  ])

  const [securitySettings, setSecuritySettings] = useState<SecuritySetting[]>([
    {
      id: 'two_factor',
      title: 'Two-Factor Authentication',
      description: 'Add an extra layer of security to your account',
      enabled: false
    },
    {
      id: 'login_alerts',
      title: 'Login Alerts',
      description: 'Get notified of new login attempts',
      enabled: true
    }
  ])

  const [theme, setTheme] = useState('light')
  const [language, setLanguage] = useState('en')

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
      })

      if (response.ok) {
        localStorage.clear()
        sessionStorage.clear()
        window.location.replace('/auth/login')
      } else {
        console.error('Logout failed:', await response.text())
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const toggleNotification = (id: string) => {
    setNotifications(notifications.map(notification =>
      notification.id === id
        ? { ...notification, enabled: !notification.enabled }
        : notification
    ))
  }

  const toggleSecurity = (id: string) => {
    setSecuritySettings(securitySettings.map(setting =>
      setting.id === id
        ? { ...setting, enabled: !setting.enabled }
        : setting
    ))
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <CogIcon className="h-8 w-8" />
              <h1 className="text-2xl font-bold">Settings</h1>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-8">
          {/* Notifications */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <BellIcon className="h-6 w-6 text-blue-500" />
              <h2 className="text-xl font-semibold">Notifications</h2>
            </div>
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div key={notification.id} className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{notification.title}</h3>
                    <p className="text-sm text-gray-500">{notification.description}</p>
                  </div>
                  <button
                    onClick={() => toggleNotification(notification.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notification.enabled ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notification.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Security */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <ShieldCheckIcon className="h-6 w-6 text-blue-500" />
              <h2 className="text-xl font-semibold">Security</h2>
            </div>
            <div className="space-y-4">
              {securitySettings.map((setting) => (
                <div key={setting.id} className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{setting.title}</h3>
                    <p className="text-sm text-gray-500">{setting.description}</p>
                  </div>
                  <button
                    onClick={() => toggleSecurity(setting.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      setting.enabled ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        setting.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <SwatchIcon className="h-6 w-6 text-blue-500" />
              <h2 className="text-xl font-semibold">Preferences</h2>
            </div>
            <div className="space-y-4">
              {/* Theme */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Theme
                </label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>

              {/* Language */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>
            </div>
          </div>

          {/* Mobile Settings */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <DevicePhoneMobileIcon className="h-6 w-6 text-blue-500" />
              <h2 className="text-xl font-semibold">Mobile</h2>
            </div>
            <div className="space-y-4">
              <button className="w-full py-2 border border-blue-500 text-blue-500 rounded-xl hover:bg-blue-50 transition-colors">
                Download Mobile App
              </button>
              <p className="text-sm text-gray-500">
                Get our mobile app for a better experience on the go
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage 