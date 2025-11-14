'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Calendar, FileText, Tag, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { generateFileName } from '@/lib/utils'
import Input from '@/app/components/ui/Input'
import Textarea from '@/app/components/ui/Textarea'
import Button from '@/app/components/ui/Button'
import ImageUpload from '@/app/components/ImageUpload'

export default function JourneyForm({ userId, journey = null }) {
  const router = useRouter()
  const isEditing = !!journey
  
  const [formData, setFormData] = useState({
    title: journey?.title || '',
    location: journey?.location || '',
    start_date: journey?.start_date || '',
    end_date: journey?.end_date || '',
    body: journey?.body || '',
    tags: journey?.tags?.join(', ') || '',
  })
  
  const [image, setImage] = useState(null)
  const [imageError, setImageError] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleImageChange = (file, error) => {
    setImage(file)
    setImageError(error || '')
  }

  const validate = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    
    if (formData.start_date && formData.end_date) {
      if (new Date(formData.start_date) > new Date(formData.end_date)) {
        newErrors.end_date = 'End date must be after start date'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const uploadImage = async () => {
    if (!image) return null

    try {
      const fileName = generateFileName(userId, image.name)
      
      const { data, error } = await supabase.storage
        .from('journey-images')
        .upload(fileName, image, {
          cacheControl: '3600',
          upsert: false,
        })

      if (error) throw error

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('journey-images')
        .getPublicUrl(fileName)

      return { url: publicUrl, path: fileName }
    } catch (error) {
      console.error('Error uploading image:', error)
      throw new Error('Failed to upload image')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validate()) return
    
    setLoading(true)

    try {
      // Upload image if present
      let imageData = null
      if (image) {
        imageData = await uploadImage()
      }

      // Process tags
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      // Prepare journey data
      const journeyData = {
        user_id: userId,
        title: formData.title.trim(),
        location: formData.location.trim() || null,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        body: formData.body.trim() || null,
        tags: tags.length > 0 ? tags : null,
        image_url: imageData?.url || journey?.image_url || null,
        image_path: imageData?.path || journey?.image_path || null,
      }

      if (isEditing) {
        // Update existing journey
        const { error } = await supabase
          .from('journeys')
          .update(journeyData)
          .eq('id', journey.id)
          .eq('user_id', userId)

        if (error) throw error

        router.push(`/journeys/${journey.id}`)
      } else {
        // Create new journey
        const { data, error } = await supabase
          .from('journeys')
          .insert([journeyData])
          .select()
          .single()

        if (error) throw error

        router.push(`/journeys/${data.id}`)
      }

      router.refresh()
    } catch (error) {
      console.error('Error saving journey:', error)
      setErrors({ submit: error.message || 'Failed to save journey. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Message */}
      {errors.submit && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {errors.submit}
        </div>
      )}

      {/* Title */}
      <Input
        label="Title"
        name="title"
        placeholder="e.g., Kyoto, Japan"
        value={formData.title}
        onChange={handleChange}
        error={errors.title}
        icon={FileText}
        required
      />

      {/* Location */}
      <Input
        label="Location"
        name="location"
        placeholder="e.g., Amalfi Coast, Italy"
        value={formData.location}
        onChange={handleChange}
        icon={MapPin}
      />

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Start Date"
          name="start_date"
          type="date"
          value={formData.start_date}
          onChange={handleChange}
          icon={Calendar}
        />
        <Input
          label="End Date"
          name="end_date"
          type="date"
          value={formData.end_date}
          onChange={handleChange}
          error={errors.end_date}
          icon={Calendar}
        />
      </div>

      {/* Body */}
      <Textarea
        label="My Experience"
        name="body"
        placeholder="What's the story behind this journey? Share your memories, experiences, and reflections..."
        value={formData.body}
        onChange={handleChange}
        maxLength={5000}
        showCount
        className="min-h-[200px]"
      />

      {/* Tags */}
      <Input
        label="Tags"
        name="tags"
        placeholder="e.g., adventure, food, culture (comma-separated)"
        value={formData.tags}
        onChange={handleChange}
        helperText="Add tags to help organize and find your journeys later"
        icon={Tag}
      />

      {/* Image Upload */}
      <ImageUpload
        image={journey?.image_url}
        onChange={handleImageChange}
        error={imageError}
      />

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          className="flex-1"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            isEditing ? 'Update Journey' : 'Save Memory'
          )}
        </Button>
      </div>
    </form>
  )
}

