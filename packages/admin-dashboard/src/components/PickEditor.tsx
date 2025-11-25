import { useState, useEffect } from 'react';
import { Pick, PickHierarchy } from '../types';

interface PickEditorProps {
  pick: Pick;
  onSave: (pickId: string, updates: Partial<Pick>) => void;
  onCancel: () => void;
  otherPicks?: Pick[];
}

const HIERARCHY_OPTIONS: { value: PickHierarchy; label: string }[] = [
  { value: 'lock', label: 'LOCK' },
  { value: 'featured', label: 'FEATURED' },
  { value: 'high', label: 'HIGH CONFIDENCE' },
  { value: 'medium', label: 'MEDIUM CONFIDENCE' },
  { value: 'value', label: 'VALUE PLAY' },
];

export const PickEditor = ({ pick, onSave, onCancel, otherPicks = [] }: PickEditorProps) => {
  const [hierarchy, setHierarchy] = useState<PickHierarchy>(pick.hierarchy);
  const [units, setUnits] = useState<number>(pick.units);
  const [reasoning, setReasoning] = useState<string>(pick.reasoning);
  const [detailedAnalysis, setDetailedAnalysis] = useState<string>(pick.detailedAnalysis);
  const [showLockWarning, setShowLockWarning] = useState(false);

  // Check for existing locks when hierarchy changes to 'lock'
  useEffect(() => {
    if (hierarchy === 'lock') {
      const hasExistingLock = otherPicks.some(
        (p) => p.id !== pick.id && p.hierarchy === 'lock'
      );
      setShowLockWarning(hasExistingLock);
    } else {
      setShowLockWarning(false);
    }
  }, [hierarchy, otherPicks, pick.id]);

  const handleSave = () => {
    onSave(pick.id, {
      hierarchy,
      units,
      reasoning,
      detailedAnalysis,
    });
  };

  return (
    <div className="bg-white border-2 border-blue-500 rounded-lg p-5 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-900">Edit Pick: {pick.matchup}</h3>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded"
          >
            Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        {/* Hierarchy Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hierarchy
          </label>
          <select
            value={hierarchy}
            onChange={(e) => setHierarchy(e.target.value as PickHierarchy)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            {HIERARCHY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {showLockWarning && (
            <p className="mt-1 text-xs text-orange-600 font-medium">
              ⚠️ Warning: Another pick is already marked as LOCK.
            </p>
          )}
        </div>

        {/* Units Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Units (1-5)
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="5"
              step="0.5"
              value={units}
              onChange={(e) => setUnits(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-lg font-bold text-gray-900 w-12 text-center">
              {units}
            </span>
          </div>
        </div>
      </div>

      {/* Reasoning */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Brief Reasoning (Client Facing)
        </label>
        <textarea
          value={reasoning}
          onChange={(e) => setReasoning(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
          placeholder="Enter brief reasoning..."
        />
      </div>

      {/* Detailed Analysis */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Detailed Analysis (Admin Only)
        </label>
        <textarea
          value={detailedAnalysis}
          onChange={(e) => setDetailedAnalysis(e.target.value)}
          rows={5}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
          placeholder="Enter detailed analysis..."
        />
      </div>

      <div className="bg-gray-50 p-3 rounded text-xs text-gray-500 flex justify-between items-center">
        <span>
          Original Confidence: <strong>{pick.confidenceScore}%</strong>
        </span>
        <span>
          EV: <strong>{pick.expectedValue?.toFixed(1)}%</strong>
        </span>
        <span>
          Risk: <strong>{pick.riskScore}</strong>
        </span>
      </div>
    </div>
  );
};
