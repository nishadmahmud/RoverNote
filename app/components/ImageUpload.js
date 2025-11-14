'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { validateImageFile } from '@/lib/utils'
import Button from './ui/Button'

/**
 * Image Upload Component with drag & drop
 * @param {object} props - ImageUpload props
 * @param {File} props.image - Current image file
 * @param {Function} props.onChange - Callback when image changes
 * @param {string} props.error - Error message
 */
export default function ImageUpload({ image, onChange, error }) {
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileSelect = (file) => {
    if (!file) return

    const validation = validateImageFile(file)
    if (!validation.valid) {
      onChange(null, validation.error)
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result)
    }
    reader.readAsDataURL(file)

    onChange(file, null)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    handleFileSelect(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleFileInputChange = (e) => {
    const file = e.target.files[0]
    handleFileSelect(file)
  }

  const handleRemove = () => {
    setPreview(null)
    onChange(null, null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Photo
      </label>
      
      {preview || image ? (
        <div className="relative w-full h-64 rounded-xl overflow-hidden bg-gray-100 group">
          <Image
            src={preview || image}
            alt="Upload preview"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
            <Button
              variant="danger"
              size="sm"
              onClick={handleRemove}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
          className={`
            relative w-full h-64 rounded-xl border-2 border-dashed 
            flex flex-col items-center justify-center cursor-pointer
            transition-all
            ${isDragging 
              ? 'border-coral-400 bg-coral-50' 
              : 'border-gray-300 bg-gray-50 hover:border-coral-400 hover:bg-coral-50'
            }
          `}
        >
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
            {isDragging ? (
              <Upload className="w-8 h-8 text-coral-500" />
            ) : (
              <ImageIcon className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <p className="text-sm font-medium text-gray-700 mb-1">
            {isDragging ? 'Drop your photo here' : 'Drop your favorite photo here'}
          </p>
          <p className="text-xs text-gray-500 mb-4">
            or click to browse
          </p>
          <p className="text-xs text-gray-400">
            JPG, PNG, or WebP (max 5MB)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 mt-2">{error}</p>
      )}
      <p className="text-xs text-gray-500 mt-2">
        Choose a photo that captures the essence of your journey
      </p>
    </div>
  )
}

