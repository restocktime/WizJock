import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PicksDisplay } from '../components/PicksDisplay';
import type { Pick } from '@sportsbook/shared-types';

const mockPicks: Pick[] = [
    {
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
        reasoning: 'Reasoning 1',
        detailedAnalysis: 'Analysis 1',
        playerProps: [],
    },
    {
        id: 'pick-2',
        gameId: 'game-2',
        matchup: 'Team C vs Team D',
        gameTime: new Date('2023-10-27T21:00:00Z'),
        betType: 'overunder',
        recommendation: 'Over 45.5',
        confidenceScore: 75,
        hierarchy: 'medium',
        units: 2,
        currentOdds: '-110',
        reasoning: 'Reasoning 2',
        detailedAnalysis: 'Analysis 2',
        playerProps: [],
    },
];

describe('PicksDisplay', () => {
    it('renders picks', () => {
        render(<PicksDisplay picks={mockPicks} />);
        expect(screen.getByText('Team A vs Team B')).toBeInTheDocument();
        expect(screen.getByText('Team C vs Team D')).toBeInTheDocument();
    });

    it('displays hierarchy badges', () => {
        render(<PicksDisplay picks={mockPicks} />);
        expect(screen.getByText('LOCK')).toBeInTheDocument();
        expect(screen.getByText('MEDIUM')).toBeInTheDocument();
    });

    it('shows empty state when no picks', () => {
        render(<PicksDisplay picks={[]} />);
        expect(screen.getByText('No picks available for this selection.')).toBeInTheDocument();
    });
});
