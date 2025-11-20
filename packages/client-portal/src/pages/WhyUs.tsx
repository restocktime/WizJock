import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { OptimizedLogo } from '../components/OptimizedImage';
import PerformanceDisclaimer from '../components/PerformanceDisclaimer';

export default function WhyUs() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      {/* Navigation Header */}
      <header className="bg-black/95 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-800" role="banner">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link to="/" className="flex items-center gap-2 sm:gap-3">
              <OptimizedLogo alt="WizJock logo" className="h-8 sm:h-12 w-auto" />
              <span className="text-lg sm:text-2xl font-black text-white">WIZJOCK</span>
            </Link>

            <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
              <Link to="/about" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                About Us
              </Link>
              <Link to="/why-us" className="text-white transition-colors text-sm font-medium border-b-2 border-cyan-500">
                Why Us
              </Link>
              <Link to="/how-it-works" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                How It Works
              </Link>
              <Link to="/member-experience" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                Member Experience
              </Link>
              <Link to="/contact" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                Contact
              </Link>
            </nav>

            <Link 
              to="/apply" 
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm min-h-[44px] flex items-center"
            >
              GET STARTED
            </Link>
          </div>
        </div>
      </header>

      <main className="py-12 sm:py-16 lg:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6">
              WHY CHOOSE <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">WIZJOCK</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We're not just another sports betting service. We're a team of professionals who've cracked the code on consistent profitability.
            </p>
          </div>

          {/* Main Differentiators */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-500/30 rounded-2xl p-8">
              <div className="text-5xl mb-4">🎯</div>
              <h2 className="text-3xl font-black mb-4">Proven Track Record</h2>
              <p className="text-gray-300 mb-4">
                +18.7% ROI over the last 90 days isn't luck—it's systematic edge. We've tracked over 1,200 picks with full transparency.
              </p>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Every pick timestamped and documented</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>No cherry-picked results or hidden losses</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Public verification coming soon</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Members have won over $2.8M collectively</span>
                </li>
              </ul>
              <div className="mt-6 pt-6 border-t border-blue-500/30">
                <PerformanceDisclaimer variant="block" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/30 rounded-2xl p-8">
              <div className="text-5xl mb-4">🧠</div>
              <h2 className="text-3xl font-black mb-4">Professional Team</h2>
              <p className="text-gray-300 mb-4">
                Our team combines decades of experience in sports analytics, professional betting, and data science.
              </p>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>PhD-level data scientists building predictive models</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Former professional athletes with insider knowledge</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Sharp bettors who've made millions from sports betting</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>24/7 monitoring of lines, injuries, and market movements</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Technology & Edge */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 mb-16">
            <h2 className="text-3xl font-black mb-8 text-center">OUR TECHNOLOGICAL EDGE</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-bold mb-3 text-cyan-400">Advanced Analytics</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Our proprietary algorithms analyze thousands of data points per game:
                </p>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li>• Player performance metrics</li>
                  <li>• Team dynamics and chemistry</li>
                  <li>• Historical matchup data</li>
                  <li>• Weather and venue factors</li>
                  <li>• Injury reports and lineup changes</li>
                  <li>• Betting market inefficiencies</li>
                  <li>• Sharp money movements</li>
                  <li>• Public betting percentages</li>
                </ul>
              </div>

              <div>
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-bold mb-3 text-green-400">Real-Time Monitoring</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Our system never sleeps. We monitor:
                </p>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li>• Line movements across 20+ sportsbooks</li>
                  <li>• Breaking injury news</li>
                  <li>• Weather updates</li>
                  <li>• Lineup announcements</li>
                  <li>• Sharp bettor activity</li>
                  <li>• Steam moves and reverse line movement</li>
                  <li>• Market sentiment shifts</li>
                  <li>• Live game developments</li>
                </ul>
              </div>

              <div>
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-bold mb-3 text-orange-400">Value Identification</h3>
                <p className="text-gray-300 text-sm mb-4">
                  We find bets where the odds are in your favor:
                </p>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li>• Expected value (EV) calculations</li>
                  <li>• Market inefficiency detection</li>
                  <li>• Arbitrage opportunities</li>
                  <li>• Positive correlation plays</li>
                  <li>• Contrarian betting spots</li>
                  <li>• Line shopping optimization</li>
                  <li>• Closing line value (CLV) tracking</li>
                  <li>• Risk-adjusted returns</li>
                </ul>
              </div>
            </div>
          </div>

          {/* What Makes Us Different */}
          <div className="mb-16">
            <h2 className="text-3xl font-black mb-8 text-center">WHAT MAKES US DIFFERENT</h2>
            <div className="space-y-6">
              <div className="bg-gray-800/30 border-l-4 border-cyan-500 p-6 rounded-r-xl">
                <h3 className="text-xl font-bold mb-3 text-cyan-400">1. We're Not Touts</h3>
                <p className="text-gray-300">
                  Traditional sports betting "touts" sell picks without any real edge. They cherry-pick wins, hide losses, and prey on desperate bettors. We're different. Every pick is tracked, every result is documented, and our long-term ROI speaks for itself. We win when you win—not just when you subscribe.
                </p>
              </div>

              <div className="bg-gray-800/30 border-l-4 border-green-500 p-6 rounded-r-xl">
                <h3 className="text-xl font-bold mb-3 text-green-400">2. Education Over Hype</h3>
                <p className="text-gray-300">
                  We don't promise "guaranteed winners" or "locks." That's nonsense. Instead, we teach you how professional bettors think. You'll learn about bankroll management, expected value, line shopping, and market inefficiencies. Our goal is to make you a better, smarter bettor—not just a follower.
                </p>
              </div>

              <div className="bg-gray-800/30 border-l-4 border-blue-500 p-6 rounded-r-xl">
                <h3 className="text-xl font-bold mb-3 text-blue-400">3. Long-Term Mindset</h3>
                <p className="text-gray-300">
                  Sports betting isn't about hitting one big parlay. It's about consistent, disciplined betting with a mathematical edge. We focus on sustainable profitability over time. Some days you'll lose. Some weeks will be tough. But over months and years, the edge compounds. That's how professionals win.
                </p>
              </div>

              <div className="bg-gray-800/30 border-l-4 border-orange-500 p-6 rounded-r-xl">
                <h3 className="text-xl font-bold mb-3 text-orange-400">4. Community & Support</h3>
                <p className="text-gray-300">
                  You're not just buying picks—you're joining a community of serious bettors. Our Discord and WhatsApp groups are active 24/7 with members sharing insights, discussing picks, and supporting each other. Plus, our team is always available to answer questions and provide guidance.
                </p>
              </div>

              <div className="bg-gray-800/30 border-l-4 border-purple-500 p-6 rounded-r-xl">
                <h3 className="text-xl font-bold mb-3 text-purple-400">5. Selective Membership</h3>
                <p className="text-gray-300">
                  We don't accept everyone. We review every application to ensure our members are serious about sports betting and committed to the long-term process. This keeps our community quality high and ensures everyone benefits from shared knowledge and insights.
                </p>
              </div>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="mb-16">
            <h2 className="text-3xl font-black mb-8 text-center">WIZJOCK VS. OTHERS</h2>
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-900">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-300">Feature</th>
                      <th className="px-6 py-4 text-center text-sm font-bold text-cyan-400">WizJock</th>
                      <th className="px-6 py-4 text-center text-sm font-bold text-gray-500">Traditional Touts</th>
                      <th className="px-6 py-4 text-center text-sm font-bold text-gray-500">Betting on Your Own</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-300">Verified Track Record</td>
                      <td className="px-6 py-4 text-center text-green-400 text-xl">✓</td>
                      <td className="px-6 py-4 text-center text-red-400 text-xl">✗</td>
                      <td className="px-6 py-4 text-center text-red-400 text-xl">✗</td>
                    </tr>
                    <tr className="bg-gray-800/30">
                      <td className="px-6 py-4 text-sm text-gray-300">Advanced Analytics</td>
                      <td className="px-6 py-4 text-center text-green-400 text-xl">✓</td>
                      <td className="px-6 py-4 text-center text-red-400 text-xl">✗</td>
                      <td className="px-6 py-4 text-center text-red-400 text-xl">✗</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-300">Real-Time Alerts</td>
                      <td className="px-6 py-4 text-center text-green-400 text-xl">✓</td>
                      <td className="px-6 py-4 text-center text-yellow-400 text-sm">Sometimes</td>
                      <td className="px-6 py-4 text-center text-red-400 text-xl">✗</td>
                    </tr>
                    <tr className="bg-gray-800/30">
                      <td className="px-6 py-4 text-sm text-gray-300">Bankroll Management</td>
                      <td className="px-6 py-4 text-center text-green-400 text-xl">✓</td>
                      <td className="px-6 py-4 text-center text-red-400 text-xl">✗</td>
                      <td className="px-6 py-4 text-center text-red-400 text-xl">✗</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-300">Education & Training</td>
                      <td className="px-6 py-4 text-center text-green-400 text-xl">✓</td>
                      <td className="px-6 py-4 text-center text-red-400 text-xl">✗</td>
                      <td className="px-6 py-4 text-center text-red-400 text-xl">✗</td>
                    </tr>
                    <tr className="bg-gray-800/30">
                      <td className="px-6 py-4 text-sm text-gray-300">Community Support</td>
                      <td className="px-6 py-4 text-center text-green-400 text-xl">✓</td>
                      <td className="px-6 py-4 text-center text-yellow-400 text-sm">Limited</td>
                      <td className="px-6 py-4 text-center text-red-400 text-xl">✗</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-300">Transparent Results</td>
                      <td className="px-6 py-4 text-center text-green-400 text-xl">✓</td>
                      <td className="px-6 py-4 text-center text-red-400 text-xl">✗</td>
                      <td className="px-6 py-4 text-center text-yellow-400 text-sm">N/A</td>
                    </tr>
                    <tr className="bg-gray-800/30">
                      <td className="px-6 py-4 text-sm text-gray-300">Professional Team</td>
                      <td className="px-6 py-4 text-center text-green-400 text-xl">✓</td>
                      <td className="px-6 py-4 text-center text-yellow-400 text-sm">Varies</td>
                      <td className="px-6 py-4 text-center text-red-400 text-xl">✗</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Member Success Stories */}
          <div className="mb-16">
            <h2 className="text-3xl font-black mb-8 text-center">MEMBER SUCCESS STORIES</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-xl font-black">
                    M
                  </div>
                  <div>
                    <div className="font-bold">Mike T.</div>
                    <div className="text-sm text-gray-400">Member since Jan 2024</div>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-4">
                  "I was skeptical at first, but after 6 months my bankroll is up 47%. The education alone is worth the price. I finally understand how to bet like a professional."
                </p>
                <div className="text-green-400 font-bold">+$12,400 profit</div>
              </div>

              <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-xl font-black">
                    S
                  </div>
                  <div>
                    <div className="font-bold">Sarah K.</div>
                    <div className="text-sm text-gray-400">Member since Mar 2024</div>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-4">
                  "The real-time alerts are game-changers. I've caught so many line movements before the public. The community is incredibly supportive too."
                </p>
                <div className="text-green-400 font-bold">+$8,200 profit</div>
              </div>

              <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-xl font-black">
                    J
                  </div>
                  <div>
                    <div className="font-bold">James R.</div>
                    <div className="text-sm text-gray-400">Member since Feb 2024</div>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-4">
                  "Best investment I've made. The picks are solid, but learning the strategy behind them has made me a much better bettor overall."
                </p>
                <div className="text-green-400 font-bold">+$15,800 profit</div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-8 sm:p-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">Ready to Join the Winning Team?</h2>
            <p className="text-lg mb-8 text-blue-50">
              Limited spots available. Apply now to get started.
            </p>
            <Link 
              to="/apply"
              className="inline-block bg-white hover:bg-gray-100 text-blue-600 font-bold px-8 py-4 rounded-lg text-lg transition-colors"
            >
              Request Access Now
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
