import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
    Sport,
    GenerateReportResponse,
    PublishReportResponse,
    Report,
    ReportStatus,
} from '@sportsbook/shared-types';

interface GetReportsResponse {
    success: boolean;
    reports: Report[];
    total: number;
}

export const useGetReports = (sport?: Sport, status?: ReportStatus, limit?: number) => {
    return useQuery({
        queryKey: ['reports', sport, status, limit],
        queryFn: async () => {
            const response = await axios.get<GetReportsResponse>('/api/admin/reports', {
                params: { sport, status, limit },
            });
            return response.data.reports;
        },
    });
};

export const useGenerateReport = (onSuccess?: (report: Report) => void) => {
    return useMutation({
        mutationFn: async (sport: Sport) => {
            const response = await axios.post<GenerateReportResponse>(
                '/api/admin/reports/generate',
                { sport }
            );
            return response.data;
        },
        onSuccess: (data) => {
            if (onSuccess) {
                onSuccess(data.report);
            }
        },
    });
};

export const usePublishReport = (onSuccess?: () => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (reportId: string) => {
            const response = await axios.post<PublishReportResponse>(
                `/api/admin/reports/${reportId}/publish`
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
