import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';

interface Game {
    matchup: string;
    gameTime: string;
    sport: string;
    pickCount: number;
}

export default function Schedule() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['schedule'],
        queryFn: async () => {
            const response = await api.get('/client/schedule');
            return response.data.schedule as Game[];
        },
    });

    const getSportIcon = (sport: string) => {
        switch (sport) {
            case 'NFL': return '🏈';
            case 'NBA': return '🏀';
            case 'UFC': return '🥊';
            case 'NCAA': return '🎓';
            default: return '🏆';
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Header />

            <main className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
                <div className="text-center mb-12">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4">UPCOMING SCHEDULE</h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        The games and fights we're targeting this week.
                        Our analysts are already breaking down the matchups.
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <LoadingSpinner />
                    </div>
                ) : error ? (
                    <div className="text-center py-20 text-red-400">
                        Failed to load schedule. Please try again later.
                    </div>
                ) : data?.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        No upcoming games scheduled yet.
                    </div>
                ) : (
                    <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-800/50 text-gray-400 text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">Date & Time</th>
                                        <th className="px-6 py-4 font-medium">Sport</th>
                                        <th className="px-6 py-4 font-medium">Matchup</th>
                                        <th className="px-6 py-4 font-medium text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {data?.map((game, index) => (
                                        <tr key={index} className="hover:bg-gray-800/30 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                                                {new Date(game.gameTime).toLocaleString(undefined, {
                                                    weekday: 'short',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: 'numeric',
                                                    minute: '2-digit',
                                                })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800 text-xs font-bold text-gray-300">
                                                    <span>{getSportIcon(game.sport)}</span>
                                                    {game.sport}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-white">
                                                {game.matchup}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {game.pickCount > 0 ? (
                                                    <span className="inline-flex items-center text-green-400 text-sm font-bold animate-pulse">
                                                        {game.pickCount} Pick{game.pickCount > 1 ? 's' : ''} Live
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-500 text-sm">Analyzing...</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
