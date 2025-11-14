'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { 
  Calendar, 
  MapPin, 
  Edit, 
  Trash2, 
  ArrowLeft,
  AlertTriangle,
  X 
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import Button from '@/app/components/ui/Button'

export default function JourneyDetail({ journey, userId }) {
  const router = useRouter()
  const supabase = createClient()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const { 
    id, 
    title, 
    location, 
    start_date, 
    end_date, 
    body, 
    image_url, 
    image_path, 
    tags,
    created_at 
  } = journey

  // Format date range
  const dateDisplay = start_date && end_date && start_date !== end_date
    ? `${formatDate(start_date, 'MMMM d, yyyy')} - ${formatDate(end_date, 'MMMM d, yyyy')}`
    : formatDate(start_date || end_date, 'MMMM d, yyyy')

  const handleEdit = () => {
    router.push(`/journeys/${id}/edit`)
  }

  const handleDelete = async () => {
    setDeleting(true)

    try {
      // Delete image from storage if it exists
      if (image_path) {
        await supabase.storage
          .from('journey-images')
          .remove([image_path])
      }

      // Delete journey from database
      const { error } = await supabase
        .from('journeys')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)

      if (error) throw error

      router.push('/journeys')
      router.refresh()
    } catch (error) {
      console.error('Error deleting journey:', error)
      alert('Failed to delete journey. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero Image */}
      {image_url ? (
        <div className="relative w-full h-[400px] md:h-[500px] bg-gray-200">
          <Image
            src={image_url}
            alt={title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      ) : (
        <div className="relative w-full h-[300px] bg-gradient-to-br from-teal-400 to-coral-400 flex items-center justify-center">
          <MapPin className="w-24 h-24 text-white opacity-50" />
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="bg-white shadow-md hover:shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 mb-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-4">
                {title}
              </h1>
              
              {/* Meta Information */}
              <div className="flex flex-wrap gap-4 text-gray-600">
                {location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    <span className="font-medium">{location}</span>
                  </div>
                )}
                {dateDisplay && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>{dateDisplay}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="md"
                onClick={handleEdit}
              >
                <Edit className="w-4 h-4" />
                Edit
              </Button>
              <Button
                variant="danger"
                size="md"
                onClick={() => setShowDeleteModal(true)}
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </div>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-cream-200 text-gray-700 text-sm font-medium rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Body Content */}
          {body && (
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {body}
              </p>
            </div>
          )}

          {/* Footer Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Created on {formatDate(created_at, 'MMMM d, yyyy')}
            </p>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Delete Journey?
                </h3>
                <p className="text-gray-600">
                  Are you sure you want to delete &quot;{title}&quot;? This action cannot be undone and will permanently remove this journey and its image.
                </p>
              </div>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                fullWidth
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                fullWidth
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete Journey'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

