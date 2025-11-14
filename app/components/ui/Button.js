import { cn } from '@/lib/utils'

/**
 * Reusable Button Component with multiple variants
 * @param {object} props - Button props
 * @param {string} props.variant - Button style variant: 'primary', 'secondary', 'ghost', 'danger'
 * @param {string} props.size - Button size: 'sm', 'md', 'lg'
 * @param {boolean} props.fullWidth - Whether button takes full width
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.className - Additional classes
 * @param {boolean} props.disabled - Whether button is disabled
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className,
  disabled,
  ...props
}) {
  const baseStyles = 'font-medium rounded-xl transition-all duration-200 inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4'

  const variants = {
    primary: 'bg-coral-400 text-white hover:bg-coral-500 focus:ring-coral-200 shadow-sm hover:shadow-md active:scale-95',
    secondary: 'bg-teal-400 text-white hover:bg-teal-500 focus:ring-teal-200 shadow-sm hover:shadow-md active:scale-95',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-200 active:scale-95',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-200 shadow-sm hover:shadow-md active:scale-95',
    outline: 'bg-transparent border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:ring-gray-200 active:scale-95',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

