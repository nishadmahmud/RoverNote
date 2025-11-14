import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import JourneyForm from './JourneyForm'

export const metadata = {
  title: 'New Journey - RoverNote',
  description: 'Document a new adventure',
}

export default async function NewJourneyPage() {
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">
            Document a New Adventure
          </h1>
          <p className="text-gray-600">
            What&apos;s the story behind this journey?
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
          <JourneyForm userId={user.id} />
        </div>
      </div>
    </div>
  )
}

