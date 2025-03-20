'use client'
import { useState } from 'react'
import { 
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon
} from '@heroicons/react/24/outline'

interface Event {
  id: string
  title: string
  type: 'delivery' | 'appointment' | 'meeting'
  date: string
  time: string
  location?: string
  description?: string
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Lens Delivery',
    type: 'delivery',
    date: '2024-01-20',
    time: '10:00 AM',
    location: 'Main Store'
  },
  {
    id: '2',
    title: 'Supplier Meeting',
    type: 'meeting',
    date: '2024-01-20',
    time: '2:00 PM',
    location: 'Virtual',
    description: 'Discuss new product line'
  }
]

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<Event[]>(mockEvents)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }

    return days
  }

  const getEventTypeColor = (type: Event['type']) => {
    const colors = {
      delivery: 'bg-green-100 text-green-800',
      appointment: 'bg-blue-100 text-blue-800',
      meeting: 'bg-purple-100 text-purple-800'
    }
    return colors[type]
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Calendar Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <CalendarIcon className="h-8 w-8" />
              <h1 className="text-2xl font-bold">Calendar</h1>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors">
              <PlusIcon className="h-5 w-5" />
              <span>Add Event</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Grid */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                {months[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-4 py-2 text-sm bg-gray-100 rounded-xl hover:bg-gray-200"
                >
                  Today
                </button>
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Day Headers */}
              {daysOfWeek.map((day) => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}

              {/* Calendar Days */}
              {generateCalendarDays().map((day, index) => {
                const dateStr = day ? `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : ''
                const dayEvents = events.filter(event => event.date === dateStr)
                
                return (
                  <div
                    key={index}
                    className={`
                      min-h-24 p-2 border border-gray-100 rounded-xl
                      ${day ? 'hover:bg-gray-50 cursor-pointer' : 'bg-gray-50'}
                      ${selectedDate === dateStr ? 'ring-2 ring-blue-500' : ''}
                    `}
                    onClick={() => day && setSelectedDate(dateStr)}
                  >
                    {day && (
                      <>
                        <div className="text-right">
                          <span className="text-sm">{day}</span>
                        </div>
                        <div className="mt-2 space-y-1">
                          {dayEvents.map(event => (
                            <div
                              key={event.id}
                              className={`text-xs p-1 rounded ${getEventTypeColor(event.type)}`}
                            >
                              {event.title}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Events Sidebar */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">
              {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : 'Upcoming Events'}
            </h3>
            <div className="space-y-4">
              {events
                .filter(event => !selectedDate || event.date === selectedDate)
                .map(event => (
                  <div key={event.id} className="p-4 bg-gray-50 rounded-xl">
                    <h4 className="font-medium">{event.title}</h4>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <ClockIcon className="h-4 w-4 mr-2" />
                        {event.time}
                      </div>
                      {event.location && (
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPinIcon className="h-4 w-4 mr-2" />
                          {event.location}
                        </div>
                      )}
                      {event.description && (
                        <p className="text-sm text-gray-600 mt-2">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 