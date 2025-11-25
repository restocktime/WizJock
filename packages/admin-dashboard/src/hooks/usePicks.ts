import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Pick } from '../types';

export const useUpdatePick = (onSuccess?: (updatedPick: Pick) => void) => {

    return useMutation({
        mutationFn: async ({ pickId, updates }: { pickId: string; updates: Partial<Pick> }) => {
            const response = await axios.patch<Pick>(`/api/admin/picks/${pickId}`, updates);
            return response.data;
        },
        onSuccess: (updatedPick) => {
            // Invalidate relevant queries if needed, e.g., refreshing the report
            // queryClient.invalidateQueries({ queryKey: ['report', reportId] }); 
            // For now, we rely on the onSuccess callback to update local state in Reports.tsx
            if (onSuccess) {
                onSuccess(updatedPick);
            }
        },
    });
};
