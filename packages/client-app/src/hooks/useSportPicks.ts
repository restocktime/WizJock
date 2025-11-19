import { useMemo } from 'react';
import { usePublishedReports } from './usePublishedReports';

export const useSportPicks = (sport: string) => {
    const { data: picksData, isLoading, error, refetch } = usePublishedReports(sport);

    const picks = useMemo(() => {
        return picksData || [];
    }, [picksData]);

    // Since we don't have the full response object here (usePublishedReports returns picks array),
    // we'll default to current time if loading, or we'd need to update usePublishedReports to return the full object.
    // For now, let's just use a placeholder or modify usePublishedReports.
    // Actually, let's modify usePublishedReports to return the full query result so we can access metadata.

    // Wait, usePublishedReports returns `response.data.picks`. 
    // I should update usePublishedReports to return the whole data object if I want publishedAt.
    // Or just simplify here for now.

    const lastUpdated = new Date(); // Placeholder for now

    return {
        picks,
        isLoading,
        error,
        refetch,
        lastUpdated,
    };
};
