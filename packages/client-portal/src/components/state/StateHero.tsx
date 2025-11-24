import { Link } from 'react-router-dom';
import { StateData } from '../../data/statesData';
import { trackCTAClick, trackWhatsAppClick } from '../../utils/analytics';

interface StateHeroProps {
  stateData: StateData;
}

export default function StateHero({ stateData }: StateHeroProps) {
  const memberCount = stateData.memberCount || 0;
  const legalStatusColor = stateData.legalStatus === 'legal' ? 'text-green-400' :
    stateData.legalStatus === 'pending' ? 'text-yellow-400' :
      'text-gray-400';

  return (
    <section className="relative px-4 pt-12 sm:pt-16 pb-20 overflow-hidden" aria-label="Hero section">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="max-w-4xl">
          <div className="inline-block bg-orange-500 text-white px-4 py-1 rounded-full text-xs font-bold mb-4">
            SERVING {stateData.name.toUpperCase()}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6 leading-tight">
            {stateData.heroTagline || `Professional Sports Betting Analysis in ${stateData.name}`}
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-6 sm:mb-8">
            {stateData.localInsights || `Join ${memberCount > 0 ? `${memberCount} ${stateData.name}` : 'local'} members who are winning with data-driven sports betting picks and professional analysis.`}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
            <Link
              to="/apply"
              onClick={() => trackCTAClick(`state_hero_${stateData.slug}`)}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold px-6 sm:px-8 py-4 rounded-lg text-base sm:text-lg min-h-[44px] flex items-center justify-center"
            >
              Request Access
            </Link>
            <a
              href="https://chat.whatsapp.com/FgmkVMnR3SH6aTFjO7QL2k"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick(`state_hero_${stateData.slug}`)}
              className="border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white font-bold px-6 sm:px-8 py-4 rounded-lg text-base sm:text-lg min-h-[44px] flex flex-col items-center justify-center group relative"
              title="Join our community to see live picks and results. Free to join, subscription required for full access."
            >
              <span>Join WhatsApp</span>
              <span className="text-xs font-normal mt-0.5 opacity-80 group-hover:opacity-100">See live picks & results</span>
            </a>
          </div>

          {/* State Stats Bar */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 sm:p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-center">
              {memberCount > 0 && (
                <div>
                  <div className="text-xl sm:text-2xl lg:text-3xl font-black text-cyan-400">{memberCount}</div>
                  <div className="text-[10px] sm:text-xs text-gray-400 uppercase leading-tight">{stateData.name} Members</div>
                </div>
              )}
              <div>
                <div className={`text-xl sm:text-2xl lg:text-3xl font-black ${legalStatusColor}`}>
                  {stateData.legalStatus === 'legal' ? 'Legal' : stateData.legalStatus === 'pending' ? 'Pending' : 'Not Yet'}
                </div>
                <div className="text-[10px] sm:text-xs text-gray-400 uppercase leading-tight">Sports Betting</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-black text-blue-400">
                  {(stateData.proTeams.nfl?.length || 0) + (stateData.proTeams.nba?.length || 0) + (stateData.proTeams.mlb?.length || 0) + (stateData.proTeams.nhl?.length || 0)}
                </div>
                <div className="text-[10px] sm:text-xs text-gray-400 uppercase leading-tight">Pro Teams</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-black text-green-400">+18.7%</div>
                <div className="text-[10px] sm:text-xs text-gray-400 uppercase leading-tight">ROI Last 90 Days</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
