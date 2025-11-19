import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { Pick } from '@sportsbook/shared-types';

interface GetPicksResponse {
    success: boolean;
    picks: Pick[];
    publishedAt: string | null;
    lockOfWeek: Pick | null;
}

export const usePublishedReports = (sport?: string) => {
    return useQuery({
        queryKey: ['published-picks', sport],
        queryFn: async () => {
            const params: any = {};
            if (sport) {
                params.sport = sport.toUpperCase();
            }
            const response = await axios.get<GetPicksResponse>('/api/picks', { params });
            return response.data.picks;
        },
        staleTime: 60 * 1000, // 1 minute
    });
};
