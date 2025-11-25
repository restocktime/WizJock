import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Publishing } from '../pages/Publishing';
import * as useReports from '../hooks/useReports';
import * as useUnpublishReport from '../hooks/useUnpublishReport';
import { Report } from '../types';

// Mock the hooks
vi.mock('../hooks/useReports');
vi.mock('../hooks/useUnpublishReport');

const mockReport: Report = {
    id: 'report-1',
    sport: 'NFL',
    generatedAt: new Date('2023-10-27T10:00:00Z'),
    status: 'draft',
    picks: [],
    injuries: [],
    intelligenceUpdates: [],
    lineMovements: [],
};

describe('Publishing Page', () => {
    const mockPublishReport = vi.fn();
    const mockUnpublishReport = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        (useReports.useGetReports as any).mockImplementation((status: string) => {
            if (status === 'draft') {
                return { data: [mockReport], isLoading: false };
            }
            if (status === 'published') {
                return { data: [], isLoading: false };
            }
            return { data: [mockReport], isLoading: false };
        });

        (useReports.usePublishReport as any).mockReturnValue({
            mutate: mockPublishReport,
            isPending: false,
        });

        (useUnpublishReport.useUnpublishReport as any).mockReturnValue({
            mutate: mockUnpublishReport,
            isPending: false,
        });
    });

    it('renders the publishing control page', () => {
        render(<Publishing />);
        expect(screen.getByText('Publishing Control')).toBeInTheDocument();
        // "Draft Reports" appears in the tab and the header
        expect(screen.getAllByText('Draft Reports')).toHaveLength(2);
    });

    it('displays draft reports by default', () => {
        render(<Publishing />);
        expect(screen.getByText('NFL')).toBeInTheDocument();
        expect(screen.getByText('DRAFT')).toBeInTheDocument();
    });

    it('opens confirmation dialog when publish is clicked', () => {
        render(<Publishing />);
        const publishButtons = screen.getAllByText('Publish');
        fireEvent.click(publishButtons[0]);

        // Dialog title
        expect(screen.getByRole('heading', { name: 'Publish Report' })).toBeInTheDocument();
        expect(screen.getByText(/Are you sure you want to publish/)).toBeInTheDocument();
    });

    it('calls publish mutation when confirmed', () => {
        render(<Publishing />);
        const publishButtons = screen.getAllByText('Publish');
        fireEvent.click(publishButtons[0]);

        // Click the confirm button in the dialog.
        // The dialog button says "Publish" and is inside the dialog.
        // We can use getByRole to be specific if possible, or just pick the last one which is usually the dialog button.
        const dialogPublishButton = screen.getAllByText('Publish').pop();
        if (dialogPublishButton) {
            fireEvent.click(dialogPublishButton);
        }

        expect(mockPublishReport).toHaveBeenCalledWith('report-1');
    });
});
