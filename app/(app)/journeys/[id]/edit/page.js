import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import JourneyForm from '../../new/JourneyForm'

export const metadata = {
  title: 'Edit Journey - RoverNote',
  description: 'Update your travel memory',
}

export default async function EditJourneyPage({ params }) {
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

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">
            Edit Journey
          </h1>
          <p className="text-gray-600">
            Update the details of your adventure
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
          <JourneyForm userId={user.id} journey={journey} />
        </div>
      </div>
    </div>
  )
}

