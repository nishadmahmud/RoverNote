'use client'

import { useRouter } from 'next/navigation'
import { Mail, Calendar, MapPin, BookOpen, Tag } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import Card from '@/app/components/ui/Card'
import Button from '@/app/components/ui/Button'

export default function ProfileView({ user, stats }) {
  const router = useRouter()

  const displayName = user.user_metadata?.display_name || user.email?.split('@')[0] || 'Wanderer'
  const joinDate = formatDate(user.created_at, 'MMMM yyyy')

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-2">
            Profile
          </h1>
          <p className="text-gray-600">
            Your travel journey at a glance
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              {/* Avatar */}
              <div className="flex items-start gap-6 mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-coral-400 to-teal-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-3xl font-semibold text-white">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    {displayName}
                  </h2>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Joined {joinDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio Section (Placeholder) */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">About</h3>
                <p className="text-gray-600 text-sm italic">
                  Explorer of hidden gems and lover of street food. Capturing the world one city at a time.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/journeys')}
                >
                  View My Journeys
                </Button>
              </div>
            </Card>
          </div>

          {/* Stats Card */}
          <div className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Travel Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-coral-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-coral-600" />
                    </div>
                    <span className="text-gray-700 text-sm font-medium">Journeys</span>
                  </div>
                  <span className="text-2xl font-semibold text-gray-800">
                    {stats.journeys}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-teal-600" />
                    </div>
                    <span className="text-gray-700 text-sm font-medium">Locations</span>
                  </div>
                  <span className="text-2xl font-semibold text-gray-800">
                    {stats.locations}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-sage-300 rounded-lg flex items-center justify-center">
                      <Tag className="w-5 h-5 text-sage-600" />
                    </div>
                    <span className="text-gray-700 text-sm font-medium">Tags</span>
                  </div>
                  <span className="text-2xl font-semibold text-gray-800">
                    {stats.tags}
                  </span>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => router.push('/journeys/new')}
                >
                  Add New Journey
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => router.push('/map')}
                >
                  View on Map
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

