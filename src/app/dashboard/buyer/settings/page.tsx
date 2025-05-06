'use client'
import { useState, useEffect, Fragment, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Listbox, Switch, Tab, Transition, Dialog } from '@headlessui/react'
import { 
  Bars3Icon,
  XMarkIcon,
  ChartBarIcon,
  ShoppingBagIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  CreditCardIcon,
  ChartPieIcon,
  QuestionMarkCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  BellIcon,
  ShieldCheckIcon,
  KeyIcon,
  UserIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  SwatchIcon,
  DevicePhoneMobileIcon,
  LockClosedIcon,
  DocumentTextIcon,
  EyeIcon,
  EyeSlashIcon,
  CameraIcon,
  PaintBrushIcon,
  CheckIcon,
  ChevronUpDownIcon,
  TrashIcon,
  PlusIcon,
  WalletIcon,
  LanguageIcon,
  ClockIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
  ArrowPathIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { clientAuth } from '@/lib/auth'

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  type?: string;
  profileImage?: string;
  verified?: boolean;
  createdAt?: string;
  country?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

interface NotificationSetting {
  id: string;
  category: string;
  title: string;
  description: string;
  enabled: boolean;
  channels?: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

interface SecuritySetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  requiresVerification?: boolean;
}

interface AccountSetting {
  field: string;
  label: string;
  value: string;
  type: string;
  editable?: boolean;
}

interface DeviceSession {
  id: string;
  deviceName: string;
  browser: string;
  ip: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

interface ThemeOption {
  id: string;
  name: string;
  icon: any;
  description: string;
}

interface LanguageOption {
  id: string;
  name: string;
  nativeName: string;
  flag: string;
}

interface CurrencyOption {
  id: string;
  name: string;
  symbol: string;
}

interface TimeZoneOption {
  id: string;
  name: string;
  offset: string;
}

// Navigation sidebar links
const navigation = [
  { name: 'Overview', href: '/dashboard/buyer', icon: ChartBarIcon },
  { name: 'Order Management', href: '/dashboard/buyer/orders', icon: ShoppingBagIcon },
  { name: 'Product Catalog', href: '/dashboard/buyer/products', icon: MagnifyingGlassIcon },
  { name: 'Supplier Management', href: '/dashboard/buyer/suppliers', icon: UserGroupIcon },
  { name: 'Payments & Billing', href: '/dashboard/buyer/payments', icon: CreditCardIcon },
  { name: 'Reports & Analytics', href: '/dashboard/buyer/reports', icon: ChartPieIcon },
  { name: 'Support & Help', href: '/dashboard/buyer/support', icon: QuestionMarkCircleIcon },
  { name: 'Settings', href: '/dashboard/buyer/settings', icon: Cog6ToothIcon },
]

// Theme options
const themeOptions = [
  { id: 'light', name: 'Light', icon: SunIcon, description: 'Light mode for daytime use' },
  { id: 'dark', name: 'Dark', icon: MoonIcon, description: 'Dark mode for nighttime use' },
  { id: 'system', name: 'System', icon: ComputerDesktopIcon, description: 'Follow system preferences' }
];

// Language options
const languageOptions = [
  { id: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { id: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { id: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { id: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { id: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' }
];

// Currency options
const currencyOptions = [
  { id: 'USD', name: 'US Dollar', symbol: '$' },
  { id: 'EUR', name: 'Euro', symbol: '€' },
  { id: 'GBP', name: 'British Pound', symbol: '£' },
  { id: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { id: 'AUD', name: 'Australian Dollar', symbol: 'A$' }
];

// Timezone options
const timeZoneOptions = [
  { id: 'UTC', name: 'Coordinated Universal Time', offset: 'UTC+0:00' },
  { id: 'EST', name: 'Eastern Standard Time', offset: 'UTC-5:00' },
  { id: 'PST', name: 'Pacific Standard Time', offset: 'UTC-8:00' },
  { id: 'CET', name: 'Central European Time', offset: 'UTC+1:00' }
];

export default function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saveLoading, setSaveLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [activeTab, setActiveTab] = useState('account')
  const [showPasswordSection, setShowPasswordSection] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [profileImageUrl, setProfileImageUrl] = useState('/default-avatar.png')
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {})
  const [confirmTitle, setConfirmTitle] = useState('')
  const [confirmMessage, setConfirmMessage] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [animationEnabled, setAnimationEnabled] = useState(true)
  const [isImageUploading, setIsImageUploading] = useState(false)
  const [showDeleteAccountDialog, setShowDeleteAccountDialog] = useState(false)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [passwordScore, setPasswordScore] = useState(0)
  
  // User data state
  const [userData, setUserData] = useState<UserData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profileImage: '/default-avatar.png',
    verified: false,
    createdAt: '',
    country: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  })
  
  // Form data for account settings
  const [accountForm, setAccountForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  })
  
  // Password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  // Password validation
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: 'Too weak',
    color: 'red'
  })
  
  // Device sessions
  const [deviceSessions, setDeviceSessions] = useState<DeviceSession[]>([
    {
      id: 'current',
      deviceName: 'Windows PC',
      browser: 'Chrome',
      ip: '192.168.1.X',
      location: 'New York, USA',
      lastActive: 'Now',
      isCurrent: true
    },
    {
      id: 'device2',
      deviceName: 'iPhone 13',
      browser: 'Safari',
      ip: '192.168.1.Y',
      location: 'New York, USA',
      lastActive: '2 hours ago',
      isCurrent: false
    }
  ])

  // Theme options
  const [selectedTheme, setSelectedTheme] = useState(themeOptions[0])
  const [selectedLanguage, setSelectedLanguage] = useState(languageOptions[0])
  const [selectedCurrency, setSelectedCurrency] = useState(currencyOptions[0])
  const [selectedTimeZone, setSelectedTimeZone] = useState(timeZoneOptions[0])
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY')
  const [reducedMotion, setReducedMotion] = useState(false)
  const [highContrast, setHighContrast] = useState(false)

  // Notification settings with categories
  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    {
      id: 'order_updates',
      category: 'Orders',
      title: 'Order Status Updates',
      description: 'Receive notifications about your order status changes',
      enabled: true,
      channels: { email: true, push: true, sms: false }
    },
    {
      id: 'order_delivery',
      category: 'Orders',
      title: 'Delivery Updates',
      description: 'Get notified about delivery status changes',
      enabled: true,
      channels: { email: true, push: true, sms: false }
    },
    {
      id: 'promotions',
      category: 'Marketing',
      title: 'New Promotions',
      description: 'Get notified about new deals and discounts',
      enabled: false,
      channels: { email: false, push: false, sms: false }
    },
    {
      id: 'inventory',
      category: 'Products',
      title: 'Inventory Alerts',
      description: 'Notifications when items are back in stock',
      enabled: true,
      channels: { email: true, push: false, sms: false }
    },
    {
      id: 'price_drops',
      category: 'Products',
      title: 'Price Drops',
      description: 'Get alerted when items in your wishlist drop in price',
      enabled: true,
      channels: { email: true, push: true, sms: false }
    },
    {
      id: 'new_features',
      category: 'System',
      title: 'New Features',
      description: 'Be the first to know about new platform features',
      enabled: true,
      channels: { email: true, push: false, sms: false }
    },
    {
      id: 'account_activity',
      category: 'Security',
      title: 'Account Activity',
      description: 'Be notified of important account activities',
      enabled: true,
      channels: { email: true, push: true, sms: true }
    }
  ])

  // Security settings
  const [securitySettings, setSecuritySettings] = useState<SecuritySetting[]>([
    {
      id: 'two_factor',
      title: 'Two-Factor Authentication',
      description: 'Add an extra layer of security to your account',
      enabled: false,
      requiresVerification: true
    },
    {
      id: 'login_alerts',
      title: 'Login Alerts',
      description: 'Get notified of new login attempts',
      enabled: true
    },
    {
      id: 'suspicious_activity',
      title: 'Suspicious Activity Detection',
      description: "We'll alert you of any unusual activity on your account",
      enabled: true
    },
    {
      id: 'biometric',
      title: 'Biometric Login',
      description: "Use your fingerprint or face ID for faster secure access",
      enabled: false,
      requiresVerification: true
    },
    {
      id: 'device_management',
      title: 'Device Management',
      description: "Control which devices can access your account",
      enabled: true
    }
  ])

  // Usage Stats (mock data)
  const [usageStats, setUsageStats] = useState({
    ordersPlaced: 42,
    totalSpent: 12750,
    activeDevices: 2,
    lastLogin: '2 hours ago',
    memberSince: 'Jan 15, 2023',
    accountStatus: 'Active'
  })

  // Fetch user data on component mount
  useEffect(() => {
    async function fetchUserData() {
      try {
        console.log('Fetching user profile data...');
        // Get token from localStorage
        const token = clientAuth.getToken();
        
        if (!token) {
          console.log('No auth token found, redirecting to login');
          router.push('/auth/login');
          return;
        }
        
        const response = await fetch('/api/user/profile', {
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Profile API error:', response.status, errorData);
          
          if (response.status === 401) {
            console.log('User not authenticated, redirecting to login');
            router.push('/auth/login')
            return
          }
          throw new Error(`Failed to fetch user data: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('User data loaded:', data);
        
        // Update both the user data and the form
        setUserData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          phone: data.phone || '',
          type: data.type || 'BUYER',
          profileImage: data.profileImage || '/default-avatar.png',
          verified: data.verified || false,
          createdAt: data.createdAt || new Date().toISOString(),
          country: data.country || '',
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          zipCode: data.zipCode || ''
        });
        
        setProfileImageUrl(data.profileImage || '/default-avatar.png');
        
        setAccountForm({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          phone: data.phone || '',
          country: data.country || '',
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          zipCode: data.zipCode || ''
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error)
        setError('Failed to load user information')
        setLoading(false)
        
        // Set some default data for development
        const mockData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+1 (555) 123-4567',
          type: 'BUYER',
          profileImage: '/default-avatar.png',
          verified: true,
          createdAt: '2023-01-15T00:00:00.000Z',
          country: 'United States',
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001'
        };
        
        setUserData(mockData);
        setProfileImageUrl(mockData.profileImage);
        setAccountForm({
          firstName: mockData.firstName,
          lastName: mockData.lastName,
          email: mockData.email,
          phone: mockData.phone,
          country: mockData.country,
          address: mockData.address,
          city: mockData.city,
          state: mockData.state,
          zipCode: mockData.zipCode
        });
        
        setLoading(false);
      }
    }
    
    fetchUserData();
    
    // Load preferences from localStorage if available
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      const themeOption = themeOptions.find(option => option.id === storedTheme);
      if (themeOption) {
        setSelectedTheme(themeOption);
        setIsDarkMode(storedTheme === 'dark');
      }
    }
    
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage) {
      const langOption = languageOptions.find(option => option.id === storedLanguage);
      if (langOption) {
        setSelectedLanguage(langOption);
      }
    }
    
    const storedReducedMotion = localStorage.getItem('reducedMotion');
    if (storedReducedMotion) {
      setReducedMotion(storedReducedMotion === 'true');
      setAnimationEnabled(storedReducedMotion !== 'true');
    }
    
    return () => {
      console.log('Settings component unmounted');
    };
  }, [router])

  // Evaluate password strength
  const evaluatePasswordStrength = (password: string) => {
    if (!password) {
      setPasswordStrength({ score: 0, message: 'Too weak', color: 'red' });
      setPasswordScore(0);
      return;
    }
    
    let score = 0;
    
    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    // Set appropriate message and color
    let message = 'Too weak';
    let color = 'red';
    
    if (score >= 6) {
      message = 'Very strong';
      color = 'green';
    } else if (score >= 4) {
      message = 'Strong';
      color = 'blue';
    } else if (score >= 3) {
      message = 'Medium';
      color = 'yellow';
    } else if (score >= 2) {
      message = 'Weak';
      color = 'orange';
    }
    
    setPasswordStrength({ score, message, color });
    setPasswordScore(score);
  };

  // Handle account form changes
  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccountForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle password form changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'newPassword') {
      evaluatePasswordStrength(value);
    }
  };
  
  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsImageUploading(true);
    
    // Simulate upload with timeout
    setTimeout(() => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newImageUrl = event.target?.result as string;
        setProfileImageUrl(newImageUrl);
        setIsImageUploading(false);
        
        showSuccessMessage("Profile image updated successfully!");
      };
      reader.readAsDataURL(file);
    }, 1500);
  };
  
  // Show success message with auto-hide
  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
  };
  
  // Show error message with auto-hide
  const showErrorMessage = (message: string) => {
    setError(message);
    setTimeout(() => {
      setError('');
    }, 5000);
  };
  
  // Open confirm dialog
  const openConfirmDialog = (title: string, message: string, action: () => void) => {
    setConfirmTitle(title);
    setConfirmMessage(message);
    setConfirmAction(() => action);
    setConfirmDialogOpen(true);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  // Handle form submission
  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      // Get token from localStorage
      const token = clientAuth.getToken();
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(accountForm)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }
      
      const data = await response.json();
      setUserData({
        ...userData,
        ...data
      });
      
      showSuccessMessage('Profile updated successfully!');
      setIsEditingProfile(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      showErrorMessage(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setSaveLoading(false);
    }
  };
  
  // Handle password update
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showErrorMessage("New passwords don't match");
      return;
    }
    
    if (passwordScore < 3) {
      showErrorMessage("Please use a stronger password");
      return;
    }
    
    setSaveLoading(true);
    
    try {
      // Get token from localStorage
      const token = clientAuth.getToken();
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const response = await fetch('/api/user/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });
      
      // Simulate success for development
      setTimeout(() => {
        showSuccessMessage('Password updated successfully!');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setShowPasswordSection(false);
        setSaveLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error updating password:', error);
      showErrorMessage('Failed to update password');
      setSaveLoading(false);
    }
  };
  
  // Toggle notification settings
  const toggleNotification = useCallback((id: string) => {
    setNotifications(prev => prev.map(notification =>
      notification.id === id
        ? { ...notification, enabled: !notification.enabled }
        : notification
    ));
  }, []);
  
  // Toggle notification channel
  const toggleNotificationChannel = useCallback((id: string, channel: 'email' | 'push' | 'sms') => {
    setNotifications(prev => prev.map(notification =>
      notification.id === id && notification.channels
        ? { 
            ...notification, 
            channels: { 
              ...notification.channels, 
              [channel]: !notification.channels[channel] 
            } 
          }
        : notification
    ));
  }, []);

  // Toggle security settings
  const toggleSecurity = useCallback((id: string) => {
    const setting = securitySettings.find(s => s.id === id);
    
    if (setting?.requiresVerification) {
      openConfirmDialog(
        `Enable ${setting.title}?`,
        `You will need to verify your identity to enable this feature.`,
        () => {
          setSecuritySettings(prev => prev.map(setting =>
            setting.id === id
              ? { ...setting, enabled: !setting.enabled }
              : setting
          ));
        }
      );
    } else {
      setSecuritySettings(prev => prev.map(setting =>
        setting.id === id
          ? { ...setting, enabled: !setting.enabled }
          : setting
      ));
    }
  }, [securitySettings, openConfirmDialog]);
  
  // Handle theme change
  const handleThemeChange = useCallback((theme: ThemeOption) => {
    setSelectedTheme(theme);
    setIsDarkMode(theme.id === 'dark');
    localStorage.setItem('theme', theme.id);
  }, []);
  
  // Handle language change
  const handleLanguageChange = useCallback((language: LanguageOption) => {
    setSelectedLanguage(language);
    localStorage.setItem('language', language.id);
  }, []);
  
  // Handle reduced motion toggle
  const handleReducedMotionToggle = useCallback((enabled: boolean) => {
    setReducedMotion(enabled);
    setAnimationEnabled(!enabled);
    localStorage.setItem('reducedMotion', enabled.toString());
  }, []);
  
  // Save all preferences function
  const savePreferences = useCallback(() => {
    // Save theme preference
    localStorage.setItem('theme', selectedTheme.id);
    document.documentElement.classList.toggle('dark', selectedTheme.id === 'dark');
    
    // Save language preference
    localStorage.setItem('language', selectedLanguage.id);
    
    // Save date format preference
    localStorage.setItem('dateFormat', dateFormat);
    
    // Save currency preference
    localStorage.setItem('currency', selectedCurrency.id);
    
    // Save timezone preference
    localStorage.setItem('timezone', selectedTimeZone.id);
    
    // Save reduced motion preference
    localStorage.setItem('reducedMotion', reducedMotion.toString());
    
    // Save high contrast preference
    localStorage.setItem('highContrast', highContrast.toString());
    document.documentElement.classList.toggle('high-contrast', highContrast);
    
    // Show success message
    showSuccessMessage("Preferences saved successfully!");
    
    // Apply theme to body element if needed
    if (selectedTheme.id === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [selectedTheme, selectedLanguage, dateFormat, selectedCurrency, selectedTimeZone, reducedMotion, highContrast, showSuccessMessage]);
  
  // Handle logout
  const handleLogout = async () => {
    try {
      // Get token from localStorage
      const token = clientAuth.getToken();
      
      // Call the logout API endpoint
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Clear the token from localStorage
      clientAuth.clearToken();
      
      // Redirect to login page
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still attempt to redirect on error
      router.push('/auth/login');
    }
  };
  
  // Handle device removal
  const handleRemoveDevice = (deviceId: string) => {
    if (deviceId === 'current') {
      showErrorMessage("You cannot remove your current device");
      return;
    }
    
    openConfirmDialog(
      "Remove Device",
      "Are you sure you want to remove this device? You will be signed out on this device.",
      () => {
        setDeviceSessions(deviceSessions.filter(session => session.id !== deviceId));
        showSuccessMessage("Device removed successfully");
      }
    );
  };
  
  // Handle delete account
  const handleDeleteAccount = () => {
    setShowDeleteAccountDialog(true);
  };
  
  // Confirm account deletion
  const confirmDeleteAccount = async () => {
    setShowDeleteAccountDialog(false);
    
    // Simulate account deletion
    setTimeout(() => {
      router.push('/auth/login');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toggle Button - YouTube Style */}
      <div className={`fixed top-0 ${sidebarOpen ? 'left-64' : 'left-0'} z-50 h-14 transition-all duration-300`}>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="h-14 w-14 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors duration-200 focus:outline-none"
          aria-label="Toggle sidebar"
        >
          <Bars3Icon className="w-6 h-6 text-gray-900" />
        </button>
      </div>

      {/* Dark Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 border-r border-gray-800 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <div className="h-full flex flex-col">
          {/* Logo and Title */}
          <div className="h-14 px-4 flex items-center border-b border-gray-800">
            <Image src="/logo.jpg" alt="Logo" width={30} height={30} className="rounded" />
            <span className="ml-4 text-lg font-medium text-white">
              <span className="text-blue-400">e</span>-ecm
            </span>
          </div>

          {/* User Info */}
          {userData.firstName && (
            <div className="px-4 py-3 border-b border-gray-800">
              <p className="text-sm text-gray-400">Logged in as</p>
              <p className="text-white font-medium truncate">{userData.firstName} {userData.lastName}</p>
              <p className="text-xs text-gray-500 truncate">{userData.email}</p>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-2">
            <ul className="space-y-1 px-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <a 
                    href={item.href} 
                    className={`flex items-center px-3 py-2 rounded-lg ${item.name === 'Settings' 
                      ? 'bg-gray-800 text-white' 
                      : 'text-gray-300 hover:bg-gray-800'}`}
                  >
                    <item.icon className="w-5 h-5 mr-3 text-gray-400" />
                    <span>{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-800">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-gray-300 rounded-lg hover:bg-gray-800"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3 text-gray-400" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`min-h-screen ${sidebarOpen ? 'pl-64' : 'pl-0'} transition-all duration-300`}>
        <main className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Settings Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl overflow-hidden">
                <div className="p-8 sm:p-10 lg:p-12">
                  <div className="md:flex md:items-center md:justify-between">
                    <div className="flex-1 min-w-0">
                      <h1 className="text-3xl font-bold text-white sm:text-4xl">
                        Account Settings
                      </h1>
                      <p className="mt-2 text-lg text-blue-100">
                        Manage your profile, preferences, and account settings
                      </p>
                    </div>
                    <div className="mt-4 flex md:mt-0 md:ml-4">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <ArrowRightOnRectangleIcon className="-ml-1 mr-2 h-5 w-5" />
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Error/Success Messages */}
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start"
                  >
                    <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                    <p className="text-sm text-red-700">{error}</p>
                  </motion.div>
                )}
                
                {successMessage && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 bg-green-50 border-l-4 border-green-500 rounded-md flex items-start"
                  >
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                    <p className="text-sm text-green-700">{successMessage}</p>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Settings Tabs */}
              <div className="bg-white shadow rounded-xl overflow-hidden">
                <Tab.Group onChange={(index) => setActiveTab(['account', 'notifications', 'security', 'preferences'][index])}>
                  <Tab.List className="bg-gray-50 border-b border-gray-200">
                    <div className="px-6 flex space-x-8">
                      <Tab className={({ selected }: { selected: boolean }) => `
                        py-4 px-1 text-sm font-medium text-gray-500 whitespace-nowrap border-b-2 
                        ${selected 
                          ? 'border-blue-500 text-blue-600' 
                          : 'border-transparent hover:text-gray-700 hover:border-gray-300'} 
                        focus:outline-none transition-colors duration-200
                      `}>
                        <span className="flex items-center">
                          <UserIcon className="h-5 w-5 mr-2" />
                          Account
                        </span>
                      </Tab>
                      <Tab className={({ selected }: { selected: boolean }) => `
                        py-4 px-1 text-sm font-medium text-gray-500 whitespace-nowrap border-b-2 
                        ${selected 
                          ? 'border-blue-500 text-blue-600' 
                          : 'border-transparent hover:text-gray-700 hover:border-gray-300'} 
                        focus:outline-none transition-colors duration-200
                      `}>
                        <span className="flex items-center">
                          <BellIcon className="h-5 w-5 mr-2" />
                          Notifications
                        </span>
                      </Tab>
                      <Tab className={({ selected }: { selected: boolean }) => `
                        py-4 px-1 text-sm font-medium text-gray-500 whitespace-nowrap border-b-2 
                        ${selected 
                          ? 'border-blue-500 text-blue-600' 
                          : 'border-transparent hover:text-gray-700 hover:border-gray-300'} 
                        focus:outline-none transition-colors duration-200
                      `}>
                        <span className="flex items-center">
                          <ShieldCheckIcon className="h-5 w-5 mr-2" />
                          Security
                        </span>
                      </Tab>
                      <Tab className={({ selected }: { selected: boolean }) => `
                        py-4 px-1 text-sm font-medium text-gray-500 whitespace-nowrap border-b-2 
                        ${selected 
                          ? 'border-blue-500 text-blue-600' 
                          : 'border-transparent hover:text-gray-700 hover:border-gray-300'} 
                        focus:outline-none transition-colors duration-200
                      `}>
                        <span className="flex items-center">
                          <Cog6ToothIcon className="h-5 w-5 mr-2" />
                          Preferences
                        </span>
                      </Tab>
                    </div>
                  </Tab.List>
                  <Tab.Panels className="p-6">
                    <Tab.Panel>
                      {/* Account Panel Content */}
                      <div className="space-y-8">
                        {/* Profile Section */}
                        <div className="bg-white overflow-hidden sm:rounded-lg">
                          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                            <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
                              <UserIcon className="h-5 w-5 mr-2 text-gray-500" />
                              Profile Information
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and contact information</p>
                          </div>
                          
                          <div className="px-4 py-5 sm:p-6">
                            <div className="flex flex-col md:flex-row md:space-x-8">
                              {/* Profile Image */}
                              <div className="flex-none mb-6 md:mb-0">
                                <div className="relative group">
                                  <div className="relative h-32 w-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow">
                                    {isImageUploading ? (
                                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                      </div>
                                    ) : (
                                      <Image 
                                        src={profileImageUrl} 
                                        alt="Profile picture" 
                                        width={128} 
                                        height={128}
                                        className="h-full w-full object-cover"
                                      />
                                    )}
                                  </div>
                                  <label 
                                    htmlFor="profile-image-upload" 
                                    className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center cursor-pointer shadow-md hover:bg-blue-700 transition-colors"
                                  >
                                    <CameraIcon className="h-4 w-4 text-white" />
                                    <span className="sr-only">Change profile picture</span>
                                  </label>
                                  <input 
                                    id="profile-image-upload" 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                  />
                                </div>
                                
                                <div className="mt-4 flex items-center space-x-2">
                                  {userData.verified ? (
                                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      <CheckIcon className="h-3 w-3 mr-1" />
                                      Verified
                                    </div>
                                  ) : (
                                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                      <ExclamationCircleIcon className="h-3 w-3 mr-1" />
                                      Unverified
                                    </div>
                                  )}
                                  <span className="text-xs text-gray-500">
                                    Member since {formatDate(userData.createdAt || '')}
                                  </span>
                                </div>
                              </div>
                              
                              {/* Profile Details */}
                              <div className="flex-1">
                                {isEditingProfile ? (
                                  <form onSubmit={handleAccountSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      <div>
                                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                                          First Name
                                        </label>
                                        <input
                                          type="text"
                                          id="firstName"
                                          name="firstName"
                                          value={accountForm.firstName}
                                          onChange={handleAccountChange}
                                          className="mt-1 block w-full shadow-sm sm:text-sm rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                          required
                                        />
                                      </div>
                                      
                                      <div>
                                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                                          Last Name
                                        </label>
                                        <input
                                          type="text"
                                          id="lastName"
                                          name="lastName"
                                          value={accountForm.lastName}
                                          onChange={handleAccountChange}
                                          className="mt-1 block w-full shadow-sm sm:text-sm rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                          required
                                        />
                                      </div>
                                      
                                      <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                          Email Address
                                        </label>
                                        <input
                                          type="email"
                                          id="email"
                                          name="email"
                                          value={accountForm.email}
                                          onChange={handleAccountChange}
                                          className="mt-1 block w-full shadow-sm sm:text-sm rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                          required
                                        />
                                      </div>
                                      
                                      <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                          Phone Number
                                        </label>
                                        <input
                                          type="tel"
                                          id="phone"
                                          name="phone"
                                          value={accountForm.phone}
                                          onChange={handleAccountChange}
                                          className="mt-1 block w-full shadow-sm sm:text-sm rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                      </div>
                                      
                                      <div>
                                        <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                                          Country
                                        </label>
                                        <input
                                          type="text"
                                          id="country"
                                          name="country"
                                          value={accountForm.country}
                                          onChange={handleAccountChange}
                                          className="mt-1 block w-full shadow-sm sm:text-sm rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                      </div>
                                      
                                      <div>
                                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                          Address
                                        </label>
                                        <input
                                          type="text"
                                          id="address"
                                          name="address"
                                          value={accountForm.address}
                                          onChange={handleAccountChange}
                                          className="mt-1 block w-full shadow-sm sm:text-sm rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                      </div>
                                      
                                      <div>
                                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                          City
                                        </label>
                                        <input
                                          type="text"
                                          id="city"
                                          name="city"
                                          value={accountForm.city}
                                          onChange={handleAccountChange}
                                          className="mt-1 block w-full shadow-sm sm:text-sm rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                      </div>
                                      
                                      <div className="grid grid-cols-2 gap-3">
                                        <div>
                                          <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                                            State/Province
                                          </label>
                                          <input
                                            type="text"
                                            id="state"
                                            name="state"
                                            value={accountForm.state}
                                            onChange={handleAccountChange}
                                            className="mt-1 block w-full shadow-sm sm:text-sm rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                          />
                                        </div>
                                        
                                        <div>
                                          <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                                            ZIP / Postal
                                          </label>
                                          <input
                                            type="text"
                                            id="zipCode"
                                            name="zipCode"
                                            value={accountForm.zipCode}
                                            onChange={handleAccountChange}
                                            className="mt-1 block w-full shadow-sm sm:text-sm rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="flex justify-end space-x-3">
                                      <button
                                        type="button"
                                        onClick={() => setIsEditingProfile(false)}
                                        className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        type="submit"
                                        disabled={saveLoading}
                                        className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
                                      >
                                        {saveLoading ? (
                                          <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Saving...
                                          </>
                                        ) : 'Save Changes'}
                                      </button>
                                    </div>
                                  </form>
                                ) : (
                                  <div>
                                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                                      <div className="col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">First name</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{userData.firstName}</dd>
                                      </div>
                                      <div className="col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">Last name</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{userData.lastName}</dd>
                                      </div>
                                      <div className="col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">Email</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{userData.email}</dd>
                                      </div>
                                      <div className="col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">Phone</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{userData.phone || '-'}</dd>
                                      </div>
                                      <div className="col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">Country</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{userData.country || '-'}</dd>
                                      </div>
                                      <div className="col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">Address</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{userData.address || '-'}</dd>
                                      </div>
                                      <div className="col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">City</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{userData.city || '-'}</dd>
                                      </div>
                                      <div className="col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">State/ZIP</dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                          {userData.state ? `${userData.state}${userData.zipCode ? `, ${userData.zipCode}` : ''}` : '-'}
                                        </dd>
                                      </div>
                                    </dl>
                                    
                                    <div className="mt-6">
                                      <button
                                        type="button"
                                        onClick={() => setIsEditingProfile(true)}
                                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                      >
                                        Edit Profile
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Password Section */}
                        <div className="bg-white overflow-hidden shadow sm:rounded-lg">
                          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                            <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
                              <KeyIcon className="h-5 w-5 mr-2 text-gray-500" />
                              Password
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">Update your password or enable two-factor authentication</p>
                          </div>
                          
                          <div className="px-4 py-5 sm:p-6">
                            {showPasswordSection ? (
                              <form onSubmit={handlePasswordUpdate} className="space-y-6">
                                <div className="space-y-4">
                                  <div>
                                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                                      Current Password
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                      <input
                                        type={passwordVisible ? "text" : "password"}
                                        id="currentPassword"
                                        name="currentPassword"
                                        value={passwordForm.currentPassword}
                                        onChange={handlePasswordChange}
                                        className="block w-full pr-10 sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        required
                                      />
                                      <button
                                        type="button"
                                        onClick={() => setPasswordVisible(!passwordVisible)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                                      >
                                        {passwordVisible ? (
                                          <EyeSlashIcon className="h-5 w-5" />
                                        ) : (
                                          <EyeIcon className="h-5 w-5" />
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                                      New Password
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                      <input
                                        type={passwordVisible ? "text" : "password"}
                                        id="newPassword"
                                        name="newPassword"
                                        value={passwordForm.newPassword}
                                        onChange={handlePasswordChange}
                                        className="block w-full pr-10 sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        required
                                      />
                                    </div>
                                    {passwordForm.newPassword && (
                                      <div className="mt-2">
                                        <div className="flex items-center">
                                          <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div 
                                              className={`h-2 rounded-full ${
                                                passwordScore >= 6 ? 'bg-green-500' :
                                                passwordScore >= 4 ? 'bg-blue-500' :
                                                passwordScore >= 3 ? 'bg-yellow-500' :
                                                'bg-red-500'
                                              }`}
                                              style={{ width: `${Math.min(100, passwordScore * 16.6)}%` }}
                                            ></div>
                                          </div>
                                          <span className={`ml-2 text-xs ${
                                            passwordScore >= 6 ? 'text-green-600' :
                                            passwordScore >= 4 ? 'text-blue-600' :
                                            passwordScore >= 3 ? 'text-yellow-600' :
                                            'text-red-600'
                                          }`}>
                                            {passwordStrength.message}
                                          </span>
                                        </div>
                                        <ul className="mt-2 text-xs text-gray-500 space-y-1">
                                          <li className={passwordForm.newPassword.length >= 8 ? 'text-green-600' : ''}>
                                            • At least 8 characters
                                          </li>
                                          <li className={/[A-Z]/.test(passwordForm.newPassword) ? 'text-green-600' : ''}>
                                            • At least one uppercase letter
                                          </li>
                                          <li className={/[a-z]/.test(passwordForm.newPassword) ? 'text-green-600' : ''}>
                                            • At least one lowercase letter
                                          </li>
                                          <li className={/[0-9]/.test(passwordForm.newPassword) ? 'text-green-600' : ''}>
                                            • At least one number
                                          </li>
                                          <li className={/[^A-Za-z0-9]/.test(passwordForm.newPassword) ? 'text-green-600' : ''}>
                                            • At least one special character
                                          </li>
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                      Confirm New Password
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                      <input
                                        type={passwordVisible ? "text" : "password"}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={passwordForm.confirmPassword}
                                        onChange={handlePasswordChange}
                                        className={`block w-full pr-10 sm:text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                                          passwordForm.newPassword && 
                                          passwordForm.confirmPassword && 
                                          passwordForm.newPassword !== passwordForm.confirmPassword
                                            ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                                            : 'border-gray-300'
                                        }`}
                                        required
                                      />
                                    </div>
                                    {passwordForm.newPassword && 
                                     passwordForm.confirmPassword && 
                                     passwordForm.newPassword !== passwordForm.confirmPassword && (
                                      <p className="mt-1 text-xs text-red-600">
                                        Passwords don't match
                                      </p>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="flex justify-end space-x-3">
                                  <button
                                    type="button"
                                    onClick={() => setShowPasswordSection(false)}
                                    className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="submit"
                                    disabled={saveLoading}
                                    className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
                                  >
                                    {saveLoading ? (
                                      <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Updating...
                                      </>
                                    ) : 'Update Password'}
                                  </button>
                                </div>
                              </form>
                            ) : (
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-900">Password</h4>
                                  <p className="mt-1 text-sm text-gray-500">
                                    Last updated: 3 months ago
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setShowPasswordSection(true)}
                                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                  Change password
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Danger Zone */}
                        <div className="bg-white overflow-hidden shadow sm:rounded-lg">
                          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 bg-red-50">
                            <h3 className="text-lg font-medium leading-6 text-red-800 flex items-center">
                              <ExclamationCircleIcon className="h-5 w-5 mr-2 text-red-500" />
                              Danger Zone
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm text-red-700">
                              Irreversible and destructive actions
                            </p>
                          </div>
                          
                          <div className="px-4 py-5 sm:p-6">
                            <div className="space-y-6">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-900">Delete account</h4>
                                  <p className="mt-1 text-sm text-gray-500">
                                    Permanently delete your account and all of your data
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={handleDeleteAccount}
                                  className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                  <TrashIcon className="-ml-1 mr-2 h-4 w-4" />
                                  Delete Account
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Tab.Panel>
                    <Tab.Panel>
                      {/* Notifications Panel Content */}
                      <div className="space-y-8">
                        <div className="bg-white overflow-hidden shadow sm:rounded-lg">
                          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                            <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
                              <BellIcon className="h-5 w-5 mr-2 text-gray-500" />
                              Notification Preferences
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">Configure how and when you receive notifications</p>
                          </div>
                          
                          <div className="px-4 py-6 sm:p-6">
                            {/* Group notifications by category */}
                            {['Orders', 'Marketing', 'Products', 'System', 'Security'].map(category => {
                              const categoryNotifications = notifications.filter(n => n.category === category);
                              if (categoryNotifications.length === 0) return null;
                              
                              return (
                                <div key={category} className="mb-8 last:mb-0">
                                  <h4 className="text-base font-medium text-gray-900 mb-4">{category}</h4>
                                  <div className="space-y-4">
                                    {categoryNotifications.map(notification => (
                                      <div key={notification.id} className="bg-white rounded-lg border border-gray-200 shadow-sm">
                                        <div className="p-4 sm:p-5">
                                          <div className="flex items-center justify-between">
                                            <div className="flex-1 pr-6">
                                              <h5 className="text-sm font-medium text-gray-900">{notification.title}</h5>
                                              <p className="mt-1 text-xs text-gray-500">{notification.description}</p>
                                            </div>
                                            <Switch
                                              checked={notification.enabled}
                                              onChange={() => toggleNotification(notification.id)}
                                              className={`${
                                                notification.enabled ? 'bg-blue-600' : 'bg-gray-200'
                                              } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                                            >
                                              <span className="sr-only">Toggle notification</span>
                                              <span
                                                aria-hidden="true"
                                                className={`${
                                                  notification.enabled ? 'translate-x-5' : 'translate-x-0'
                                                } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                                              />
                                            </Switch>
                                          </div>
                                          
                                          {notification.enabled && notification.channels && (
                                            <div className="mt-4 border-t border-gray-100 pt-4">
                                              <h6 className="text-xs font-medium text-gray-700 mb-2">Delivery Channels</h6>
                                              <div className="flex items-center space-x-4">
                                                <div className="flex items-center">
                                                  <input
                                                    id={`${notification.id}-email`}
                                                    name={`${notification.id}-email`}
                                                    type="checkbox"
                                                    checked={notification.channels.email}
                                                    onChange={() => toggleNotificationChannel(notification.id, 'email')}
                                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                  />
                                                  <label htmlFor={`${notification.id}-email`} className="ml-2 text-xs text-gray-700">
                                                    <EnvelopeIcon className="inline h-3 w-3 mr-1" />
                                                    Email
                                                  </label>
                                                </div>
                                                <div className="flex items-center">
                                                  <input
                                                    id={`${notification.id}-push`}
                                                    name={`${notification.id}-push`}
                                                    type="checkbox"
                                                    checked={notification.channels.push}
                                                    onChange={() => toggleNotificationChannel(notification.id, 'push')}
                                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                  />
                                                  <label htmlFor={`${notification.id}-push`} className="ml-2 text-xs text-gray-700">
                                                    <DevicePhoneMobileIcon className="inline h-3 w-3 mr-1" />
                                                    Push
                                                  </label>
                                                </div>
                                                <div className="flex items-center">
                                                  <input
                                                    id={`${notification.id}-sms`}
                                                    name={`${notification.id}-sms`}
                                                    type="checkbox"
                                                    checked={notification.channels.sms}
                                                    onChange={() => toggleNotificationChannel(notification.id, 'sms')}
                                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                  />
                                                  <label htmlFor={`${notification.id}-sms`} className="ml-2 text-xs text-gray-700">
                                                    <DevicePhoneMobileIcon className="inline h-3 w-3 mr-1" />
                                                    SMS
                                                  </label>
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        
                        <div className="bg-white overflow-hidden shadow sm:rounded-lg">
                          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                            <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
                              <InformationCircleIcon className="h-5 w-5 mr-2 text-gray-500" />
                              Communication Settings
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">Control email frequency and marketing preferences</p>
                          </div>
                          
                          <div className="px-4 py-5 sm:p-6">
                            <div className="space-y-6">
                              <div>
                                <h4 className="text-sm font-medium text-gray-900">Email Digest</h4>
                                <p className="mt-1 text-xs text-gray-500">Choose how often you want to receive email summaries</p>
                                <fieldset className="mt-4">
                                  <div className="space-y-3">
                                    <div className="flex items-center">
                                      <input
                                        id="digest-daily"
                                        name="digest-frequency"
                                        type="radio"
                                        className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                                      />
                                      <label htmlFor="digest-daily" className="ml-3 text-sm text-gray-700">
                                        Daily
                                      </label>
                                    </div>
                                    <div className="flex items-center">
                                      <input
                                        id="digest-weekly"
                                        name="digest-frequency"
                                        type="radio"
                                        className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                                        defaultChecked
                                      />
                                      <label htmlFor="digest-weekly" className="ml-3 text-sm text-gray-700">
                                        Weekly
                                      </label>
                                    </div>
                                    <div className="flex items-center">
                                      <input
                                        id="digest-monthly"
                                        name="digest-frequency"
                                        type="radio"
                                        className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                                      />
                                      <label htmlFor="digest-monthly" className="ml-3 text-sm text-gray-700">
                                        Monthly
                                      </label>
                                    </div>
                                    <div className="flex items-center">
                                      <input
                                        id="digest-never"
                                        name="digest-frequency"
                                        type="radio"
                                        className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                                      />
                                      <label htmlFor="digest-never" className="ml-3 text-sm text-gray-700">
                                        Never
                                      </label>
                                    </div>
                                  </div>
                                </fieldset>
                              </div>
                              
                              <div className="pt-6 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-900">Marketing Communications</h4>
                                    <p className="mt-1 text-xs text-gray-500">Receive emails about new products, offers, and updates</p>
                                  </div>
                                  <Switch
                                    checked={true}
                                    className="bg-blue-600 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                  >
                                    <span className="sr-only">Toggle marketing communications</span>
                                    <span
                                      aria-hidden="true"
                                      className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                                    />
                                  </Switch>
                                </div>
                              </div>
                              
                              <div className="pt-6 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-900">Event Invitations</h4>
                                    <p className="mt-1 text-xs text-gray-500">Get notified about upcoming events and webinars</p>
                                  </div>
                                  <Switch
                                    checked={false}
                                    className="bg-gray-200 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                  >
                                    <span className="sr-only">Toggle event invitations</span>
                                    <span
                                      aria-hidden="true"
                                      className="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                                    />
                                  </Switch>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Tab.Panel>
                    <Tab.Panel>
                      {/* Security Panel Content */}
                      <div className="space-y-8">
                        {/* Security Settings */}
                        <div className="bg-white overflow-hidden shadow sm:rounded-lg">
                          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                            <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
                              <ShieldCheckIcon className="h-5 w-5 mr-2 text-gray-500" />
                              Security Settings
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">Manage your account security preferences</p>
                          </div>
                          
                          <div className="px-4 py-5 sm:p-6">
                            <div className="space-y-6">
                              {securitySettings.map(setting => (
                                <div key={setting.id} className="flex items-center justify-between border-b border-gray-200 pb-5 last:border-b-0 last:pb-0">
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-900 flex items-center">
                                      {setting.id === 'two_factor' && <KeyIcon className="h-4 w-4 mr-2 text-gray-500" />}
                                      {setting.id === 'login_alerts' && <BellIcon className="h-4 w-4 mr-2 text-gray-500" />}
                                      {setting.id === 'suspicious_activity' && <ExclamationCircleIcon className="h-4 w-4 mr-2 text-gray-500" />}
                                      {setting.id === 'biometric' && <KeyIcon className="h-4 w-4 mr-2 text-gray-500" />}
                                      {setting.id === 'device_management' && <DevicePhoneMobileIcon className="h-4 w-4 mr-2 text-gray-500" />}
                                      {setting.title}
                                    </h4>
                                    <p className="mt-1 text-xs text-gray-500">{setting.description}</p>
                                    {setting.requiresVerification && !setting.enabled && (
                                      <span className="inline-flex items-center px-2 py-0.5 mt-2 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                        Requires verification
                                      </span>
                                    )}
                                  </div>
                                  <div>
                                    <Switch
                                      checked={setting.enabled}
                                      onChange={() => toggleSecurity(setting.id)}
                                      className={`${
                                        setting.enabled ? 'bg-blue-600' : 'bg-gray-200'
                                      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                                    >
                                      <span className="sr-only">Toggle {setting.title}</span>
                                      <span
                                        aria-hidden="true"
                                        className={`${
                                          setting.enabled ? 'translate-x-5' : 'translate-x-0'
                                        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                                      />
                                    </Switch>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        {/* Active Sessions */}
                        <div className="bg-white overflow-hidden shadow sm:rounded-lg">
                          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                            <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
                              <DevicePhoneMobileIcon className="h-5 w-5 mr-2 text-gray-500" />
                              Active Sessions
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">Devices currently logged in to your account</p>
                          </div>
                          
                          <div className="px-4 py-5 sm:p-6">
                            <div className="space-y-4">
                              {deviceSessions.map(session => (
                                <div key={session.id} className="bg-white rounded-lg border border-gray-200 p-4 flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center">
                                      <h4 className="text-sm font-medium text-gray-900">
                                        {session.deviceName} / {session.browser}
                                      </h4>
                                      {session.isCurrent && (
                                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                          Current
                                        </span>
                                      )}
                                    </div>
                                    <div className="mt-1 text-xs text-gray-500 grid grid-cols-2 gap-2">
                                      <div>
                                        <span className="font-medium">IP:</span> {session.ip}
                                      </div>
                                      <div>
                                        <span className="font-medium">Location:</span> {session.location}
                                      </div>
                                      <div>
                                        <span className="font-medium">Last active:</span> {session.lastActive}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {!session.isCurrent && (
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveDevice(session.id)}
                                      className="ml-4 inline-flex items-center px-2.5 py-1.5 border border-red-300 text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    >
                                      Sign out
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        {/* Recent Activity */}
                        <div className="bg-white overflow-hidden shadow sm:rounded-lg">
                          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                            <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
                              <ClockIcon className="h-5 w-5 mr-2 text-gray-500" />
                              Recent Activity
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">Recent security events on your account</p>
                          </div>
                          
                          <div className="px-4 py-5 sm:p-6">
                            <ul className="space-y-4">
                              {[
                                { event: 'Login', device: 'Windows PC', location: 'New York, USA', time: '2 hours ago' },
                                { event: 'Password changed', device: 'Windows PC', location: 'New York, USA', time: '3 months ago' },
                                { event: 'Login', device: 'iPhone 13', location: 'New York, USA', time: '1 day ago' },
                                { event: 'Login attempt', device: 'Unknown device', location: 'Boston, USA', time: '5 days ago' }
                              ].map((activity, index) => (
                                <li key={index} className="flex items-start space-x-3">
                                  <div className="flex-shrink-0 pt-0.5">
                                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                      {activity.event.includes('Login attempt') ? (
                                        <ExclamationCircleIcon className="h-4 w-4 text-yellow-600" />
                                      ) : activity.event.includes('Password') ? (
                                        <KeyIcon className="h-4 w-4 text-blue-600" />
                                      ) : (
                                        <ArrowRightOnRectangleIcon className="h-4 w-4 text-blue-600" />
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900">{activity.event}</p>
                                    <p className="text-xs text-gray-500">
                                      {activity.device} • {activity.location} • {activity.time}
                                    </p>
                                  </div>
                                </li>
                              ))}
                            </ul>
                            
                            <div className="mt-6">
                              <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                                View all activity →
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Tab.Panel>
                    <Tab.Panel>
                      {/* Preferences Panel Content */}
                      <div className="space-y-8">
                        {/* Theme Settings */}
                        <div className="bg-white overflow-hidden shadow sm:rounded-lg">
                          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                            <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
                              <PaintBrushIcon className="h-5 w-5 mr-2 text-gray-500" />
                              Theme Settings
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">Customize the appearance of the application</p>
                          </div>
                          
                          <div className="px-4 py-5 sm:p-6">
                            <div className="space-y-6">
                              {/* Theme Selector */}
                              <div>
                                <Listbox value={selectedTheme} onChange={handleThemeChange}>
                                  {({ open }) => (
                                    <div className="contents">
                                      <Listbox.Label className="block text-sm font-medium text-gray-700">Theme</Listbox.Label>
                                      <div className="mt-1 relative">
                                        <Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                          <div className="flex items-center">
                                            <selectedTheme.icon className="flex-shrink-0 h-5 w-5 text-gray-500" aria-hidden="true" />
                                            <span className="ml-3 block truncate">{selectedTheme.name}</span>
                                          </div>
                                          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                          </span>
                                        </Listbox.Button>

                                        <Transition
                                          show={open}
                                          as="div"
                                          leave="transition ease-in duration-100"
                                          leaveFrom="opacity-100"
                                          leaveTo="opacity-0"
                                        >
                                          <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                            {themeOptions.map((theme) => (
                                              <Listbox.Option
                                                key={theme.id}
                                                className={({ active }) =>
                                                  `${active ? 'text-white bg-blue-600' : 'text-gray-900'}
                                                    relative cursor-default select-none py-2 pl-3 pr-9`
                                                }
                                                value={theme}
                                              >
                                                {({ selected, active }) => (
                                                  <div className="contents">
                                                    <div className="flex items-center">
                                                      <theme.icon
                                                        className={`${active ? 'text-white' : 'text-gray-500'} h-5 w-5 flex-shrink-0`}
                                                        aria-hidden="true"
                                                      />
                                                      <span className={`${selected ? 'font-semibold' : 'font-normal'} ml-3 block truncate`}>
                                                        {theme.name}
                                                      </span>
                                                      <span className="ml-2 text-gray-500 text-xs">{theme.description}</span>
                                                    </div>

                                                    {selected && (
                                                      <span
                                                        className={`${active ? 'text-white' : 'text-blue-600'}
                                                            absolute inset-y-0 right-0 flex items-center pr-4`}
                                                      >
                                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                      </span>
                                                    )}
                                                  </div>
                                                )}
                                              </Listbox.Option>
                                            ))}
                                          </Listbox.Options>
                                        </Transition>
                                      </div>
                                    </div>
                                  )}
                                </Listbox>
                                
                                <div className="mt-4">
                                  <p className="text-sm font-medium text-gray-700 mb-2">Preview</p>
                                  <div className="grid grid-cols-3 gap-3">
                                    <div className={`rounded-md border ${selectedTheme.id === 'light' ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-300'} overflow-hidden shadow-sm`}>
                                      <div className="h-16 bg-white"></div>
                                      <div className="p-2 bg-gray-50 text-xs text-center text-gray-700">Light</div>
                                    </div>
                                    
                                    <div className={`rounded-md border ${selectedTheme.id === 'dark' ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-300'} overflow-hidden shadow-sm`}>
                                      <div className="h-16 bg-gray-900"></div>
                                      <div className="p-2 bg-gray-800 text-xs text-center text-gray-200">Dark</div>
                                    </div>
                                    
                                    <div className={`rounded-md border ${selectedTheme.id === 'system' ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-300'} overflow-hidden shadow-sm`}>
                                      <div className="h-16 bg-gradient-to-r from-white to-gray-900"></div>
                                      <div className="p-2 bg-gradient-to-r from-gray-50 to-gray-800 text-xs text-center text-gray-700">System</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Accessibility Settings */}
                              <div className="pt-6 border-t border-gray-200">
                                <h4 className="text-sm font-medium text-gray-900 mb-4">Accessibility</h4>
                                <div className="space-y-4">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-sm font-medium text-gray-700">Reduced Motion</p>
                                      <p className="text-xs text-gray-500">Minimize animations throughout the interface</p>
                                    </div>
                                    <Switch
                                      checked={reducedMotion}
                                      onChange={handleReducedMotionToggle}
                                      className={`${
                                        reducedMotion ? 'bg-blue-600' : 'bg-gray-200'
                                      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                                    >
                                      <span className="sr-only">Toggle reduced motion</span>
                                      <span
                                        aria-hidden="true"
                                        className={`${
                                          reducedMotion ? 'translate-x-5' : 'translate-x-0'
                                        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                                      />
                                    </Switch>
                                  </div>
                                  
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-sm font-medium text-gray-700">High Contrast</p>
                                      <p className="text-xs text-gray-500">Increase contrast for better readability</p>
                                    </div>
                                    <Switch
                                      checked={highContrast}
                                      onChange={(value) => setHighContrast(value)}
                                      className={`${
                                        highContrast ? 'bg-blue-600' : 'bg-gray-200'
                                      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                                    >
                                      <span className="sr-only">Toggle high contrast</span>
                                      <span
                                        aria-hidden="true"
                                        className={`${
                                          highContrast ? 'translate-x-5' : 'translate-x-0'
                                        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                                      />
                                    </Switch>
                                  </div>
                                  
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Font Size</label>
                                    <div className="mt-2">
                                      <div className="flex items-center space-x-2">
                                        <span className="text-xs text-gray-500">A</span>
                                        <input
                                          type="range"
                                          min="1"
                                          max="5"
                                          step="1"
                                          defaultValue="3"
                                          className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                        />
                                        <span className="text-base font-bold text-gray-500">A</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Localization Settings */}
                        <div className="bg-white overflow-hidden shadow sm:rounded-lg">
                          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                            <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
                              <GlobeAltIcon className="h-5 w-5 mr-2 text-gray-500" />
                              Localization
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">Regional and language preferences</p>
                          </div>
                          
                          <div className="px-4 py-5 sm:p-6">
                            <div className="space-y-6">
                              {/* Language Selector */}
                              <div>
                                <Listbox value={selectedLanguage} onChange={handleLanguageChange}>
                                  {({ open }) => (
                                    <div className="contents">
                                      <Listbox.Label className="block text-sm font-medium text-gray-700">Language</Listbox.Label>
                                      <div className="mt-1 relative">
                                        <Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                          <div className="flex items-center">
                                            <span className="mr-2">{selectedLanguage.flag}</span>
                                            <span className="block truncate">{selectedLanguage.name}</span>
                                            <span className="ml-2 text-gray-500">({selectedLanguage.nativeName})</span>
                                          </div>
                                          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                          </span>
                                        </Listbox.Button>

                                        <Transition
                                          show={open}
                                          as="div"
                                          leave="transition ease-in duration-100"
                                          leaveFrom="opacity-100"
                                          leaveTo="opacity-0"
                                        >
                                          <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                            {languageOptions.map((language) => (
                                              <Listbox.Option
                                                key={language.id}
                                                className={({ active }) =>
                                                  `${active ? 'text-white bg-blue-600' : 'text-gray-900'}
                                                    relative cursor-default select-none py-2 pl-3 pr-9`
                                                }
                                                value={language}
                                              >
                                                {({ selected, active }) => (
                                                  <div className="contents">
                                                    <div className="flex items-center">
                                                      <span className="mr-2">{language.flag}</span>
                                                      <span className={`${selected ? 'font-semibold' : 'font-normal'} block truncate`}>
                                                        {language.name}
                                                      </span>
                                                      <span className="ml-2 text-xs text-gray-500">({language.nativeName})</span>
                                                    </div>

                                                    {selected && (
                                                      <span
                                                        className={`${active ? 'text-white' : 'text-blue-600'}
                                                            absolute inset-y-0 right-0 flex items-center pr-4`}
                                                      >
                                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                      </span>
                                                    )}
                                                  </div>
                                                )}
                                              </Listbox.Option>
                                            ))}
                                          </Listbox.Options>
                                        </Transition>
                                      </div>
                                    </div>
                                  )}
                                </Listbox>
                              </div>
                              
                              {/* Currency Selector */}
                              <div>
                                <Listbox value={selectedCurrency} onChange={(currency) => setSelectedCurrency(currency)}>
                                  {({ open }) => (
                                    <div className="contents">
                                      <Listbox.Label className="block text-sm font-medium text-gray-700">Currency</Listbox.Label>
                                      <div className="mt-1 relative">
                                        <Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                          <div className="flex items-center">
                                            <span className="font-medium mr-1">{selectedCurrency.symbol}</span>
                                            <span className="block truncate">{selectedCurrency.name}</span>
                                          </div>
                                          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                          </span>
                                        </Listbox.Button>

                                        <Transition
                                          show={open}
                                          as="div"
                                          leave="transition ease-in duration-100"
                                          leaveFrom="opacity-100"
                                          leaveTo="opacity-0"
                                        >
                                          <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                            {currencyOptions.map((currency) => (
                                              <Listbox.Option
                                                key={currency.id}
                                                className={({ active }) =>
                                                  `${active ? 'text-white bg-blue-600' : 'text-gray-900'}
                                                    relative cursor-default select-none py-2 pl-3 pr-9`
                                                }
                                                value={currency}
                                              >
                                                {({ selected, active }) => (
                                                  <div className="contents">
                                                    <div className="flex items-center">
                                                      <span className={`${active ? 'text-white' : 'text-gray-900'} font-medium mr-1`}>
                                                        {currency.symbol}
                                                      </span>
                                                      <span className={`${selected ? 'font-semibold' : 'font-normal'} block truncate`}>
                                                        {currency.name}
                                                      </span>
                                                    </div>

                                                    {selected && (
                                                      <span
                                                        className={`${active ? 'text-white' : 'text-blue-600'}
                                                            absolute inset-y-0 right-0 flex items-center pr-4`}
                                                      >
                                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                      </span>
                                                    )}
                                                  </div>
                                                )}
                                              </Listbox.Option>
                                            ))}
                                          </Listbox.Options>
                                        </Transition>
                                      </div>
                                    </div>
                                  )}
                                </Listbox>
                              </div>
                              
                              {/* Timezone Selector */}
                              <div>
                                <Listbox value={selectedTimeZone} onChange={(timezone) => setSelectedTimeZone(timezone)}>
                                  {({ open }) => (
                                    <div className="contents">
                                      <Listbox.Label className="block text-sm font-medium text-gray-700">Time Zone</Listbox.Label>
                                      <div className="mt-1 relative">
                                        <Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                          <div className="flex items-center">
                                            <span className="block truncate">{selectedTimeZone.name}</span>
                                            <span className="ml-2 text-gray-500 text-xs">{selectedTimeZone.offset}</span>
                                          </div>
                                          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                          </span>
                                        </Listbox.Button>

                                        <Transition
                                          show={open}
                                          as="div"
                                          leave="transition ease-in duration-100"
                                          leaveFrom="opacity-100"
                                          leaveTo="opacity-0"
                                        >
                                          <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                            {timeZoneOptions.map((timezone) => (
                                              <Listbox.Option
                                                key={timezone.id}
                                                className={({ active }) =>
                                                  `${active ? 'text-white bg-blue-600' : 'text-gray-900'}
                                                    relative cursor-default select-none py-2 pl-3 pr-9`
                                                }
                                                value={timezone}
                                              >
                                                {({ selected, active }) => (
                                                  <div className="contents">
                                                    <div className="flex items-center">
                                                      <span className={`${selected ? 'font-semibold' : 'font-normal'} block truncate`}>
                                                        {timezone.name}
                                                      </span>
                                                      <span className={`ml-2 text-xs ${active ? 'text-white' : 'text-gray-500'}`}>
                                                        {timezone.offset}
                                                      </span>
                                                    </div>

                                                    {selected && (
                                                      <span
                                                        className={`${active ? 'text-white' : 'text-blue-600'}
                                                            absolute inset-y-0 right-0 flex items-center pr-4`}
                                                      >
                                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                      </span>
                                                    )}
                                                  </div>
                                                )}
                                              </Listbox.Option>
                                            ))}
                                          </Listbox.Options>
                                        </Transition>
                                      </div>
                                    </div>
                                  )}
                                </Listbox>
                              </div>
                              
                              {/* Date Format */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700">Date Format</label>
                                <div className="mt-2">
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="flex items-center">
                                      <input
                                        id="dateformat-mmddyyyy"
                                        name="dateformat"
                                        type="radio"
                                        checked={dateFormat === "MM/DD/YYYY"}
                                        onChange={() => setDateFormat("MM/DD/YYYY")}
                                        className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                                      />
                                      <label htmlFor="dateformat-mmddyyyy" className="ml-3">
                                        <div className="text-sm text-gray-900">MM/DD/YYYY</div>
                                        <div className="text-xs text-gray-500">Example: 12/31/2023</div>
                                      </label>
                                    </div>
                                    <div className="flex items-center">
                                      <input
                                        id="dateformat-ddmmyyyy"
                                        name="dateformat"
                                        type="radio"
                                        checked={dateFormat === "DD/MM/YYYY"}
                                        onChange={() => setDateFormat("DD/MM/YYYY")}
                                        className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                                      />
                                      <label htmlFor="dateformat-ddmmyyyy" className="ml-3">
                                        <div className="text-sm text-gray-900">DD/MM/YYYY</div>
                                        <div className="text-xs text-gray-500">Example: 31/12/2023</div>
                                      </label>
                                    </div>
                                    <div className="flex items-center">
                                      <input
                                        id="dateformat-yyyymmdd"
                                        name="dateformat"
                                        type="radio"
                                        checked={dateFormat === "YYYY-MM-DD"}
                                        onChange={() => setDateFormat("YYYY-MM-DD")}
                                        className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                                      />
                                      <label htmlFor="dateformat-yyyymmdd" className="ml-3">
                                        <div className="text-sm text-gray-900">YYYY-MM-DD</div>
                                        <div className="text-xs text-gray-500">Example: 2023-12-31</div>
                                      </label>
                                    </div>
                                    <div className="flex items-center">
                                      <input
                                        id="dateformat-longform"
                                        name="dateformat"
                                        type="radio"
                                        checked={dateFormat === "MMMM D, YYYY"}
                                        onChange={() => setDateFormat("MMMM D, YYYY")}
                                        className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                                      />
                                      <label htmlFor="dateformat-longform" className="ml-3">
                                        <div className="text-sm text-gray-900">Month Day, Year</div>
                                        <div className="text-xs text-gray-500">Example: December 31, 2023</div>
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="mt-6 flex justify-end">
                                <button
                                  type="button"
                                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                  onClick={() => showSuccessMessage("Localization preferences saved successfully!")}
                                >
                                  Save Preferences
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Tab.Panel>
                  </Tab.Panels>
                </Tab.Group>
              </div>
            </div>
          )}
        </main>
      </div>
      
      {/* Confirmation Dialog */}
      <Transition appear show={confirmDialogOpen} as="div">
        <Dialog as="div" className="relative z-50" onClose={() => setConfirmDialogOpen(false)}>
          <Transition.Child
            as="div"
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as="div"
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    {confirmTitle}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">{confirmMessage}</p>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      onClick={() => setConfirmDialogOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      onClick={() => {
                        confirmAction();
                        setConfirmDialogOpen(false);
                      }}
                    >
                      Confirm
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      
      {/* Delete Account Confirmation Dialog */}
      <Transition appear show={showDeleteAccountDialog} as="div">
        <Dialog as="div" className="relative z-50" onClose={() => setShowDeleteAccountDialog(false)}>
          <Transition.Child
            as="div"
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as="div"
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 flex items-center text-red-600">
                    <ExclamationCircleIcon className="h-6 w-6 mr-2" />
                    Delete Account
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">This action cannot be undone. This will permanently delete your account and remove all your data from our servers.</p>
                    <div className="mt-4 p-3 bg-red-50 rounded-md text-sm text-red-700">
                      <p>You will lose access to:</p>
                      <ul className="list-disc pl-5 mt-1 space-y-1">
                        <li>Your order history and tracking information</li>
                        <li>Saved payment methods and addresses</li>
                        <li>Wishlist and saved items</li>
                        <li>Any unused store credits or rewards</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700">
                      Please type "DELETE" to confirm:
                    </label>
                    <input 
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                      placeholder="Type DELETE"
                    />
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      onClick={() => setShowDeleteAccountDialog(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      onClick={confirmDeleteAccount}
                    >
                      Delete Account
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
} 