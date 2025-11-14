import { cn } from '@/lib/utils'

/**
 * Reusable Card Component for consistent styling
 * @param {object} props - Card props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.className - Additional classes
 * @param {boolean} props.hoverable - Whether card has hover effect
 * @param {Function} props.onClick - Click handler
 */
export default function Card({
  children,
  className,
  hoverable = false,
  onClick,
  ...props
}) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl shadow-md overflow-hidden',
        hoverable && 'hover:shadow-lg hover:-translate-y-1 cursor-pointer',
        hoverable && 'transition-all duration-200',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
}

