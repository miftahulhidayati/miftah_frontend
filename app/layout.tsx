import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FTL iMeeting - Meeting Room Booking',
  description: 'Aplikasi Booking Ruang Meeting FTL',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <div className="flex">
            <Sidebar />
            <div className="flex-1">
              <Header />
              <main>
                {children}
              </main>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
