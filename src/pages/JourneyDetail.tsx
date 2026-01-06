import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, Bookmark, Loader2 } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useJourney, useJourneyMutations } from '../hooks/useJourneys';
import { toast } from 'sonner';

export function JourneyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { journey, loading, error } = useJourney(id);
  const { likeJourney } = useJourneyMutations();

  const handleLike = async () => {
    if (!journey) return;
    const { error } = await likeJourney(journey.id);
    if (error) {
      toast.error('Failed to like journey');
    } else {
      toast.success('Loved it! ❤️');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${journey?.location} - RoverNote`,
        text: journey?.body || '',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  // Format date for display
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[var(--color-bg)] to-white flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  if (error || !journey) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[var(--color-bg)] to-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-[var(--color-text)] mb-4">Journey Not Found</h2>
          <p className="text-gray-500 mb-4">{error || 'This journey may have been removed.'}</p>
          <Link to="/community" className="text-[var(--color-secondary)] hover:underline">
            Back to Community
          </Link>
        </div>
      </div>
    );
  }

  const authorName = journey.profiles?.display_name || 'Anonymous Traveler';
  const authorInitial = authorName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 relative">
      {/* Paper texture overlay */}
      <div className="absolute inset-0 opacity-40" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
        backgroundSize: '100px 100px'
      }}></div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-700 hover:text-[var(--color-primary)] mb-6 transition-colors"
          style={{ fontFamily: 'Caveat, cursive', fontSize: '1.3rem' }}
        >
          <ArrowLeft size={24} />
          <span>Back to adventures</span>
        </button>

        {/* Diary Pages Container */}
        <div className="relative">
          {/* Left Page */}
          <div className="bg-[#f9f6f0] rounded-r-lg shadow-2xl p-8 md:p-12 mb-8 relative border-l-4 border-amber-900/20"
            style={{
              backgroundImage: `repeating-linear-gradient(transparent, transparent 31px, #e5d5c5 31px, #e5d5c5 32px)`,
              minHeight: '600px'
            }}
          >
            {/* Decorative elements */}
            <div className="absolute top-6 right-6 w-16 h-16 border-4 border-red-400 rounded-full opacity-60 transform rotate-12"></div>
            <div className="absolute top-12 right-12">
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="35" fill="none" stroke="#8b5cf6" strokeWidth="2.5" opacity="0.7"/>
                <circle cx="40" cy="40" r="30" fill="none" stroke="#8b5cf6" strokeWidth="1.5" opacity="0.5"/>
                <text x="40" y="28" textAnchor="middle" fill="#8b5cf6" fontSize="8" fontFamily="Permanent Marker" opacity="0.8">
                  {(journey.country || '').toUpperCase()}
                </text>
                <text x="40" y="42" textAnchor="middle" fill="#8b5cf6" fontSize="12" fontFamily="Permanent Marker" fontWeight="bold" opacity="0.9">
                  {journey.location || journey.title}
                </text>
                <text x="40" y="54" textAnchor="middle" fill="#8b5cf6" fontSize="7" fontFamily="Permanent Marker" opacity="0.7">
                  {formatDate(journey.start_date)}
                </text>
                <path d="M 15 60 L 65 60" stroke="#8b5cf6" strokeWidth="1" opacity="0.6"/>
                <text x="40" y="70" textAnchor="middle" fill="#8b5cf6" fontSize="8" fontFamily="Permanent Marker" opacity="0.8">
                  ★ VISITED ★
                </text>
              </svg>
            </div>
            
            {/* Washi tape at top */}
            <div className="absolute -top-4 left-20 w-32 h-8 bg-gradient-to-r from-orange-300 to-yellow-300 opacity-70 transform -rotate-2 shadow-md"
              style={{ 
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.3) 10px, rgba(255,255,255,.3) 20px)'
              }}
            ></div>

            {/* Header with handwriting */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <h1 style={{ fontFamily: 'Caveat, cursive', fontSize: '3.5rem', lineHeight: '1' }} 
                    className="text-gray-800">
                  {journey.location || journey.title}
                </h1>
                <span style={{ fontFamily: 'Permanent Marker, cursive', fontSize: '1.5rem' }} 
                      className="text-[var(--color-primary)]">
                  ★
                </span>
              </div>
              <p style={{ fontFamily: 'Caveat, cursive', fontSize: '1.5rem' }} className="text-gray-600">
                {journey.country} · {formatDate(journey.start_date)}
              </p>
              
              {/* Handwritten underline doodle */}
              <svg className="w-48 h-4 mt-1" viewBox="0 0 200 10">
                <path d="M 5 5 Q 50 8, 100 5 T 195 5" stroke="#f59e0b" strokeWidth="2" fill="none" strokeLinecap="round"/>
              </svg>
            </div>

            {/* Author info with doodle */}
            <div className="mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white shadow-md transform -rotate-3">
                {authorInitial}
              </div>
              <span style={{ fontFamily: 'Kalam, cursive', fontSize: '1.1rem' }} className="text-gray-700">
                by {authorName}
              </span>
              <div className="flex items-center gap-1 ml-auto">
                <Heart size={18} fill="#ef4444" className="text-red-500" />
                <span style={{ fontFamily: 'Kalam, cursive' }} className="text-red-500">{journey.likes_count || 0}</span>
              </div>
            </div>

            {/* Main polaroid photo */}
            <div className="relative inline-block transform -rotate-2 mb-6">
              <div className="bg-white p-4 pb-12 shadow-xl">
                <ImageWithFallback
                  src={journey.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'}
                  alt={journey.location || journey.title}
                  className="w-full h-64 object-cover"
                />
                <p style={{ fontFamily: 'Caveat, cursive', fontSize: '1.3rem' }} 
                   className="text-center mt-3 text-gray-700">
                  {journey.location || journey.title} was magical! ✨
                </p>
              </div>
              {/* Paper clip doodle */}
              <div className="absolute -top-3 right-4 w-8 h-12 border-2 border-gray-400 rounded-full transform rotate-45"></div>
            </div>

            {/* Quick note with highlight */}
            {journey.body && (
              <div className="mb-6 relative">
                <div className="absolute inset-0 bg-yellow-200 opacity-30 transform -skew-y-1"></div>
                <p style={{ fontFamily: 'Kalam, cursive', fontSize: '1.1rem', lineHeight: '2rem' }} 
                   className="text-gray-800 relative z-10 py-1">
                  ✎ {journey.body}
                </p>
              </div>
            )}

            {/* Decorative ticket stub */}
            <div className="inline-block bg-orange-100 border-2 border-dashed border-orange-400 px-4 py-2 transform rotate-1 shadow-sm">
              <p style={{ fontFamily: 'Permanent Marker, cursive', fontSize: '0.8rem' }} className="text-orange-800">
                ✈ ADVENTURE TICKET
              </p>
            </div>
          </div>

          {/* Right Page */}
          <div className="bg-[#f9f6f0] rounded-l-lg shadow-2xl p-8 md:p-12 relative border-r-4 border-amber-900/20"
            style={{
              backgroundImage: `repeating-linear-gradient(transparent, transparent 31px, #e5d5c5 31px, #e5d5c5 32px)`,
              minHeight: '400px'
            }}
          >
            {/* Washi tape decorations */}
            <div className="absolute top-0 left-0 w-full h-6 bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 opacity-40"
              style={{ 
                backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(255,255,255,.5) 20px, rgba(255,255,255,.5) 40px)'
              }}
            ></div>

            {/* Country Stamp */}
            <div className="absolute top-12 right-8 transform rotate-12">
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#dc2626" strokeWidth="3" opacity="0.8"/>
                <circle cx="50" cy="50" r="38" fill="none" stroke="#dc2626" strokeWidth="1.5" opacity="0.6"/>
                <text x="50" y="35" textAnchor="middle" fill="#dc2626" fontSize="10" fontFamily="Permanent Marker" opacity="0.8">
                  {(journey.country || '').toUpperCase()}
                </text>
                <text x="50" y="50" textAnchor="middle" fill="#dc2626" fontSize="16" fontFamily="Permanent Marker" fontWeight="bold" opacity="0.9">
                  {journey.location || journey.title}
                </text>
                <text x="50" y="65" textAnchor="middle" fill="#dc2626" fontSize="8" fontFamily="Permanent Marker" opacity="0.7">
                  {formatDate(journey.start_date)}
                </text>
                <path d="M 20 75 L 80 75" stroke="#dc2626" strokeWidth="1" opacity="0.6"/>
                <text x="50" y="85" textAnchor="middle" fill="#dc2626" fontSize="10" fontFamily="Permanent Marker" opacity="0.8">
                  ★ VISITED ★
                </text>
              </svg>
            </div>

            {/* Must Do's with checkboxes */}
            {journey.tags && journey.tags.length > 0 && (
              <div className="mb-8">
                <h3 style={{ fontFamily: 'Permanent Marker, cursive', fontSize: '1.5rem' }} 
                    className="text-[var(--color-secondary)] mb-4">
                  ✨ Must Do's!
                </h3>
                <div className="space-y-3">
                  {journey.tags.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 border-2 border-gray-600 mt-1 flex items-center justify-center">
                        <span className="text-green-600">✓</span>
                      </div>
                      <span style={{ fontFamily: 'Kalam, cursive', fontSize: '1.05rem', lineHeight: '1.8rem' }} 
                            className="text-gray-800">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Doodle stars */}
            <div className="flex gap-2 mt-4">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-500">★</span>
              ))}
            </div>

            {/* Stamp collection at bottom */}
            <div className="flex gap-3 justify-end mt-8">
              <div className="w-16 h-16 border-2 border-red-500 rounded-full flex items-center justify-center transform rotate-12">
                <span style={{ fontFamily: 'Permanent Marker, cursive', fontSize: '0.7rem' }} className="text-red-500">
                  LOVED IT
                </span>
              </div>
              <div className="w-16 h-16 border-2 border-green-500 transform -rotate-6 flex items-center justify-center">
                <span style={{ fontFamily: 'Permanent Marker, cursive', fontSize: '0.7rem' }} className="text-green-500">
                  5★
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons - styled as stickers */}
        <div className="flex justify-center gap-4 mt-8">
          <button 
            onClick={handleLike}
            className="bg-gradient-to-br from-pink-400 to-red-400 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all transform -rotate-2"
          >
            <span style={{ fontFamily: 'Permanent Marker, cursive' }} className="flex items-center gap-2">
              <Heart size={20} />
              Love this!
            </span>
          </button>
          <button className="bg-gradient-to-br from-blue-400 to-purple-400 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all transform rotate-2">
            <span style={{ fontFamily: 'Permanent Marker, cursive' }} className="flex items-center gap-2">
              <Bookmark size={20} />
              Save
            </span>
          </button>
          <button 
            onClick={handleShare}
            className="bg-gradient-to-br from-orange-400 to-yellow-400 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all transform -rotate-1"
          >
            <span style={{ fontFamily: 'Permanent Marker, cursive' }} className="flex items-center gap-2">
              <Share2 size={20} />
              Share
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
