import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';

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
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Upcoming Schedule</h2>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
            ) : error ? (
                <div className="text-center py-12 text-red-400">
                    Failed to load schedule. Please try again later.
                </div>
            ) : data?.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
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
        </div>
    );
}
