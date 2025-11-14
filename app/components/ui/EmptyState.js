import { cn } from '@/lib/utils'
import Button from './Button'

/**
 * Reusable Empty State Component
 * @param {object} props - EmptyState props
 * @param {React.ReactNode} props.icon - Icon component to display
 * @param {string} props.title - Main heading
 * @param {string} props.description - Description text
 * @param {string} props.actionLabel - Button label
 * @param {Function} props.onAction - Button click handler
 * @param {string} props.className - Additional classes
 */
export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-16 px-4',
        className
      )}
    >
      {Icon && (
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <Icon className="w-10 h-10 text-gray-400" />
        </div>
      )}
      {title && (
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-gray-600 max-w-md mb-8">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary" size="lg">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

