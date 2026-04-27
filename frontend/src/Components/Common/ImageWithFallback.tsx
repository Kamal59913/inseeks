import React, { useState } from 'react';
import { ImageOff, User } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  variant?: 'media' | 'avatar';
}

export default function ImageWithFallback({
  src,
  alt,
  className = '',
  variant = 'media',
  ...props
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Fallback if error or no src
  if (error || !src) {
    if (variant === 'avatar') {
      return (
        <div className={`bg-[#1a2540] flex items-center justify-center text-slate-500 rounded-full ${className}`}>
          <User size="60%" className="opacity-40" />
        </div>
      );
    }
    return (
      <div className={`bg-[#111827] flex flex-col items-center justify-center text-slate-500 gap-2 select-none min-h-[200px] w-full rounded-xl ${className}`}>
        <ImageOff className="w-8 h-8 opacity-30" />
        <span className="text-[10px] uppercase tracking-wider font-semibold opacity-30">Media Unavailable</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${variant === 'avatar' ? 'rounded-full' : 'rounded-xl'} ${className}`}>
      {/* Shimmer Placeholder */}
      {!loaded && (
        <div className="absolute inset-0 z-0 animate-shimmer" />
      )}
      
      <img
        src={src}
        alt={alt}
        className={`${className} transition-opacity duration-500 ease-in-out ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        {...props}
      />
    </div>
  );
}
