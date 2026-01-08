import Link from 'next/link';
import { MapPin, Heart, Calendar } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface TravelEntryProps {
  id: string;
  location: string;
  country: string;
  date: string;
  image: string;
  notes: string;
  mustDos: string[];
  author: string;
  likes: number;
  rotation?: number;
}

export function TravelEntry({
  id,
  location,
  country,
  date,
  image,
  notes,
  mustDos,
  author,
  likes,
  rotation = 0
}: TravelEntryProps) {
  return (
    <Link 
      href={`/journey/${id}`}
      className="block relative bg-[var(--color-paper)] p-6 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 border-4 border-white cursor-pointer group"
      style={{ 
        transform: `rotate(${rotation}deg)`,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease'
      }}
    >
      {/* Decorative tape */}
      <div className="absolute -top-3 left-1/4 w-20 h-6 bg-amber-100 opacity-60 rotate-[-5deg] shadow-sm"></div>
      <div className="absolute -top-3 right-1/4 w-20 h-6 bg-amber-100 opacity-60 rotate-[5deg] shadow-sm"></div>
      
      {/* Polaroid style image */}
      <div className="bg-white p-3 shadow-lg mb-4 transform group-hover:scale-105 transition-transform duration-300">
        <ImageWithFallback 
          src={image} 
          alt={location}
          className="w-full h-64 object-cover"
        />
        <div className="mt-2 text-center italic text-gray-600">
          {location}, {country}
        </div>
      </div>

      {/* Location header */}
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="text-[var(--color-primary)]" size={20} />
        <h3 className="text-[var(--color-text)]">{location}</h3>
      </div>

      {/* Date */}
      <div className="flex items-center gap-2 mb-3 text-gray-600">
        <Calendar size={16} />
        <span className="text-sm">{date}</span>
      </div>

      {/* Notes */}
      <div className="mb-4">
        <div className="text-sm mb-1 text-gray-500 uppercase tracking-wide">Travel Notes</div>
        <p className="text-gray-700 italic leading-relaxed line-clamp-3">{notes}</p>
      </div>

      {/* Must Dos preview */}
      {mustDos.length > 0 && (
        <div className="mb-4">
          <div className="text-sm mb-2 text-gray-500 uppercase tracking-wide">Must Do&apos;s ✨</div>
          <ul className="space-y-1">
            {mustDos.slice(0, 2).map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-[var(--color-secondary)] mt-1">•</span>
                <span className="text-sm text-gray-600">{item}</span>
              </li>
            ))}
            {mustDos.length > 2 && (
              <li className="text-sm text-[var(--color-secondary)]">
                +{mustDos.length - 2} more...
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t-2 border-dashed border-gray-200">
        <span className="text-sm text-gray-600">by {author}</span>
        <div className="flex items-center gap-1 text-[var(--color-primary)]">
          <Heart size={18} />
          <span className="text-sm">{likes}</span>
        </div>
      </div>

      {/* Decorative corner */}
      <div className="absolute bottom-2 right-2 w-8 h-8 opacity-10">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="var(--color-accent)" />
        </svg>
      </div>
    </Link>
  );
}
