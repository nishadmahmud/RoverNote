import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Map as MapIcon } from 'lucide-react'
import EmptyState from '@/app/components/ui/EmptyState'

export const metadata = {
  title: 'Map - RoverNote',
  description: 'Visualize your journeys on a map',
}

export default async function MapPage() {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-2">
            Your World Map
          </h1>
          <p className="text-gray-600">
            Visualize your adventures on an interactive map
          </p>
        </div>

        {/* Placeholder for map integration */}
        <div className="bg-white rounded-2xl shadow-md p-8 min-h-[500px] flex items-center justify-center">
          <EmptyState
            icon={MapIcon}
            title="Coming Soon!"
            description="An interactive map view is in the works. Soon you'll be able to see all your journeys plotted on a beautiful world map with clickable pins! 🗺️"
          />
        </div>
      </div>
    </div>
  )
}

