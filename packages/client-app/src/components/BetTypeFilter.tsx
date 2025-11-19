import clsx from 'clsx';
import type { BetType } from '@sportsbook/shared-types';

interface BetTypeFilterProps {
    selectedType: BetType | 'all';
    onSelect: (type: BetType | 'all') => void;
    counts: Record<BetType | 'all', number>;
}

const BET_TYPES: { type: BetType | 'all'; label: string }[] = [
    { type: 'all', label: 'All Picks' },
    { type: 'spread', label: 'Spread' },
    { type: 'overunder', label: 'Total' },
    { type: 'moneyline', label: 'Moneyline' },
    { type: 'playerprop', label: 'Props' },
];

export const BetTypeFilter = ({ selectedType, onSelect, counts }: BetTypeFilterProps) => {
    return (
        <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
            <div className="flex space-x-3">
                {BET_TYPES.map((betType) => (
                    <button
                        key={betType.type}
                        onClick={() => onSelect(betType.type)}
                        className={clsx(
                            'flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap',
                            selectedType === betType.type
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                        )}
                    >
                        <span>{betType.label}</span>
                        <span
                            className={clsx(
                                'px-1.5 py-0.5 rounded-full text-xs',
                                selectedType === betType.type
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                            )}
                        >
                            {counts[betType.type] || 0}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};
