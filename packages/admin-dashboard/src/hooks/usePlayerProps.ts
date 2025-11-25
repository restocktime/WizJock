import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { PlayerProp } from '../types';

export const useAddPlayerProp = (onSuccess?: (data: { pickId: string; prop: PlayerProp }) => void) => {
    return useMutation({
        mutationFn: async ({
            pickId,
            prop,
        }: {
            pickId: string;
            prop: Omit<PlayerProp, 'id' | 'outcome'>;
        }) => {
            const response = await axios.post<PlayerProp>('/api/admin/player-props', {
                pickId,
                ...prop,
            });
            return { pickId, prop: response.data };
        },
        onSuccess: (data) => {
            if (onSuccess) {
                onSuccess(data);
            }
        },
    });
};

export const useDeletePlayerProp = (onSuccess?: (data: { pickId: string; propId: string }) => void) => {
    return useMutation({
        mutationFn: async ({ pickId, propId }: { pickId: string; propId: string }) => {
            await axios.delete(`/api/admin/player-props/${propId}`);
            return { pickId, propId };
        },
        onSuccess: (data) => {
            if (onSuccess) {
                onSuccess(data);
            }
        },
    });
};
