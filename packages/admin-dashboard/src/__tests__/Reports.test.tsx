import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Reports } from '../pages/Reports';
import * as useReports from '../hooks/useReports';
import * as usePicks from '../hooks/usePicks';
import * as usePlayerProps from '../hooks/usePlayerProps';
import { Report, Pick } from '../types';

// Mock the hooks
vi.mock('../hooks/useReports');
vi.mock('../hooks/usePicks');
vi.mock('../hooks/usePlayerProps');

const mockPick: Pick = {
    id: 'pick-1',
    gameId: 'game-1',
    matchup: 'Team A vs Team B',
    gameTime: new Date('2023-10-27T20:00:00Z'),
    betType: 'spread',
    recommendation: 'Team A -3.5',
    confidenceScore: 85,
    hierarchy: 'lock',
    units: 3,
    currentOdds: '-110',
    reasoning: 'Great defense',
    detailedAnalysis: 'Detailed analysis here',
    playerProps: [],
};

const mockReport: Report = {
    id: 'report-1',
    sport: 'NFL',
    generatedAt: new Date(),
    status: 'draft',
    picks: [mockPick],
    injuries: [],
    intelligenceUpdates: [],
    lineMovements: [],
};

describe('Reports Page', () => {
    const mockGenerateReport = vi.fn();
    const mockPublishReport = vi.fn();
    const mockUpdatePick = vi.fn();
    const mockAddPlayerProp = vi.fn();
    const mockDeletePlayerProp = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        (useReports.useGenerateReport as any).mockReturnValue({
            mutate: mockGenerateReport,
            isPending: false,
            isError: false,
        });

        (useReports.usePublishReport as any).mockReturnValue({
            mutate: mockPublishReport,
            isPending: false,
        });

        (usePicks.useUpdatePick as any).mockReturnValue({
            mutate: mockUpdatePick,
        });

        (usePlayerProps.useAddPlayerProp as any).mockReturnValue({
            mutate: mockAddPlayerProp,
        });

        (usePlayerProps.useDeletePlayerProp as any).mockReturnValue({
            mutate: mockDeletePlayerProp,
        });
    });

    it('renders the report runner', () => {
        render(<Reports />);
        expect(screen.getByText('Report Runner')).toBeInTheDocument();
        expect(screen.getByText('Generate Report')).toBeInTheDocument();
    });

    it('calls generate report when button is clicked', () => {
        render(<Reports />);
        fireEvent.click(screen.getByText('Generate Report'));
        expect(mockGenerateReport).toHaveBeenCalledWith('NFL');
    });

    it('displays report content after generation', async () => {
        // Simulate successful generation by mocking the hook to call onSuccess immediately
        (useReports.useGenerateReport as any).mockImplementation((onSuccess: any) => ({
            mutate: () => onSuccess(mockReport),
            isPending: false,
        }));

        render(<Reports />);
        fireEvent.click(screen.getByText('Generate Report'));

        await waitFor(() => {
            expect(screen.getByText('NFL Report')).toBeInTheDocument();
            expect(screen.getByText('Team A vs Team B')).toBeInTheDocument();
        });
    });

    it('allows editing a pick', async () => {
        (useReports.useGenerateReport as any).mockImplementation((onSuccess: any) => ({
            mutate: () => onSuccess(mockReport),
            isPending: false,
        }));

        render(<Reports />);
        fireEvent.click(screen.getByText('Generate Report'));

        // Find the edit button (it's hidden by default, but we can find it by role or text if visible, 
        // or we can simulate the hover if needed, but for click it might just work if in DOM)
        // The button text is "Edit"
        const editButton = screen.getByText('Edit');
        fireEvent.click(editButton);

        expect(screen.getByText('Edit Pick: Team A vs Team B')).toBeInTheDocument();

        // Change units
        const unitInput = screen.getByRole('slider'); // Assuming input type="range"
        fireEvent.change(unitInput, { target: { value: '5' } });

        fireEvent.click(screen.getByText('Save Changes'));

        expect(mockUpdatePick).toHaveBeenCalled();
    });
});
