import { cn } from '@/lib/utils'

/**
 * Reusable Textarea Component
 * @param {object} props - Textarea props
 * @param {string} props.label - Textarea label
 * @param {string} props.error - Error message
 * @param {string} props.helperText - Helper text below textarea
 * @param {number} props.maxLength - Maximum character length
 * @param {boolean} props.showCount - Whether to show character count
 * @param {string} props.className - Additional classes
 */
export default function Textarea({
  label,
  error,
  helperText,
  maxLength,
  showCount = false,
  className,
  id,
  value,
  ...props
}) {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-')
  const currentLength = value?.length || 0

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        {showCount && maxLength && (
          <span className="text-sm text-gray-500">
            {currentLength}/{maxLength}
          </span>
        )}
      </div>
      <textarea
        id={textareaId}
        value={value}
        maxLength={maxLength}
        className={cn(
          'w-full px-4 py-3 border rounded-xl transition-all outline-none resize-y min-h-[120px]',
          error
            ? 'border-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-400'
            : 'border-gray-300 focus:ring-2 focus:ring-coral-400 focus:border-transparent',
          'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed'
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  )
}

