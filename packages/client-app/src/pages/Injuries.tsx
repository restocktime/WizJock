import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';

interface Injury {
    playerName: string;
    team: string;
    status: string;
    injuryType: string;
    impact: 'critical' | 'significant' | 'minor';
    details: string;
    reportedAt: string;
    sport: string;
}

export default function Injuries() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['injuries'],
        queryFn: async () => {
            const response = await api.get('/client/injuries');
            return response.data.injuries as Injury[];
        },
    });

    const getImpactColor = (impact: string) => {
        switch (impact) {
            case 'critical':
                return 'bg-red-500/20 text-red-400 border-red-500/50';
            case 'significant':
                return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
            default:
                return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Injury Report</h2>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
            ) : error ? (
                <div className="text-center py-12 text-red-400">
                    Failed to load injury reports. Please try again later.
                </div>
            ) : data?.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    No recent injuries reported.
                </div>
            ) : (
                <div className="grid gap-4">
                    {data?.map((injury, index) => (
                        <div
                            key={index}
                            className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="text-lg font-bold text-white">{injury.playerName}</h3>
                                    <div className="text-sm text-gray-400">{injury.team} • {injury.sport}</div>
                                </div>
                                <span
                                    className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase border ${getImpactColor(
                                        injury.impact
                                    )}`}
                                >
                                    {injury.impact}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <div className="flex gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500 uppercase text-xs mr-2">Status:</span>
                                        <span className="text-gray-300 font-medium">{injury.status}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 uppercase text-xs mr-2">Injury:</span>
                                        <span className="text-gray-300 font-medium">{injury.injuryType}</span>
                                    </div>
                                </div>
                                {injury.details && (
                                    <p className="text-sm text-gray-400 leading-relaxed border-t border-gray-800 pt-2 mt-2">
                                        {injury.details}
                                    </p>
                                )}
                            </div>

                            <div className="mt-3 text-xs text-gray-600 text-right">
                                Reported: {new Date(injury.reportedAt).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
