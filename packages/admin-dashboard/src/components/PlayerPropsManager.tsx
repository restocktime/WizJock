import { useState } from 'react';
import { Pick, PlayerProp, OverUnder } from '@sportsbook/shared-types';

interface PlayerPropsManagerProps {
    pick: Pick;
    onAddProp: (pickId: string, prop: Omit<PlayerProp, 'id' | 'outcome'>) => void;
    onDeleteProp: (pickId: string, propId: string) => void;
}

export const PlayerPropsManager = ({ pick, onAddProp, onDeleteProp }: PlayerPropsManagerProps) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newProp, setNewProp] = useState<Partial<PlayerProp>>({
        overUnder: 'over',
        confidence: 75,
    });

    const handleAdd = () => {
        if (
            newProp.playerName &&
            newProp.statType &&
            newProp.line !== undefined &&
            newProp.odds &&
            newProp.reasoning
        ) {
            onAddProp(pick.id, {
                playerId: newProp.playerName.toLowerCase().replace(/\s+/g, '-'), // Mock ID generation
                playerName: newProp.playerName,
                statType: newProp.statType,
                line: Number(newProp.line),
                overUnder: newProp.overUnder as OverUnder,
                odds: newProp.odds,
                confidence: Number(newProp.confidence),
                reasoning: newProp.reasoning,
            });
            setIsAdding(false);
            setNewProp({ overUnder: 'over', confidence: 75 });
        }
    };

    return (
        <div className="mt-4 border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center mb-3">
                <h5 className="text-sm font-bold text-gray-900">
                    Player Props ({pick.playerProps?.length || 0})
                </h5>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                    {isAdding ? 'Cancel' : '+ Add Prop'}
                </button>
            </div>

            {isAdding && (
                <div className="bg-gray-50 p-3 rounded-lg mb-3 border border-gray-200">
                    <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Player Name</label>
                            <input
                                type="text"
                                value={newProp.playerName || ''}
                                onChange={(e) => setNewProp({ ...newProp, playerName: e.target.value })}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                placeholder="e.g. Patrick Mahomes"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Stat Type</label>
                            <input
                                type="text"
                                value={newProp.statType || ''}
                                onChange={(e) => setNewProp({ ...newProp, statType: e.target.value })}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                placeholder="e.g. Passing Yards"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Line</label>
                            <input
                                type="number"
                                value={newProp.line || ''}
                                onChange={(e) => setNewProp({ ...newProp, line: parseFloat(e.target.value) })}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                placeholder="250.5"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Over/Under</label>
                            <select
                                value={newProp.overUnder}
                                onChange={(e) => setNewProp({ ...newProp, overUnder: e.target.value as OverUnder })}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                            >
                                <option value="over">Over</option>
                                <option value="under">Under</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Odds</label>
                            <input
                                type="text"
                                value={newProp.odds || ''}
                                onChange={(e) => setNewProp({ ...newProp, odds: e.target.value })}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                placeholder="-110"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Confidence (%)</label>
                            <input
                                type="number"
                                value={newProp.confidence || ''}
                                onChange={(e) => setNewProp({ ...newProp, confidence: parseFloat(e.target.value) })}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                min="0"
                                max="100"
                            />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Reasoning</label>
                        <textarea
                            value={newProp.reasoning || ''}
                            onChange={(e) => setNewProp({ ...newProp, reasoning: e.target.value })}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                            rows={2}
                            placeholder="Why this prop?"
                        />
                    </div>
                    <button
                        onClick={handleAdd}
                        className="w-full py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                        Add Prop
                    </button>
                </div>
            )}

            {pick.playerProps && pick.playerProps.length > 0 ? (
                <div className="space-y-2">
                    {pick.playerProps.map((prop) => (
                        <div key={prop.id} className="bg-white border border-gray-200 rounded p-2 text-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="font-bold">{prop.playerName}</span>
                                    <span className="mx-1 text-gray-400">|</span>
                                    <span className="text-gray-700">
                                        {prop.statType} {prop.overUnder.toUpperCase()} {prop.line}
                                    </span>
                                    <span className="mx-1 text-gray-400">|</span>
                                    <span className="font-medium text-blue-600">{prop.odds}</span>
                                </div>
                                <button
                                    onClick={() => prop.id && onDeleteProp(pick.id, prop.id)}
                                    className="text-red-500 hover:text-red-700 text-xs"
                                >
                                    Delete
                                </button>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">{prop.reasoning}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-xs text-gray-500 italic">No player props added yet.</p>
            )}
        </div>
    );
};
