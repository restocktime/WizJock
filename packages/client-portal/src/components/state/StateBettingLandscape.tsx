import { StateData } from '../../data/statesData';

interface StateBettingLandscapeProps {
  stateData: StateData;
}

export default function StateBettingLandscape({ stateData }: StateBettingLandscapeProps) {
  const { name, legalStatus, legalSince, legalDetails, popularSports } = stateData;

  const statusConfig = {
    legal: {
      color: 'from-green-900/30 to-emerald-900/30',
      borderColor: 'border-green-500/30',
      textColor: 'text-green-400',
      icon: '✅',
      title: 'Legal Sports Betting',
    },
    pending: {
      color: 'from-yellow-900/30 to-orange-900/30',
      borderColor: 'border-yellow-500/30',
      textColor: 'text-yellow-400',
      icon: '⏳',
      title: 'Pending Legislation',
    },
    illegal: {
      color: 'from-gray-800/30 to-gray-900/30',
      borderColor: 'border-gray-700',
      textColor: 'text-gray-400',
      icon: '📋',
      title: 'Not Yet Legal',
    },
  };

  const config = statusConfig[legalStatus];

  return (
    <section className="py-12 sm:py-16 px-4 bg-gradient-to-b from-gray-900 to-black" aria-label={`${name} betting landscape`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-4">
            SPORTS BETTING IN {name.toUpperCase()}
          </h2>
          <p className="text-base sm:text-lg text-gray-400">
            Understanding the {name} sports betting market
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Legal Status */}
          <div className={`bg-gradient-to-br ${config.color} border ${config.borderColor} rounded-2xl p-8`}>
            <div className="text-5xl mb-4">{config.icon}</div>
            <h3 className={`text-2xl font-black mb-4 ${config.textColor}`}>
              {config.title}
            </h3>
            
            {legalStatus === 'legal' && legalSince && (
              <p className="text-gray-300 mb-4">
                Sports betting became legal in {name} in <span className="font-bold text-green-400">{legalSince}</span>.
              </p>
            )}
            
            {legalDetails && (
              <p className="text-gray-300 mb-4">
                {legalDetails}
              </p>
            )}

            {legalStatus === 'legal' ? (
              <div className="mt-6 pt-6 border-t border-green-500/30">
                <p className="text-sm text-gray-400">
                  <strong className="text-green-400">Good news for {name} bettors:</strong> You can legally bet on sports online and in-person at licensed sportsbooks.
                </p>
              </div>
            ) : legalStatus === 'pending' ? (
              <div className="mt-6 pt-6 border-t border-yellow-500/30">
                <p className="text-sm text-gray-400">
                  <strong className="text-yellow-400">Stay informed:</strong> Legislation is in progress. Join our community to stay updated on {name} sports betting news.
                </p>
              </div>
            ) : (
              <div className="mt-6 pt-6 border-t border-gray-700">
                <p className="text-sm text-gray-400">
                  <strong className="text-gray-300">Important:</strong> While sports betting isn't yet legal in {name}, our analysis and picks are still valuable for educational purposes and for when legislation passes.
                </p>
              </div>
            )}
          </div>

          {/* Sports Culture */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
            <div className="text-5xl mb-4">🏆</div>
            <h3 className="text-2xl font-black mb-4 text-cyan-400">
              {name} Sports Culture
            </h3>
            
            <p className="text-gray-300 mb-6">
              {name} has a passionate sports betting community with strong interest in {popularSports?.join(', ') || 'all major sports'}.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-cyan-400 mt-1">✓</span>
                <div>
                  <h4 className="font-bold text-white mb-1">Expert Analysis</h4>
                  <p className="text-sm text-gray-400">
                    Our team provides in-depth analysis of all {name} teams and matchups
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-cyan-400 mt-1">✓</span>
                <div>
                  <h4 className="font-bold text-white mb-1">Local Insights</h4>
                  <p className="text-sm text-gray-400">
                    We understand {name} sports culture and betting trends
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-cyan-400 mt-1">✓</span>
                <div>
                  <h4 className="font-bold text-white mb-1">Community Support</h4>
                  <p className="text-sm text-gray-400">
                    Connect with other {name} bettors in our private community
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="mt-8 bg-gray-800/30 border border-gray-700 rounded-xl p-6">
          <p className="text-sm text-gray-400 text-center">
            <strong className="text-white">Legal Disclaimer:</strong> Sports betting laws vary by state. Please check your local regulations before participating. Must be 21+ to bet on sports.
          </p>
        </div>
      </div>
    </section>
  );
}
