import { cn } from '@/lib/utils'

/**
 * Reusable Input Component
 * @param {object} props - Input props
 * @param {string} props.label - Input label
 * @param {string} props.error - Error message
 * @param {string} props.helperText - Helper text below input
 * @param {React.ReactNode} props.icon - Icon component to display
 * @param {string} props.className - Additional classes
 */
export default function Input({
  label,
  error,
  helperText,
  icon: Icon,
  className,
  id,
  ...props
}) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <Icon className="w-5 h-5 text-gray-400" />
          </div>
        )}
        <input
          id={inputId}
          className={cn(
            'w-full px-4 py-3 border rounded-xl transition-all outline-none',
            Icon && 'pl-11',
            error
              ? 'border-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-400'
              : 'border-gray-300 focus:ring-2 focus:ring-coral-400 focus:border-transparent',
            'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed'
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  )
}

