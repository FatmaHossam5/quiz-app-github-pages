import React, { useState, useRef, useEffect, memo, useCallback } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
  loadingClassName?: string;
  errorClassName?: string;
  threshold?: number;
  rootMargin?: string;
  onLoad?: () => void;
  onError?: () => void;
  fallback?: React.ReactNode;
}

const LazyImage: React.FC<LazyImageProps> = memo(({
  src,
  alt,
  placeholder,
  className = '',
  loadingClassName = '',
  errorClassName = '',
  threshold = 0.1,
  rootMargin = '50px',
  onLoad,
  onError,
  fallback,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const [imageSrc, setImageSrc] = useState<string>('');

  // Handle successful image load
  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    setIsError(false);
    if (onLoad) {
      onLoad();
    }
  }, [onLoad]);

  // Handle image load error
  const handleError = useCallback(() => {
    setIsError(true);
    setIsLoaded(false);
    if (onError) {
      onError();
    }
  }, [onError]);

  // Intersection Observer setup
  useEffect(() => {
    const currentImg = imgRef.current;
    if (!currentImg) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(currentImg);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  // Set image source when in view
  useEffect(() => {
    if (isInView && !imageSrc) {
      setImageSrc(src);
    }
  }, [isInView, src, imageSrc]);

  // Default placeholder component
  const DefaultPlaceholder = memo(() => (
    <div className="bg-gray-200 animate-pulse flex items-center justify-center">
      <svg
        className="w-8 h-8 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    </div>
  ));

  // Error fallback component
  const ErrorFallback = memo(() => (
    <div className="bg-red-50 flex items-center justify-center">
      <svg
        className="w-8 h-8 text-red-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
  ));

  // Combine class names
  const containerClasses = `relative overflow-hidden ${className}`;
  const imgClasses = `transition-opacity duration-300 ${
    isLoaded ? 'opacity-100' : 'opacity-0'
  }`;
  const placeholderClasses = `absolute inset-0 ${loadingClassName}`;
  const errorClasses = `absolute inset-0 ${errorClassName}`;

  return (
    <div className={containerClasses}>
      <img
        ref={imgRef}
        src={imageSrc || placeholder}
        alt={alt}
        className={imgClasses}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          ...props.style,
          opacity: isLoaded ? 1 : 0,
        }}
        {...props}
      />
      
      {/* Loading placeholder */}
      {!isLoaded && !isError && (
        <div className={placeholderClasses}>
          {placeholder ? (
            <img
              src={placeholder}
              alt={`${alt} placeholder`}
              className="w-full h-full object-cover filter blur-sm"
            />
          ) : (
            <DefaultPlaceholder />
          )}
        </div>
      )}
      
      {/* Error state */}
      {isError && (
        <div className={errorClasses}>
          {fallback || <ErrorFallback />}
        </div>
      )}
    </div>
  );
});

LazyImage.displayName = 'LazyImage';

export default LazyImage; 
