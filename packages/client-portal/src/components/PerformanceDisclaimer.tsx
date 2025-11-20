interface PerformanceDisclaimerProps {
  variant?: 'inline' | 'block';
  className?: string;
}

export default function PerformanceDisclaimer({ 
  variant = 'inline', 
  className = '' 
}: PerformanceDisclaimerProps) {
  const disclaimerText = 'Past performance does not guarantee future results';
  
  if (variant === 'inline') {
    return (
      <span 
        className={`text-[11px] text-gray-400 ${className}`}
        style={{ fontSize: '11px' }}
      >
        *{disclaimerText}
      </span>
    );
  }
  
  // Block variant
  return (
    <div 
      className={`text-[11px] text-gray-400 mt-2 ${className}`}
      style={{ fontSize: '11px' }}
    >
      *{disclaimerText}
    </div>
  );
}
