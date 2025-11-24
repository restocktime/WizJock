import { OptimizedLogo } from './OptimizedImage';

interface BetCardProps {
    pick: {
        id: string;
        matchup: string;
        betType: string;
        recommendation: string;
        currentOdds: string;
        units: number;
        confidenceScore: number;
        reasoning: string;
        hierarchy: 'lock' | 'featured' | 'high' | 'medium' | 'value';
        gameTime: string;
        sport: string;
        playerProps?: Array<{
            playerName: string;
            statType: string;
            line: number;
            overUnder: 'over' | 'under';
            odds: string;
        }>;
    };
}

export const BetCard = ({ pick }: BetCardProps) => {
    const isLock = pick.hierarchy === 'lock';
    const isFeatured = pick.hierarchy === 'featured';

    return (
        <div className={`relative overflow-hidden rounded-xl border ${isLock ? 'border-yellow-500/50 bg-yellow-500/5' :
            isFeatured ? 'border-blue-500/50 bg-blue-500/5' :
                'border-gray-800 bg-gray-900'
            } transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/10 group`}>

            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/5 pointer-events-none" />

            {/* Header */}
            <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-black/20">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-400">
                        {pick.sport}
                    </div>
                    <div>
                        <div className="text-xs text-gray-400 font-medium">{new Date(pick.gameTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        <div className="text-sm font-bold text-white">{pick.matchup}</div>
                    </div>
                </div>
                <div className="text-right">
                    {isLock && <span className="text-[10px] font-black bg-yellow-500 text-black px-2 py-0.5 rounded uppercase tracking-wider">LOCK</span>}
                    {isFeatured && <span className="text-[10px] font-black bg-blue-500 text-white px-2 py-0.5 rounded uppercase tracking-wider">FEATURED</span>}
                </div>
            </div>

            {/* Main Content - PrizePicks Style */}
            <div className="p-4">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Pick</div>
                        <div className="text-2xl font-black text-white leading-none">
                            {pick.recommendation}
                        </div>
                        <div className="text-sm text-cyan-400 font-bold mt-1">{pick.betType}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Odds</div>
                        <div className="text-xl font-bold text-green-400">{pick.currentOdds}</div>
                    </div>
                </div>

                {/* Player Props (if any) - The "More/Less" look */}
                {pick.playerProps && pick.playerProps.length > 0 && (
                    <div className="space-y-2 mb-4">
                        {pick.playerProps.map((prop, idx) => (
                            <div key={idx} className="bg-gray-800/50 rounded-lg p-2 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden">
                                        {/* Placeholder for player image */}
                                        <OptimizedLogo alt={prop.playerName} className="w-full h-full opacity-50" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-white">{prop.playerName}</div>
                                        <div className="text-xs text-gray-400">{prop.statType}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-black text-white">{prop.line}</div>
                                    <div className={`text-xs font-bold uppercase ${prop.overUnder === 'over' ? 'text-green-400' : 'text-red-400'}`}>
                                        {prop.overUnder}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Stats Bar */}
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
            </div>
        </div>
    );
};
