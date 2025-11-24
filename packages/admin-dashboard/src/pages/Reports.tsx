import { useState, useEffect } from 'react';

import type {
  Sport,
  Report,
  Pick,
  InjuryUpdate,
  PlayerProp,
} from '@sportsbook/shared-types';
import { PickEditor } from '../components/PickEditor';
import { PlayerPropsManager } from '../components/PlayerPropsManager';
import { useGenerateReport, usePublishReport, useGetReports } from '../hooks/useReports';
import { useUpdatePick } from '../hooks/usePicks';
import { useAddPlayerProp, useDeletePlayerProp } from '../hooks/usePlayerProps';

const SPORTS: Sport[] = ['NFL', 'NCAA', 'NBA', 'UFC'];

const getHierarchyBadge = (hierarchy: Pick['hierarchy']) => {
  const badges = {
    lock: { label: 'LOCK', color: 'bg-yellow-500 text-white' },
    featured: { label: 'FEATURED', color: 'bg-blue-500 text-white' },
    high: { label: 'HIGH', color: 'bg-green-500 text-white' },
    medium: { label: 'MEDIUM', color: 'bg-gray-500 text-white' },
    value: { label: 'VALUE', color: 'bg-purple-500 text-white' },
  };
  return badges[hierarchy];
};

const getInjuryColor = (impact: InjuryUpdate['impact']) => {
  const colors = {
    critical: 'bg-red-100 border-red-500 text-red-900',
    moderate: 'bg-yellow-100 border-yellow-500 text-yellow-900',
    minor: 'bg-green-100 border-green-500 text-green-900',
  };
  return colors[impact];
};

const getCredibilityColor = (rating: number) => {
  if (rating >= 90) return 'text-green-600';
  if (rating >= 80) return 'text-blue-600';
  if (rating >= 70) return 'text-yellow-600';
  return 'text-gray-600';
};

export const Reports = () => {
  const [selectedSport, setSelectedSport] = useState<Sport>('NFL');
  const [currentReport, setCurrentReport] = useState<Report | null>(null);
  const [editingPickId, setEditingPickId] = useState<string | null>(null);

  const { data: reports } = useGetReports(selectedSport, undefined, 1);

  // Update current report when reports are fetched or sport changes
  useEffect(() => {
    if (reports && reports.length > 0) {
      setCurrentReport(reports[0]);
    } else {
      setCurrentReport(null);
    }
  }, [reports, selectedSport]);

  const generateReportMutation = useGenerateReport((report) => {
    setCurrentReport(report);
  });

  const publishReportMutation = usePublishReport(() => {
    if (currentReport) {
      setCurrentReport({ ...currentReport, status: 'published' });
    }
  });

  const updatePickMutation = useUpdatePick((updatedPick) => {
    if (currentReport) {
      const updatedPicks = currentReport.picks.map((p) =>
        p.id === updatedPick.id ? updatedPick : p
      );
      setCurrentReport({ ...currentReport, picks: updatedPicks });
      setEditingPickId(null);
    }
  });

  const addPropMutation = useAddPlayerProp(({ pickId, prop }) => {
    if (currentReport) {
      const updatedPicks = currentReport.picks.map((p) => {
        if (p.id === pickId) {
          return {
            ...p,
            playerProps: [...(p.playerProps || []), prop],
          };
        }
        return p;
      });
      setCurrentReport({ ...currentReport, picks: updatedPicks });
    }
  });

  const deletePropMutation = useDeletePlayerProp(({ pickId, propId }) => {
    if (currentReport) {
      const updatedPicks = currentReport.picks.map((p) => {
        if (p.id === pickId && p.playerProps) {
          return {
            ...p,
            playerProps: p.playerProps.filter((prop) => prop.id !== propId),
          };
        }
        return p;
      });
      setCurrentReport({ ...currentReport, picks: updatedPicks });
    }
  });

  const handleGenerateReport = () => {
    generateReportMutation.mutate(selectedSport);
  };

  const handlePublishReport = () => {
    if (currentReport) {
      publishReportMutation.mutate(currentReport.id);
    }
  };

  const handleSavePick = (pickId: string, updates: Partial<Pick>) => {
    updatePickMutation.mutate({ pickId, updates });
  };

  const handleAddProp = (pickId: string, prop: Omit<PlayerProp, 'id' | 'outcome'>) => {
    addPropMutation.mutate({ pickId, prop });
  };

  const handleDeleteProp = (pickId: string, propId: string) => {
    deletePropMutation.mutate({ pickId, propId });
  };

  const sortedIntelligence = currentReport?.intelligenceUpdates
    ? [...currentReport.intelligenceUpdates].sort(
      (a, b) => b.credibilityRating - a.credibilityRating
    )
    : [];

  const sortedPicks = currentReport?.picks
    ? [...currentReport.picks].sort((a, b) => {
      const hierarchyOrder = { lock: 0, featured: 1, high: 2, medium: 3, value: 4 };
      const orderDiff = hierarchyOrder[a.hierarchy] - hierarchyOrder[b.hierarchy];
      if (orderDiff !== 0) return orderDiff;
      return new Date(a.gameTime).getTime() - new Date(b.gameTime).getTime();
    })
    : [];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Report Runner</h2>

      {/* Sport Selection and Generation */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center gap-4">
          <label htmlFor="sport-select" className="text-sm font-medium text-gray-700">
            Select Sport:
          </label>
          <select
            id="sport-select"
            value={selectedSport}
            onChange={(e) => setSelectedSport(e.target.value as Sport)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={generateReportMutation.isPending}
          >
            {SPORTS.map((sport) => (
              <option key={sport} value={sport}>
                {sport}
              </option>
            ))}
          </select>
          <button
            onClick={handleGenerateReport}
            disabled={generateReportMutation.isPending}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {generateReportMutation.isPending ? 'Generating...' : 'Generate Report'}
          </button>
        </div>

        {generateReportMutation.isPending && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <p className="text-blue-800">
                Generating report... This may take up to 120 seconds.
              </p>
            </div>
          </div>
        )}

        {generateReportMutation.isError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 font-medium">Report Generation Failed</p>
            <p className="text-red-600 text-sm mt-1">
              {generateReportMutation.error instanceof Error
                ? generateReportMutation.error.message
                : 'An error occurred while generating the report. Please try again.'}
            </p>
          </div>
        )}
      </div>

      {/* Report Display */}
      {currentReport && (
        <div className="space-y-6">
          {/* Report Header */}
          <div className="bg-white rounded-lg shadow p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {currentReport.sport} Report
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-bold ${currentReport.status === 'published'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                      }`}
                  >
                    {currentReport.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Generated: {new Date(currentReport.generatedAt).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {currentReport.status !== 'published' && (
                  <>
                    <div className="px-4 py-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-sm font-medium flex items-center gap-2">
                      <span>✏️ Editing Mode Active</span>
                    </div>
                    <button
                      onClick={() => window.open(`/preview/report/${currentReport.id}`, '_blank')}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors font-medium"
                    >
                      👁️ Preview
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to publish this report? It will immediately become visible to all clients.')) {
                          handlePublishReport();
                        }
                      }}
                      disabled={publishReportMutation.isPending}
                      className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-bold shadow-sm"
                    >
                      {publishReportMutation.isPending ? 'Publishing...' : '🚀 Publish Live'}
                    </button>
                  </>
                )}
                {currentReport.status === 'published' && (
                  <div className="px-4 py-2 bg-green-50 border border-green-200 rounded text-green-800 text-sm font-medium flex items-center gap-2">
                    <span>✅ Live on Client Portal</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Critical Injuries Section */}
          {currentReport.injuries && currentReport.injuries.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Injury Updates ({currentReport.injuries.length})
              </h3>
              <div className="space-y-3">
                {currentReport.injuries.map((injury) => (
                  <div
                    key={injury.id}
                    className={`p-4 border-l-4 rounded ${getInjuryColor(injury.impact)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold">{injury.playerName}</h4>
                          {injury.team && (
                            <span className="text-sm text-gray-600">({injury.team})</span>
                          )}
                          <span className="px-2 py-1 text-xs font-medium bg-white rounded">
                            {injury.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm mt-1">
                          <span className="font-medium">Injury:</span> {injury.injuryType}
                        </p>
                        <p className="text-sm mt-1">{injury.details}</p>
                        {injury.affectedPicks.length > 0 && (
                          <p className="text-sm mt-2 font-medium">
                            ⚠️ Affects {injury.affectedPicks.length} pick(s)
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(injury.reportedAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Intelligence Updates Section */}
          {sortedIntelligence.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Intelligence Updates ({sortedIntelligence.length})
              </h3>
              <div className="space-y-3">
                {sortedIntelligence.map((intel) => (
                  <div key={intel.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-bold">{intel.entityName}</h4>
                          {intel.isNew && (
                            <span className="px-2 py-1 text-xs font-bold bg-red-500 text-white rounded">
                              NEW
                            </span>
                          )}
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                            {intel.updateType}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{intel.content}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-600">
                          <span>
                            Source: <span className="font-medium">{intel.source}</span> (
                            {intel.sourceType})
                          </span>
                          <span
                            className={`font-bold ${getCredibilityColor(
                              intel.credibilityRating
                            )}`}
                          >
                            Credibility: {intel.credibilityRating}%
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 ml-4">
                        {new Date(intel.reportedAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Line Movements Section */}
          {currentReport.lineMovements && currentReport.lineMovements.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Line Movements ({currentReport.lineMovements.length})
              </h3>
              <div className="space-y-3">
                {currentReport.lineMovements.map((movement) => {
                  const isSignificant = Math.abs(movement.movementPercentage) > 10;
                  return (
                    <div
                      key={movement.id}
                      className={`p-4 border rounded-lg ${isSignificant
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <span className="font-medium">
                              {movement.openingLine} → {movement.currentLine}
                            </span>
                            <span
                              className={`flex items-center gap-1 text-sm font-medium ${movement.direction === 'toward'
                                ? 'text-green-600'
                                : 'text-red-600'
                                }`}
                            >
                              {movement.direction === 'toward' ? '↗' : '↘'}
                              {Math.abs(movement.movementPercentage).toFixed(1)}%
                            </span>
                            {isSignificant && (
                              <span className="px-2 py-1 text-xs font-bold bg-orange-500 text-white rounded">
                                SIGNIFICANT
                              </span>
                            )}
                            {movement.sharpMoney && (
                              <span className="px-2 py-1 text-xs font-bold bg-purple-500 text-white rounded">
                                SHARP MONEY
                              </span>
                            )}
                          </div>
                          {movement.notes && (
                            <p className="text-sm text-gray-600 mt-2">{movement.notes}</p>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(movement.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Picks Section */}
          {sortedPicks.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Picks ({sortedPicks.length})
              </h3>
              <div className="space-y-4">
                {sortedPicks.map((pick) => {
                  const badge = getHierarchyBadge(pick.hierarchy);
                  return (
                    <div key={pick.id}>
                      {editingPickId === pick.id ? (
                        <PickEditor
                          pick={pick}
                          onSave={handleSavePick}
                          onCancel={() => setEditingPickId(null)}
                          otherPicks={currentReport.picks}
                        />
                      ) : (
                        <div className="p-5 border border-gray-200 rounded-lg relative group">
                          <button
                            onClick={() => setEditingPickId(pick.id)}
                            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-opacity"
                          >
                            Edit
                          </button>
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span
                                  className={`px-3 py-1 text-xs font-bold rounded ${badge.color}`}
                                >
                                  {badge.label}
                                </span>
                                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                  {pick.units} UNIT{pick.units > 1 ? 'S' : ''}
                                </span>
                              </div>
                              <h4 className="text-lg font-bold text-gray-900">{pick.matchup}</h4>
                              <p className="text-sm text-gray-600">
                                {new Date(pick.gameTime).toLocaleString()}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-3">
                            <div>
                              <p className="text-sm text-gray-600">Bet Type</p>
                              <p className="font-medium">{pick.betType.toUpperCase()}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Recommendation</p>
                              <p className="font-medium">{pick.recommendation}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Current Odds</p>
                              <p className="font-medium">{pick.currentOdds}</p>
                            </div>
                            {pick.openingOdds && (
                              <div>
                                <p className="text-sm text-gray-600">Opening Odds</p>
                                <p className="font-medium">{pick.openingOdds}</p>
                              </div>
                            )}
                          </div>

                          <div className="grid grid-cols-3 gap-4 mb-3 p-3 bg-gray-50 rounded">
                            <div>
                              <p className="text-sm text-gray-600">Confidence</p>
                              <p className="text-lg font-bold text-blue-600">
                                {pick.confidenceScore}%
                              </p>
                            </div>
                            {pick.riskScore !== undefined && (
                              <div>
                                <p className="text-sm text-gray-600">Risk Score</p>
                                <p className="text-lg font-bold text-orange-600">
                                  {pick.riskScore}
                                </p>
                              </div>
                            )}
                            {pick.expectedValue !== undefined && (
                              <div>
                                <p className="text-sm text-gray-600">Expected Value</p>
                                <p
                                  className={`text-lg font-bold ${pick.expectedValue > 0 ? 'text-green-600' : 'text-red-600'
                                    }`}
                                >
                                  {pick.expectedValue > 0 ? '+' : ''}
                                  {pick.expectedValue.toFixed(1)}%
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="mb-3">
                            <p className="text-sm text-gray-600 font-medium mb-1">
                              Brief Reasoning
                            </p>
                            <p className="text-sm text-gray-800">{pick.reasoning}</p>
                          </div>

                          <div>
                            <p className="text-sm text-gray-600 font-medium mb-1">
                              Detailed Analysis
                            </p>
                            <p className="text-sm text-gray-800">{pick.detailedAnalysis}</p>
                          </div>

                          {pick.injuryImpact && pick.injuryImpact.length > 0 && (
                            <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
                              <p className="text-sm text-red-800">
                                ⚠️ Affected by {pick.injuryImpact.length} injury update(s)
                              </p>
                            </div>
                          )}

                          <PlayerPropsManager
                            pick={pick}
                            onAddProp={handleAddProp}
                            onDeleteProp={handleDeleteProp}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
