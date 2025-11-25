import { useState, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import type {
  LineMovement,
  Pick,
  CreateLineMovementRequest,
  Sport,
} from '../types';

interface PickWithMovements extends Pick {
  movements: LineMovement[];
  latestMovement?: LineMovement;
}

const getDirectionIcon = (direction: 'toward' | 'away') => {
  return direction === 'toward' ? '↗' : '↘';
};

const getDirectionColor = (direction: 'toward' | 'away') => {
  return direction === 'toward' ? 'text-green-600' : 'text-red-600';
};

const calculateExpectedValue = (
  confidenceScore: number,
  currentOdds: string
): number => {
  // Parse odds to decimal probability
  const parseOdds = (odds: string): number => {
    const cleaned = odds.replace(/[^\d.+-]/g, '');
    const value = parseFloat(cleaned);
    
    if (value > 0) {
      // Positive American odds
      return 100 / (value + 100);
    } else {
      // Negative American odds
      return Math.abs(value) / (Math.abs(value) + 100);
    }
  };

  const impliedProbability = parseOdds(currentOdds);
  const ourProbability = confidenceScore / 100;
  
  // EV = (Our Probability * Payout) - (1 - Our Probability)
  // Simplified as percentage edge
  return ((ourProbability - impliedProbability) * 100);
};

export const LineMovements = () => {
  const queryClient = useQueryClient();
  const [selectedReportId, setSelectedReportId] = useState<string>('');
  const [selectedPickId, setSelectedPickId] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterSport, setFilterSport] = useState<Sport | ''>('');
  const [showOnlySignificant, setShowOnlySignificant] = useState(false);
  const [showFavorableOnly, setShowFavorableOnly] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    openingLine: '',
    currentLine: '',
    sharpMoney: false,
    notes: '',
  });

  // Fetch available reports
  const { data: reportsData } = useQuery({
    queryKey: ['reports', 'published'],
    queryFn: async () => {
      const response = await axios.get('/api/admin/reports', {
        params: { limit: 50 },
      });
      return response.data;
    },
  });

  // Fetch picks for selected report
  const { data: reportData, isLoading: isLoadingReport } = useQuery({
    queryKey: ['report', selectedReportId],
    queryFn: async () => {
      if (!selectedReportId) return null;
      const response = await axios.get(`/api/admin/reports/${selectedReportId}`);
      return response.data.report;
    },
    enabled: !!selectedReportId,
  });

  // Fetch line movements for all picks in the report
  const { data: movementsData, isLoading: isLoadingMovements } = useQuery({
    queryKey: ['line-movements', selectedReportId],
    queryFn: async () => {
      if (!reportData?.picks) return [];
      
      const movementPromises = reportData.picks.map(async (pick: Pick) => {
        try {
          const response = await axios.get(`/api/admin/line-movements/${pick.id}`);
          return {
            pickId: pick.id,
            movements: response.data.movements || [],
          };
        } catch (error) {
          return {
            pickId: pick.id,
            movements: [],
          };
        }
      });

      return Promise.all(movementPromises);
    },
    enabled: !!reportData?.picks,
  });

  // Create line movement mutation
  const createMovementMutation = useMutation({
    mutationFn: async (data: CreateLineMovementRequest) => {
      const response = await axios.post('/api/admin/line-movements', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['line-movements'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      setShowAddForm(false);
      resetForm();
    },
  });

  const resetForm = () => {
    setFormData({
      openingLine: '',
      currentLine: '',
      sharpMoney: false,
      notes: '',
    });
    setSelectedPickId('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPickId) {
      alert('Please select a pick');
      return;
    }

    createMovementMutation.mutate({
      pickId: selectedPickId,
      ...formData,
    });
  };

  // Combine picks with their movements
  const picksWithMovements: PickWithMovements[] = useMemo(() => {
    if (!reportData?.picks || !movementsData) return [];

    return reportData.picks.map((pick: Pick) => {
      const pickMovements = movementsData.find(
        (m: any) => m.pickId === pick.id
      )?.movements || [];
      
      return {
        ...pick,
        movements: pickMovements,
        latestMovement: pickMovements[0], // Already sorted by timestamp DESC
      };
    });
  }, [reportData, movementsData]);

  // Apply filters
  const filteredPicks = useMemo(() => {
    let filtered = picksWithMovements;

    if (filterSport) {
      filtered = filtered.filter(() => reportData?.sport === filterSport);
    }

    if (showOnlySignificant) {
      filtered = filtered.filter(
        (pick) => pick.latestMovement && Math.abs(pick.latestMovement.movementPercentage) > 10
      );
    }

    if (showFavorableOnly) {
      filtered = filtered.filter((pick) => {
        const ev = calculateExpectedValue(pick.confidenceScore, pick.currentOdds);
        return ev > 0;
      });
    }

    return filtered;
  }, [picksWithMovements, filterSport, showOnlySignificant, showFavorableOnly, reportData]);

  const reports = reportsData?.reports || [];
  const availablePicks = reportData?.picks || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Line Movement Tracker</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          disabled={!selectedReportId}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {showAddForm ? 'Cancel' : '+ Add Line Movement'}
        </button>
      </div>

      {/* Add Line Movement Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Track New Line Movement</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pick *
                </label>
                <select
                  value={selectedPickId}
                  onChange={(e) => setSelectedPickId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select a pick</option>
                  {availablePicks.map((pick: Pick) => (
                    <option key={pick.id} value={pick.id}>
                      {pick.matchup} - {pick.betType} ({pick.currentOdds})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Opening Line *
                </label>
                <input
                  type="text"
                  value={formData.openingLine}
                  onChange={(e) => setFormData({ ...formData, openingLine: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., -7, +150, O 45.5"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Line *
                </label>
                <input
                  type="text"
                  value={formData.currentLine}
                  onChange={(e) => setFormData({ ...formData, currentLine: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., -5.5, +180, O 47"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.sharpMoney}
                    onChange={(e) => setFormData({ ...formData, sharpMoney: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Sharp Money Indicator
                  </span>
                </label>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Additional notes about this line movement..."
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={createMovementMutation.isPending}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {createMovementMutation.isPending ? 'Adding...' : 'Track Movement'}
              </button>
            </div>

            {createMovementMutation.isError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800 text-sm">
                  {createMovementMutation.error instanceof Error
                    ? createMovementMutation.error.message
                    : 'Failed to track line movement'}
                </p>
              </div>
            )}
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Report
            </label>
            <select
              value={selectedReportId}
              onChange={(e) => setSelectedReportId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a report</option>
              {reports.map((report: any) => (
                <option key={report.id} value={report.id}>
                  {report.sport} - {new Date(report.generated_at).toLocaleDateString()} (
                  {report.status})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Sport
            </label>
            <select
              value={filterSport}
              onChange={(e) => setFilterSport(e.target.value as Sport | '')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Sports</option>
              <option value="NFL">NFL</option>
              <option value="NCAA">NCAA</option>
              <option value="NBA">NBA</option>
              <option value="UFC">UFC</option>
            </select>
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showOnlySignificant}
                onChange={(e) => setShowOnlySignificant(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                Significant Only (&gt;10%)
              </span>
            </label>
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showFavorableOnly}
                onChange={(e) => setShowFavorableOnly(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                Favorable EV Only
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Line Movements Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Line Movements {selectedReportId && `(${filteredPicks.length} picks)`}
          </h3>

          {!selectedReportId ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Please select a report to view line movements</p>
            </div>
          ) : isLoadingReport || isLoadingMovements ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredPicks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No picks found matching your filters</p>
              <p className="text-sm text-gray-500 mt-1">
                Try adjusting your filters or add line movements to picks
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pick
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Opening Line
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Line
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Movement
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expected Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Indicators
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPicks.map((pick) => {
                    const movement = pick.latestMovement;
                    const ev = calculateExpectedValue(pick.confidenceScore, pick.currentOdds);
                    const isSignificant = movement && Math.abs(movement.movementPercentage) > 10;
                    const isFavorable = ev > 0;

                    return (
                      <tr
                        key={pick.id}
                        className={`${
                          isSignificant ? 'bg-orange-50' : ''
                        } hover:bg-gray-50 transition-colors`}
                      >
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">{pick.matchup}</div>
                            <div className="text-gray-500">
                              {pick.betType} - {pick.recommendation}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              Confidence: {pick.confidenceScore}%
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {movement?.openingLine || pick.openingOdds || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {movement?.currentLine || pick.currentOdds}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {movement ? (
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-2xl ${getDirectionColor(movement.direction)}`}
                              >
                                {getDirectionIcon(movement.direction)}
                              </span>
                              <span
                                className={`text-sm font-bold ${
                                  isSignificant ? 'text-orange-600' : 'text-gray-600'
                                }`}
                              >
                                {Math.abs(movement.movementPercentage).toFixed(1)}%
                              </span>
                              {isSignificant && (
                                <span className="px-2 py-1 text-xs font-bold bg-orange-500 text-white rounded">
                                  SIGNIFICANT
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">No movement</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div
                            className={`text-sm font-bold ${
                              isFavorable ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {ev > 0 ? '+' : ''}
                            {ev.toFixed(1)}%
                          </div>
                          {isFavorable && (
                            <div className="text-xs text-green-600 font-medium mt-1">
                              ✓ Favorable
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            {movement?.sharpMoney && (
                              <span className="px-2 py-1 text-xs font-bold bg-purple-500 text-white rounded inline-block w-fit">
                                SHARP MONEY
                              </span>
                            )}
                            {pick.hierarchy === 'lock' && (
                              <span className="px-2 py-1 text-xs font-bold bg-yellow-500 text-white rounded inline-block w-fit">
                                LOCK
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600 max-w-xs">
                            {movement?.notes || '-'}
                          </div>
                          {movement && (
                            <div className="text-xs text-gray-400 mt-1">
                              {new Date(movement.timestamp).toLocaleString()}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Alerts Section */}
        {selectedReportId && filteredPicks.length > 0 && (
          <div className="border-t border-gray-200 bg-gray-50 p-6">
            <h4 className="text-sm font-bold text-gray-900 mb-3">Alerts & Insights</h4>
            <div className="space-y-2">
              {filteredPicks.filter((p) => {
                const movement = p.latestMovement;
                return movement && Math.abs(movement.movementPercentage) > 10;
              }).length > 0 && (
                <div className="flex items-start gap-2 text-sm">
                  <span className="text-orange-600 font-bold">⚠️</span>
                  <span className="text-gray-700">
                    {
                      filteredPicks.filter((p) => {
                        const movement = p.latestMovement;
                        return movement && Math.abs(movement.movementPercentage) > 10;
                      }).length
                    }{' '}
                    pick(s) with significant line movement (&gt;10%)
                  </span>
                </div>
              )}
              {filteredPicks.filter((p) => {
                const ev = calculateExpectedValue(p.confidenceScore, p.currentOdds);
                return ev > 5;
              }).length > 0 && (
                <div className="flex items-start gap-2 text-sm">
                  <span className="text-green-600 font-bold">✓</span>
                  <span className="text-gray-700">
                    {
                      filteredPicks.filter((p) => {
                        const ev = calculateExpectedValue(p.confidenceScore, p.currentOdds);
                        return ev > 5;
                      }).length
                    }{' '}
                    pick(s) with favorable expected value (&gt;5%)
                  </span>
                </div>
              )}
              {filteredPicks.filter((p) => p.latestMovement?.sharpMoney).length > 0 && (
                <div className="flex items-start gap-2 text-sm">
                  <span className="text-purple-600 font-bold">💎</span>
                  <span className="text-gray-700">
                    {filteredPicks.filter((p) => p.latestMovement?.sharpMoney).length} pick(s)
                    with sharp money indicators
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
