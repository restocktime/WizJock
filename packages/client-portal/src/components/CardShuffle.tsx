import { useState, useEffect } from 'react';
import { OptimizedLogo } from './OptimizedImage';

interface CardShuffleProps {
    className?: string;
}

export const CardShuffle = ({ className = '' }: CardShuffleProps) => {
    const [activeIndex, setActiveIndex] = useState(0);

    // We'll use a set of cards (logos or slips) to shuffle
    // For now, using placeholders/logos as the "cards"
    const cards = [1, 2, 3, 4, 5];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % cards.length);
        }, 2000); // Shuffle every 2 seconds

        return () => clearInterval(interval);
    }, [cards.length]);

    return (
        <div className={`relative w-64 h-80 ${className}`}>
            {cards.map((_, index) => {
                // Calculate position based on index relative to active
                const offset = (index - activeIndex + cards.length) % cards.length;
                const isBottom = offset === cards.length - 1;

                // Dynamic styles for the shuffle effect
                let style: React.CSSProperties = {
                    zIndex: cards.length - offset,
                    transform: `translateY(${offset * 4}px) scale(${1 - offset * 0.05})`,
                    opacity: 1 - offset * 0.1,
                    transition: 'all 0.5s ease-in-out',
                };

                if (isBottom) {
                    // Animation for the card moving from bottom back to top (shuffling)
                    style = {
                        ...style,
                        zIndex: 0,
                        transform: 'translateY(20px) scale(0.9)',
                        opacity: 0,
                    }
                }

                return (
                    <div
                        key={index}
                        className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 border border-cyan-500/30 rounded-xl shadow-2xl flex items-center justify-center overflow-hidden"
                        style={style}
                    >
                        {/* Card Content - Simulating a betting slip or card */}
                        <div className="absolute inset-0 bg-grid-white/[0.05]" />
                        <div className="relative p-4 w-full h-full flex flex-col items-center justify-between">
                            <div className="w-full flex justify-between items-center">
                                <span className="text-xs font-bold text-cyan-400">WIZJOCK</span>
                                <span className="text-[10px] text-gray-500">LIVE</span>
                            </div>

                            <OptimizedLogo className="w-16 h-16 opacity-80" alt="Logo" />

                            <div className="w-full space-y-2">
                                <div className="h-2 bg-gray-700 rounded w-3/4 animate-pulse" />
                                <div className="h-2 bg-gray-700 rounded w-1/2 animate-pulse" />
                            </div>

                            <div className="w-full pt-2 border-t border-gray-700 flex justify-between items-center">
                                <span className="text-xs text-green-400 font-bold">+180</span>
                                <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                </div>
                            </div>
                        </div>

                        {/* Shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
                    </div>
                );
            })}
        </div>
    );
};
