'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft } from 'lucide-react'
import { fetchUnits, fetchRooms, fetchConsumptions, createBooking, checkAvailability } from '@/lib/api'
import { Unit, MeetingRoom, Consumption, CreateBookingRequest } from '@/lib/types'

const bookingSchema = z.object({
  unit_id: z.string().min(1, 'Unit harus dipilih'),
  meeting_room_id: z.string().min(1, 'Ruang meeting harus dipilih'),
  meeting_date: z.string().min(1, 'Tanggal rapat harus diisi'),
  start_time: z.string().min(1, 'Waktu mulai harus diisi'),
  end_time: z.string().min(1, 'Waktu selesai harus diisi'),
  total_participants: z.string().min(1, 'Jumlah peserta harus diisi'),
  total_consumption: z.string().min(0, 'Nominal konsumsi harus diisi'),
  consumption_ids: z.array(z.number()).optional(),
  notes: z.string().optional(),
}).refine((data) => {
  const startTime = data.start_time
  const endTime = data.end_time
  return startTime < endTime
}, {
  message: 'Waktu selesai harus setelah waktu mulai',
  path: ['end_time'],
})

type BookingFormData = z.infer<typeof bookingSchema>

export default function NewBooking() {
  const router = useRouter()
  const [units, setUnits] = useState<Unit[]>([])
  const [rooms, setRooms] = useState<MeetingRoom[]>([])
  const [consumptions, setConsumptions] = useState<Consumption[]>([])
  const [selectedRoom, setSelectedRoom] = useState<MeetingRoom | null>(null)
  const [availability, setAvailability] = useState<{ available: boolean; conflicts: any[] } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      total_consumption: '0',
      consumption_ids: [],
    }
  })

  const watchedValues = watch()

  useEffect(() => {
    const loadMasterData = async () => {
      try {
        const [unitsData, roomsData, consumptionsData] = await Promise.all([
          fetchUnits(),
          fetchRooms(),
          fetchConsumptions(),
        ])
        setUnits(unitsData)
        setRooms(roomsData)
        setConsumptions(consumptionsData)
      } catch (error) {
        console.error('Error fetching master data:', error)
      }
    }

    loadMasterData()
  }, [])

  // Update selected room when room selection changes
  useEffect(() => {
    if (watchedValues.meeting_room_id) {
      const room = rooms.find(r => r.id === parseInt(watchedValues.meeting_room_id))
      setSelectedRoom(room || null)
    }
  }, [watchedValues.meeting_room_id, rooms])

  const handleConsumptionChange = (consumptionId: number, checked: boolean) => {
    const currentIds = watchedValues.consumption_ids || []
    let newIds

    if (checked) {
      newIds = [...currentIds, consumptionId]
    } else {
      newIds = currentIds.filter(id => id !== consumptionId)
    }

    setValue('consumption_ids', newIds)
  }

  const onSubmit = async (data: BookingFormData) => {
    try {
      setIsSubmitting(true)

      const bookingData: CreateBookingRequest = {
        unit_id: parseInt(data.unit_id),
        meeting_room_id: parseInt(data.meeting_room_id),
        meeting_date: data.meeting_date,
        start_time: data.start_time,
        end_time: data.end_time,
        total_participants: parseInt(data.total_participants),
        total_consumption: parseInt(data.total_consumption),
        consumption_ids: data.consumption_ids || [],
        notes: data.notes,
      }

      await createBooking(bookingData)
      alert('Booking berhasil dibuat!')
      router.push('/booking')
    } catch (error) {
      console.error('Error creating booking:', error)
      alert('Error membuat booking. Silakan coba lagi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb area without white background */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            style={{ backgroundColor: '#4A8394' }}
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <div>
            <h1 className="text-lg font-medium text-gray-900">Ruang Meeting</h1>
            <p className="text-sm text-gray-500">Ruang Meeting</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Informasi Ruang Meeting */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Informasi Ruang Meeting</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit
                </label>
                <select
                  {...register('unit_id')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent bg-gray-50 text-sm"
                  style={{
                    '--tw-ring-color': '#4A8394',
                    '--tw-ring-opacity': '0.5'
                  } as React.CSSProperties}
                  onFocus={(e) => e.target.style.borderColor = '#4A8394'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                >
                  <option value="">Pilih Unit</option>
                  {units.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name}
                    </option>
                  ))}
                </select>
                {errors.unit_id && (
                  <p className="text-red-600 text-sm mt-1">{errors.unit_id.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pilihan Ruangan Meeting
                </label>
                <select
                  {...register('meeting_room_id')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent bg-gray-50 text-sm"
                  style={{
                    '--tw-ring-color': '#4A8394',
                    '--tw-ring-opacity': '0.5'
                  } as React.CSSProperties}
                  onFocus={(e) => e.target.style.borderColor = '#4A8394'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                >
                  <option value="">Pilih Ruangan Meeting</option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name}
                    </option>
                  ))}
                </select>
                {errors.meeting_room_id && (
                  <p className="text-red-600 text-sm mt-1">{errors.meeting_room_id.message}</p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kapasitas Ruangan
              </label>
              <input
                type="text"
                value={selectedRoom ? `${selectedRoom.capacity} Orang` : 'Kapasitas Ruangan'}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-100 text-gray-500 text-sm"
              />
            </div>
          </div>

          {/* Informasi Rapat */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Informasi Rapat</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Rapat *
                </label>
                <input
                  type="date"
                  {...register('meeting_date')}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent bg-white text-sm"
                  style={{
                    '--tw-ring-color': '#4A8394',
                    '--tw-ring-opacity': '0.5'
                  } as React.CSSProperties}
                  onFocus={(e) => e.target.style.borderColor = '#4A8394'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
                {errors.meeting_date && (
                  <p className="text-red-600 text-sm mt-1">{errors.meeting_date.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah Peserta
                </label>
                <input
                  type="number"
                  min="1"
                  {...register('total_participants')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent text-sm"
                  style={{
                    '--tw-ring-color': '#4A8394',
                    '--tw-ring-opacity': '0.5'
                  } as React.CSSProperties}
                  onFocus={(e) => e.target.style.borderColor = '#4A8394'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  placeholder="Masukan Jumlah Peserta"
                />
                {errors.total_participants && (
                  <p className="text-red-600 text-sm mt-1">{errors.total_participants.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Waktu Seleksi
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="time"
                    {...register('start_time')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent text-sm"
                    style={{
                      '--tw-ring-color': '#4A8394',
                      '--tw-ring-opacity': '0.5'
                    } as React.CSSProperties}
                    onFocus={(e) => e.target.style.borderColor = '#4A8394'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                    placeholder="Pilih Waktu Seleksi"
                  />
                  <input
                    type="time"
                    {...register('end_time')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent text-sm"
                    style={{
                      '--tw-ring-color': '#4A8394',
                      '--tw-ring-opacity': '0.5'
                    } as React.CSSProperties}
                    onFocus={(e) => e.target.style.borderColor = '#4A8394'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                    placeholder="Pilih Waktu Seleksi"
                  />
                </div>
                {(errors.start_time || errors.end_time) && (
                  <div className="mt-1">
                    {errors.start_time && (
                      <p className="text-red-600 text-sm">{errors.start_time.message}</p>
                    )}
                    {errors.end_time && (
                      <p className="text-red-600 text-sm">{errors.end_time.message}</p>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nominal Konsumsi
                </label>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-3 px-3 py-3 border border-r-0 border-gray-300 bg-gray-50 rounded-l-md">Rp</span>
                  <input
                    type="number"
                    min="0"
                    {...register('total_consumption')}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:border-transparent text-sm"
                    style={{
                      '--tw-ring-color': '#4A8394',
                      '--tw-ring-opacity': '0.5'
                    } as React.CSSProperties}
                    onFocus={(e) => e.target.style.borderColor = '#4A8394'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                </div>
                {errors.total_consumption && (
                  <p className="text-red-600 text-sm mt-1">{errors.total_consumption.message}</p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Jenis Konsumsi
              </label>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {consumptions.map((consumption) => (
                  <label key={consumption.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={watchedValues.consumption_ids?.includes(consumption.id) || false}
                      onChange={(e) => handleConsumptionChange(consumption.id, e.target.checked)}
                      className="h-4 w-4 border-gray-300 rounded focus:ring-2"
                      style={{
                        accentColor: '#4A8394',
                        '--tw-ring-color': '#4A8394'
                      } as React.CSSProperties}
                    />
                    <span className="text-sm text-gray-700">{consumption.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-8 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 text-sm font-medium text-white rounded-md hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#4A8394' }}
              >
                {isSubmitting ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}