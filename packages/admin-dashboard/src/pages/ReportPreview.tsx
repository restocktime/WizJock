import { useParams } from 'react-router-dom';
import { useGetReports } from '../hooks/useReports';


export const ReportPreview = () => {
    const { id } = useParams<{ id: string }>();
    // We can reuse useGetReports or fetch specific report. 
    // For now, let's assume we can filter or get it. 
    // Actually, useGetReports gets a list. We might need a specific hook or just find it in the list if cached.
    // But for a standalone preview page, we should probably fetch it.
    // Let's mock the fetch for now or use the existing hook if it supports ID.
    // Looking at Reports.tsx, it uses useGetReports(selectedSport).

    // Ideally we should have useGetReport(id).
    // I will implement a simple fetch for this preview.

    const { data: reports } = useGetReports(undefined, undefined, 100); // Fetch recent reports to find it
    const report = reports?.find(r => r.id === id);

    if (!report) {
        return <div className="p-8 text-center">Loading preview... (or report not found in recent cache)</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
                <div className="bg-gray-900 text-white p-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">CLIENT VIEW PREVIEW</h1>
                        <p className="text-gray-400 text-sm">This is how the data will appear to users</p>
                    </div>
                    <div className="px-3 py-1 bg-yellow-500 text-black font-bold rounded text-xs">
                        {report.status.toUpperCase()}
                    </div>
                </div>

                <div className="p-8 space-y-8">
                    {/* Header */}
                    <div className="flex items-center gap-4 border-b pb-6">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-bold text-gray-500">
                            {report.sport[0]}
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-gray-900">{report.sport} INTELLIGENCE</h2>
                            <p className="text-gray-500">{new Date(report.generatedAt).toLocaleDateString()} • Daily Report</p>
                        </div>
                    </div>

                    {/* Picks */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-gray-800">OFFICIAL PICKS</h3>
                        <div className="grid gap-6">
                            {report.picks.map(pick => (
                                <div key={pick.id} className="border rounded-lg p-6 bg-gray-50 relative overflow-hidden">
                                    <div className={`absolute top-0 left-0 w-1 h-full ${pick.hierarchy === 'lock' ? 'bg-yellow-500' :
                                        pick.hierarchy === 'featured' ? 'bg-blue-500' : 'bg-gray-300'
                                        }`} />

                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${pick.hierarchy === 'lock' ? 'bg-yellow-100 text-yellow-800' :
                                                    pick.hierarchy === 'featured' ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-700'
                                                    }`}>
                                                    {pick.hierarchy}
                                                </span>
                                                <span className="text-xs font-bold text-gray-500">{pick.betType}</span>
                                            </div>
                                            <h4 className="text-xl font-bold">{pick.matchup}</h4>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-black text-gray-900">{pick.currentOdds}</div>
                                            <div className="text-xs text-gray-500">{pick.units} Units</div>
                                        </div>
                                    </div>

                                    <div className="bg-white p-4 rounded border border-gray-200 mb-4">
                                        <p className="font-bold text-gray-900 mb-1">Recommendation</p>
                                        <p className="text-lg text-blue-600 font-bold">{pick.recommendation}</p>
                                    </div>

                                    <p className="text-gray-700 text-sm leading-relaxed">{pick.reasoning}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
