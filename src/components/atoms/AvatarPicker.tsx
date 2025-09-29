'use client'
import { useRef, useState } from 'react';

type AvatarPickerProps = {
  imageUrl?: string;
  initials: string;
  isEditing: boolean;
  loading?: boolean;
  onFileSelected: (file: File) => void;
  alt?: string;
};

export const AvatarPicker = ({
  imageUrl,
  initials,
  isEditing,
  loading,
  onFileSelected,
  alt = 'Avatar del usuario',
}: AvatarPickerProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [imgError, setImgError] = useState(false);

  const handleClick = () => {
    if (!isEditing) return;
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelected(file);
    // Limpia el input para permitir re-seleccionar el mismo archivo
    e.currentTarget.value = '';
  };

  return (
    <div className="relative">
      <div
        className={`w-24 h-24 rounded-full ${isEditing ? 'cursor-pointer' : 'cursor-default'}
          overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center
          text-white text-2xl font-semibold shadow-lg transition-all duration-300
          ${isEditing ? 'hover:shadow-xl hover:scale-105' : ''}`}
        onClick={handleClick}
      >
        {imageUrl && !imgError ? (
          <img
            src={imageUrl}
            alt={alt}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
            onLoad={() => imgError && setImgError(false)}
            referrerPolicy="no-referrer"
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      {isEditing && (
        <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors shadow-lg">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          </svg>
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
};