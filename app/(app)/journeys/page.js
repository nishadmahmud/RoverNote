import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import JourneysList from './JourneysList'

export const metadata = {
  title: 'My Journeys - RoverNote',
  description: 'View and manage your travel memories',
}

export default async function JourneysPage() {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user's journeys
  const { data: journeys, error } = await supabase
    .from('journeys')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching journeys:', error)
  }

  return (
    <div className="min-h-screen">
      <JourneysList initialJourneys={journeys || []} />
    </div>
  )
}

