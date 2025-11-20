import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { OptimizedLogo } from '../components/OptimizedImage';

export default function HowItWorks() {
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
              <Link to="/why-us" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                Why Us
              </Link>
              <Link to="/how-it-works" className="text-white transition-colors text-sm font-medium border-b-2 border-cyan-500">
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
              HOW <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">IT WORKS</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From application to consistent profits—here's your complete journey with WizJock
            </p>
          </div>

          {/* Main Process Steps */}
          <div className="space-y-12 mb-20">
            {/* Step 1 */}
            <div className="relative">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-4xl font-black shadow-lg shadow-blue-500/50">
                    1
                  </div>
                </div>
                <div className="flex-1 bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
                  <h2 className="text-3xl font-black mb-4 text-cyan-400">Apply for Membership</h2>
                  <p className="text-gray-300 mb-6">
                    Fill out our simple application form. We ask about your betting experience, goals, and commitment level. This helps us ensure you're a good fit for our community.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-gray-900/50 rounded-lg p-4">
                      <h3 className="font-bold mb-2 text-sm text-cyan-400">What We Ask:</h3>
                      <ul className="text-sm text-gray-400 space-y-1">
                        <li>• Your betting experience level</li>
                        <li>• Sports you're interested in</li>
                        <li>• Your bankroll size</li>
                        <li>• Your goals with sports betting</li>
                      </ul>
                    </div>
                    <div className="bg-gray-900/50 rounded-lg p-4">
                      <h3 className="font-bold mb-2 text-sm text-green-400">Review Time:</h3>
                      <ul className="text-sm text-gray-400 space-y-1">
                        <li>• 24-48 hour review period</li>
                        <li>• Email notification of decision</li>
                        <li>• Feedback if not accepted</li>
                        <li>• Reapply after 30 days</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-4xl font-black shadow-lg shadow-blue-500/50">
                    2
                  </div>
                </div>
                <div className="flex-1 bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
                  <h2 className="text-3xl font-black mb-4 text-cyan-400">Get Approved & Onboarded</h2>
                  <p className="text-gray-300 mb-6">
                    Once approved, you'll receive a welcome email with everything you need to get started. We'll guide you through setting up your account and joining our community.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-gray-900/50 rounded-lg p-4">
                      <h3 className="font-bold mb-2 text-sm text-cyan-400">You'll Receive:</h3>
                      <ul className="text-sm text-gray-400 space-y-1">
                        <li>• Welcome email with login details</li>
                        <li>• Access to member dashboard</li>
                        <li>• WhatsApp group invitation</li>
                        <li>• Discord server access</li>
                        <li>• Onboarding video tutorial</li>
                      </ul>
                    </div>
                    <div className="bg-gray-900/50 rounded-lg p-4">
                      <h3 className="font-bold mb-2 text-sm text-green-400">First Steps:</h3>
                      <ul className="text-sm text-gray-400 space-y-1">
                        <li>• Complete your profile</li>
                        <li>• Set notification preferences</li>
                        <li>• Join community channels</li>
                        <li>• Review betting guidelines</li>
                        <li>• Set up bankroll tracking</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-4xl font-black shadow-lg shadow-blue-500/50">
                    3
                  </div>
                </div>
                <div className="flex-1 bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
                  <h2 className="text-3xl font-black mb-4 text-cyan-400">Receive Daily Picks</h2>
                  <p className="text-gray-300 mb-6">
                    Every morning, you'll receive curated picks based on our analysis. Each pick includes detailed reasoning, confidence level, and recommended bet size.
                  </p>
                  <div className="bg-gray-900/50 rounded-lg p-6 mb-4">
                    <h3 className="font-bold mb-4 text-cyan-400">Example Pick Format:</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                        <span className="text-gray-400">Game:</span>
                        <span className="text-white font-bold">Lakers vs Warriors</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                        <span className="text-gray-400">Pick:</span>
                        <span className="text-white font-bold">Warriors -3.5</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                        <span className="text-gray-400">Odds:</span>
                        <span className="text-white font-bold">-110</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                        <span className="text-gray-400">Confidence:</span>
                        <span className="text-green-400 font-bold">High (8/10)</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                        <span className="text-gray-400">Units:</span>
                        <span className="text-white font-bold">2 units</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Expected Value:</span>
                        <span className="text-cyan-400 font-bold">+4.2%</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
                    <p className="text-sm text-gray-300">
                      <strong className="text-blue-400">Reasoning:</strong> Warriors coming off 3 days rest while Lakers played last night. Curry is 12-3 ATS in this matchup. Sharp money moving Warriors direction. Public on Lakers 68%.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-4xl font-black shadow-lg shadow-blue-500/50">
                    4
                  </div>
                </div>
                <div className="flex-1 bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
                  <h2 className="text-3xl font-black mb-4 text-cyan-400">Place Your Bets</h2>
                  <p className="text-gray-300 mb-6">
                    Use our picks to place bets at your preferred sportsbook. We recommend line shopping across multiple books to get the best odds.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-gray-900/50 rounded-lg p-4">
                      <h3 className="font-bold mb-2 text-sm text-cyan-400">Best Practices:</h3>
                      <ul className="text-sm text-gray-400 space-y-1">
                        <li>• Shop lines across 3-5 sportsbooks</li>
                        <li>• Bet early to get best value</li>
                        <li>• Use proper unit sizing</li>
                        <li>• Track all bets in dashboard</li>
                        <li>• Never chase losses</li>
                      </ul>
                    </div>
                    <div className="bg-gray-900/50 rounded-lg p-4">
                      <h3 className="font-bold mb-2 text-sm text-green-400">Recommended Books:</h3>
                      <ul className="text-sm text-gray-400 space-y-1">
                        <li>• DraftKings (best promos)</li>
                        <li>• FanDuel (fast payouts)</li>
                        <li>• BetMGM (good lines)</li>
                        <li>• Caesars (variety)</li>
                        <li>• Pinnacle (sharp lines)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="relative">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-4xl font-black shadow-lg shadow-blue-500/50">
                    5
                  </div>
                </div>
                <div className="flex-1 bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
                  <h2 className="text-3xl font-black mb-4 text-cyan-400">Track & Learn</h2>
                  <p className="text-gray-300 mb-6">
                    Monitor your results in real-time through our dashboard. Learn from wins and losses. Engage with the community to improve your betting strategy.
                  </p>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="bg-gray-900/50 rounded-lg p-4">
                      <h3 className="font-bold mb-2 text-sm text-cyan-400">Dashboard Features:</h3>
                      <ul className="text-sm text-gray-400 space-y-1">
                        <li>• Real-time P&L</li>
                        <li>• ROI tracking</li>
                        <li>• Win rate by sport</li>
                        <li>• Unit performance</li>
                        <li>• CLV analysis</li>
                      </ul>
                    </div>
                    <div className="bg-gray-900/50 rounded-lg p-4">
                      <h3 className="font-bold mb-2 text-sm text-green-400">Learning Resources:</h3>
                      <ul className="text-sm text-gray-400 space-y-1">
                        <li>• Weekly webinars</li>
                        <li>• Strategy guides</li>
                        <li>• Video tutorials</li>
                        <li>• Q&A sessions</li>
                        <li>• Case studies</li>
                      </ul>
                    </div>
                    <div className="bg-gray-900/50 rounded-lg p-4">
                      <h3 className="font-bold mb-2 text-sm text-orange-400">Community:</h3>
                      <ul className="text-sm text-gray-400 space-y-1">
                        <li>• Live chat support</li>
                        <li>• Member discussions</li>
                        <li>• Shared insights</li>
                        <li>• Success stories</li>
                        <li>• Accountability</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 6 */}
            <div className="relative">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-600 to-emerald-500 rounded-full flex items-center justify-center text-4xl font-black shadow-lg shadow-green-500/50">
                    ✓
                  </div>
                </div>
                <div className="flex-1 bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/30 rounded-2xl p-8">
                  <h2 className="text-3xl font-black mb-4 text-green-400">Build Your Bankroll</h2>
                  <p className="text-gray-300 mb-6">
                    With consistent execution and proper bankroll management, watch your profits grow over time. Most members see positive ROI within their first 30 days.
                  </p>
                  <div className="bg-gray-900/50 rounded-lg p-6">
                    <h3 className="font-bold mb-4 text-green-400">Average Member Results:</h3>
                    <div className="grid sm:grid-cols-3 gap-6 text-center">
                      <div>
                        <div className="text-3xl font-black text-green-400 mb-2">+18.7%</div>
                        <div className="text-sm text-gray-400">Average ROI</div>
                      </div>
                      <div>
                        <div className="text-3xl font-black text-cyan-400 mb-2">+47%</div>
                        <div className="text-sm text-gray-400">Bankroll Growth (6mo)</div>
                      </div>
                      <div>
                        <div className="text-3xl font-black text-blue-400 mb-2">$9,800</div>
                        <div className="text-sm text-gray-400">Avg Member Profit</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* What You'll Get Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-black mb-8 text-center">WHAT'S INCLUDED</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <div className="text-3xl mb-3">📱</div>
                <h3 className="text-xl font-bold mb-2">Daily Picks</h3>
                <p className="text-gray-400 text-sm">5-15 picks per day across all major sports with detailed analysis</p>
              </div>
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="text-xl font-bold mb-2">Real-Time Alerts</h3>
                <p className="text-gray-400 text-sm">Instant notifications for line movements and breaking news</p>
              </div>
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="text-xl font-bold mb-2">Performance Dashboard</h3>
                <p className="text-gray-400 text-sm">Track every bet with detailed analytics and insights</p>
              </div>
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <div className="text-3xl mb-3">💬</div>
                <h3 className="text-xl font-bold mb-2">Private Community</h3>
                <p className="text-gray-400 text-sm">Discord and WhatsApp groups with 2,800+ active members</p>
              </div>
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <div className="text-3xl mb-3">🎓</div>
                <h3 className="text-xl font-bold mb-2">Education Library</h3>
                <p className="text-gray-400 text-sm">Courses, webinars, and guides on professional betting</p>
              </div>
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <div className="text-3xl mb-3">🔒</div>
                <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
                <p className="text-gray-400 text-sm">Our team is always available to answer questions</p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-black mb-8 text-center">FREQUENTLY ASKED QUESTIONS</h2>
            <div className="space-y-4">
              <details className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 group">
                <summary className="font-bold text-lg cursor-pointer list-none flex justify-between items-center">
                  <span>How much money do I need to start?</span>
                  <span className="text-cyan-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-gray-400 mt-4 text-sm">
                  We recommend a minimum bankroll of $1,000 to properly implement our unit sizing strategy. However, you can start with less and scale up as you build profits. The key is proper bankroll management—never bet more than 1-5% of your total bankroll on a single pick.
                </p>
              </details>

              <details className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 group">
                <summary className="font-bold text-lg cursor-pointer list-none flex justify-between items-center">
                  <span>What sports do you cover?</span>
                  <span className="text-cyan-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-gray-400 mt-4 text-sm">
                  We cover all major sports: NFL, NBA, MLB, NHL, NCAA Football, NCAA Basketball, Soccer (EPL, Champions League, MLS), UFC/MMA, Tennis, and Golf. Our focus shifts based on the season, with more picks during peak times for each sport.
                </p>
              </details>

              <details className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 group">
                <summary className="font-bold text-lg cursor-pointer list-none flex justify-between items-center">
                  <span>How many picks do you send per day?</span>
                  <span className="text-cyan-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-gray-400 mt-4 text-sm">
                  It varies by day and season. During peak seasons (NFL, NBA), you'll typically receive 10-15 picks per day. During slower periods, it might be 3-5 picks. We focus on quality over quantity—we only send picks where we have a clear edge.
                </p>
              </details>

              <details className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 group">
                <summary className="font-bold text-lg cursor-pointer list-none flex justify-between items-center">
                  <span>Can I cancel anytime?</span>
                  <span className="text-cyan-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-gray-400 mt-4 text-sm">
                  Yes, absolutely. All memberships are month-to-month with no long-term commitment. You can cancel anytime from your account dashboard. We also offer a 7-day money-back guarantee if you're not satisfied.
                </p>
              </details>

              <details className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 group">
                <summary className="font-bold text-lg cursor-pointer list-none flex justify-between items-center">
                  <span>Do you guarantee profits?</span>
                  <span className="text-cyan-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-gray-400 mt-4 text-sm">
                  No, and anyone who guarantees profits in sports betting is lying. Sports betting involves risk, and losing streaks happen. What we do guarantee is transparency, professional analysis, and a proven long-term edge. Our track record speaks for itself, but past performance doesn't guarantee future results.
                </p>
              </details>

              <details className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 group">
                <summary className="font-bold text-lg cursor-pointer list-none flex justify-between items-center">
                  <span>What if I'm a complete beginner?</span>
                  <span className="text-cyan-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-gray-400 mt-4 text-sm">
                  Perfect! We have extensive educational resources for beginners. You'll learn everything from basic betting terminology to advanced strategies. Our community is very supportive of new members, and our team is always available to answer questions.
                </p>
              </details>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-8 sm:p-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">Ready to Get Started?</h2>
            <p className="text-lg mb-8 text-blue-50">
              Join 2,800+ members who are already winning with WizJock
            </p>
            <Link 
              to="/apply"
              className="inline-block bg-white hover:bg-gray-100 text-blue-600 font-bold px-8 py-4 rounded-lg text-lg transition-colors"
            >
              Apply for Membership
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
