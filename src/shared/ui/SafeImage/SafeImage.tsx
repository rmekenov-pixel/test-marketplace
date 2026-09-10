// src/shared/ui/SafeImage/SafeImage.tsx
import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  containerClassName?: string;
}

const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  fallbackSrc = DEFAULT_FALLBACK,
  className = '',
  containerClassName = '',
  ...props
}) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleError = () => {
    if (!error) {
      setError(true);
    }
    setLoading(false);
  };

  const handleLoad = () => {
    setLoading(false);
  };

  const imageSrc = error ? fallbackSrc : (src || fallbackSrc);

  return (
    <div className={`relative overflow-hidden bg-zinc-100 dark:bg-zinc-900 ${containerClassName}`}>
      {loading && (
        <div className="absolute inset-0 animate-pulse bg-zinc-200 dark:bg-zinc-800" />
      )}
      {error && !fallbackSrc ? (
        <div className="flex flex-col items-center justify-center w-full h-full p-4 text-zinc-500">
          <ImageOff className="w-8 h-8 stroke-1" />
        </div>
      ) : (
        <img
          src={imageSrc}
          alt={alt || 'Image'}
          onError={handleError}
          onLoad={handleLoad}
          className={`${className} ${loading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}`}
          {...props}
        />
      )}
    </div>
  );
};
