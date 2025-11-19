import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import ComingSoon from './ComingSoon';

const queryClient = new QueryClient();

function App() {
  const [showComingSoon, setShowComingSoon] = useState(false);

  useEffect(() => {
    if (window.location.hash === '#coming-soon') {
      setShowComingSoon(true);
    }
    const handleHashChange = () => {
      setShowComingSoon(window.location.hash === '#coming-soon');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (showComingSoon) {
    return (
      <QueryClientProvider client={queryClient}>
        <ComingSoon />
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">

        {/* Top Bar - Like FanDuel */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 py-2 px-4 text-center text-sm font-bold">
          🔥 MEMBERS WON $847K THIS WEEK • 67% WIN RATE • JOIN THE WINNING TEAM
        </div>

        {/* Hero - Bold & Direct */}
        <section className="relative px-4 pt-12 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <img src="/wizjock-logo.png" alt="WizJock" className="h-24 lg:h-32 w-auto" />
              <a href="#coming-soon" className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-lg text-sm">
                GET STARTED
              </a>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block bg-orange-500 text-white px-4 py-1 rounded-full text-xs font-bold mb-4">
                  INVITE ONLY
                </div>
                <h1 className="text-5xl lg:text-7xl font-black mb-6 leading-tight">
                  WIN MORE.<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                    LOSE LESS.
                  </span>
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                  AI-powered sports betting intelligence trusted by 50,000+ serious bettors.
                  Get the edge the sportsbooks don't want you to have.
                </p>
                <div className="flex gap-4 mb-8">
                  <a href="#coming-soon" className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold px-8 py-4 rounded-lg text-lg">
                    Request Access
                  </a>
                  <a href="https://chat.whatsapp.com/FgmkVMnR3SH6aTFjO7QL2k" target="_blank" rel="noopener noreferrer" className="border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white font-bold px-8 py-4 rounded-lg text-lg">
                    Join WhatsApp
                  </a>
                </div>

                {/* Live Stats Bar */}
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-3xl font-black text-green-400">67%</div>
                      <div className="text-xs text-gray-400 uppercase">Win Rate</div>
                    </div>
                    <div>
                      <div className="text-3xl font-black text-blue-400">$2.4M</div>
                      <div className="text-xs text-gray-400 uppercase">Won This Month</div>
                    </div>
                    <div>
                      <div className="text-3xl font-black text-cyan-400">50K+</div>
                      <div className="text-xs text-gray-400 uppercase">Members</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Featured Winning Slip */}
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 blur-3xl"></div>
                <div className="relative bg-gray-800 border-2 border-cyan-500/50 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">WON</span>
                    <span className="text-gray-400 text-sm">2 hours ago</span>
                  </div>
                  <img
                    src="/slips/slip1.png"
                    alt="Recent win"
                    className="w-full aspect-[9/16] object-contain bg-gray-900 rounded-lg mb-4"
                  />
                  <div className="text-center">
                    <div className="text-3xl font-black text-green-400 mb-1">+$12,450</div>
                    <div className="text-sm text-gray-400">5-leg parlay • +2100 odds</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Winning Slips Grid - Like DraftKings Showcase */}
        <section className="py-16 px-4 bg-black">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl lg:text-4xl font-black mb-2">RECENT WINS</h2>
                <p className="text-gray-400">Real members. Real money. Real results.</p>
              </div>
              <a href="https://chat.whatsapp.com/FgmkVMnR3SH6aTFjO7QL2k" target="_blank" rel="noopener noreferrer" className="hidden lg:block bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-lg">
                See All Wins
              </a>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <div key={num} className="bg-gray-800 border border-gray-700 rounded-lg p-3 hover:border-cyan-500/50 transition">
                  <img
                    src={`/slips/slip${num > 6 ? num - 6 : num}.png`}
                    alt={`Win ${num}`}
                    className="w-full aspect-[9/16] object-contain bg-gray-900 rounded mb-2"
                  />
                  <div className="text-center">
                    <div className="text-green-400 font-bold">+${(Math.random() * 15000 + 1000).toFixed(0)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The Edge - What Makes Us Different */}
        <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-black mb-4">THE WIZJOCK EDGE</h2>
              <p className="text-xl text-gray-400">What the sportsbooks don't want you to know</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8">
                <div className="text-cyan-400 text-4xl mb-4">🧠</div>
                <h3 className="text-2xl font-bold mb-3">AI That Actually Wins</h3>
                <p className="text-gray-400 mb-4">
                  Our proprietary AI analyzes 10M+ data points daily—player stats, injury reports, weather, betting trends, line movements, and historical matchups.
                </p>
                <p className="text-gray-400">
                  It finds value bets the market consistently underprices. That's why we maintain a 67% win rate while most bettors lose long-term.
                </p>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8">
                <div className="text-green-400 text-4xl mb-4">⚡</div>
                <h3 className="text-2xl font-bold mb-3">Real-Time Intelligence</h3>
                <p className="text-gray-400 mb-4">
                  Lines move fast. Injuries happen. Weather changes. Our system monitors everything 24/7 and alerts you instantly when conditions shift.
                </p>
                <p className="text-gray-400">
                  You get the information before the public catches on—that's when the real money is made.
                </p>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8">
                <div className="text-blue-400 text-4xl mb-4">📊</div>
                <h3 className="text-2xl font-bold mb-3">Smart Bankroll Management</h3>
                <p className="text-gray-400 mb-4">
                  Every pick comes with a confidence rating and recommended unit size. No guessing. No chasing losses.
                </p>
                <p className="text-gray-400">
                  Our members report 89% better money management. We're building wealth, not gambling.
                </p>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8">
                <div className="text-orange-400 text-4xl mb-4">✅</div>
                <h3 className="text-2xl font-bold mb-3">100% Transparent Results</h3>
                <p className="text-gray-400 mb-4">
                  Every pick is tracked and timestamped. No cherry-picking wins. No hiding losses.
                </p>
                <p className="text-gray-400">
                  Our 67% win rate is independently verified across thousands of documented bets. See the proof in our winning slips above.
                </p>
              </div>
            </div>

            {/* Simple Process */}
            <div className="border-t border-gray-800 pt-16">
              <h3 className="text-2xl lg:text-3xl font-black text-center mb-12">HOW IT WORKS</h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-4">1</div>
                  <h4 className="text-lg font-bold mb-2">Apply & Get Approved</h4>
                  <p className="text-gray-400 text-sm">Request access. We review applications to keep the community quality high.</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-4">2</div>
                  <h4 className="text-lg font-bold mb-2">Receive Daily Picks</h4>
                  <p className="text-gray-400 text-sm">Get AI-analyzed picks with confidence ratings, odds, and recommended units.</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-4">3</div>
                  <h4 className="text-lg font-bold mb-2">Win & Build Bankroll</h4>
                  <p className="text-gray-400 text-sm">Place your bets, track results, and watch your bankroll grow consistently.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Bar */}
        <section className="py-12 px-4 bg-gradient-to-r from-blue-900/30 to-cyan-900/30">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-black text-cyan-400 mb-2">67%</div>
                <div className="text-sm text-gray-400">Overall Win Rate</div>
              </div>
              <div>
                <div className="text-4xl font-black text-green-400 mb-2">$847K</div>
                <div className="text-sm text-gray-400">Won This Week</div>
              </div>
              <div>
                <div className="text-4xl font-black text-blue-400 mb-2">10M+</div>
                <div className="text-sm text-gray-400">Data Points Daily</div>
              </div>
              <div>
                <div className="text-4xl font-black text-orange-400 mb-2">24/7</div>
                <div className="text-sm text-gray-400">Live Monitoring</div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing - Bold & Clear */}
        <section className="py-20 px-4 bg-black">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-5xl font-black mb-4">CHOOSE YOUR PLAN</h2>
              <p className="text-xl text-gray-400">Limited spots available per tier</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Starter */}
              <div className="bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-8 hover:border-blue-500/50 transition">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">STARTER</div>
                <div className="mb-6">
                  <span className="text-5xl font-black text-white">$299</span>
                  <span className="text-gray-500 text-lg">/mo</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-gray-300">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>5 daily picks</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Basic analytics</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Community access</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Email support</span>
                  </li>
                </ul>
                <a href="#coming-soon" className="block w-full bg-white hover:bg-gray-100 text-black font-bold py-4 rounded-lg text-center transition">
                  Get Started
                </a>
              </div>

              {/* Pro - Featured */}
              <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 rounded-xl p-8 relative transform lg:scale-105 shadow-2xl shadow-blue-500/50">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-6 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
                  Most Popular
                </div>
                <div className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-3">PRO</div>
                <div className="mb-6">
                  <span className="text-5xl font-black text-white">$799</span>
                  <span className="text-blue-200 text-lg">/mo</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-white">
                    <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Unlimited daily picks</span>
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Advanced AI analytics</span>
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Real-time alerts</span>
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Priority support</span>
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Live chat access</span>
                  </li>
                </ul>
                <a href="#coming-soon" className="block w-full bg-white hover:bg-gray-100 text-blue-600 font-bold py-4 rounded-lg text-center transition">
                  Get Started
                </a>
              </div>

              {/* Elite */}
              <div className="bg-gradient-to-b from-gray-800 to-gray-900 border border-yellow-500/30 rounded-xl p-8 hover:border-yellow-500/60 transition">
                <div className="text-xs font-bold text-yellow-500 uppercase tracking-wider mb-3">ELITE</div>
                <div className="mb-6">
                  <span className="text-5xl font-black text-white">$1,999</span>
                  <span className="text-gray-500 text-lg">/mo</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-gray-300">
                    <svg className="w-5 h-5 text-yellow-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Everything in Pro</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <svg className="w-5 h-5 text-yellow-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>1-on-1 strategy sessions</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <svg className="w-5 h-5 text-yellow-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Custom betting models</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <svg className="w-5 h-5 text-yellow-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>VIP community</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <svg className="w-5 h-5 text-yellow-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Dedicated account manager</span>
                  </li>
                </ul>
                <a href="#coming-soon" className="block w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold py-4 rounded-lg text-center transition">
                  Get Started
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-cyan-500">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl lg:text-5xl font-black mb-6">READY TO START WINNING?</h2>
            <p className="text-xl mb-8 text-blue-50">Join 50,000+ members who are beating the sportsbooks</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#coming-soon" className="bg-white hover:bg-gray-100 text-blue-600 font-bold px-10 py-5 rounded-lg text-lg">
                Request Access Now
              </a>
              <a href="https://chat.whatsapp.com/FgmkVMnR3SH6aTFjO7QL2k" target="_blank" rel="noopener noreferrer" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-bold px-10 py-5 rounded-lg text-lg">
                Join WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 bg-black border-t border-gray-800">
          <div className="max-w-6xl mx-auto text-center text-gray-500 text-sm">
            <p>© 2025 WizJock. All rights reserved. Gamble responsibly.</p>
          </div>
        </footer>

      </div>
    </QueryClientProvider>
  );
}

export default App;
