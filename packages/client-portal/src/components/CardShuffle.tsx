import { useState, useEffect } from 'react';

interface CardShuffleProps {
    className?: string;
}

export const CardShuffle = ({ className = '' }: CardShuffleProps) => {
    const [activeIndex, setActiveIndex] = useState(0);

    // Array of winning slip images
    const slipImages = [
        '/optimized/slips/slip1.webp',
        '/optimized/slips/slip2.webp',
        '/optimized/slips/slip3.webp',
        '/optimized/slips/slip4.webp',
        '/optimized/slips/slip5.webp',
        '/optimized/slips/slip6.webp',
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % slipImages.length);
        }, 3000); // Change image every 3 seconds

        return () => clearInterval(interval);
    }, [slipImages.length]);

    return (
        <div className={`relative w-full max-w-4xl mx-auto ${className}`}>
            <div className="relative aspect-[4/3] sm:aspect-[16/9] overflow-hidden rounded-2xl shadow-2xl">
                {slipImages.map((slip, index) => {
                    // Calculate position based on index relative to active
                    const offset = (index - activeIndex + slipImages.length) % slipImages.length;
                    const isActive = offset === 0;
                    const isNext = offset === 1;
                    const isPrev = offset === slipImages.length - 1;

                    // Dynamic styles for the shuffle effect
                    let style: React.CSSProperties = {
                        zIndex: isActive ? 30 : isNext ? 20 : isPrev ? 10 : 5,
                        opacity: isActive ? 1 : 0,
                        transform: isActive
                            ? 'translateX(0) scale(1)'
                            : isNext
                                ? 'translateX(100%) scale(0.9)'
                                : 'translateX(-100%) scale(0.9)',
                        transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
                    };

                    return (
                        <div
                            key={index}
                            className="absolute inset-0"
                            style={style}
                        >
                            <img
                                src={slip}
                                alt={`Winning betting slip ${index + 1}`}
                                className="w-full h-full object-contain rounded-2xl"
                                loading={index < 2 ? 'eager' : 'lazy'}
                            />

                            {/* Shine effect on active card */}
                            {isActive && (
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none animate-pulse" />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Navigation dots */}
            <div className="flex justify-center gap-2 mt-4">
                {slipImages.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${index === activeIndex
                            ? 'bg-cyan-400 w-8'
                            : 'bg-gray-600 hover:bg-gray-500'
                            }`}
                        aria-label={`View slip ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};
