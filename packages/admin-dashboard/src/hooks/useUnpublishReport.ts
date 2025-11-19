import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { UnpublishReportResponse } from '@sportsbook/shared-types';

export const useUnpublishReport = (onSuccess?: () => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (reportId: string) => {
            const response = await axios.delete<UnpublishReportResponse>(
                `/api/admin/reports/${reportId}/unpublish`
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reports'] });
            if (onSuccess) {
                onSuccess();
            }
        },
    });
};
