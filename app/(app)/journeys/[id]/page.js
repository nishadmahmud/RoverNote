import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import JourneyDetail from './JourneyDetail'

export async function generateMetadata({ params }) {
  const resolvedParams = await params
  const supabase = await createClient()
  
  const { data: journey } = await supabase
    .from('journeys')
    .select('title')
    .eq('id', resolvedParams.id)
    .single()

  return {
    title: journey ? `${journey.title} - RoverNote` : 'Journey - RoverNote',
  }
}

export default async function JourneyPage({ params }) {
  const resolvedParams = await params
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch the specific journey
  const { data: journey, error } = await supabase
    .from('journeys')
    .select('*')
    .eq('id', resolvedParams.id)
    .eq('user_id', user.id)
    .single()

  if (error || !journey) {
    notFound()
  }

  return <JourneyDetail journey={journey} userId={user.id} />
}

