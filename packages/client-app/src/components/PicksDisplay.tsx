import type { Pick, PickHierarchy } from '@sportsbook/shared-types';
import { PickCard } from './PickCard';

interface PicksDisplayProps {
    picks: Pick[];
}

const HIERARCHY_ORDER: Record<PickHierarchy, number> = {
    lock: 0,
    featured: 1,
    high: 2,
    medium: 3,
    value: 4,
};

export const PicksDisplay = ({ picks }: PicksDisplayProps) => {
    const sortedPicks = [...picks].sort((a, b) => {
        // Sort by hierarchy first
        const hierarchyDiff = HIERARCHY_ORDER[a.hierarchy] - HIERARCHY_ORDER[b.hierarchy];
        if (hierarchyDiff !== 0) return hierarchyDiff;

        // Then by game time
        return new Date(a.gameTime).getTime() - new Date(b.gameTime).getTime();
    });

    if (picks.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <p className="text-gray-500 text-lg">No picks available for this selection.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {sortedPicks.map((pick) => (
                <PickCard key={pick.id} pick={pick} />
            ))}
        </div>
    );
};
