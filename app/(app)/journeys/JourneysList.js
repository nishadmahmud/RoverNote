'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search, MapPin, Compass } from 'lucide-react'
import JourneyCard from '@/app/components/JourneyCard'
import EmptyState from '@/app/components/ui/EmptyState'
import Button from '@/app/components/ui/Button'

export default function JourneysList({ initialJourneys }) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [journeys] = useState(initialJourneys)

  // Filter journeys based on search query
  const filteredJourneys = journeys.filter((journey) => {
    const query = searchQuery.toLowerCase()
    return (
      journey.title?.toLowerCase().includes(query) ||
      journey.location?.toLowerCase().includes(query) ||
      journey.body?.toLowerCase().includes(query) ||
      journey.tags?.some(tag => tag.toLowerCase().includes(query))
    )
  })

  const handleNewEntry = () => {
    router.push('/journeys/new')
  }

  return (
    <>
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-2">
                My Journeys
              </h1>
              <p className="text-gray-600">
                A collection of your adventures and memories.
              </p>
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={handleNewEntry}
              className="md:ml-auto"
            >
              <Plus className="w-5 h-5" />
              New Entry
            </Button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {journeys.length === 0 ? (
          /* Empty State */
          <EmptyState
            icon={Compass}
            title="No journeys yet!"
            description="Start exploring and document your first adventure. Your travel memories are waiting to be captured! ✨"
            actionLabel="Create Your First Journey"
            onAction={handleNewEntry}
          />
        ) : (
          <>
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative max-w-xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by location, keyword, or memory..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-coral-400 focus:border-transparent transition-all outline-none bg-white"
                />
              </div>
            </div>

            {/* Journeys Grid */}
            {filteredJourneys.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No matches found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search terms
                </p>
                <Button
                  variant="ghost"
                  onClick={() => setSearchQuery('')}
                >
                  Clear search
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-gray-600">
                  {filteredJourneys.length} {filteredJourneys.length === 1 ? 'journey' : 'journeys'} found
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredJourneys.map((journey) => (
                    <JourneyCard key={journey.id} journey={journey} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  )
}

