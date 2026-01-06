import React, { useState } from "react";
import {
  X,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";

interface AddEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (entry: NewTravelEntry) => void;
}

export interface NewTravelEntry {
  location: string;
  country: string;
  date: string;
  image: string;
  notes: string;
  mustDos: string[];
  imageFile?: File;
}

export function AddEntryModal({
  isOpen,
  onClose,
  onAdd,
}: AddEntryModalProps) {
  const [location, setLocation] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [mustDos, setMustDos] = useState<string[]>([""]);
  const [uploadMethod, setUploadMethod] = useState<"upload" | "url">("upload");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setImageUrl(""); // Clear URL if file is selected
  };

  const handleAddMustDo = () => {
    setMustDos([...mustDos, ""]);
  };

  const handleRemoveMustDo = (index: number) => {
    setMustDos(mustDos.filter((_, i) => i !== index));
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
      location,
      country,
      date,
      image: imageUrl,
      notes,
      mustDos: filteredMustDos,
      imageFile: imageFile || undefined,
    });

    // Reset form
    setLocation("");
    setCountry("");
    setDate("");
    setImageUrl("");
    setImageFile(null);
    setImagePreview("");
    setNotes("");
    setMustDos([""]);
  };

  const handleClose = () => {
    // Clean up preview URL
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    onClose();
  };

  if (!isOpen) return null;

  const displayImage = imagePreview || imageUrl;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-[var(--color-paper)] rounded-2xl shadow-2xl max-w-2xl w-full my-8 border-4 border-white relative">
        {/* Decorative corners */}
        <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-[var(--color-secondary)]"></div>
        <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-[var(--color-secondary)]"></div>
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-[var(--color-secondary)]"></div>
        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-[var(--color-secondary)]"></div>

        <div
          className="p-8 md:p-12 bg-[#f9f6f0] relative overflow-hidden"
          style={{
            backgroundImage: `repeating-linear-gradient(transparent, transparent 31px, #e5d5c5 31px, #e5d5c5 32px)`,
            minHeight: "600px",
          }}
        >
          {/* Paper texture overlay */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
              backgroundSize: "100px 100px",
            }}
          ></div>

          {/* Decorative washi tape at top */}
          <div
            className="absolute -top-4 left-20 w-40 h-8 bg-gradient-to-r from-pink-300 to-purple-300 opacity-60 transform -rotate-2 shadow-md"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.4) 10px, rgba(255,255,255,.4) 20px)",
            }}
          ></div>
          <div
            className="absolute -top-4 right-20 w-40 h-8 bg-gradient-to-r from-yellow-300 to-orange-300 opacity-60 transform rotate-2 shadow-md"
            style={{
              backgroundImage:
                "repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(255,255,255,.4) 10px, rgba(255,255,255,.4) 20px)",
            }}
          ></div>

          {/* Decorative stamp */}
          <div className="absolute top-6 right-8 transform rotate-12">
            <svg width="60" height="60" viewBox="0 0 60 60">
              <circle
                cx="30"
                cy="30"
                r="25"
                fill="none"
                stroke="#ef4444"
                strokeWidth="2"
                opacity="0.6"
              />
              <text
                x="30"
                y="28"
                textAnchor="middle"
                fill="#ef4444"
                fontSize="8"
                fontFamily="Permanent Marker"
                opacity="0.7"
              >
                NEW
              </text>
              <text
                x="30"
                y="38"
                textAnchor="middle"
                fill="#ef4444"
                fontSize="9"
                fontFamily="Permanent Marker"
                opacity="0.7"
              >
                ENTRY
              </text>
            </svg>
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2
                  style={{
                    fontFamily: "Caveat, cursive",
                    fontSize: "3rem",
                    lineHeight: "1",
                  }}
                  className="text-[var(--color-primary)]"
                >
                  My Travel Story ✈
                </h2>
                {/* Handwritten underline */}
                <svg className="w-56 h-4 mt-1" viewBox="0 0 220 10">
                  <path
                    d="M 5 5 Q 60 8, 110 5 T 215 5"
                    stroke="#FF6B6B"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Location & Country */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label
                    style={{
                      fontFamily: "Permanent Marker, cursive",
                      fontSize: "1rem",
                    }}
                    className="block mb-2 text-[var(--color-primary)]"
                  >
                    📍 Where did you go?
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    style={{
                      fontFamily: "Kalam, cursive",
                      fontSize: "1.1rem",
                    }}
                    className="w-full px-4 py-3 bg-transparent border-b-2 border-dashed border-gray-400 focus:border-[var(--color-secondary)] focus:outline-none transition-colors"
                    placeholder="Paris"
                  />
                </div>
                <div>
                  <label
                    style={{
                      fontFamily: "Permanent Marker, cursive",
                      fontSize: "1rem",
                    }}
                    className="block mb-2 text-[var(--color-primary)]"
                  >
                    🌍 Country
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                    style={{
                      fontFamily: "Kalam, cursive",
                      fontSize: "1.1rem",
                    }}
                    className="w-full px-4 py-3 bg-transparent border-b-2 border-dashed border-gray-400 focus:border-[var(--color-secondary)] focus:outline-none transition-colors"
                    placeholder="France"
                  />
                </div>
              </div>

              {/* Date */}
              <div>
                <label
                  style={{
                    fontFamily: "Permanent Marker, cursive",
                    fontSize: "1rem",
                  }}
                  className="block mb-2 text-[var(--color-secondary)]"
                >
                  📅 When?
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  style={{
                    fontFamily: "Kalam, cursive",
                    fontSize: "1.1rem",
                  }}
                  className="w-full px-4 py-3 bg-transparent border-b-2 border-dashed border-gray-400 focus:border-[var(--color-secondary)] focus:outline-none transition-colors"
                />
              </div>

              {/* Image Upload - Polaroid style */}
              <div>
                <label
                  style={{
                    fontFamily: "Permanent Marker, cursive",
                    fontSize: "1rem",
                  }}
                  className="block mb-3 text-purple-600"
                >
                  📸 Add a photo!
                </label>
                <div className="relative inline-block transform -rotate-1">
                  <div className="bg-white p-4 pb-12 shadow-lg border-2 border-gray-200">
                    {displayImage ? (
                      <img
                        src={displayImage}
                        alt="Preview"
                        className="w-64 h-48 object-cover"
                      />
                    ) : (
                      <div className="w-64 h-48 bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                        <Upload size={40} className="text-gray-400" />
                      </div>
                    )}
                    <p
                      style={{
                        fontFamily: "Caveat, cursive",
                        fontSize: "1.1rem",
                      }}
                      className="text-center mt-2 text-gray-600"
                    >
                      {displayImage ? "Looking good!" : "Add your photo"}
                    </p>
                  </div>
                  {/* Paper clip */}
                  <div className="absolute -top-3 right-4 w-6 h-10 border-2 border-gray-400 rounded-full transform rotate-45"></div>
                </div>
                
                <div className="flex gap-4 mt-4">
                  <button
                    type="button"
                    onClick={() => setUploadMethod("upload")}
                    className={`flex-1 px-4 py-2 rounded-full transition-colors ${
                      uploadMethod === "upload"
                        ? "bg-[var(--color-secondary)] text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadMethod("url")}
                    className={`flex-1 px-4 py-2 rounded-full transition-colors ${
                      uploadMethod === "url"
                        ? "bg-[var(--color-secondary)] text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    Paste URL
                  </button>
                </div>
                
                {uploadMethod === "upload" ? (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="w-full mt-4 px-4 py-2 bg-transparent border-b-2 border-dashed border-gray-400 focus:border-[var(--color-secondary)] focus:outline-none transition-colors"
                  />
                ) : (
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      setImageFile(null);
                      setImagePreview("");
                    }}
                    style={{
                      fontFamily: "Kalam, cursive",
                      fontSize: "1rem",
                    }}
                    className="w-full mt-4 px-4 py-2 bg-transparent border-b-2 border-dashed border-gray-400 focus:border-[var(--color-secondary)] focus:outline-none transition-colors"
                    placeholder="https://example.com/image.jpg"
                  />
                )}
              </div>

              {/* Travel Notes */}
              <div>
                <label
                  style={{
                    fontFamily: "Permanent Marker, cursive",
                    fontSize: "1rem",
                  }}
                  className="block mb-3 text-orange-600"
                >
                  ✎ My thoughts & memories...
                </label>
                <div className="relative">
                  {/* Highlight effect */}
                  <div className="absolute inset-0 bg-yellow-100 opacity-20 transform -skew-y-1 pointer-events-none"></div>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    required
                    rows={5}
                    style={{
                      fontFamily: "Kalam, cursive",
                      fontSize: "1.05rem",
                      lineHeight: "2rem",
                    }}
                    className="w-full px-4 py-3 bg-transparent border-2 border-gray-300 rounded focus:border-[var(--color-secondary)] focus:outline-none transition-colors resize-none relative z-10"
                    placeholder="This place was incredible! The food, the people, the sights..."
                  />
                </div>
              </div>

              {/* Must Do's with checkboxes */}
              <div>
                <label
                  style={{
                    fontFamily: "Permanent Marker, cursive",
                    fontSize: "1rem",
                  }}
                  className="block mb-3 text-[var(--color-secondary)]"
                >
                  ✨ Must Do's!
                </label>
                <div className="space-y-3">
                  {mustDos.map((mustDo, index) => (
                    <div key={index} className="flex gap-3 items-start">
                      <div className="w-5 h-5 border-2 border-gray-600 mt-2 flex-shrink-0"></div>
                      <input
                        type="text"
                        value={mustDo}
                        onChange={(e) => handleMustDoChange(index, e.target.value)}
                        style={{
                          fontFamily: "Kalam, cursive",
                          fontSize: "1rem",
                          lineHeight: "2rem",
                        }}
                        className="flex-1 px-3 py-2 bg-transparent border-b border-dashed border-gray-300 focus:border-[var(--color-secondary)] focus:outline-none transition-colors"
                        placeholder="Visit the Eiffel Tower at sunset"
                      />
                      {mustDos.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMustDo(index)}
                          className="p-2 text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddMustDo}
                    style={{
                      fontFamily: "Kalam, cursive",
                      fontSize: "1rem",
                    }}
                    className="flex items-center gap-2 text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors mt-2"
                  >
                    <Plus size={20} />
                    <span>Add another must-do</span>
                  </button>
                </div>
              </div>

              {/* Decorative arrow doodle */}
              <svg className="w-24 h-12 my-4" viewBox="0 0 100 50">
                <path
                  d="M 10 25 L 70 25 L 65 20 M 70 25 L 65 30"
                  stroke="#8b5cf6"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>

              {/* Buttons - Sticker style */}
              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={handleClose}
                  style={{
                    fontFamily: "Permanent Marker, cursive",
                  }}
                  className="flex-1 px-6 py-4 rounded-full border-3 border-gray-400 hover:bg-gray-100 transition-all transform hover:scale-105"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    fontFamily: "Permanent Marker, cursive",
                  }}
                  className="flex-1 px-6 py-4 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white hover:shadow-xl transition-all transform hover:scale-105 shadow-lg"
                >
                  ✈ Add to Journal!
                </button>
              </div>
            </form>

            {/* Decorative stickers at bottom */}
            <div className="flex justify-end gap-2 mt-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-200 to-red-200 flex items-center justify-center transform rotate-12 shadow-sm">
                <span style={{ fontFamily: "Permanent Marker, cursive", fontSize: "1.2rem" }}>★</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-200 to-purple-200 flex items-center justify-center transform -rotate-6 shadow-sm">
                <span style={{ fontFamily: "Permanent Marker, cursive", fontSize: "1.2rem" }}>✈</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
