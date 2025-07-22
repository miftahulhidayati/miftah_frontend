'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, User, CalendarDays } from 'lucide-react'

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-16 bg-white shadow-lg border-r border-gray-200">
      <div className="flex flex-col h-full">
        {/* Navigation Icons */}
        <nav className="flex-1 flex flex-col items-center py-6 space-y-6 mt-20">
          <Link
            href="/"
            className={`p-3 rounded-lg transition-colors ${
              pathname === "/"
                ? "text-white"
                : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            }`}
            style={pathname === "/" ? { backgroundColor: "#4A8394" } : {}}
            title="Dashboard">
            <Home className="h-6 w-6" />
          </Link>
          <Link
            href="/booking"
            className={`p-3 rounded-lg transition-colors ${
              pathname === "/booking"
                ? "text-white"
                : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            }`}
            style={pathname === "/booking" ? { backgroundColor: "#4A8394" } : {}}
            title="Meeting Room Booking">
            <CalendarDays className="h-6 w-6" />
          </Link>


        </nav>
      </div>
    </div>
  );
}