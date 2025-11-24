import { Link } from 'react-router-dom';
import { StateData, getStateData } from '../../data/statesData';

interface NearbyStatesLinksProps {
  stateData: StateData;
}

export default function NearbyStatesLinks({ stateData }: NearbyStatesLinksProps) {
  const { name, nearbyStates } = stateData;

  if (!nearbyStates || nearbyStates.length === 0) {
    return null;
  }

  // Get full state data for nearby states
  const nearbyStateData = nearbyStates
    .map(slug => getStateData(slug))
    .filter((state): state is StateData => state !== null)
    .slice(0, 5); // Limit to 5 nearby states

  if (nearbyStateData.length === 0) {
    return null;
  }

  return (
    <section className="py-12 sm:py-16 px-4 bg-black" aria-label="Nearby states">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-4">
            NEARBY STATES
          </h2>
          <p className="text-base sm:text-lg text-gray-400">
            We also serve bettors in states near {name}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {nearbyStateData.map((nearbyState) => {
            const legalStatusColor = nearbyState.legalStatus === 'legal' ? 'text-green-400' : 
                                     nearbyState.legalStatus === 'pending' ? 'text-yellow-400' : 
                                     'text-gray-400';
            const legalStatusText = nearbyState.legalStatus === 'legal' ? 'Legal' : 
                                   nearbyState.legalStatus === 'pending' ? 'Pending' : 
                                   'Not Yet Legal';

            return (
              <Link
                key={nearbyState.slug}
                to={`/locations/${nearbyState.slug}`}
                className="bg-gray-800/50 border border-gray-700 hover:border-cyan-500/50 rounded-xl p-6 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {nearbyState.name}
                  </h3>
                  <span className="text-2xl">→</span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Sports Betting:</span>
                    <span className={`font-semibold ${legalStatusColor}`}>{legalStatusText}</span>
                  </div>
                  
                  {nearbyState.memberCount && nearbyState.memberCount > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Members:</span>
                      <span className="font-semibold text-cyan-400">{nearbyState.memberCount}</span>
                    </div>
                  )}

                  {nearbyState.proTeams && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Pro Teams:</span>
                      <span className="font-semibold text-blue-400">
                        {(nearbyState.proTeams.nfl?.length || 0) + 
                         (nearbyState.proTeams.nba?.length || 0) + 
                         (nearbyState.proTeams.mlb?.length || 0) + 
                         (nearbyState.proTeams.nhl?.length || 0)}
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-sm text-gray-400 line-clamp-2">
                  {nearbyState.localInsights || `Professional sports betting analysis for ${nearbyState.name} bettors.`}
                </p>

                <div className="mt-4 pt-4 border-t border-gray-700">
                  <span className="text-sm text-cyan-400 group-hover:text-cyan-300 font-semibold">
                    View {nearbyState.name} Page →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link 
            to="/locations"
            className="inline-block text-cyan-400 hover:text-cyan-300 font-semibold text-sm"
          >
            View All 50 States →
          </Link>
        </div>
      </div>
    </section>
  );
}
