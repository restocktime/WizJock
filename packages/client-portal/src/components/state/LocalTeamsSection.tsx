import { StateData } from '../../data/statesData';

interface LocalTeamsSectionProps {
  stateData: StateData;
}

export default function LocalTeamsSection({ stateData }: LocalTeamsSectionProps) {
  const { proTeams, name, popularSports } = stateData;
  const hasTeams = Object.values(proTeams).some(teams => teams && teams.length > 0);

  if (!hasTeams) {
    return null;
  }

  return (
    <section className="py-12 sm:py-16 px-4 bg-black" aria-label={`${name} sports teams`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-4">
            YOUR {name.toUpperCase()} TEAMS
          </h2>
          <p className="text-base sm:text-lg text-gray-400">
            We cover all your favorite {name} teams with expert analysis and winning picks
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {proTeams.nfl && proTeams.nfl.length > 0 && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">🏈</div>
                <h3 className="text-xl font-bold text-orange-400">NFL</h3>
              </div>
              <ul className="space-y-2">
                {proTeams.nfl.map((team, idx) => (
                  <li key={idx} className="text-gray-300 text-sm">{team}</li>
                ))}
              </ul>
            </div>
          )}

          {proTeams.nba && proTeams.nba.length > 0 && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">🏀</div>
                <h3 className="text-xl font-bold text-orange-400">NBA</h3>
              </div>
              <ul className="space-y-2">
                {proTeams.nba.map((team, idx) => (
                  <li key={idx} className="text-gray-300 text-sm">{team}</li>
                ))}
              </ul>
            </div>
          )}

          {proTeams.mlb && proTeams.mlb.length > 0 && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">⚾</div>
                <h3 className="text-xl font-bold text-blue-400">MLB</h3>
              </div>
              <ul className="space-y-2">
                {proTeams.mlb.map((team, idx) => (
                  <li key={idx} className="text-gray-300 text-sm">{team}</li>
                ))}
              </ul>
            </div>
          )}

          {proTeams.nhl && proTeams.nhl.length > 0 && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">🏒</div>
                <h3 className="text-xl font-bold text-cyan-400">NHL</h3>
              </div>
              <ul className="space-y-2">
                {proTeams.nhl.map((team, idx) => (
                  <li key={idx} className="text-gray-300 text-sm">{team}</li>
                ))}
              </ul>
            </div>
          )}

          {proTeams.ncaa && proTeams.ncaa.length > 0 && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">🎓</div>
                <h3 className="text-xl font-bold text-green-400">NCAA</h3>
              </div>
              <ul className="space-y-2">
                {proTeams.ncaa.map((team, idx) => (
                  <li key={idx} className="text-gray-300 text-sm">{team}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {popularSports && popularSports.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Popular sports in {name}: <span className="text-cyan-400 font-semibold">{popularSports.join(', ')}</span>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
