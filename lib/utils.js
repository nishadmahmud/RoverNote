import { clsx } from 'clsx'
import { format, parseISO } from 'date-fns'

/**
 * Combines class names conditionally
 * @param {...any} inputs - Class names or conditional objects
 * @returns {string} Combined class names
 */
export function cn(...inputs) {
  return clsx(inputs)
}

/**
 * Formats a date string to a readable format
 * @param {string} dateString - ISO date string
 * @param {string} formatString - date-fns format string
 * @returns {string} Formatted date
 */
export function formatDate(dateString, formatString = 'MMMM yyyy') {
  if (!dateString) return ''
  try {
    return format(parseISO(dateString), formatString)
  } catch (error) {
    return dateString
  }
}

/**
 * Truncates text to a specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text with ellipsis
 */
export function truncate(text, maxLength = 150) {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

/**
 * Generates a unique file name for uploads
 * @param {string} userId - User ID
 * @param {string} originalName - Original file name
 * @returns {string} Unique file path
 */
export function generateFileName(userId, originalName) {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 9)
  const extension = originalName.split('.').pop()
  return `${userId}/${timestamp}-${randomString}.${extension}`
}

/**
 * Validates image file
 * @param {File} file - File to validate
 * @returns {Object} { valid: boolean, error: string }
 */
export function validateImageFile(file) {
  const maxSize = 5 * 1024 * 1024 // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

  if (!file) {
    return { valid: false, error: 'No file provided' }
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Please upload a valid image (JPG, PNG, or WebP)' }
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'Image must be smaller than 5MB' }
  }

  return { valid: true, error: null }
}

