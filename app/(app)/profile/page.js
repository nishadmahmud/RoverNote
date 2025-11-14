import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfileView from './ProfileView'

export const metadata = {
  title: 'Profile - RoverNote',
  description: 'Manage your travel profile',
}

export default async function ProfilePage() {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get journey stats
  const { data: journeys } = await supabase
    .from('journeys')
    .select('id, location, tags')
    .eq('user_id', user.id)

  const journeyCount = journeys?.length || 0
  
  // Count unique locations (countries/cities)
  const uniqueLocations = new Set(
    journeys?.map(j => j.location).filter(Boolean)
  ).size

  // Count all tags
  const allTags = journeys?.flatMap(j => j.tags || []) || []
  const totalTags = new Set(allTags).size

  const stats = {
    journeys: journeyCount,
    locations: uniqueLocations,
    tags: totalTags,
  }

  return <ProfileView user={user} stats={stats} />
}

