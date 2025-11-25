import { useState } from 'react';
import type { Sport, ReportStatus, Report } from '../types';
import { useGetReports, usePublishReport } from '../hooks/useReports';
import { useUnpublishReport } from '../hooks/useUnpublishReport';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  confirmColor: 'green' | 'red';
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmLabel,
  confirmColor,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  if (!isOpen) return null;

  const colorClasses = {
    green: 'bg-green-600 hover:bg-green-700',
    red: 'bg-red-600 hover:bg-red-700',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 text-white rounded-md transition-colors ${colorClasses[confirmColor]}`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Publishing = () => {
  const [selectedTab, setSelectedTab] = useState<'draft' | 'published' | 'history'>('draft');
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: 'publish' | 'unpublish';
    reportId: string;
    sport: Sport;
  }>({
    isOpen: false,
    type: 'publish',
    reportId: '',
    sport: 'NFL',
  });

  // Fetch draft reports
  const { data: draftReports, isLoading: loadingDrafts } = useGetReports(undefined, 'draft', 50);

  // Fetch published reports
  const { data: publishedReports, isLoading: loadingPublished } = useGetReports(undefined, 'published', 50);

  // Fetch publication history (all reports)
  const { data: historyReports, isLoading: loadingHistory } = useGetReports(undefined, undefined, 100);

  // Publish mutation
  const publishMutation = usePublishReport(() => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
  });

  // Unpublish mutation
  const unpublishMutation = useUnpublishReport(() => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
  });

  const handlePublishClick = (reportId: string, sport: Sport) => {
    setConfirmDialog({
      isOpen: true,
      type: 'publish',
      reportId,
      sport,
    });
  };

  const handleUnpublishClick = (reportId: string, sport: Sport) => {
    setConfirmDialog({
      isOpen: true,
      type: 'unpublish',
      reportId,
      sport,
    });
  };

  const handleConfirm = () => {
    if (confirmDialog.type === 'publish') {
      publishMutation.mutate(confirmDialog.reportId);
    } else {
      unpublishMutation.mutate(confirmDialog.reportId);
    }
  };

  const handleCancel = () => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
  };

  const getStatusBadge = (status: ReportStatus) => {
    const badges = {
      draft: { label: 'DRAFT', color: 'bg-gray-500 text-white' },
      published: { label: 'PUBLISHED', color: 'bg-green-500 text-white' },
      unpublished: { label: 'UNPUBLISHED', color: 'bg-red-500 text-white' },
    };
    return badges[status];
  };

  const formatDate = (dateString: Date | string) => {
    return new Date(dateString).toLocaleString();
  };

  const renderReportCard = (report: Report, showActions: boolean) => {
    const badge = getStatusBadge(report.status);

    return (
      <div key={report.id} className="p-5 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-bold text-gray-900">{report.sport}</h3>
              <span className={`px-3 py-1 text-xs font-bold rounded ${badge.color}`}>
                {badge.label}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Generated: {formatDate(report.generatedAt)}
            </p>
            {/* Published info would need to be added to Report type if needed */}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded">
          <div>
            <p className="text-xs text-gray-600">Picks</p>
            <p className="text-lg font-bold text-gray-900">{report.pick_count || report.picks?.length || 0}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Injuries</p>
            <p className="text-lg font-bold text-gray-900">{report.injury_count || report.injuries?.length || 0}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Intelligence</p>
            <p className="text-lg font-bold text-gray-900">{report.intelligence_count || report.intelligenceUpdates?.length || 0}</p>
          </div>
        </div>

        {showActions && (
          <div className="flex gap-2">
            {report.status === 'draft' && (
              <button
                onClick={() => handlePublishClick(report.id, report.sport)}
                disabled={publishMutation.isPending}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {publishMutation.isPending ? 'Publishing...' : 'Publish'}
              </button>
            )}
            {report.status === 'published' && (
              <button
                onClick={() => handleUnpublishClick(report.id, report.sport)}
                disabled={unpublishMutation.isPending}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {unpublishMutation.isPending ? 'Unpublishing...' : 'Unpublish'}
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Publishing Control</h2>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setSelectedTab('draft')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${selectedTab === 'draft'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Draft Reports
              {draftReports && draftReports.length > 0 && (
                <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full">
                  {draftReports.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setSelectedTab('published')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${selectedTab === 'published'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Published Reports
              {publishedReports && publishedReports.length > 0 && (
                <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-600 rounded-full">
                  {publishedReports.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setSelectedTab('history')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${selectedTab === 'history'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Publication History
            </button>
          </nav>
        </div>
      </div>

      {/* Draft Reports Tab */}
      {selectedTab === 'draft' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Draft Reports</h3>
          {loadingDrafts ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : draftReports && draftReports.length > 0 ? (
            <div className="space-y-4">
              {draftReports.map((report) => renderReportCard(report, true))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No draft reports available</p>
              <p className="text-sm text-gray-400 mt-2">
                Generate a new report from the Reports page
              </p>
            </div>
          )}
        </div>
      )}

      {/* Published Reports Tab */}
      {selectedTab === 'published' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Currently Published Reports</h3>
          {loadingPublished ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : publishedReports && publishedReports.length > 0 ? (
            <div className="space-y-4">
              {publishedReports.map((report) => renderReportCard(report, true))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No published reports</p>
              <p className="text-sm text-gray-400 mt-2">
                Publish a draft report to make it visible to clients
              </p>
            </div>
          )}
        </div>
      )}

      {/* Publication History Tab */}
      {selectedTab === 'history' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Publication History</h3>
          {loadingHistory ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : historyReports && historyReports.length > 0 ? (
            <div className="space-y-4">
              {historyReports.map((report) => renderReportCard(report, false))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No reports found</p>
            </div>
          )}
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={
          confirmDialog.type === 'publish'
            ? 'Publish Report'
            : 'Unpublish Report'
        }
        message={
          confirmDialog.type === 'publish'
            ? `Are you sure you want to publish this ${confirmDialog.sport} report? This will unpublish any currently published ${confirmDialog.sport} report and make this report visible to clients.`
            : `Are you sure you want to unpublish this ${confirmDialog.sport} report? Clients will no longer be able to see these picks.`
        }
        confirmLabel={confirmDialog.type === 'publish' ? 'Publish' : 'Unpublish'}
        confirmColor={confirmDialog.type === 'publish' ? 'green' : 'red'}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
};
