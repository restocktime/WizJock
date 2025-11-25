import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';

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
        <div className="min-h-screen bg-black text-white">
            <Header />

            <main className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
                <div className="text-center mb-12">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4">INJURY REPORT</h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Real-time injury updates and impact analysis for key players.
                        Knowing who's out is just as important as knowing who's playing.
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <LoadingSpinner />
                    </div>
                ) : error ? (
                    <div className="text-center py-20 text-red-400">
                        Failed to load injury reports. Please try again later.
                    </div>
                ) : data?.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        No recent injuries reported.
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {data?.map((injury, index) => (
                            <div
                                key={index}
                                className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{injury.playerName}</h3>
                                        <div className="text-sm text-gray-400">{injury.team} • {injury.sport}</div>
                                    </div>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getImpactColor(
                                            injury.impact
                                        )}`}
                                    >
                                        {injury.impact}
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Status</div>
                                        <div className="font-medium text-gray-300">{injury.status}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Injury</div>
                                        <div className="font-medium text-gray-300">{injury.injuryType}</div>
                                    </div>
                                    {injury.details && (
                                        <div>
                                            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Analysis</div>
                                            <p className="text-sm text-gray-400 leading-relaxed">{injury.details}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-800 text-xs text-gray-600">
                                    Reported: {new Date(injury.reportedAt).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
