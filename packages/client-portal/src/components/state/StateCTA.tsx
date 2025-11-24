import { Link } from 'react-router-dom';
import { StateData } from '../../data/statesData';
import { trackCTAClick, trackWhatsAppClick } from '../../utils/analytics';

interface StateCTAProps {
  stateData: StateData;
}

export default function StateCTA({ stateData }: StateCTAProps) {
  const { name, slug, memberCount, legalStatus } = stateData;
  const displayMemberCount = memberCount || 0;

  return (
    <section className="py-12 sm:py-16 px-4 bg-black" aria-label="Call to action">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 text-white">
            Ready to Win in {name}?
          </h2>
          
          <p className="text-lg sm:text-xl mb-2 text-blue-50">
            {displayMemberCount > 0 
              ? `Join ${displayMemberCount} ${name} members who are already winning with WizJock` 
              : `Join ${name} bettors who are winning with professional analysis`}
          </p>

          {legalStatus === 'legal' && (
            <p className="text-base mb-8 text-blue-100">
              Sports betting is legal in {name}—start winning today!
            </p>
          )}

          {legalStatus === 'pending' && (
            <p className="text-base mb-8 text-blue-100">
              Get ready for when sports betting becomes legal in {name}
            </p>
          )}

          {legalStatus === 'illegal' && (
            <p className="text-base mb-8 text-blue-100">
              Be prepared when sports betting comes to {name}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
            <Link 
              to="/apply"
              onClick={() => trackCTAClick(`state_cta_${slug}`)}
              className="w-full sm:w-auto inline-block bg-white hover:bg-gray-100 text-blue-600 font-bold px-8 py-4 rounded-lg text-lg transition-colors min-h-[44px] flex items-center justify-center"
            >
              Request Access Now
            </Link>
            
            <a 
              href="https://chat.whatsapp.com/FgmkVMnR3SH6aTFjO7QL2k"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick(`state_cta_${slug}`)}
              className="w-full sm:w-auto inline-block border-2 border-white text-white hover:bg-white hover:text-blue-600 font-bold px-8 py-4 rounded-lg text-lg transition-colors min-h-[44px] flex items-center justify-center"
              title="Join our community to see live picks and results. Free to join, subscription required for full access."
            >
              Join WhatsApp Community
            </a>
          </div>

          <div className="mt-8 pt-8 border-t border-blue-400/30">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-white mb-1">+18.7%</div>
                <div className="text-xs sm:text-sm text-blue-100">ROI Last 90 Days</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-white mb-1">2,847</div>
                <div className="text-xs sm:text-sm text-blue-100">Active Members</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-white mb-1">1,200+</div>
                <div className="text-xs sm:text-sm text-blue-100">Tracked Picks</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-white mb-1">24/7</div>
                <div className="text-xs sm:text-sm text-blue-100">Live Monitoring</div>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary CTA - Explore Other States */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 mb-4">
            Not in {name}? We serve all 50 states
          </p>
          <Link 
            to="/locations"
            className="inline-block text-cyan-400 hover:text-cyan-300 font-semibold"
          >
            View All Locations →
          </Link>
        </div>
      </div>
    </section>
  );
}
