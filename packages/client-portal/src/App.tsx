import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import ComingSoon from './ComingSoon';

const queryClient = new QueryClient();

function App() {
  const [isVisible, setIsVisible] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    // Check if URL has #coming-soon
    if (window.location.hash === '#coming-soon') {
      setShowComingSoon(true);
    }
  }, []);

  useEffect(() => {
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
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20"></div>
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-200"></div>
            <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-400"></div>
          </div>

          <div className="section relative z-10 text-center">
            <div className={`${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}>
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <img
                    src="/wizjock-logo.png"
                    alt="WizJock Logo"
                    className="w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-2xl"
                  />
                </div>
              </div>
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
                <span className="gradient-text animate-gradient">WizJock</span>
              </h1>
              <p className="text-2xl md:text-3xl text-gray-300 mb-2">
                Win Smarter with AI-Powered Picks
              </p>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                AI-powered sports betting analysis that gives you the winning edge.
                Expert picks for NFL, NBA, NCAA, and UFC backed by real-time data.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <a href="#coming-soon" className="btn-gradient inline-block">
                  Start Winning Today
                </a>
                <a href="#coming-soon" className="btn-outline inline-block">
                  View Sample Picks
                </a>
              </div>
              <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>No Credit Card Required</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>7-Day Free Trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Cancel Anytime</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </section>

        {/* Stats Section */}
        <section className="section">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="glass-card p-6 text-center animate-fadeInUp delay-100">
              <div className="text-4xl font-bold gradient-text mb-2">67%</div>
              <div className="text-gray-400 text-sm">Win Rate</div>
            </div>
            <div className="glass-card p-6 text-center animate-fadeInUp delay-200">
              <div className="text-4xl font-bold gradient-text mb-2">50K+</div>
              <div className="text-gray-400 text-sm">Active Users</div>
            </div>
            <div className="glass-card p-6 text-center animate-fadeInUp delay-300">
              <div className="text-4xl font-bold gradient-text mb-2">$2.4M</div>
              <div className="text-gray-400 text-sm">Won This Month</div>
            </div>
            <div className="glass-card p-6 text-center animate-fadeInUp delay-400">
              <div className="text-4xl font-bold gradient-text mb-2">24/7</div>
              <div className="text-gray-400 text-sm">Live Analysis</div>
            </div>
          </div>
        </section>

        {/* Winning Slips Section */}
        <section className="section">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">
              Recent <span className="gradient-text">Winning Slips</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Real results from real bettors. See why thousands trust WizJock for their winning edge.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {/* Note: Add your betting slip images to packages/client-portal/public/slips/ */}
            {/* Slip 1 */}
            <div className="glass-card p-4 hover:scale-105 transition-transform h-full flex flex-col">
              <img
                src="/slips/slip1.png"
                alt="5-Bet Parlay Winner - $222.92"
                className="w-full aspect-[9/16] object-contain bg-gray-900 rounded-lg shadow-2xl"
              />
            </div>

            {/* Slip 2 */}
            <div className="glass-card p-4 hover:scale-105 transition-transform h-full flex flex-col">
              <img
                src="/slips/slip2.png"
                alt="6-Bet Parlay Winner - $197.69"
                className="w-full aspect-[9/16] object-contain bg-gray-900 rounded-lg shadow-2xl"
              />
            </div>

            {/* Slip 3 */}
            <div className="glass-card p-4 hover:scale-105 transition-transform h-full flex flex-col">
              <img
                src="/slips/slip3.png"
                alt="UFC 4-Bet Parlay Winner - $763.39"
                className="w-full aspect-[9/16] object-contain bg-gray-900 rounded-lg shadow-2xl"
              />
            </div>

            {/* Slip 4 */}
            <div className="glass-card p-4 hover:scale-105 transition-transform h-full flex flex-col">
              <img
                src="/slips/slip4.png"
                alt="NFL 3-Bet Parlay Winner - $74.12"
                className="w-full aspect-[9/16] object-contain bg-gray-900 rounded-lg shadow-2xl"
              />
              <div className="hidden text-center py-8 text-gray-400">
                <p className="text-sm">Betting slip image</p>
                <p className="text-xs mt-2">Add slip4.png to /public/slips/</p>
              </div>
            </div>

            {/* Slip 5 */}
            <div className="glass-card p-4 hover:scale-105 transition-transform h-full flex flex-col">
              <img
                src="/slips/slip5.png"
                alt="NBA Props 5-Bet Winner - $300.41"
                className="w-full aspect-[9/16] object-contain bg-gray-900 rounded-lg shadow-2xl"
              />
              <div className="hidden text-center py-8 text-gray-400">
                <p className="text-sm">Betting slip image</p>
                <p className="text-xs mt-2">Add slip5.png to /public/slips/</p>
              </div>
            </div>

            {/* Slip 6 */}
            <div className="glass-card p-4 hover:scale-105 transition-transform h-full flex flex-col">
              <img
                src="/slips/slip6.png"
                alt="2-Bet Parlay Winner - $108.89"
                className="w-full aspect-[9/16] object-contain bg-gray-900 rounded-lg shadow-2xl"
              />
              <div className="hidden text-center py-8 text-gray-400">
                <p className="text-sm">Betting slip image</p>
                <p className="text-xs mt-2">Add slip6.png to /public/slips/</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-400 mb-6">Join thousands of winning bettors in our exclusive community</p>
            <a
              href="https://chat.whatsapp.com/FgmkVMnR3SH6aTFjO7QL2k"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-8 py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Join Our WhatsApp Community
            </a>
          </div>
        </section>


        {/* Features Section */}
        <section className="section">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">
              Why Choose <span className="gradient-text">WizJock</span>?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Our AI-powered platform analyzes thousands of data points to give you the edge you need
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="feature-card">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">Advanced Analytics</h3>
              <p className="text-gray-400">
                Machine learning algorithms analyze player stats, team performance, weather conditions, and historical data to predict outcomes with precision.
              </p>
            </div>

            <div className="feature-card">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">Real-Time Updates</h3>
              <p className="text-gray-400">
                Get instant notifications on line movements, injury reports, and breaking news that could impact your bets.
              </p>
            </div>

            <div className="feature-card">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-green-500 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">Proven Track Record</h3>
              <p className="text-gray-400">
                67% win rate across all sports with transparent results. Every pick is tracked and verified for complete accountability.
              </p>
            </div>

            <div className="feature-card">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-yellow-500 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">Bankroll Management</h3>
              <p className="text-gray-400">
                Smart betting strategies and unit recommendations to protect your bankroll and maximize long-term profits.
              </p>
            </div>

            <div className="feature-card">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">Expert Community</h3>
              <p className="text-gray-400">
                Join thousands of winning bettors. Share insights, discuss strategies, and learn from the best in our exclusive community.
              </p>
            </div>

            <div className="feature-card">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">Multi-Sport Coverage</h3>
              <p className="text-gray-400">
                NFL, NBA, NCAA Football & Basketball, UFC, and more. Get expert analysis across all major sports leagues.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="section">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Start winning in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-2xl font-bold mb-3">Sign Up</h3>
              <p className="text-gray-400">
                Create your free account in seconds. No credit card required for your 7-day trial.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-2xl font-bold mb-3">Get Picks</h3>
              <p className="text-gray-400">
                Receive daily expert picks with detailed analysis and confidence ratings for each bet.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-green-500 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-2xl font-bold mb-3">Start Winning</h3>
              <p className="text-gray-400">
                Place your bets with confidence and watch your bankroll grow with our proven strategies.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="section">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">
              Simple <span className="gradient-text">Pricing</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Choose the plan that fits your betting style
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter Plan */}
            <div className="pricing-card">
              <h3 className="text-2xl font-bold mb-2">Starter</h3>
              <p className="text-gray-400 mb-6">Perfect for serious bettors</p>
              <div className="mb-6">
                <span className="text-5xl font-bold">$299</span>
                <span className="text-gray-400">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">5 daily picks</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">Basic analytics</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">Email support</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">Community access</span>
                </li>
              </ul>
              <a href="#coming-soon" className="btn-outline w-full inline-block text-center">Get Started</a>
            </div>

            {/* Pro Plan - Featured */}
            <div className="pricing-card featured">
              <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm font-bold">
                MOST POPULAR
              </div>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <p className="text-gray-400 mb-6">For elite professionals</p>
              <div className="mb-6">
                <span className="text-5xl font-bold">$799</span>
                <span className="text-gray-400">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">Unlimited daily picks</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">Advanced AI analytics</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">Priority support</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">Real-time alerts</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">Bankroll tracker</span>
                </li>
              </ul>
              <a href="#coming-soon" className="btn-gradient w-full inline-block text-center">Get Started</a>
            </div>

            {/* Elite Plan */}
            <div className="pricing-card">
              <h3 className="text-2xl font-bold mb-2">Elite</h3>
              <p className="text-gray-400 mb-6">Ultra-exclusive VIP access</p>
              <div className="mb-6">
                <span className="text-5xl font-bold">$1,999</span>
                <span className="text-gray-400">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">Everything in Pro</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">1-on-1 strategy sessions</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">Custom betting models</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">VIP community access</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">Dedicated account manager</span>
                </li>
              </ul>
              <a href="#coming-soon" className="btn-outline w-full inline-block text-center">Get Started</a>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section">
          <div className="glass-card p-12 md:p-16 text-center max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Start <span className="gradient-text">Winning</span>?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join 50,000+ bettors who are already using Wiz Jock to gain the winning edge.
              Start your free 7-day trial today.
            </p>
            <a href="#coming-soon" className="btn-gradient text-xl px-12 py-4 inline-block">
              Start Free Trial
            </a>
            <p className="text-sm text-gray-400 mt-4">
              No credit card required • Cancel anytime
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-800 py-12">
          <div className="section">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src="/wizjock-logo.png"
                    alt="WizJock Logo"
                    className="w-12 h-12 object-contain"
                  />
                  <h3 className="text-2xl font-bold gradient-text">WizJock</h3>
                </div>
                <p className="text-gray-400 text-sm">
                  AI-powered sports betting analysis for elite bettors.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-4">Product</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><a href="#" className="hover:text-white transition">Features</a></li>
                  <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                  <li><a href="#" className="hover:text-white transition">How It Works</a></li>
                  <li><a href="#" className="hover:text-white transition">FAQ</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Company</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><a href="#" className="hover:text-white transition">About Us</a></li>
                  <li><a href="#" className="hover:text-white transition">Blog</a></li>
                  <li><a href="#" className="hover:text-white transition">Careers</a></li>
                  <li><a href="#" className="hover:text-white transition">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Legal</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-white transition">Responsible Gaming</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                © 2025 WizJock. All rights reserved.
              </p>
              <div className="flex gap-6">
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </QueryClientProvider>
  );
}

export default App;
