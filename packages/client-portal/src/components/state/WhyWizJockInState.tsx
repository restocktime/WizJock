import { StateData } from '../../data/statesData';
import PerformanceDisclaimer from '../PerformanceDisclaimer';

interface WhyWizJockInStateProps {
  stateData: StateData;
}

export default function WhyWizJockInState({ stateData }: WhyWizJockInStateProps) {
  const { name, memberCount } = stateData;
  const displayMemberCount = memberCount || 0;

  return (
    <section className="py-12 sm:py-16 px-4" aria-label={`Why WizJock in ${name}`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-4">
            WHY {name.toUpperCase()} BETTORS CHOOSE WIZJOCK
          </h2>
          <p className="text-base sm:text-lg text-gray-400">
            {displayMemberCount > 0 
              ? `Join ${displayMemberCount} ${name} members who are already winning` 
              : `Join local ${name} bettors who are winning with professional analysis`}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 mb-12">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 sm:p-8">
            <div className="text-cyan-400 text-3xl sm:text-4xl mb-3 sm:mb-4">🎯</div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Local Team Expertise</h3>
            <p className="text-sm sm:text-base text-gray-400 mb-3 sm:mb-4">
              We provide expert analysis on all {name} teams across NFL, NBA, MLB, NHL, and NCAA. Our analysts understand the local sports landscape and betting markets.
            </p>
            <p className="text-sm sm:text-base text-gray-400">
              Get insights on team dynamics, player performance, and matchup advantages specific to {name} teams.
            </p>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 sm:p-8">
            <div className="text-green-400 text-3xl sm:text-4xl mb-3 sm:mb-4">📊</div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Proven Results</h3>
            <p className="text-sm sm:text-base text-gray-400 mb-3 sm:mb-4">
              Our system has delivered +18.7% ROI over the last 90 days across 1,200+ tracked picks. {name} members are seeing consistent profits with our data-driven approach.
            </p>
            <p className="text-sm sm:text-base text-gray-400">
              Every pick is tracked and verified—no cherry-picking, no hidden losses.
            </p>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 sm:p-8">
            <div className="text-blue-400 text-3xl sm:text-4xl mb-3 sm:mb-4">⚡</div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Real-Time Alerts</h3>
            <p className="text-sm sm:text-base text-gray-400 mb-3 sm:mb-4">
              Get instant notifications when lines move, injuries are reported, or breaking news impacts {name} teams. Time-sensitive opportunities delivered directly to you.
            </p>
            <p className="text-sm sm:text-base text-gray-400">
              Our 24/7 monitoring system ensures you never miss a valuable betting opportunity.
            </p>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 sm:p-8">
            <div className="text-orange-400 text-3xl sm:text-4xl mb-3 sm:mb-4">💬</div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">{name} Community</h3>
            <p className="text-sm sm:text-base text-gray-400 mb-3 sm:mb-4">
              Connect with other {name} bettors in our private Discord and WhatsApp groups. Share insights, discuss picks, and learn from fellow members.
            </p>
            <p className="text-sm sm:text-base text-gray-400">
              {displayMemberCount > 0 
                ? `${displayMemberCount} ${name} members are already part of our winning community.` 
                : `Join a growing community of ${name} sports bettors.`}
            </p>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-blue-500/30 rounded-xl p-6 sm:p-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-center">
            <div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-cyan-400 mb-1 sm:mb-2">+18.7%</div>
              <div className="text-xs sm:text-sm text-gray-400">ROI Last 90 Days</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-green-400 mb-1 sm:mb-2">+4.2%</div>
              <div className="text-xs sm:text-sm text-gray-400">Avg EV Per Bet</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-blue-400 mb-1 sm:mb-2">1,200+</div>
              <div className="text-xs sm:text-sm text-gray-400">Tracked Picks</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-orange-400 mb-1 sm:mb-2">2,847</div>
              <div className="text-xs sm:text-sm text-gray-400">Active Members</div>
            </div>
          </div>
          <div className="mt-4">
            <PerformanceDisclaimer variant="block" className="text-center" />
          </div>
        </div>
      </div>
    </section>
  );
}
