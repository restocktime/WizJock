import { useState } from 'react';
import { Star, ChevronDown, ChevronUp, ShieldCheck, TrendingUp, Zap, Trophy } from 'lucide-react';
import clsx from 'clsx';
import type { Pick, PickHierarchy } from '@sportsbook/shared-types';

interface PickCardProps {
    pick: Pick;
}

const HierarchyBadge = ({ hierarchy }: { hierarchy: PickHierarchy }) => {
    const config = {
        lock: { color: 'bg-yellow-500 text-black', icon: ShieldCheck, label: 'LOCK' },
        featured: { color: 'bg-blue-500 text-white', icon: Star, label: 'FEATURED' },
        high: { color: 'bg-green-500 text-black', icon: TrendingUp, label: 'HIGH CONFIDENCE' },
        medium: { color: 'bg-gray-700 text-gray-300', icon: null, label: 'MEDIUM' },
        value: { color: 'bg-purple-500 text-white', icon: Zap, label: 'VALUE PLAY' },
    };

    const { color, icon: Icon, label } = config[hierarchy] || config.medium;

    return (
        <span className={clsx('px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider flex items-center gap-1', color)}>
            {Icon && <Icon className="w-3 h-3" />}
            {label}
        </span>
    );
};

export const PickCard = ({ pick }: PickCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const isLock = pick.hierarchy === 'lock';
    const isFeatured = pick.hierarchy === 'featured';

    return (
        <div className={`relative overflow-hidden rounded-xl border mb-4 transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl hover:shadow-cyan-500/10 group ${isLock ? 'border-yellow-500/50 bg-yellow-500/5' :
                isFeatured ? 'border-blue-500/50 bg-blue-500/5' :
                    'border-gray-800 bg-gray-900'
            }`}>
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/5 pointer-events-none" />

            {/* Header */}
            <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-black/20">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-400">
                        <Trophy className="w-4 h-4" />
                    </div>
                    <div>
                        <div className="text-xs text-gray-400 font-medium">
                            {new Date(pick.gameTime).toLocaleString([], {
                                weekday: 'short',
                                hour: 'numeric',
                                minute: '2-digit'
                            })}
                        </div>
                        <div className="text-sm font-bold text-white">{pick.matchup}</div>
                    </div>
                </div>
                <HierarchyBadge hierarchy={pick.hierarchy} />
            </div>

            <div className="p-4">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Pick</div>
                        <div className="text-2xl font-black text-white leading-none mb-1">
                            {pick.recommendation}
                        </div>
                        <div className="text-sm text-cyan-400 font-bold">{pick.betType}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Odds</div>
                        <div className="text-xl font-bold text-green-400">{pick.currentOdds}</div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-800">
                    <div className="bg-gray-800/30 rounded p-2 text-center">
                        <div className="text-[10px] text-gray-500 uppercase">Confidence</div>
                        <div className="text-lg font-bold text-blue-400">{pick.confidenceScore}%</div>
                    </div>
                    <div className="bg-gray-800/30 rounded p-2 text-center">
                        <div className="text-[10px] text-gray-500 uppercase">Units</div>
                        <div className="text-lg font-bold text-white">{pick.units}u</div>
                    </div>
                </div>

                <div className="mt-4">
                    <p className="text-sm text-gray-300 leading-relaxed">
                        {pick.reasoning}
                    </p>
                </div>

                {pick.playerProps && pick.playerProps.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-800">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="flex items-center justify-between w-full text-left text-gray-400 hover:text-white transition-colors text-sm"
                        >
                            <span className="font-medium">Player Props ({pick.playerProps.length})</span>
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        {isExpanded && (
                            <div className="mt-3 space-y-2">
                                {pick.playerProps.map((prop) => (
                                    <div key={prop.id} className="bg-gray-800/50 rounded-lg p-2 flex justify-between items-center">
                                        <div>
                                            <div className="text-sm font-bold text-white">{prop.playerName}</div>
                                            <div className="text-xs text-gray-400">{prop.statType}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-black text-white">{prop.line}</div>
                                            <div className={`text-[10px] font-bold uppercase ${prop.overUnder === 'over' ? 'text-green-400' : 'text-red-400'}`}>
                                                {prop.overUnder}
                                            </div>
                                        </div>
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
