import { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import PerformanceDisclaimer from '../components/PerformanceDisclaimer';
import ComingSoonModal from '../components/ComingSoonModal';
import { OptimizedLogo } from '../components/OptimizedImage';
import { CardShuffle } from '../components/CardShuffle';
import { trackCTAClick, trackWhatsAppClick } from '../utils/analytics';

export default function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      {/* Skip to main content link for keyboard navigation */}
      <a href="#main-content" className="skip-to-main">
        Skip to main content
      </a>

      {/* Navigation Header */}
      <header className="bg-black/95 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-800" role="banner">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 sm:gap-3">
              <OptimizedLogo alt="WizJock logo" className="h-8 sm:h-12 w-auto" />
              <span className="text-lg sm:text-2xl font-black text-white">WIZJOCK</span>
            </Link>

            {/* Desktop Navigation */}
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
              <Link to="/member-experience" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                Member Experience
              </Link>
              <Link to="/contact" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                Contact
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-white p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>

            {/* CTA Button - Desktop */}
            <Link
              to="/apply"
              onClick={() => trackCTAClick('header')}
              className="hidden lg:flex bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold px-6 py-3 rounded-lg text-sm min-h-[44px] items-center"
              aria-label="Get started with WizJock"
            >
              GET STARTED
            </Link>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <nav className="lg:hidden py-4 border-t border-gray-800" aria-label="Mobile navigation">
              <div className="flex flex-col space-y-4">
                <Link
                  to="/about"
                  onClick={closeMobileMenu}
                  className="text-gray-300 hover:text-white transition-colors text-base font-medium py-2"
                >
                  About Us
                </Link>
                <Link
                  to="/why-us"
                  onClick={closeMobileMenu}
                  className="text-gray-300 hover:text-white transition-colors text-base font-medium py-2"
                >
                  Why Us
                </Link>
                <Link
                  to="/how-it-works"
                  onClick={closeMobileMenu}
                  className="text-gray-300 hover:text-white transition-colors text-base font-medium py-2"
                >
                  How It Works
                </Link>
                <Link
                  to="/member-experience"
                  onClick={closeMobileMenu}
                  className="text-gray-300 hover:text-white transition-colors text-base font-medium py-2"
                >
                  Member Experience
                </Link>
                <Link
                  to="/contact"
                  onClick={closeMobileMenu}
                  className="text-gray-300 hover:text-white transition-colors text-base font-medium py-2"
                >
                  Contact
                </Link>
                <Link
                  to="/apply"
                  onClick={() => {
                    trackCTAClick('mobile_menu');
                    closeMobileMenu();
                  }}
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold px-6 py-3 rounded-lg text-center min-h-[44px] flex items-center justify-center"
                >
                  GET STARTED
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Hero - Bold & Direct */}
      <main id="main-content">
        <section className="relative px-4 pt-12 sm:pt-16 pb-20 overflow-hidden" aria-label="Hero section">
          {/* Background Gradients */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-cyan-600/10 rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto relative z-10">

            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block bg-orange-500 text-white px-4 py-1 rounded-full text-xs font-bold mb-4">
                INVITE ONLY
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black mb-4 sm:mb-6 leading-tight">
                WIN MORE.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                  LOSE LESS.
                </span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto">
                Professional sports betting analysis and insider intelligence.
                Get the edge sharp bettors use to beat the books.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8 justify-center">
                <Link
                  to="/apply"
                  onClick={() => trackCTAClick('hero')}
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold px-6 sm:px-8 py-4 rounded-lg text-base sm:text-lg min-h-[44px] flex items-center justify-center hover-lift relative overflow-hidden group"
                >
                  <span className="relative z-10">Request Access</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                </Link>
                <a
                  href="https://chat.whatsapp.com/FgmkVMnR3SH6aTFjO7QL2k"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsAppClick('hero')}
                  className="border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white font-bold px-6 sm:px-8 py-4 rounded-lg text-base sm:text-lg min-h-[44px] flex flex-col items-center justify-center group relative"
                  title="Join our community to see live picks and results. Free to join, subscription required for full access."
                >
                  <span>Join WhatsApp</span>
                  <span className="text-xs font-normal mt-0.5 opacity-80 group-hover:opacity-100">See live picks & results</span>
                </a>
              </div>

              {/* Live Stats Bar */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 sm:p-6 hover-glow animate-scale-in max-w-3xl mx-auto">
                <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                  <div className="animate-slide-up-fade">
                    <div className="text-xl sm:text-2xl lg:text-3xl font-black text-green-400 animate-glow-pulse">+18.7%</div>
                    <div className="text-[10px] sm:text-xs text-gray-400 uppercase leading-tight">ROI Last 90 Days</div>
                  </div>
                  <div className="animate-slide-up-fade delay-100">
                    <div className="text-xl sm:text-2xl lg:text-3xl font-black text-blue-400">+4.2%</div>
                    <div className="text-[10px] sm:text-xs text-gray-400 uppercase leading-tight">Avg EV Per Bet</div>
                  </div>
                  <div className="animate-slide-up-fade delay-200">
                    <div className="text-xl sm:text-2xl lg:text-3xl font-black text-cyan-400">2,847</div>
                    <div className="text-[10px] sm:text-xs text-gray-400 uppercase leading-tight">Active Members</div>
                  </div>
                </div>
                <PerformanceDisclaimer variant="block" className="text-center" />
              </div>
            </div>
          </div>
        </section>

        {/* Winning Slips Grid - Like DraftKings Showcase */}
        <section className="py-12 sm:py-16 px-4 bg-black" aria-label="Recent wins">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-2">RECENT WINS</h2>
                <p className="text-sm sm:text-base text-gray-400">Real members. Real money. Real results.</p>
              </div>
              <a
                href="https://chat.whatsapp.com/FgmkVMnR3SH6aTFjO7QL2k"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick('recent_wins')}
                className="hidden sm:flex bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-lg min-h-[44px] flex-col items-center justify-center group"
                title="Join our community to see live picks and results. Free to join, subscription required for full access."
              >
                <span>See All Wins</span>
                <span className="text-xs font-normal opacity-80 group-hover:opacity-100">in WhatsApp Community</span>
              </a>
            </div>

            {/* Card Shuffle Animation */}
            <CardShuffle />
          </div>
        </section>

        {/* About Us / Why Us - What Makes Us Different */}
        <section id="about" className="py-12 sm:py-16 lg:py-20 px-4 bg-gradient-to-b from-gray-900 to-black scroll-mt-20" aria-label="About WizJock">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black mb-3 sm:mb-4">ABOUT WIZJOCK</h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto mb-8">
                We're a team of professional sports analysts, data scientists, and sharp bettors who've been beating the books for years. Now we're sharing our edge with a select community of serious bettors.
              </p>
            </div>

            {/* Our Story */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-bold mb-4 text-cyan-400">Our Mission</h3>
                <p className="text-gray-300 text-sm sm:text-base mb-4">
                  Sports betting shouldn't be gambling—it should be strategic investing. We built WizJock to level the playing field between casual bettors and professional sharps.
                </p>
                <p className="text-gray-300 text-sm sm:text-base">
                  Our mission is to provide everyday bettors with the same tools, data, and insights that professional betting syndicates use to consistently profit from sports betting.
                </p>
              </div>

              <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-bold mb-4 text-green-400">Our Track Record</h3>
                <p className="text-gray-300 text-sm sm:text-base mb-4">
                  Over the past 90 days, our system has delivered a +18.7% ROI across 1,200+ tracked picks. We don't cherry-pick results—every single pick is documented and verified.
                </p>
                <p className="text-gray-300 text-sm sm:text-base">
                  Our members have collectively won over $2.8M in the last year, with an average member bankroll growth of 47% over 6 months.
                </p>
              </div>
            </div>

            {/* Our Team */}
            <div className="text-center mb-8">
              <h3 className="text-2xl sm:text-3xl font-black mb-6">OUR TEAM</h3>
            </div>
            <div className="grid sm:grid-cols-3 gap-6 mb-16">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                  📊
                </div>
                <h4 className="text-lg font-bold mb-2">Data Scientists</h4>
                <p className="text-gray-400 text-sm">
                  PhD-level analysts who build predictive models using machine learning and advanced statistics
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                  🏆
                </div>
                <h4 className="text-lg font-bold mb-2">Sports Experts</h4>
                <p className="text-gray-400 text-sm">
                  Former athletes and coaches with insider knowledge of team dynamics and player performance
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                  💰
                </div>
                <h4 className="text-lg font-bold mb-2">Sharp Bettors</h4>
                <p className="text-gray-400 text-sm">
                  Professional gamblers who've made millions betting on sports and understand market inefficiencies
                </p>
              </div>
            </div>

            <div id="why-us" className="scroll-mt-20">
              <div className="text-center mb-12 sm:mb-16">
                <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black mb-3 sm:mb-4">WHY CHOOSE US</h2>
                <p className="text-base sm:text-lg lg:text-xl text-gray-400">Professional analysis meets insider intelligence</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 sm:p-8 hover-lift hover-glow">
                  <div className="text-cyan-400 text-3xl sm:text-4xl mb-3 sm:mb-4 animate-bounce-subtle">🧠</div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Advanced Analytics</h3>
                  <p className="text-sm sm:text-base text-gray-400 mb-3 sm:mb-4">
                    Our system analyzes thousands of data points daily—player stats, injury reports, weather, betting trends, line movements, and historical matchups.
                  </p>
                  <p className="text-sm sm:text-base text-gray-400">
                    We identify value bets the market underprices. Consistent edge over time is how sharp bettors win.
                  </p>
                </div>

                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 sm:p-8 hover-lift hover-glow">
                  <div className="text-green-400 text-3xl sm:text-4xl mb-3 sm:mb-4 animate-bounce-subtle">⚡</div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Real-Time Intelligence</h3>
                  <p className="text-sm sm:text-base text-gray-400 mb-3 sm:mb-4">
                    Lines move fast. Injuries happen. Weather changes. Our system monitors everything 24/7 and alerts you instantly when conditions shift.
                  </p>
                  <p className="text-sm sm:text-base text-gray-400">
                    You get the information before the public catches on—that's when the real money is made.
                  </p>
                </div>

                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 sm:p-8 hover-lift hover-glow">
                  <div className="text-blue-400 text-3xl sm:text-4xl mb-3 sm:mb-4 animate-bounce-subtle">📊</div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Smart Bankroll Management</h3>
                  <p className="text-sm sm:text-base text-gray-400 mb-3 sm:mb-4">
                    Every pick comes with a confidence rating and recommended unit size. No guessing. No chasing losses.
                  </p>
                  <p className="text-sm sm:text-base text-gray-400">
                    Proper bankroll management is the difference between winning long-term and going broke.
                  </p>
                </div>

                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 sm:p-8 hover-lift hover-glow">
                  <div className="text-orange-400 text-3xl sm:text-4xl mb-3 sm:mb-4 animate-bounce-subtle">✅</div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">100% Transparent Results</h3>
                  <p className="text-sm sm:text-base text-gray-400 mb-3 sm:mb-4">
                    Every pick is tracked and timestamped. No cherry-picking wins. No hiding losses.
                  </p>
                  <p className="text-sm sm:text-base text-gray-400 mb-3 sm:mb-4">
                    All results are verified and documented. See the proof in our winning slips above.
                  </p>
                  <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-700">
                    <p className="text-xs sm:text-sm text-cyan-400 font-semibold animate-pulse">
                      📊 Full public dashboard launching soon
                    </p>
                  </div>
                </div>
              </div>

              {/* Simple Process */}
              <div id="how-it-works" className="border-t border-gray-800 pt-12 sm:pt-16 scroll-mt-20">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-center mb-8 sm:mb-12">HOW IT WORKS</h3>
                <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
                  <div className="text-center">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-xl sm:text-2xl font-black mx-auto mb-3 sm:mb-4">1</div>
                    <h4 className="text-base sm:text-lg font-bold mb-2">Apply & Get Approved</h4>
                    <p className="text-gray-400 text-xs sm:text-sm">Request access. We review applications to keep the community quality high.</p>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-xl sm:text-2xl font-black mx-auto mb-3 sm:mb-4">2</div>
                    <h4 className="text-base sm:text-lg font-bold mb-2">Receive Daily Picks</h4>
                    <p className="text-gray-400 text-xs sm:text-sm">Get AI-analyzed picks with confidence ratings, odds, and recommended units.</p>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-xl sm:text-2xl font-black mx-auto mb-3 sm:mb-4">3</div>
                    <h4 className="text-base sm:text-lg font-bold mb-2">Win & Build Bankroll</h4>
                    <p className="text-gray-400 text-xs sm:text-sm">Place your bets, track results, and watch your bankroll grow consistently.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What You Get */}
        <section id="what-you-get" className="py-12 sm:py-16 lg:py-20 px-4 scroll-mt-20" aria-label="What you get">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black mb-3 sm:mb-4">WHAT YOU GET</h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-400">Everything you need to bet like a professional</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 sm:p-6">
                <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">📱</div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Daily Picks Delivered</h3>
                <p className="text-gray-400 text-xs sm:text-sm">
                  Wake up to curated picks in your inbox and WhatsApp. Each pick includes the game, bet type, odds, confidence level, and recommended unit size.
                </p>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 sm:p-6">
                <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">📈</div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Live Line Alerts</h3>
                <p className="text-gray-400 text-xs sm:text-sm">
                  Get notified when lines move in your favor or when breaking news impacts a game. Time-sensitive opportunities sent directly to you.
                </p>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 sm:p-6">
                <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">💬</div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Private Community</h3>
                <p className="text-gray-400 text-xs sm:text-sm mb-2 sm:mb-3">
                  Access to our members-only Discord and WhatsApp groups. Share insights, discuss picks, and learn from other sharp bettors.
                </p>
                <p className="text-cyan-400 text-xs sm:text-sm font-semibold">
                  💬 Our WhatsApp community is where members receive daily picks and track results in real-time
                </p>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 sm:p-6">
                <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">📊</div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Performance Dashboard</h3>
                <p className="text-gray-400 text-xs sm:text-sm">
                  Track every pick with detailed analytics. See your ROI, win rate by sport, best bet types, and bankroll growth over time.
                </p>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 sm:p-6">
                <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">🎓</div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Betting Education</h3>
                <p className="text-gray-400 text-xs sm:text-sm">
                  Learn the strategies pros use. Weekly breakdowns on bankroll management, line shopping, hedging, and identifying value.
                </p>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 sm:p-6">
                <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">🔒</div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Verified Results</h3>
                <p className="text-gray-400 text-xs sm:text-sm">
                  Full transparency. Every pick is timestamped and tracked. No edited screenshots or fake records—just real, documented results.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Bar */}
        <section className="py-8 sm:py-12 px-4 bg-gradient-to-r from-blue-900/30 to-cyan-900/30" aria-label="Performance statistics">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 text-center">
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
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-orange-400 mb-1 sm:mb-2">24/7</div>
                <div className="text-xs sm:text-sm text-gray-400">Live Monitoring</div>
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <PerformanceDisclaimer variant="block" className="text-center" />
            </div>
          </div>
        </section>

        {/* Pricing - Bold & Clear */}
        <section id="pricing" className="py-12 sm:py-16 lg:py-20 px-4 bg-black scroll-mt-20" aria-label="Pricing plans">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black mb-3 sm:mb-4">CHOOSE YOUR PLAN</h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-400">Limited spots available per tier</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Starter */}
              <div className="bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6 sm:p-8 hover:border-blue-500/50 transition hover-lift animate-scale-in">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 sm:mb-3">STARTER</div>
                <div className="mb-4 sm:mb-6">
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">$299</span>
                  <span className="text-gray-500 text-base sm:text-lg">/mo</span>
                </div>
                <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  <li className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-gray-300">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>5 daily picks</span>
                  </li>
                  <li className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-gray-300">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Basic analytics</span>
                  </li>
                  <li className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-gray-300">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Community access</span>
                  </li>
                  <li className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-gray-300">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Email support</span>
                  </li>
                </ul>
                <Link
                  to="/apply"
                  onClick={() => trackCTAClick('pricing_starter')}
                  className="block w-full bg-white hover:bg-gray-100 text-black font-bold py-3 sm:py-4 rounded-lg text-center transition text-sm sm:text-base min-h-[44px] flex items-center justify-center relative overflow-hidden group"
                >
                  <span className="relative z-10">Get Started</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                </Link>
              </div>

              {/* Pro - Featured */}
              <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 rounded-xl p-6 sm:p-8 relative transform lg:scale-105 shadow-2xl shadow-blue-500/50 sm:col-span-2 lg:col-span-1 hover-lift animate-scale-in animate-glow-pulse">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-4 sm:px-6 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider animate-bounce-subtle">
                  Most Popular
                </div>
                <div className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-2 sm:mb-3">PRO</div>
                <div className="mb-4 sm:mb-6">
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">$799</span>
                  <span className="text-blue-200 text-base sm:text-lg">/mo</span>
                </div>
                <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  <li className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-white">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Unlimited daily picks</span>
                  </li>
                  <li className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-white">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Advanced AI analytics</span>
                  </li>
                  <li className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-white">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Real-time alerts</span>
                  </li>
                  <li className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-white">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Priority support</span>
                  </li>
                  <li className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-white">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Live chat access</span>
                  </li>
                </ul>
                <Link
                  to="/apply"
                  onClick={() => trackCTAClick('pricing_pro')}
                  className="block w-full bg-white hover:bg-gray-100 text-blue-600 font-bold py-3 sm:py-4 rounded-lg text-center transition text-sm sm:text-base min-h-[44px] flex items-center justify-center relative overflow-hidden group"
                >
                  <span className="relative z-10">Get Started</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                </Link>
              </div>

              {/* Elite */}
              <div className="bg-gradient-to-b from-gray-800 to-gray-900 border border-yellow-500/30 rounded-xl p-6 sm:p-8 hover:border-yellow-500/60 transition sm:col-span-2 lg:col-span-1">
                <div className="text-xs font-bold text-yellow-500 uppercase tracking-wider mb-2 sm:mb-3">ELITE</div>
                <div className="mb-4 sm:mb-6">
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">$1,999</span>
                  <span className="text-gray-500 text-base sm:text-lg">/mo</span>
                </div>
                <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  <li className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-gray-300">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Everything in Pro</span>
                  </li>
                  <li className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-gray-300">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>1-on-1 strategy sessions</span>
                  </li>
                  <li className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-gray-300">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Custom betting models</span>
                  </li>
                  <li className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-gray-300">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>VIP community</span>
                  </li>
                  <li className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-gray-300">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Dedicated account manager</span>
                  </li>
                </ul>
                <Link
                  to="/apply"
                  onClick={() => trackCTAClick('pricing_elite')}
                  className="block w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold py-3 sm:py-4 rounded-lg text-center transition text-sm sm:text-base min-h-[44px] flex items-center justify-center"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-12 sm:py-16 lg:py-20 px-4 bg-gradient-to-r from-blue-600 to-cyan-500" aria-label="Call to action">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black mb-4 sm:mb-6">READY TO GET THE EDGE?</h2>
            <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 text-blue-50">Join 2,800+ members betting smarter with insider analysis</p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link
                to="/apply"
                onClick={() => trackCTAClick('final_cta')}
                className="bg-white hover:bg-gray-100 text-blue-600 font-bold px-8 sm:px-10 py-4 sm:py-5 rounded-lg text-base sm:text-lg min-h-[44px] flex items-center justify-center"
              >
                Request Access Now
              </Link>
              <a
                href="https://chat.whatsapp.com/FgmkVMnR3SH6aTFjO7QL2k"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick('final_cta')}
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-bold px-8 sm:px-10 py-4 sm:py-5 rounded-lg text-base sm:text-lg min-h-[44px] flex flex-col items-center justify-center group"
                title="Join our community to see live picks and results. Free to join, subscription required for full access."
              >
                <span>Join WhatsApp</span>
                <span className="text-xs font-normal mt-0.5 opacity-80 group-hover:opacity-100">See live picks & results</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Coming Soon Modal */}
      <ComingSoonModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
