import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import type {
  InjuryUpdate,
  InjuryStatus,
  InjuryImpact,
  CreateInjuryRequest,
  UpdateInjuryRequest,
  Pick,
} from '@sportsbook/shared-types';

const INJURY_STATUSES: InjuryStatus[] = ['out', 'questionable', 'probable', 'season-ending'];
const INJURY_IMPACTS: InjuryImpact[] = ['critical', 'moderate', 'minor'];

const getInjuryColor = (impact: InjuryImpact) => {
  const colors = {
    critical: 'bg-red-100 border-red-500 text-red-900',
    moderate: 'bg-yellow-100 border-yellow-500 text-yellow-900',
    minor: 'bg-green-100 border-green-500 text-green-900',
  };
  return colors[impact];
};

const getStatusBadgeColor = (status: InjuryStatus) => {
  const colors = {
    out: 'bg-red-600 text-white',
    'season-ending': 'bg-red-800 text-white',
    questionable: 'bg-yellow-600 text-white',
    probable: 'bg-green-600 text-white',
  };
  return colors[status];
};

export const Injuries = () => {
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string>('');
  const [selectedInjuries, setSelectedInjuries] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState<InjuryStatus>('questionable');
  const [filterStatus, setFilterStatus] = useState<InjuryStatus | 'all'>('all');
  const [filterReportId, setFilterReportId] = useState<string>('');
  const [playerSearch, setPlayerSearch] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    playerId: '',
    playerName: '',
    team: '',
    status: 'questionable' as InjuryStatus,
    injuryType: '',
    impact: 'moderate' as InjuryImpact,
    details: '',
  });

  // Fetch available reports for dropdown
  const { data: reportsData } = useQuery({
    queryKey: ['reports', 'draft'],
    queryFn: async () => {
      const response = await axios.get('/api/admin/reports', {
        params: { status: 'draft', limit: 50 },
      });
      return response.data;
    },
  });

  // Fetch injuries with filters
  const { data: injuriesData, isLoading } = useQuery({
    queryKey: ['injuries', filterReportId, filterStatus],
    queryFn: async () => {
      const params: any = {};
      if (filterReportId) params.reportId = filterReportId;
      if (filterStatus !== 'all') params.status = filterStatus;

      const response = await axios.get('/api/admin/injuries', { params });
      return response.data;
    },
  });

  // Fetch picks for selected report to show affected picks
  const { data: picksData } = useQuery({
    queryKey: ['picks', selectedReportId],
    queryFn: async () => {
      if (!selectedReportId) return { picks: [] };
      const response = await axios.get(`/api/admin/reports/${selectedReportId}`);
      return { picks: response.data.report.picks || [] };
    },
    enabled: !!selectedReportId,
  });

  // Create injury mutation
  const createInjuryMutation = useMutation({
    mutationFn: async (data: CreateInjuryRequest) => {
      const response = await axios.post('/api/admin/injuries', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['injuries'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      setShowAddForm(false);
      resetForm();
    },
  });

  // Update injury mutation
  const updateInjuryMutation = useMutation({
    mutationFn: async ({ injuryId, data }: { injuryId: string; data: UpdateInjuryRequest }) => {
      const response = await axios.patch(`/api/admin/injuries/${injuryId}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['injuries'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });

  const resetForm = () => {
    setFormData({
      playerId: '',
      playerName: '',
      team: '',
      status: 'questionable',
      injuryType: '',
      impact: 'moderate',
      details: '',
    });
    setPlayerSearch('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReportId) {
      alert('Please select a report');
      return;
    }

    createInjuryMutation.mutate({
      reportId: selectedReportId,
      ...formData,
    });
  };

  const handleBulkStatusUpdate = () => {
    if (selectedInjuries.size === 0) {
      alert('Please select injuries to update');
      return;
    }

    selectedInjuries.forEach((injuryId) => {
      updateInjuryMutation.mutate({
        injuryId,
        data: { status: bulkStatus },
      });
    });

    setSelectedInjuries(new Set());
  };

  const toggleInjurySelection = (injuryId: string) => {
    const newSelection = new Set(selectedInjuries);
    if (newSelection.has(injuryId)) {
      newSelection.delete(injuryId);
    } else {
      newSelection.add(injuryId);
    }
    setSelectedInjuries(newSelection);
  };

  const getAffectedPicksForInjury = (injury: InjuryUpdate): Pick[] => {
    if (!picksData?.picks) return [];
    return picksData.picks.filter((pick: Pick) =>
      injury.affectedPicks.includes(pick.id)
    );
  };

  const injuries: InjuryUpdate[] = injuriesData?.injuries || [];
  const filteredInjuries = playerSearch
    ? injuries.filter((injury) =>
        injury.playerName.toLowerCase().includes(playerSearch.toLowerCase())
      )
    : injuries;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Injury Manager</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {showAddForm ? 'Cancel' : '+ Add Injury'}
        </button>
      </div>

      {/* Add Injury Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Injury Update</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Report *
                </label>
                <select
                  value={selectedReportId}
                  onChange={(e) => setSelectedReportId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select a report</option>
                  {reportsData?.reports?.map((report: any) => (
                    <option key={report.id} value={report.id}>
                      {report.sport} - {new Date(report.generated_at).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Player Name *
                </label>
                <input
                  type="text"
                  value={formData.playerName}
                  onChange={(e) => setFormData({ ...formData, playerName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Patrick Mahomes"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Player ID *
                </label>
                <input
                  type="text"
                  value={formData.playerId}
                  onChange={(e) => setFormData({ ...formData, playerId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., player_123"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Team</label>
                <input
                  type="text"
                  value={formData.team}
                  onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Kansas City Chiefs"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as InjuryStatus })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {INJURY_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Impact *
                </label>
                <select
                  value={formData.impact}
                  onChange={(e) => setFormData({ ...formData, impact: e.target.value as InjuryImpact })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {INJURY_IMPACTS.map((impact) => (
                    <option key={impact} value={impact}>
                      {impact.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Injury Type *
                </label>
                <input
                  type="text"
                  value={formData.injuryType}
                  onChange={(e) => setFormData({ ...formData, injuryType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Hamstring, Torn ACL, Concussion"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Details
                </label>
                <textarea
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Additional details about the injury..."
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={createInjuryMutation.isPending}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {createInjuryMutation.isPending ? 'Adding...' : 'Add Injury'}
              </button>
              {(formData.status === 'out' || formData.status === 'season-ending') && (
                <p className="text-sm text-orange-600 font-medium">
                  ⚠️ Critical injuries will automatically flag affected picks
                </p>
              )}
            </div>

            {createInjuryMutation.isError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800 text-sm">
                  {createInjuryMutation.error instanceof Error
                    ? createInjuryMutation.error.message
                    : 'Failed to add injury'}
                </p>
              </div>
            )}
          </form>
        </div>
      )}

      {/* Filters and Bulk Actions */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Report
            </label>
            <select
              value={filterReportId}
              onChange={(e) => setFilterReportId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Reports</option>
              {reportsData?.reports?.map((report: any) => (
                <option key={report.id} value={report.id}>
                  {report.sport} - {new Date(report.generated_at).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as InjuryStatus | 'all')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              {INJURY_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Player
            </label>
            <input
              type="text"
              value={playerSearch}
              onChange={(e) => setPlayerSearch(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search by name..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bulk Actions
            </label>
            <div className="flex gap-2">
              <select
                value={bulkStatus}
                onChange={(e) => setBulkStatus(e.target.value as InjuryStatus)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {INJURY_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status.toUpperCase()}
                  </option>
                ))}
              </select>
              <button
                onClick={handleBulkStatusUpdate}
                disabled={selectedInjuries.size === 0 || updateInjuryMutation.isPending}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm"
              >
                Update ({selectedInjuries.size})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Injuries List */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">
            Tracked Injuries ({filteredInjuries.length})
          </h3>
          {selectedInjuries.size > 0 && (
            <button
              onClick={() => setSelectedInjuries(new Set())}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Clear Selection
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredInjuries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No injuries found</p>
            <p className="text-sm text-gray-500 mt-1">
              {showAddForm ? 'Fill out the form above to add an injury' : 'Click "Add Injury" to get started'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredInjuries.map((injury) => {
              const affectedPicks = getAffectedPicksForInjury(injury);
              const isSelected = selectedInjuries.has(injury.id);

              return (
                <div
                  key={injury.id}
                  className={`p-4 border-l-4 rounded ${getInjuryColor(injury.impact)} ${
                    isSelected ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleInjurySelection(injury.id)}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-bold text-lg">{injury.playerName}</h4>
                        {injury.team && (
                          <span className="text-sm text-gray-600">({injury.team})</span>
                        )}
                        <span
                          className={`px-2 py-1 text-xs font-bold rounded ${getStatusBadgeColor(
                            injury.status
                          )}`}
                        >
                          {injury.status.toUpperCase()}
                        </span>
                        <span className="px-2 py-1 text-xs font-medium bg-white rounded border border-gray-300">
                          {injury.impact.toUpperCase()} IMPACT
                        </span>
                      </div>

                      <p className="text-sm mb-1">
                        <span className="font-medium">Injury:</span> {injury.injuryType}
                      </p>

                      {injury.details && (
                        <p className="text-sm mb-2 text-gray-700">{injury.details}</p>
                      )}

                      <div className="flex items-center gap-4 text-xs text-gray-600 mb-2">
                        <span>Player ID: {injury.playerId}</span>
                        <span>Reported: {new Date(injury.reportedAt).toLocaleString()}</span>
                      </div>

                      {injury.affectedPicks.length > 0 && (
                        <div className="mt-3 p-3 bg-white bg-opacity-50 rounded border border-gray-300">
                          <p className="text-sm font-bold mb-2">
                            ⚠️ Affects {injury.affectedPicks.length} pick(s)
                          </p>
                          {affectedPicks.length > 0 && (
                            <div className="space-y-1">
                              {affectedPicks.map((pick) => (
                                <div
                                  key={pick.id}
                                  className="text-xs text-gray-700 flex items-center gap-2"
                                >
                                  <span className="font-medium">{pick.matchup}</span>
                                  <span className="text-gray-500">
                                    ({pick.betType} - {pick.hierarchy})
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Quick Status Update */}
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-xs text-gray-600">Quick update:</span>
                        {INJURY_STATUSES.map((status) => (
                          <button
                            key={status}
                            onClick={() =>
                              updateInjuryMutation.mutate({
                                injuryId: injury.id,
                                data: { status },
                              })
                            }
                            disabled={
                              injury.status === status || updateInjuryMutation.isPending
                            }
                            className={`px-2 py-1 text-xs rounded transition-colors ${
                              injury.status === status
                                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
