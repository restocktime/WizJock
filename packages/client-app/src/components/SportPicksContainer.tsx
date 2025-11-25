import { useParams } from 'react-router-dom';
import { useSportPicks } from '../hooks/useSportPicks';
import { PicksDisplay } from './PicksDisplay';
import { UpdateIndicator } from './UpdateIndicator';

export const SportPicksContainer = () => {
    const { sport } = useParams<{ sport: string }>();
    const { picks, isLoading, error, lastUpdated } = useSportPicks(sport || 'nfl');

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12 bg-red-50 rounded-xl border border-red-200">
                <p className="text-red-600 text-lg">Failed to load picks. Please try again later.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <UpdateIndicator lastUpdated={lastUpdated || new Date()} />
            <PicksDisplay picks={picks} />
        </div>
    );
};
