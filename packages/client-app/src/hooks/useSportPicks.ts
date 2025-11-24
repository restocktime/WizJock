import { useMemo } from 'react';
import { usePublishedReports } from './usePublishedReports';

export const useSportPicks = (sport: string) => {
    const { data, isLoading, error, refetch } = usePublishedReports(sport);

    const picks = useMemo(() => {
        return data?.picks || [];
    }, [data]);

    const lastUpdated = useMemo(() => {
        return data?.publishedAt ? new Date(data.publishedAt) : null;
    }, [data]);

    return {
        picks,
        isLoading,
        error,
        refetch,
        lastUpdated,
    };
};
