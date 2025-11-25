import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { Sport, BetType, PickHierarchy } from '../types';

interface PerformanceData {
  success: boolean;
  overall: {
    total: number;
    wins: number;
    losses: number;
    pushes: number;
    winRate: number;
    lossRate: number;
    pushRate: number;
  };
  bySport: Record<
    string,
    {
      total: number;
      wins: number;
      losses: number;
      pushes: number;
      winRate: number;
    }
  >;
  byBetType: Record<
    string,
    {
      total: number;
      wins: number;
      losses: number;
      pushes: number;
      winRate: number;
    }
  >;
  byHierarchy: Record<
    string,
    {
      total: number;
      wins: number;
      losses: number;
      pushes: number;
      winRate: number;
    }
  >;
  trends: Array<{
    week: string;
    total: number;
    wins: number;
    losses: number;
    pushes: number;
    winRate: number;
  }>;
}

const fetchPerformance = async (params: {
  sport?: Sport;
  startDate?: string;
  endDate?: string;
  betType?: BetType;
  hierarchy?: PickHierarchy;
}): Promise<PerformanceData> => {
  const queryParams = new URLSearchParams();
  if (params.sport) queryParams.append('sport', params.sport);
  if (params.startDate) queryParams.append('startDate', params.startDate);
  if (params.endDate) queryParams.append('endDate', params.endDate);
  if (params.betType) queryParams.append('betType', params.betType);
  if (params.hierarchy) queryParams.append('hierarchy', params.hierarchy);

  const response = await axios.get(
    `/api/admin/performance?${queryParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );
  return response.data;
};

export const Performance = () => {
  const [selectedSport, setSelectedSport] = useState<Sport | ''>('');
  const [selectedBetType, setSelectedBetType] = useState<BetType | ''>('');
  const [selectedHierarchy, setSelectedHierarchy] = useState<PickHierarchy | ''>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['performance', selectedSport, startDate, endDate, selectedBetType, selectedHierarchy],
    queryFn: () =>
      fetchPerformance({
        sport: selectedSport || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        betType: selectedBetType || undefined,
        hierarchy: selectedHierarchy || undefined,
      }),
  });

  const exportData = () => {
    if (!data) return;

    const csvContent = [
      ['Performance Report'],
      [''],
      ['Overall Statistics'],
      ['Metric', 'Value'],
      ['Total Picks', data.overall.total],
      ['Wins', data.overall.wins],
      ['Losses', data.overall.losses],
      ['Pushes', data.overall.pushes],
      ['Win Rate', `${data.overall.winRate.toFixed(2)}%`],
      ['Loss Rate', `${data.overall.lossRate.toFixed(2)}%`],
      ['Push Rate', `${data.overall.pushRate.toFixed(2)}%`],
      [''],
      ['By Sport'],
      ['Sport', 'Total', 'Wins', 'Losses', 'Pushes', 'Win Rate'],
      ...Object.entries(data.bySport).map(([sport, stats]) => [
        sport,
        stats.total,
        stats.wins,
        stats.losses,
        stats.pushes,
        `${stats.winRate.toFixed(2)}%`,
      ]),
      [''],
      ['By Bet Type'],
      ['Bet Type', 'Total', 'Wins', 'Losses', 'Pushes', 'Win Rate'],
      ...Object.entries(data.byBetType).map(([betType, stats]) => [
        betType,
        stats.total,
        stats.wins,
        stats.losses,
        stats.pushes,
        `${stats.winRate.toFixed(2)}%`,
      ]),
      [''],
      ['By Hierarchy'],
      ['Hierarchy', 'Total', 'Wins', 'Losses', 'Pushes', 'Win Rate'],
      ...Object.entries(data.byHierarchy).map(([hierarchy, stats]) => [
        hierarchy,
        stats.total,
        stats.wins,
        stats.losses,
        stats.pushes,
        `${stats.winRate.toFixed(2)}%`,
      ]),
      [''],
      ['Weekly Trends'],
      ['Week', 'Total', 'Wins', 'Losses', 'Pushes', 'Win Rate'],
      ...data.trends.map((trend) => [
        trend.week,
        trend.total,
        trend.wins,
        trend.losses,
        trend.pushes,
        `${trend.winRate.toFixed(2)}%`,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Performance Tracker</h2>
        {data && (
          <button
            onClick={exportData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Export Data
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Sport Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sport
            </label>
            <select
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value as Sport | '')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Sports</option>
              <option value="NFL">NFL</option>
              <option value="NCAA">NCAA</option>
              <option value="NBA">NBA</option>
              <option value="UFC">UFC</option>
            </select>
          </div>

          {/* Bet Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bet Type
            </label>
            <select
              value={selectedBetType}
              onChange={(e) => setSelectedBetType(e.target.value as BetType | '')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="moneyline">Money Line</option>
              <option value="spread">Spread</option>
              <option value="overunder">Over/Under</option>
              <option value="playerprop">Player Props</option>
            </select>
          </div>

          {/* Hierarchy Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hierarchy
            </label>
            <select
              value={selectedHierarchy}
              onChange={(e) => setSelectedHierarchy(e.target.value as PickHierarchy | '')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Hierarchies</option>
              <option value="lock">Lock of the Week</option>
              <option value="featured">Featured</option>
              <option value="high">High Confidence</option>
              <option value="medium">Medium Confidence</option>
              <option value="value">Value Plays</option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Loading performance data...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800">
            Error loading performance data. Please try again.
          </p>
        </div>
      )}

      {/* Performance Data */}
      {data && (
        <>
          {/* Overall Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Total Picks</h3>
              <p className="text-3xl font-bold text-gray-900">{data.overall.total}</p>
            </div>
            <div className="bg-green-50 rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-green-700 mb-2">Wins</h3>
              <p className="text-3xl font-bold text-green-900">{data.overall.wins}</p>
              <p className="text-sm text-green-600 mt-1">
                {data.overall.winRate.toFixed(1)}%
              </p>
            </div>
            <div className="bg-red-50 rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-red-700 mb-2">Losses</h3>
              <p className="text-3xl font-bold text-red-900">{data.overall.losses}</p>
              <p className="text-sm text-red-600 mt-1">
                {data.overall.lossRate.toFixed(1)}%
              </p>
            </div>
            <div className="bg-yellow-50 rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-yellow-700 mb-2">Pushes</h3>
              <p className="text-3xl font-bold text-yellow-900">{data.overall.pushes}</p>
              <p className="text-sm text-yellow-600 mt-1">
                {data.overall.pushRate.toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Performance by Sport */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Performance by Sport
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sport
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Wins
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Losses
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pushes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Win Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(data.bySport).map(([sport, stats]) => (
                    <tr key={sport}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {sport}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {stats.total}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                        {stats.wins}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                        {stats.losses}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">
                        {stats.pushes}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {stats.winRate.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Performance by Bet Type */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Performance by Bet Type
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bet Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Wins
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Losses
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pushes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Win Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(data.byBetType).map(([betType, stats]) => (
                    <tr key={betType}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                        {betType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {stats.total}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                        {stats.wins}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                        {stats.losses}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">
                        {stats.pushes}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {stats.winRate.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Performance by Hierarchy */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Performance by Hierarchy (Locks vs Value Plays)
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hierarchy
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Wins
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Losses
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pushes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Win Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(data.byHierarchy).map(([hierarchy, stats]) => (
                    <tr key={hierarchy}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                        {hierarchy === 'lock' && '🔒 Lock of the Week'}
                        {hierarchy === 'featured' && '⭐ Featured'}
                        {hierarchy === 'high' && 'High Confidence'}
                        {hierarchy === 'medium' && 'Medium Confidence'}
                        {hierarchy === 'value' && '💎 Value Play'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {stats.total}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                        {stats.wins}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                        {stats.losses}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">
                        {stats.pushes}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {stats.winRate.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Accuracy Trends Chart */}
          {data.trends.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Accuracy Trends Over Time
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data.trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="week"
                    label={{ value: 'Week', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis
                    label={{ value: 'Win Rate (%)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => {
                      if (name === 'winRate') return `${value.toFixed(1)}%`;
                      return value;
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="winRate"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Win Rate"
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="wins"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Wins"
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="losses"
                    stroke="#ef4444"
                    strokeWidth={2}
                    name="Losses"
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {data.trends.length === 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-center">
                No trend data available. Add pick outcomes to see trends over time.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
