'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CalendarDays, Users, Clock, Building2, Plus } from 'lucide-react'
import { fetchBookings, fetchRooms } from '@/lib/api'
import { Booking, MeetingRoom } from '@/lib/types'

export default function Dashboard() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [rooms, setRooms] = useState<MeetingRoom[]>([])
  const [loading, setLoading] = useState(true)
  const [todayDate, setTodayDate] = useState<string>('')
  const [mounted, setMounted] = useState(false)

  // Set today's date only on client side to avoid hydration mismatch
  useEffect(() => {
    setTodayDate(new Date().toISOString().split('T')[0])
    setMounted(true)
  }, [])

  useEffect(() => {
    const loadData = async () => {
      try {
        const [bookingsData, roomsData] = await Promise.all([
          fetchBookings({ limit: 5 }),
          fetchRooms(),
        ])
        setBookings(bookingsData.bookings)
        setRooms(roomsData)
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Calculate today's bookings only after component is mounted
  const todayBookings = mounted && todayDate ? bookings.filter(
    booking => booking.meeting_date === todayDate
  ) : []

  const totalParticipants = bookings.reduce(
    (sum, booking) => sum + booking.total_participants,
    0
  )

  // Format date safely for display
  const formatDate = (dateString: string) => {
    if (!mounted) return dateString // Return raw string during SSR
    try {
      return new Date(dateString).toLocaleDateString('id-ID')
    } catch {
      return dateString
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2" style={{ borderBottomColor: '#4A8394' }}></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Selamat datang di FTL iMeeting</p>
            </div>
            <Link
              href="/booking/new"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white rounded-md hover:opacity-90 transition-colors"
              style={{ backgroundColor: '#4A8394' }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Booking Ruangan
            </Link>
          </div>
        </div>

        <div className="space-y-8">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-100">
                  <CalendarDays className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Booking</p>
                  <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-green-100">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Booking Hari Ini</p>
                  <p className="text-2xl font-bold text-gray-900">{todayBookings.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-purple-100">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Peserta</p>
                  <p className="text-2xl font-bold text-gray-900">{totalParticipants}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-orange-100">
                  <Building2 className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Ruang Meeting</p>
                  <p className="text-2xl font-bold text-gray-900">{rooms.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Booking Terbaru</h2>
                <Link
                  href="/booking"
                  className="text-sm font-medium hover:opacity-80"
                  style={{ color: '#4A8394' }}
                >
                  Lihat Semua
                </Link>
              </div>
            </div>

            <div className="p-6">
              {bookings.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarDays className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Belum ada booking ruangan</p>
                  <Link
                    href="/booking/new"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white rounded-md hover:opacity-90"
                    style={{ backgroundColor: '#4A8394' }}
                  >
                    Booking Sekarang
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.slice(0, 5).map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="p-2 bg-gray-200 rounded-lg">
                            <Building2 className="h-5 w-5 text-gray-600" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            {booking.meeting_room.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {booking.unit.name} • {booking.total_participants} peserta
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {formatDate(booking.meeting_date)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {booking.start_time.substring(0, 5)} - {booking.end_time.substring(0, 5)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions & Available Rooms */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Menu Cepat</h3>
              <div className="space-y-3">
                <Link
                  href="/booking/new"
                  className="flex items-center p-3 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                >
                  <div className="p-2 rounded-lg mr-3" style={{ backgroundColor: '#4A8394', opacity: 0.1 }}>
                    <Plus className="h-4 w-4" style={{ color: '#4A8394' }} />
                  </div>
                  Booking Ruangan Baru
                </Link>
                <Link
                  href="/booking"
                  className="flex items-center p-3 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                >
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <CalendarDays className="h-4 w-4 text-blue-600" />
                  </div>
                  Lihat Semua Booking
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ruangan Tersedia</h3>
              <div className="space-y-3">
                {rooms.slice(0, 4).map((room) => (
                  <div key={room.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="p-2 bg-gray-200 rounded-lg mr-3">
                        <Building2 className="h-4 w-4 text-gray-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{room.name}</span>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{room.capacity} orang</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
