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
              <img src="/wizjock-logo.png" alt="WizJock" className="h-16 w-auto" />
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
                  WIN MORE.<br/>
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

        {/* How It Works - Simple & Direct */}
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-black text-center mb-12">HOW IT WORKS</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-4">1</div>
                <h3 className="text-xl font-bold mb-2">Request Access</h3>
                <p className="text-gray-400">Apply for membership. We review every application to maintain quality.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-4">2</div>
                <h3 className="text-xl font-bold mb-2">Get Daily Picks</h3>
                <p className="text-gray-400">Receive AI-analyzed picks with confidence ratings and unit sizing.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-4">3</div>
                <h3 className="text-xl font-bold mb-2">Win Consistently</h3>
                <p className="text-gray-400">Follow the system. Track your wins. Build your bankroll.</p>
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
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-5xl font-black mb-4">CHOOSE YOUR PLAN</h2>
              <p className="text-xl text-gray-400">Limited spots available per tier</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Starter */}
              <div className="bg-gray-800 border-2 border-gray-700 rounded-2xl p-8">
                <div className="text-sm font-bold text-gray-400 mb-2">STARTER</div>
                <div className="mb-6">
                  <span className="text-5xl font-black">$299</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <a href="#coming-soon" className="block w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 rounded-lg text-center mb-6">
                  Get Started
                </a>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span className="text-gray-300">5 daily picks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span className="text-gray-300">Basic analytics dashboard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span className="text-gray-300">Community access</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span className="text-gray-300">Email support</span>
                  </li>
                </ul>
              </div>

              {/* Pro - Featured */}
              <div className="bg-gradient-to-b from-blue-600 to-cyan-600 rounded-2xl p-8 relative transform lg:scale-105">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-xs font-bold">
                  MOST POPULAR
                </div>
                <div className="text-sm font-bold text-blue-100 mb-2">PRO</div>
                <div className="mb-6">
                  <span className="text-5xl font-black text-white">$799</span>
                  <span className="text-blue-100">/month</span>
                </div>
                <a href="#coming-soon" className="block w-full bg-white hover:bg-gray-100 text-blue-600 font-bold py-4 rounded-lg text-center mb-6">
                  Get Started
                </a>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-white mt-1">✓</span>
                    <span className="text-white">Unlimited daily picks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-white mt-1">✓</span>
                    <span className="text-white">Advanced AI analytics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-white mt-1">✓</span>
                    <span className="text-white">Real-time alerts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-white mt-1">✓</span>
                    <span className="text-white">Priority support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-white mt-1">✓</span>
                    <span className="text-white">Live chat access</span>
                  </li>
                </ul>
              </div>

              {/* Elite */}
              <div className="bg-gray-800 border-2 border-yellow-500/50 rounded-2xl p-8">
                <div className="text-sm font-bold text-yellow-400 mb-2">ELITE</div>
                <div className="mb-6">
                  <span className="text-5xl font-black">$1,999</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <a href="#coming-soon" className="block w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-bold py-4 rounded-lg text-center mb-6">
                  Get Started
                </a>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-1">✓</span>
                    <span className="text-gray-300">Everything in Pro</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-1">✓</span>
                    <span className="text-gray-300">1-on-1 strategy sessions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-1">✓</span>
                    <span className="text-gray-300">Custom betting models</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-1">✓</span>
                    <span className="text-gray-300">VIP community</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-1">✓</span>
                    <span className="text-gray-300">Dedicated account manager</span>
                  </li>
                </ul>
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
