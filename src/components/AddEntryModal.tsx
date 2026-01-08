'use client';

import React, { useState, useRef } from "react";
import { X, Plus, Trash2, Upload, Loader2, ImagePlus } from "lucide-react";

interface AddEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (entry: {
    title: string;
    location: string;
    country: string;
    date: string;
    notes: string;
    mustDos: string[];
    isPublic: boolean;
    mainImageFile?: File;
    additionalImageFiles?: File[];
    imageUrl?: string;
    additionalImageUrls?: string[];
  }) => void;
  loading?: boolean;
}

export function AddEntryModal({
  isOpen,
  onClose,
  onAdd,
  loading = false,
}: AddEntryModalProps) {
  const [location, setLocation] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState("");
  const [authorName, setAuthorName] = useState("");
  
  // Main image (1)
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string>("");
  const [mainImageUrl, setMainImageUrl] = useState("");
  
  // Additional images (up to 4)
  const [additionalImages, setAdditionalImages] = useState<{file: File; preview: string}[]>([]);
  
  const [notes, setNotes] = useState("");
  const [mustDos, setMustDos] = useState<string[]>([""]);
  const [isPublic, setIsPublic] = useState(true);
  
  const mainFileInputRef = useRef<HTMLInputElement>(null);
  const additionalFileInputRef = useRef<HTMLInputElement>(null);

  const handleMainFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMainImageFile(file);
    setMainImagePreview(URL.createObjectURL(file));
    setMainImageUrl("");
  };

  const handleAdditionalFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const newImages: {file: File; preview: string}[] = [];
    const remaining = 4 - additionalImages.length;
    
    for (let i = 0; i < Math.min(files.length, remaining); i++) {
      newImages.push({
        file: files[i],
        preview: URL.createObjectURL(files[i])
      });
    }
    
    setAdditionalImages([...additionalImages, ...newImages]);
    e.target.value = ''; // Reset input
  };

  const removeAdditionalImage = (index: number) => {
    URL.revokeObjectURL(additionalImages[index].preview);
    setAdditionalImages(additionalImages.filter((_, i) => i !== index));
  };

  const handleAddMustDo = () => {
    setMustDos([...mustDos, ""]);
  };

  const handleRemoveMustDo = (index: number) => {
    if (mustDos.length > 1) {
      setMustDos(mustDos.filter((_, i) => i !== index));
    }
  };

  const handleMustDoChange = (index: number, value: string) => {
    const newMustDos = [...mustDos];
    newMustDos[index] = value;
    setMustDos(newMustDos);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filteredMustDos = mustDos.filter((item) => item.trim() !== "");
    
    onAdd({
      title: location,
      location,
      country,
      date,
      notes,
      mustDos: filteredMustDos,
      isPublic,
      mainImageFile: mainImageFile || undefined,
      additionalImageFiles: additionalImages.map(img => img.file),
      imageUrl: mainImageUrl || undefined,
    });

    // Cleanup previews
    if (mainImagePreview) URL.revokeObjectURL(mainImagePreview);
    additionalImages.forEach(img => URL.revokeObjectURL(img.preview));

    // Reset form
    setLocation("");
    setCountry("");
    setDate("");
    setAuthorName("");
    setMainImageUrl("");
    setMainImageFile(null);
    setMainImagePreview("");
    setAdditionalImages([]);
    setNotes("");
    setMustDos([""]);
    setIsPublic(true);
  };

  const handleClose = () => {
    if (mainImagePreview) URL.revokeObjectURL(mainImagePreview);
    additionalImages.forEach(img => URL.revokeObjectURL(img.preview));
    onClose();
  };

  if (!isOpen) return null;

  const displayMainImage = mainImagePreview || mainImageUrl;
  const currentYear = new Date().getFullYear();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-y-auto relative">
        {/* Paper texture overlay */}
        <div className="absolute inset-0 opacity-40 pointer-events-none rounded-xl" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px'
        }}></div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-50 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all"
        >
          <X size={24} />
        </button>

        <form onSubmit={handleSubmit} className="relative z-10 p-6">
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Left Page */}
            <div className="bg-[#f9f6f0] rounded-r-lg shadow-2xl p-6 md:p-8 relative border-l-4 border-amber-900/20"
              style={{
                backgroundImage: `repeating-linear-gradient(transparent, transparent 31px, #e5d5c5 31px, #e5d5c5 32px)`,
                minHeight: '600px'
              }}
            >
              {/* Decorative stamp */}
              <div className="absolute top-4 right-4">
                <svg width="70" height="70" viewBox="0 0 70 70">
                  <circle cx="35" cy="35" r="30" fill="none" stroke="#8b5cf6" strokeWidth="2" opacity="0.7"/>
                  <circle cx="35" cy="35" r="25" fill="none" stroke="#8b5cf6" strokeWidth="1" opacity="0.5"/>
                  <text x="35" y="25" textAnchor="middle" fill="#8b5cf6" fontSize="7" fontFamily="Permanent Marker" opacity="0.8">
                    {country.toUpperCase() || 'COUNTRY'}
                  </text>
                  <text x="35" y="38" textAnchor="middle" fill="#8b5cf6" fontSize="10" fontFamily="Permanent Marker" fontWeight="bold" opacity="0.9">
                    {location || 'Location'}
                  </text>
                  <text x="35" y="48" textAnchor="middle" fill="#8b5cf6" fontSize="6" fontFamily="Permanent Marker" opacity="0.7">
                    {date || 'Date'}
                  </text>
                  <text x="35" y="60" textAnchor="middle" fill="#8b5cf6" fontSize="7" fontFamily="Permanent Marker" opacity="0.8">
                    ★ NEW ENTRY ★
                  </text>
                </svg>
              </div>
              
              {/* Washi tape at top */}
              <div className="absolute -top-3 left-16 w-28 h-6 bg-gradient-to-r from-orange-300 to-yellow-300 opacity-70 transform -rotate-2 shadow-md"
                style={{ 
                  backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.3) 10px, rgba(255,255,255,.3) 20px)'
                }}
              ></div>

              {/* Header */}
              <div className="mb-6 pr-16">
                <h2 style={{ fontFamily: 'Caveat, cursive', fontSize: '2.5rem', lineHeight: '1' }} 
                    className="text-gray-800 mb-1">
                  My Travel Story ✈
                </h2>
                <svg className="w-40 h-3" viewBox="0 0 160 8">
                  <path d="M 5 4 Q 40 7, 80 4 T 155 4" stroke="#f59e0b" strokeWidth="2" fill="none" strokeLinecap="round"/>
                </svg>
              </div>

              {/* Location & Country inputs */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label style={{ fontFamily: 'Permanent Marker, cursive', fontSize: '0.8rem' }} 
                         className="block mb-1 text-[var(--color-primary)]">
                    📍 Where did you go?
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    placeholder="Paris"
                    style={{ fontFamily: 'Kalam, cursive' }}
                    className="w-full bg-transparent border-b-2 border-dashed border-gray-400 focus:border-[var(--color-secondary)] outline-none py-2 text-gray-700 placeholder-gray-400"
                  />
                </div>
                <div>
                  <label style={{ fontFamily: 'Permanent Marker, cursive', fontSize: '0.8rem' }} 
                         className="block mb-1 text-[var(--color-secondary)]">
                    🌍 Country
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                    placeholder="France"
                    style={{ fontFamily: 'Kalam, cursive' }}
                    className="w-full bg-transparent border-b-2 border-dashed border-gray-400 focus:border-[var(--color-secondary)] outline-none py-2 text-gray-700 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Date & Author */}
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label style={{ fontFamily: 'Permanent Marker, cursive', fontSize: '0.8rem' }} 
                         className="block mb-1 text-purple-600">
                    📅 When?
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    style={{ fontFamily: 'Kalam, cursive' }}
                    className="w-full bg-transparent border-b-2 border-dashed border-gray-400 focus:border-[var(--color-secondary)] outline-none py-2 text-gray-700"
                  />
                </div>
                <div>
                  <label style={{ fontFamily: 'Permanent Marker, cursive', fontSize: '0.8rem' }} 
                         className="block mb-1 text-orange-600">
                    ✍️ Your Name
                  </label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Jane Doe"
                    style={{ fontFamily: 'Kalam, cursive' }}
                    className="w-full bg-transparent border-b-2 border-dashed border-gray-400 focus:border-[var(--color-secondary)] outline-none py-2 text-gray-700 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* MAIN Polaroid Photo Upload */}
              <div className="mb-4">
                <label style={{ fontFamily: 'Permanent Marker, cursive', fontSize: '0.9rem' }} 
                       className="block mb-2 text-[var(--color-primary)]">
                  📸 Main Photo (Cover)
                </label>
                <div className="relative inline-block transform -rotate-1">
                  <div className="bg-white p-3 pb-10 shadow-xl cursor-pointer" onClick={() => mainFileInputRef.current?.click()}>
                    {displayMainImage ? (
                      <img src={displayMainImage} alt="Main Preview" className="w-52 h-40 object-cover" />
                    ) : (
                      <div className="w-52 h-40 bg-gray-100 flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
                        <Upload size={36} className="text-gray-400 mb-2" />
                        <span style={{ fontFamily: 'Kalam, cursive' }} className="text-gray-400 text-sm">Click to upload</span>
                        <span className="text-gray-300 text-xs mt-1">Main cover photo</span>
                      </div>
                    )}
                    <p style={{ fontFamily: 'Caveat, cursive', fontSize: '1rem' }} className="text-center mt-1 text-gray-600">
                      {displayMainImage ? `${location || 'My trip'} ✨` : 'Add your memory!'}
                    </p>
                  </div>
                  {/* Paper clip */}
                  <div className="absolute -top-2 right-3 w-5 h-8 border-2 border-gray-400 rounded-full transform rotate-45"></div>
                </div>
                <input ref={mainFileInputRef} type="file" accept="image/*" onChange={handleMainFileSelect} className="hidden" />
              </div>

              {/* Additional Photos (4 small polaroids) */}
              <div className="mb-4">
                <label style={{ fontFamily: 'Permanent Marker, cursive', fontSize: '0.8rem' }} 
                       className="block mb-2 text-[var(--color-secondary)]">
                  🖼️ Additional Photos ({additionalImages.length}/4)
                </label>
                <div className="flex flex-wrap gap-3">
                  {additionalImages.map((img, index) => (
                    <div key={index} className="relative transform hover:scale-105 transition-transform"
                         style={{ transform: `rotate(${index % 2 === 0 ? '-' : ''}${2 + index}deg)` }}>
                      <div className="bg-white p-2 pb-6 shadow-lg">
                        <img src={img.preview} alt={`Extra ${index + 1}`} className="w-20 h-20 object-cover" />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAdditionalImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                      >
                        <X size={12} />
                      </button>
                      {/* Washi tape */}
                      <div className="absolute -bottom-1 left-0 right-0 h-3 bg-pink-300 opacity-50"></div>
                    </div>
                  ))}
                  
                  {additionalImages.length < 4 && (
                    <div 
                      onClick={() => additionalFileInputRef.current?.click()}
                      className="w-24 h-28 bg-white p-2 pb-6 shadow-lg cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-[var(--color-secondary)] transition-colors transform rotate-1"
                    >
                      <ImagePlus size={24} className="text-gray-400 mb-1" />
                      <span style={{ fontFamily: 'Kalam, cursive' }} className="text-gray-400 text-xs text-center">
                        Add more
                      </span>
                    </div>
                  )}
                </div>
                <input 
                  ref={additionalFileInputRef} 
                  type="file" 
                  accept="image/*" 
                  multiple
                  onChange={handleAdditionalFileSelect} 
                  className="hidden" 
                />
              </div>

              {/* Decorative ticket */}
              <div className="inline-block bg-orange-100 border-2 border-dashed border-orange-400 px-3 py-1 transform rotate-1 shadow-sm">
                <p style={{ fontFamily: 'Permanent Marker, cursive', fontSize: '0.7rem' }} className="text-orange-800">
                  ✈ {additionalImages.length + (displayMainImage ? 1 : 0)}/5 PHOTOS
                </p>
              </div>
            </div>

            {/* Right Page */}
            <div className="bg-[#f9f6f0] rounded-l-lg shadow-2xl p-6 md:p-8 relative border-r-4 border-amber-900/20"
              style={{
                backgroundImage: `repeating-linear-gradient(transparent, transparent 31px, #e5d5c5 31px, #e5d5c5 32px)`,
                minHeight: '600px'
              }}
            >
              {/* Washi tape */}
              <div className="absolute top-0 left-0 w-full h-5 bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 opacity-40"
                style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(255,255,255,.5) 20px, rgba(255,255,255,.5) 40px)' }}
              ></div>

              {/* Country Stamps */}
              <div className="absolute top-10 right-4 flex gap-1">
                <div className="transform rotate-12">
                  <svg width="60" height="60" viewBox="0 0 60 60">
                    <circle cx="30" cy="30" r="26" fill="none" stroke="#dc2626" strokeWidth="2" opacity="0.8"/>
                    <text x="30" y="28" textAnchor="middle" fill="#dc2626" fontSize="8" fontFamily="Permanent Marker" opacity="0.9">
                      {country.toUpperCase() || 'NEW'}
                    </text>
                    <text x="30" y="40" textAnchor="middle" fill="#dc2626" fontSize="7" fontFamily="Permanent Marker" opacity="0.8">
                      ★ ENTRY ★
                    </text>
                  </svg>
                </div>
                <div className="transform -rotate-6">
                  <svg width="50" height="50" viewBox="0 0 50 50">
                    <rect x="5" y="5" width="40" height="40" fill="none" stroke="#16a34a" strokeWidth="2" opacity="0.7"/>
                    <text x="25" y="28" textAnchor="middle" fill="#16a34a" fontSize="8" fontFamily="Permanent Marker" opacity="0.8">
                      {currentYear}
                    </text>
                  </svg>
                </div>
              </div>
              
              {/* The Story section */}
              <div className="mb-6 mt-6">
                <h3 style={{ fontFamily: 'Permanent Marker, cursive', fontSize: '1.3rem' }} 
                    className="text-[var(--color-primary)] mb-3 flex items-center gap-2">
                  📖 The Story
                </h3>
                <div className="relative">
                  <div className="absolute inset-0 bg-yellow-200 opacity-15 transform -skew-y-1 pointer-events-none"></div>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={5}
                    placeholder="This place was incredible! The food, the people, the sights... Share your story here!"
                    style={{ fontFamily: 'Kalam, cursive', fontSize: '0.95rem', lineHeight: '1.8rem' }}
                    className="w-full bg-transparent border border-gray-200 rounded p-3 focus:border-[var(--color-secondary)] outline-none text-gray-800 placeholder-gray-400 resize-none relative z-10"
                  />
                </div>
                <div className="flex gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-500 text-sm">★</span>
                  ))}
                </div>
              </div>

              {/* Must Do's with checkboxes */}
              <div className="mb-6">
                <h3 style={{ fontFamily: 'Permanent Marker, cursive', fontSize: '1.2rem' }} 
                    className="text-[var(--color-secondary)] mb-3">
                  ✨ Must Do&apos;s!
                </h3>
                <div className="space-y-2">
                  {mustDos.map((mustDo, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-gray-500 flex-shrink-0"></div>
                      <input
                        type="text"
                        value={mustDo}
                        onChange={(e) => handleMustDoChange(index, e.target.value)}
                        placeholder={`Must do #${index + 1}...`}
                        style={{ fontFamily: 'Kalam, cursive', fontSize: '0.9rem' }}
                        className="flex-1 bg-transparent border-b border-dashed border-gray-300 focus:border-[var(--color-secondary)] outline-none py-1 text-gray-700 placeholder-gray-400"
                      />
                      {mustDos.length > 1 && (
                        <button type="button" onClick={() => handleRemoveMustDo(index)} className="text-red-400 hover:text-red-600">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={handleAddMustDo}
                    style={{ fontFamily: 'Kalam, cursive' }}
                    className="flex items-center gap-1 text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors text-sm mt-2">
                    <Plus size={16} />
                    Add another must-do
                  </button>
                </div>
              </div>

              {/* Public toggle */}
              <div className="bg-blue-50 border-2 border-blue-300 p-3 rounded transform -rotate-1 mb-6">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="isPublic" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)}
                    className="w-4 h-4 accent-[var(--color-secondary)]"
                  />
                  <label htmlFor="isPublic" style={{ fontFamily: 'Kalam, cursive' }} className="text-gray-700 text-sm">
                    Share with the community (public)
                  </label>
                </div>
              </div>

              {/* Bottom stamps */}
              <div className="flex gap-2 justify-end">
                <div className="w-12 h-12 border-2 border-red-500 rounded-full flex items-center justify-center transform rotate-12">
                  <span style={{ fontFamily: 'Permanent Marker, cursive', fontSize: '0.5rem' }} className="text-red-500 text-center">
                    NEW!
                  </span>
                </div>
                <div className="w-12 h-12 border-2 border-green-500 transform -rotate-6 flex items-center justify-center">
                  <span style={{ fontFamily: 'Permanent Marker, cursive', fontSize: '0.6rem' }} className="text-green-500">
                    ✓
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons - sticker style */}
          <div className="flex justify-center gap-4 mt-6">
            <button type="button" onClick={handleClose}
              className="bg-white border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all transform -rotate-1">
              <span style={{ fontFamily: 'Permanent Marker, cursive' }}>Cancel</span>
            </button>
            <button type="submit" disabled={loading || !location || !country}
              className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all transform rotate-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span style={{ fontFamily: 'Permanent Marker, cursive' }}>✈ Add to Journal!</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
