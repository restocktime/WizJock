import { useState } from 'react';
import { Star, ChevronDown, ChevronUp, ShieldCheck, TrendingUp } from 'lucide-react';
import clsx from 'clsx';
import type { Pick, PickHierarchy } from '@sportsbook/shared-types';

interface PickCardProps {
    pick: Pick;
}

const HierarchyBadge = ({ hierarchy }: { hierarchy: PickHierarchy }) => {
    const config = {
        lock: { color: 'bg-gold text-primary', icon: ShieldCheck, stars: 5, label: 'LOCK' },
        featured: { color: 'bg-silver text-primary', icon: Star, stars: 4, label: 'FEATURED' },
        high: { color: 'bg-blue-100 text-blue-800', icon: TrendingUp, stars: 3, label: 'HIGH CONFIDENCE' },
        medium: { color: 'bg-gray-100 text-gray-800', icon: null, stars: 2, label: 'MEDIUM' },
        value: { color: 'bg-green-100 text-green-800', icon: null, stars: 1, label: 'VALUE PLAY' },
    };

    const { color, icon: Icon, stars, label } = config[hierarchy] || config.medium;

    return (
        <div className="flex items-center justify-between mb-3">
            <span className={clsx('px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1', color)}>
                {Icon && <Icon className="w-4 h-4" />}
                {label}
            </span>
            <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={clsx('w-4 h-4', i < stars ? 'fill-gold text-gold' : 'text-gray-200')}
                    />
                ))}
            </div>
        </div>
    );
};

export const PickCard = ({ pick }: PickCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-4">
            <div className="p-5">
                <HierarchyBadge hierarchy={pick.hierarchy} />

                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{pick.matchup}</h3>
                        <p className="text-sm text-gray-500">
                            {new Date(pick.gameTime).toLocaleString([], {
                                weekday: 'short',
                                hour: 'numeric',
                                minute: '2-digit'
                            })}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{pick.recommendation}</div>
                        <div className="text-lg font-medium text-gray-600">{pick.currentOdds}</div>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Unit Size</span>
                        <span className="font-bold text-primary">{pick.units} Units</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className="bg-accent h-2.5 rounded-full"
                            style={{ width: `${(pick.units / 5) * 100}%` }}
                        ></div>
                    </div>
                </div>

                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    {pick.reasoning}
                </p>

                {pick.playerProps && pick.playerProps.length > 0 && (
                    <div className="border-t border-gray-100 pt-4">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="flex items-center justify-between w-full text-left text-gray-600 hover:text-primary transition-colors"
                        >
                            <span className="font-medium">Player Props ({pick.playerProps.length})</span>
                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>

                        {isExpanded && (
                            <div className="mt-3 space-y-3">
                                {pick.playerProps.map((prop) => (
                                    <div key={prop.id} className="bg-blue-50 p-3 rounded-lg flex justify-between items-center">
                                        <div>
                                            <div className="font-bold text-gray-900">{prop.playerName}</div>
                                            <div className="text-sm text-gray-600">{prop.statType} {prop.line} ({prop.overUnder})</div>
                                        </div>
                                        <div className="font-bold text-primary">{prop.odds}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
