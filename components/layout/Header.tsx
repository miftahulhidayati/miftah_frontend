'use client'

import { usePathname } from 'next/navigation'
import { Bell, ChevronDown } from 'lucide-react'

const getPageTitle = (pathname: string) => {
  switch (pathname) {
    case '/':
      return 'Dashboard'
    case '/booking':
      return 'Ruang Meeting'
    case '/booking/new':
      return 'Ruang Meeting'
    default:
      return 'iMeeting'
  }
}

export function Header() {
  const pathname = usePathname()
  const title = getPageTitle(pathname)

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const imgElement = e.currentTarget as HTMLImageElement;
    const fallbackElement = imgElement.nextElementSibling as HTMLDivElement;
    imgElement.style.display = 'none';
    if (fallbackElement) {
      fallbackElement.style.display = 'flex';
    }
  }

  return (
    <header
      className="text-white shadow-lg"
      style={{
        background: 'linear-gradient(90deg, #11191A 0%, #296377 100%)'
      }}
    >
      <div className="px-6 py-3 ml-16">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Logo with FTL icon */}
            <div className="flex items-center space-x-3">
              <img
                src="/ftl-icon.svg"
                alt="FTL Logo"
                className="w-8 h-8"
                onError={(e) => {
                  // Fallback to text if image fails to load
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling as HTMLSpanElement;
                  if (fallback) fallback.style.display = 'block';
                }}
              />
              <span className="text-xs font-bold text-white bg-white/20 px-2 py-1 rounded hidden">FTL</span>
              <span className="text-xl font-medium">iMeeting</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Bell className="h-5 w-5" />
            </button>

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              {/* User Image Placeholder */}
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                <img
                  src="/api/placeholder/32/32"
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
                <div className="w-full h-full bg-gray-400 rounded-full hidden items-center justify-center">
                  <span className="text-xs text-white font-medium">JD</span>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-sm font-medium">John Doe</span>
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}