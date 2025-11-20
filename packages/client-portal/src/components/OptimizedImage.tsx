import { ImgHTMLAttributes } from 'react';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> {
  src: string; // Base path without extension (e.g., "/optimized/slips/slip1")
  alt: string;
  lazy?: boolean;
  sizes?: string;
}

export function OptimizedImage({ 
  src, 
  alt, 
  lazy = true, 
  sizes = '(max-width: 768px) 400px, 800px',
  className,
  ...props 
}: OptimizedImageProps) {
  return (
    <picture>
      <source
        type="image/webp"
        srcSet={`${src}-small.webp 400w, ${src}.webp 800w`}
        sizes={sizes}
      />
      <source
        type="image/jpeg"
        srcSet={`${src}-small.jpg 400w, ${src}.jpg 800w`}
        sizes={sizes}
      />
      <img
        src={`${src}.jpg`}
        alt={alt}
        loading={lazy ? 'lazy' : 'eager'}
        decoding="async"
        fetchPriority={lazy ? 'auto' : 'high'}
        className={className}
        {...props}
      />
    </picture>
  );
}

interface OptimizedLogoProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> {
  alt: string;
  className?: string;
}

export function OptimizedLogo({ alt, className, ...props }: OptimizedLogoProps) {
  return (
    <picture>
      <source type="image/webp" srcSet="/optimized/wizjock-logo.webp" />
      <img
        src="/optimized/wizjock-logo.png"
        alt={alt}
        loading="eager"
        decoding="async"
        className={className}
        {...props}
      />
    </picture>
  );
}
