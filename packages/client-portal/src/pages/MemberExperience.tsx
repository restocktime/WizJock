import { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { OptimizedLogo } from '../components/OptimizedImage';
import { BetCard } from '../components/BetCard';

export default function MemberExperience() {
  const [activeTab, setActiveTab] = useState<'onboarding' | 'picks' | 'dashboard'>('onboarding');

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
              <Link to="/how-it-works" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                How It Works
              </Link>
              <Link to="/member-experience" className="text-white transition-colors text-sm font-medium border-b-2 border-cyan-500">
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
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6">
              EXPERIENCE <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">WIZJOCK</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See exactly what it's like to be a WizJock member—from onboarding to receiving daily picks
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-gray-800/50 border border-gray-700 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('onboarding')}
                className={`px-6 py-3 rounded-md font-semibold transition-all ${activeTab === 'onboarding'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white'
                  : 'text-gray-400 hover:text-white'
                  }`}
              >
                Onboarding
              </button>
              <button
                onClick={() => setActiveTab('picks')}
                className={`px-6 py-3 rounded-md font-semibold transition-all ${activeTab === 'picks'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white'
                  : 'text-gray-400 hover:text-white'
                  }`}
              >
                Daily Picks
              </button>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-6 py-3 rounded-md font-semibold transition-all ${activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white'
                  : 'text-gray-400 hover:text-white'
                  }`}
              >
                Dashboard
              </button>
            </div>
          </div>

          {/* Onboarding Tab */}
          {activeTab === 'onboarding' && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black mb-4">Your First 24 Hours</h2>
                <p className="text-gray-400">Here's what happens after you're approved</p>
              </div>

              {/* Timeline */}
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Step 1 */}
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-2xl font-black">
                      1
                    </div>
                  </div>
                  <div className="flex-1 bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">📧</span>
                      <h3 className="text-xl font-bold">Welcome Email</h3>
                      <span className="text-sm text-gray-400 ml-auto">Within 5 minutes</span>
                    </div>
                    <div className="bg-gray-900/50 rounded-lg p-4 mb-4">
                      <div className="text-sm text-gray-400 mb-2">From: team@wizjock.com</div>
                      <div className="text-sm text-gray-400 mb-3">Subject: Welcome to WizJock! 🎉</div>
                      <div className="text-gray-300 text-sm space-y-2">
                        <p>Hey [Name],</p>
                        <p>Welcome to the WizJock family! We're excited to have you on board.</p>
                        <p><strong>Your login credentials:</strong></p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Dashboard: app.wizjock.com</li>
                          <li>Username: your@email.com</li>
                          <li>Temporary Password: [secure-password]</li>
                        </ul>
                        <p><strong>Next steps:</strong></p>
                        <ol className="list-decimal pl-5 space-y-1">
                          <li>Log in and change your password</li>
                          <li>Complete your profile</li>
                          <li>Join our WhatsApp group (link below)</li>
                          <li>Watch the onboarding video</li>
                        </ol>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-semibold">
                        Access Dashboard
                      </button>
                      <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-semibold">
                        Join WhatsApp
                      </button>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-2xl font-black">
                      2
                    </div>
                  </div>
                  <div className="flex-1 bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">🎥</span>
                      <h3 className="text-xl font-bold">Onboarding Video</h3>
                      <span className="text-sm text-gray-400 ml-auto">15 minutes</span>
                    </div>
                    <div className="bg-gray-900/50 rounded-lg p-6 text-center">
                      <div className="w-full aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center mb-4">
                        <div className="text-center">
                          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                            </svg>
                          </div>
                          <p className="text-gray-400 text-sm">Welcome to WizJock</p>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm mb-4">
                        Learn how to navigate the dashboard, read picks, manage your bankroll, and maximize your success
                      </p>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="bg-gray-800/50 rounded p-3">
                          <div className="text-cyan-400 font-bold mb-1">Module 1</div>
                          <div className="text-gray-400">Dashboard Tour</div>
                        </div>
                        <div className="bg-gray-800/50 rounded p-3">
                          <div className="text-cyan-400 font-bold mb-1">Module 2</div>
                          <div className="text-gray-400">Reading Picks</div>
                        </div>
                        <div className="bg-gray-800/50 rounded p-3">
                          <div className="text-cyan-400 font-bold mb-1">Module 3</div>
                          <div className="text-gray-400">Bankroll Management</div>
                        </div>
                        <div className="bg-gray-800/50 rounded p-3">
                          <div className="text-cyan-400 font-bold mb-1">Module 4</div>
                          <div className="text-gray-400">Community Guidelines</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-2xl font-black">
                      3
                    </div>
                  </div>
                  <div className="flex-1 bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">💬</span>
                      <h3 className="text-xl font-bold">WhatsApp Community</h3>
                      <span className="text-sm text-gray-400 ml-auto">Instant access</span>
                    </div>
                    <div className="bg-gray-900/50 rounded-lg p-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                            WJ
                          </div>
                          <div className="flex-1">
                            <div className="bg-gray-800 rounded-lg p-3">
                              <div className="text-sm font-semibold text-cyan-400 mb-1">WizJock Team</div>
                              <div className="text-sm text-gray-300">
                                Welcome @[YourName]! 👋 Glad to have you here. Feel free to introduce yourself and ask any questions!
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                            M
                          </div>
                          <div className="flex-1">
                            <div className="bg-gray-800 rounded-lg p-3">
                              <div className="text-sm font-semibold text-green-400 mb-1">Mike T.</div>
                              <div className="text-sm text-gray-300">
                                Welcome! Been here 6 months, up 47%. The picks are solid and the community is super helpful 💪
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                            S
                          </div>
                          <div className="flex-1">
                            <div className="bg-gray-800 rounded-lg p-3">
                              <div className="text-sm font-semibold text-purple-400 mb-1">Sarah K.</div>
                              <div className="text-sm text-gray-300">
                                Welcome to the fam! 🎉 Don't hesitate to ask questions, everyone here is super supportive
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 bg-green-900/30 border border-green-500/30 rounded-lg p-4">
                      <p className="text-sm text-gray-300">
                        <strong className="text-green-400">2,847 members</strong> • Active 24/7 • Daily picks posted at 8 AM EST
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-500 rounded-full flex items-center justify-center text-2xl font-black">
                      ✓
                    </div>
                  </div>
                  <div className="flex-1 bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/30 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">🚀</span>
                      <h3 className="text-xl font-bold text-green-400">You're All Set!</h3>
                    </div>
                    <p className="text-gray-300 mb-4">
                      Your first picks will arrive tomorrow morning at 8 AM EST. In the meantime, explore the dashboard, check out past picks, and get familiar with the platform.
                    </p>
                    <div className="grid sm:grid-cols-3 gap-3">
                      <div className="bg-gray-900/50 rounded-lg p-4 text-center">
                        <div className="text-2xl mb-2">📚</div>
                        <div className="text-sm font-semibold mb-1">Education Center</div>
                        <div className="text-xs text-gray-400">50+ guides & videos</div>
                      </div>
                      <div className="bg-gray-900/50 rounded-lg p-4 text-center">
                        <div className="text-2xl mb-2">📊</div>
                        <div className="text-sm font-semibold mb-1">Past Performance</div>
                        <div className="text-xs text-gray-400">1,200+ tracked picks</div>
                      </div>
                      <div className="bg-gray-900/50 rounded-lg p-4 text-center">
                        <div className="text-2xl mb-2">💬</div>
                        <div className="text-sm font-semibold mb-1">Live Support</div>
                        <div className="text-xs text-gray-400">Response in &lt; 2 hours</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Daily Picks Tab */}
          {activeTab === 'picks' && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black mb-4">How You Receive Picks</h2>
                <p className="text-gray-400">Every morning at 8 AM EST, you'll receive curated picks across multiple channels</p>
              </div>

              {/* Delivery Methods */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-center">
                  <div className="text-4xl mb-3">📧</div>
                  <h3 className="text-xl font-bold mb-2">Email</h3>
                  <p className="text-gray-400 text-sm">Detailed picks with full analysis sent to your inbox</p>
                </div>
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-center">
                  <div className="text-4xl mb-3">💬</div>
                  <h3 className="text-xl font-bold mb-2">WhatsApp</h3>
                  <p className="text-gray-400 text-sm">Quick picks posted in the group with live discussion</p>
                </div>
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-center">
                  <div className="text-4xl mb-3">📱</div>
                  <h3 className="text-xl font-bold mb-2">Dashboard</h3>
                  <p className="text-gray-400 text-sm">All picks organized with tracking and analytics</p>
                </div>
              </div>

              {/* Example Picks */}
              <div className="max-w-5xl mx-auto space-y-6">
                <h3 className="text-2xl font-black text-center mb-6">Today's Picks (Example)</h3>

                <BetCard pick={{
                  id: '1',
                  matchup: 'Lakers vs Warriors',
                  betType: 'Spread',
                  recommendation: 'Warriors -3.5',
                  currentOdds: '-110',
                  units: 2,
                  confidenceScore: 90,
                  reasoning: 'Warriors coming off 3 days rest while Lakers played last night (back-to-back). Curry is 12-3 ATS in this matchup historically. Line moved from -2.5 to -3.5 on sharp money.',
                  hierarchy: 'high',
                  gameTime: new Date().toISOString(),
                  sport: 'NBA',
                  playerProps: []
                }} />

                <BetCard pick={{
                  id: '2',
                  matchup: 'Chiefs vs Bills',
                  betType: 'Total',
                  recommendation: 'Over 52.5',
                  currentOdds: '-108',
                  units: 1,
                  confidenceScore: 60,
                  reasoning: 'Two high-powered offenses in a dome. Both teams averaging 28+ PPG. Defenses have been vulnerable. Historical matchups average 56 points.',
                  hierarchy: 'medium',
                  gameTime: new Date().toISOString(),
                  sport: 'NFL',
                  playerProps: []
                }} />

                <BetCard pick={{
                  id: '3',
                  matchup: 'Man City vs Arsenal',
                  betType: 'Both Teams To Score',
                  recommendation: 'Yes',
                  currentOdds: '+105',
                  units: 1.5,
                  confidenceScore: 70,
                  reasoning: 'Both teams to score has hit in 8 of last 10 meetings. Both offenses firing on all cylinders. Arsenal\'s defense has been leaky on the road.',
                  hierarchy: 'value',
                  gameTime: new Date().toISOString(),
                  sport: 'SOCCER',
                  playerProps: []
                }} />
              </div>

              {/* Live Updates Section */}
              <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 border border-orange-500/30 rounded-xl p-6 mt-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">⚡</span>
                  <h3 className="text-2xl font-black">Live Updates</h3>
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold animate-pulse">LIVE</span>
                </div>
                <p className="text-gray-300 mb-4">
                  Throughout the day, we post live updates for breaking news, line movements, and last-minute opportunities
                </p>
                <div className="space-y-3">
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-red-400 text-sm font-bold">🚨 ALERT</span>
                      <span className="text-gray-400 text-xs">2:15 PM</span>
                    </div>
                    <p className="text-sm text-gray-300">
                      <strong>Lakers-Warriors:</strong> LeBron James officially OUT. Line moved from -3.5 to -5.5.
                      Our pick still valid, increased confidence to 9.5/10.
                    </p>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-blue-400 text-sm font-bold">📊 LINE MOVE</span>
                      <span className="text-gray-400 text-xs">3:42 PM</span>
                    </div>
                    <p className="text-sm text-gray-300">
                      <strong>Chiefs-Bills Over 52.5:</strong> Sharp money pushing line to 53. Still good value up to 53.5.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black mb-4">Your Member Dashboard</h2>
                <p className="text-gray-400">Track performance, manage your bankroll, and access all resources in one place</p>
              </div>

              {/* Dashboard Preview */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                {/* Stats Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/30 rounded-lg p-4">
                    <div className="text-xs text-gray-400 mb-1">YOUR ROI</div>
                    <div className="text-3xl font-black text-green-400">+24.3%</div>
                    <div className="text-xs text-green-400 mt-1">↑ Last 30 days</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-500/30 rounded-lg p-4">
                    <div className="text-xs text-gray-400 mb-1">WIN RATE</div>
                    <div className="text-3xl font-black text-blue-400">58.2%</div>
                    <div className="text-xs text-blue-400 mt-1">87 picks tracked</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-lg p-4">
                    <div className="text-xs text-gray-400 mb-1">PROFIT</div>
                    <div className="text-3xl font-black text-purple-400">$2,847</div>
                    <div className="text-xs text-purple-400 mt-1">Total earnings</div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 border border-orange-500/30 rounded-lg p-4">
                    <div className="text-xs text-gray-400 mb-1">BANKROLL</div>
                    <div className="text-3xl font-black text-orange-400">$14,847</div>
                    <div className="text-xs text-orange-400 mt-1">+23.7% growth</div>
                  </div>
                </div>

                {/* Recent Picks Table */}
                <div className="bg-gray-900/50 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-bold mb-4">Recent Picks</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="border-b border-gray-700">
                        <tr className="text-left text-gray-400">
                          <th className="pb-2">Date</th>
                          <th className="pb-2">Game</th>
                          <th className="pb-2">Pick</th>
                          <th className="pb-2">Odds</th>
                          <th className="pb-2">Units</th>
                          <th className="pb-2">Result</th>
                          <th className="pb-2">P/L</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800">
                        <tr>
                          <td className="py-3 text-gray-400">Today</td>
                          <td className="py-3">Lakers vs Warriors</td>
                          <td className="py-3 font-semibold">Warriors -3.5</td>
                          <td className="py-3">-110</td>
                          <td className="py-3">2u</td>
                          <td className="py-3"><span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs">PENDING</span></td>
                          <td className="py-3 text-gray-400">-</td>
                        </tr>
                        <tr>
                          <td className="py-3 text-gray-400">Yesterday</td>
                          <td className="py-3">Celtics vs Heat</td>
                          <td className="py-3 font-semibold">Celtics -7</td>
                          <td className="py-3">-108</td>
                          <td className="py-3">1.5u</td>
                          <td className="py-3"><span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">WON</span></td>
                          <td className="py-3 text-green-400 font-bold">+$139</td>
                        </tr>
                        <tr>
                          <td className="py-3 text-gray-400">Yesterday</td>
                          <td className="py-3">Packers vs Vikings</td>
                          <td className="py-3 font-semibold">Over 48.5</td>
                          <td className="py-3">-112</td>
                          <td className="py-3">1u</td>
                          <td className="py-3"><span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">WON</span></td>
                          <td className="py-3 text-green-400 font-bold">+$89</td>
                        </tr>
                        <tr>
                          <td className="py-3 text-gray-400">2 days ago</td>
                          <td className="py-3">Knicks vs Nets</td>
                          <td className="py-3 font-semibold">Knicks -4.5</td>
                          <td className="py-3">-110</td>
                          <td className="py-3">2u</td>
                          <td className="py-3"><span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs">LOST</span></td>
                          <td className="py-3 text-red-400 font-bold">-$200</td>
                        </tr>
                        <tr>
                          <td className="py-3 text-gray-400">2 days ago</td>
                          <td className="py-3">Man City vs Liverpool</td>
                          <td className="py-3 font-semibold">BTTS Yes</td>
                          <td className="py-3">+105</td>
                          <td className="py-3">1.5u</td>
                          <td className="py-3"><span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">WON</span></td>
                          <td className="py-3 text-green-400 font-bold">+$158</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Performance Chart Placeholder */}
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <h3 className="text-lg font-bold mb-4">Bankroll Growth (Last 30 Days)</h3>
                  <div className="h-64 flex items-end justify-between gap-2">
                    {[12000, 12200, 12100, 12400, 12600, 12500, 12800, 13000, 12900, 13200, 13400, 13300, 13600, 13800, 14000, 14200, 14100, 14400, 14600, 14500, 14800, 14700, 14900, 15000, 14900, 14700, 14850, 14847].map((value, i) => {
                      const height = ((value - 12000) / 3000) * 100;
                      return (
                        <div key={i} className="flex-1 bg-gradient-to-t from-cyan-600 to-blue-600 rounded-t" style={{ height: `${height}%` }}></div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-400">
                    <span>30 days ago</span>
                    <span>Today: $14,847</span>
                  </div>
                </div>
              </div>

              {/* Dashboard Features */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                  <div className="text-3xl mb-3">📊</div>
                  <h3 className="text-xl font-bold mb-2">Analytics</h3>
                  <ul className="text-sm text-gray-400 space-y-2">
                    <li>• Win rate by sport</li>
                    <li>• ROI tracking</li>
                    <li>• Unit performance</li>
                    <li>• Closing line value</li>
                    <li>• Best bet types</li>
                  </ul>
                </div>
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                  <div className="text-3xl mb-3">💰</div>
                  <h3 className="text-xl font-bold mb-2">Bankroll Tools</h3>
                  <ul className="text-sm text-gray-400 space-y-2">
                    <li>• Unit calculator</li>
                    <li>• Risk management</li>
                    <li>• Profit/loss tracking</li>
                    <li>• Goal setting</li>
                    <li>• Export reports</li>
                  </ul>
                </div>
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                  <div className="text-3xl mb-3">🎓</div>
                  <h3 className="text-xl font-bold mb-2">Education</h3>
                  <ul className="text-sm text-gray-400 space-y-2">
                    <li>• Video courses</li>
                    <li>• Strategy guides</li>
                    <li>• Webinar replays</li>
                    <li>• Q&A archive</li>
                    <li>• Betting glossary</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-8 sm:p-12 text-center mt-16">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">Ready to Experience This?</h2>
            <p className="text-lg mb-8 text-blue-50">
              Join 2,800+ members who receive picks like these every day
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
