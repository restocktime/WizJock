import { useState, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import type {
  IntelligenceUpdate,
  IntelligenceUpdateType,
  IntelligenceSourceType,
  CreateIntelligenceRequest,
} from '../types';

const UPDATE_TYPES: IntelligenceUpdateType[] = [
  'training',
  'weight-cut',
  'personal',
  'lineup',
  'other',
];

const SOURCE_TYPES: IntelligenceSourceType[] = [
  'official',
  'verified-social',
  'media',
  'forum',
  'insider',
];

const getCredibilityRating = (sourceType: IntelligenceSourceType): number => {
  const ratings = {
    official: 95,
    'verified-social': 85,
    media: 80,
    forum: 70,
    insider: 75,
  };
  return ratings[sourceType];
};

const getCredibilityColor = (rating: number) => {
  if (rating >= 90) return 'bg-green-100 border-green-500 text-green-900';
  if (rating >= 80) return 'bg-blue-100 border-blue-500 text-blue-900';
  if (rating >= 70) return 'bg-yellow-100 border-yellow-500 text-yellow-900';
  return 'bg-red-100 border-red-500 text-red-900';
};

const getSourceBadgeColor = (sourceType: IntelligenceSourceType) => {
  const colors = {
    official: 'bg-green-600 text-white',
    'verified-social': 'bg-blue-600 text-white',
    media: 'bg-purple-600 text-white',
    forum: 'bg-orange-600 text-white',
    insider: 'bg-indigo-600 text-white',
  };
  return colors[sourceType];
};

const isNewIntelligence = (reportedAt: Date): boolean => {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return new Date(reportedAt) > twentyFourHoursAgo;
};

export const Intelligence = () => {
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string>('');
  const [credibilityThreshold, setCredibilityThreshold] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [filterReportId, setFilterReportId] = useState<string>('');

  // Form state
  const [formData, setFormData] = useState({
    entityId: '',
    entityName: '',
    updateType: 'other' as IntelligenceUpdateType,
    content: '',
    source: '',
    sourceType: 'media' as IntelligenceSourceType,
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

  // Fetch intelligence updates with filters
  const { data: intelligenceData, isLoading } = useQuery({
    queryKey: ['intelligence', filterReportId, credibilityThreshold],
    queryFn: async () => {
      const params: any = {};
      if (filterReportId) params.reportId = filterReportId;
      if (credibilityThreshold > 0) params.minCredibility = credibilityThreshold;

      const response = await axios.get('/api/admin/intelligence', { params });
      return response.data;
    },
  });

  // Create intelligence mutation
  const createIntelligenceMutation = useMutation({
    mutationFn: async (data: CreateIntelligenceRequest) => {
      const response = await axios.post('/api/admin/intelligence', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['intelligence'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      setShowAddForm(false);
      resetForm();
    },
  });

  const resetForm = () => {
    setFormData({
      entityId: '',
      entityName: '',
      updateType: 'other',
      content: '',
      source: '',
      sourceType: 'media',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReportId) {
      alert('Please select a report');
      return;
    }

    createIntelligenceMutation.mutate({
      reportId: selectedReportId,
      ...formData,
    });
  };

  const toggleTag = (tag: string) => {
    const newTags = new Set(selectedTags);
    if (newTags.has(tag)) {
      newTags.delete(tag);
    } else {
      newTags.add(tag);
    }
    setSelectedTags(newTags);
  };

  const intelligence: IntelligenceUpdate[] = intelligenceData?.updates || [];

  // Filter by search query
  const searchFiltered = useMemo(() => {
    if (!searchQuery) return intelligence;
    const query = searchQuery.toLowerCase();
    return intelligence.filter(
      (intel) =>
        intel.entityName.toLowerCase().includes(query) ||
        intel.content.toLowerCase().includes(query) ||
        intel.source.toLowerCase().includes(query)
    );
  }, [intelligence, searchQuery]);

  // Filter by tags (update types)
  const tagFiltered = useMemo(() => {
    if (selectedTags.size === 0) return searchFiltered;
    return searchFiltered.filter((intel) => selectedTags.has(intel.updateType));
  }, [searchFiltered, selectedTags]);

  // Group by entity
  const groupedIntelligence = useMemo(() => {
    const groups: Record<string, IntelligenceUpdate[]> = {};
    tagFiltered.forEach((intel) => {
      if (!groups[intel.entityName]) {
        groups[intel.entityName] = [];
      }
      groups[intel.entityName].push(intel);
    });
    // Sort each group by credibility rating (highest first)
    Object.keys(groups).forEach((key) => {
      groups[key].sort((a, b) => b.credibilityRating - a.credibilityRating);
    });
    return groups;
  }, [tagFiltered]);

  // Get all unique tags from intelligence updates
  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    intelligence.forEach((intel) => tags.add(intel.updateType));
    return Array.from(tags).sort();
  }, [intelligence]);

  const credibilityRating = getCredibilityRating(formData.sourceType);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Intelligence Hub</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {showAddForm ? 'Cancel' : '+ Add Intelligence'}
        </button>
      </div>

      {/* Add Intelligence Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Intelligence Update</h3>
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
                  Player/Fighter Name *
                </label>
                <input
                  type="text"
                  value={formData.entityName}
                  onChange={(e) => setFormData({ ...formData, entityName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Conor McGregor"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Entity ID *
                </label>
                <input
                  type="text"
                  value={formData.entityId}
                  onChange={(e) => setFormData({ ...formData, entityId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., fighter_123"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Update Type *
                </label>
                <select
                  value={formData.updateType}
                  onChange={(e) =>
                    setFormData({ ...formData, updateType: e.target.value as IntelligenceUpdateType })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {UPDATE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type.toUpperCase().replace('-', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Source Type *
                </label>
                <select
                  value={formData.sourceType}
                  onChange={(e) =>
                    setFormData({ ...formData, sourceType: e.target.value as IntelligenceSourceType })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {SOURCE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type.toUpperCase().replace('-', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Source Name *
                </label>
                <input
                  type="text"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., ESPN, @ArielHelwani, UFC.com"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Intelligence Content *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  placeholder="Detailed intelligence information..."
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={createIntelligenceMutation.isPending}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {createIntelligenceMutation.isPending ? 'Adding...' : 'Add Intelligence'}
              </button>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Auto-assigned credibility:</span>
                <span
                  className={`px-3 py-1 text-sm font-bold rounded ${getCredibilityColor(
                    credibilityRating
                  )}`}
                >
                  {credibilityRating}%
                </span>
              </div>
            </div>

            {createIntelligenceMutation.isError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800 text-sm">
                  {createIntelligenceMutation.error instanceof Error
                    ? createIntelligenceMutation.error.message
                    : 'Failed to add intelligence'}
                </p>
              </div>
            )}
          </form>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-4 gap-4 mb-4">
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
              Credibility Threshold
            </label>
            <select
              value={credibilityThreshold}
              onChange={(e) => setCredibilityThreshold(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="0">All Sources</option>
              <option value="80">80%+ (High Quality)</option>
              <option value="85">85%+ (Very High Quality)</option>
              <option value="90">90%+ (Official Only)</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search by player/fighter name, content, or source..."
            />
          </div>
        </div>

        {/* Tag Filters */}
        {availableTags.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Type
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    selectedTags.has(tag)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {tag.replace('-', ' ')}
                </button>
              ))}
              {selectedTags.size > 0 && (
                <button
                  onClick={() => setSelectedTags(new Set())}
                  className="px-3 py-1 text-sm text-red-600 hover:text-red-700 underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Intelligence List */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Intelligence Updates ({tagFiltered.length})
        </h3>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : Object.keys(groupedIntelligence).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No intelligence updates found</p>
            <p className="text-sm text-gray-500 mt-1">
              {showAddForm
                ? 'Fill out the form above to add intelligence'
                : 'Click "Add Intelligence" to get started'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedIntelligence).map(([entityName, updates]) => (
              <div key={entityName} className="border border-gray-200 rounded-lg p-4">
                <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span>{entityName}</span>
                  <span className="text-sm font-normal text-gray-500">
                    ({updates.length} update{updates.length !== 1 ? 's' : ''})
                  </span>
                </h4>

                <div className="space-y-3">
                  {updates.map((intel) => {
                    const isNew = isNewIntelligence(intel.reportedAt);

                    return (
                      <div
                        key={intel.id}
                        className={`p-4 border-l-4 rounded ${getCredibilityColor(
                          intel.credibilityRating
                        )}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`px-2 py-1 text-xs font-bold rounded ${getSourceBadgeColor(
                                intel.sourceType
                              )}`}
                            >
                              {intel.sourceType.toUpperCase().replace('-', ' ')}
                            </span>
                            <span className="px-2 py-1 text-xs font-medium bg-white rounded border border-gray-300">
                              {intel.updateType.toUpperCase().replace('-', ' ')}
                            </span>
                            <span
                              className={`px-3 py-1 text-xs font-bold rounded ${getCredibilityColor(
                                intel.credibilityRating
                              )}`}
                            >
                              {intel.credibilityRating}% CREDIBILITY
                            </span>
                            {isNew && (
                              <span className="px-2 py-1 text-xs font-bold bg-red-600 text-white rounded animate-pulse">
                                NEW
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-sm mb-2 text-gray-900">{intel.content}</p>

                        <div className="flex items-center gap-4 text-xs text-gray-600">
                          <span>
                            <span className="font-medium">Source:</span> {intel.source}
                          </span>
                          <span>
                            <span className="font-medium">Entity ID:</span> {intel.entityId}
                          </span>
                          <span>
                            <span className="font-medium">Reported:</span>{' '}
                            {new Date(intel.reportedAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
