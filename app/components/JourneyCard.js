import Link from 'next/link'
import Image from 'next/image'
import { Calendar, MapPin, ArrowRight } from 'lucide-react'
import { formatDate, truncate } from '@/lib/utils'
import Card from './ui/Card'

/**
 * Journey Card Component - displays a single journey in a card format
 * @param {object} props - JourneyCard props
 * @param {object} props.journey - Journey data object
 */
export default function JourneyCard({ journey }) {
  const { id, title, location, start_date, end_date, body, image_url, tags } = journey

  // Format date range
  const dateDisplay = start_date && end_date && start_date !== end_date
    ? `${formatDate(start_date, 'MMM yyyy')} - ${formatDate(end_date, 'MMM yyyy')}`
    : formatDate(start_date || end_date, 'MMMM yyyy')

  return (
    <Link href={`/journeys/${id}`}>
      <Card hoverable className="h-full flex flex-col">
        {/* Image */}
        {image_url ? (
          <div className="relative w-full h-56 bg-gray-200">
            <Image
              src={image_url}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div className="relative w-full h-56 bg-gradient-to-br from-teal-400 to-coral-400 flex items-center justify-center">
            <MapPin className="w-16 h-16 text-white opacity-50" />
          </div>
        )}

        {/* Content */}
        <div className="p-6 flex flex-col flex-1">
          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
            {title}
          </h3>

          {/* Location & Date */}
          <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
            {location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{location}</span>
              </div>
            )}
            {dateDisplay && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{dateDisplay}</span>
              </div>
            )}
          </div>

          {/* Body Preview */}
          {body && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
              {truncate(body, 120)}
            </p>
          )}

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-cream-200 text-gray-700 text-xs font-medium rounded-full"
                >
                  {tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="px-3 py-1 bg-cream-200 text-gray-700 text-xs font-medium rounded-full">
                  +{tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* View Details Link */}
          <div className="flex items-center gap-1 text-coral-500 font-medium text-sm group-hover:gap-2 transition-all">
            <span>View Details</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </Card>
    </Link>
  )
}

