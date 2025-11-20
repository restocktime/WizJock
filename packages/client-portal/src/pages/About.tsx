import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { OptimizedLogo } from '../components/OptimizedImage';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-black/95 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-800" role="banner">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link to="/" className="flex items-center gap-2 sm:gap-3">
              <OptimizedLogo alt="WizJock logo" className="h-8 sm:h-12 w-auto" />
              <span className="text-lg sm:text-2xl font-black text-white">WIZJOCK</span>
            </Link>

            <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
              <Link to="/about" className="text-white transition-colors text-sm font-medium border-b-2 border-cyan-500">
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

            <Link 
              to="/apply" 
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm min-h-[44px] flex items-center"
            >
              GET STARTED
            </Link>
          </div>
        </div>
      </header>
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">About WizJock</h1>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                At WizJock, we're on a mission to bring transparency, data-driven analysis, and community to the world of sports betting. 
                We believe that informed bettors make better decisions, and that success in sports betting comes from disciplined research, 
                bankroll management, and a commitment to continuous improvement.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                Our goal is to provide our members with high-quality picks backed by rigorous analysis, while fostering a community 
                where bettors can learn, share insights, and grow together.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">What We Do</h2>
              <p className="text-gray-700 mb-4">
                WizJock provides premium sports betting analysis and picks across multiple sports:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Daily Picks:</strong> Carefully researched betting recommendations across NFL, NBA, NCAA, UFC, and more</li>
                <li><strong>In-Depth Analysis:</strong> Detailed breakdowns of matchups, trends, and betting angles</li>
                <li><strong>Performance Tracking:</strong> Full transparency with verified results and historical performance data</li>
                <li><strong>Community Access:</strong> Private WhatsApp group where members can discuss picks, share insights, and track results in real-time</li>
                <li><strong>Educational Content:</strong> Resources to help you become a better, more disciplined bettor</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Approach</h2>
              <div className="space-y-4">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">📊 Data-Driven Analysis</h3>
                  <p className="text-gray-700">
                    We combine advanced analytics, statistical modeling, and expert sports knowledge to identify value in the betting markets. 
                    Every pick is backed by research and analysis, not gut feelings.
                  </p>
                </div>

                <div className="bg-green-50 border-l-4 border-green-500 p-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">✅ Full Transparency</h3>
                  <p className="text-gray-700">
                    We track and publish all of our picks and results. No cherry-picking, no hiding losses. Our members deserve to see 
                    the full picture of our performance, including both wins and losses.
                  </p>
                </div>

                <div className="bg-purple-50 border-l-4 border-purple-500 p-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">🎯 Bankroll Management</h3>
                  <p className="text-gray-700">
                    We emphasize responsible betting with proper unit sizing and bankroll management. Long-term success in sports betting 
                    requires discipline, and we help our members develop sustainable betting habits.
                  </p>
                </div>

                <div className="bg-orange-50 border-l-4 border-orange-500 p-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">🤝 Community First</h3>
                  <p className="text-gray-700">
                    Our WhatsApp community is more than just a place to receive picks. It's a space where bettors can learn from each other, 
                    discuss strategies, and celebrate wins together. We're building a community of informed, responsible bettors.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Values</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Integrity</h3>
                  <p className="text-gray-700">
                    We're honest about our results, transparent about our methods, and committed to ethical practices in everything we do.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Excellence</h3>
                  <p className="text-gray-700">
                    We strive for the highest quality in our analysis, constantly refining our methods and learning from both successes and failures.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Responsibility</h3>
                  <p className="text-gray-700">
                    We promote responsible gambling and encourage our members to bet within their means and maintain healthy relationships with betting.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Community</h3>
                  <p className="text-gray-700">
                    We believe in the power of community and create spaces where bettors can connect, learn, and support each other.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Why Choose WizJock?</h2>
              <p className="text-gray-700 mb-4">
                The sports betting industry is full of services making unrealistic promises and hiding their true results. We're different:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>We publish all picks and results - wins and losses</li>
                <li>We focus on long-term profitability, not short-term hype</li>
                <li>We educate our members on proper bankroll management</li>
                <li>We're building a real community, not just selling picks</li>
                <li>We're committed to responsible gambling practices</li>
                <li>We continuously improve our methods based on data and feedback</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Commitment to You</h2>
              <p className="text-gray-700 mb-4">
                When you join WizJock, you can expect:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg space-y-3">
                <p className="text-gray-700">✓ High-quality, well-researched picks delivered daily</p>
                <p className="text-gray-700">✓ Complete transparency in our performance tracking</p>
                <p className="text-gray-700">✓ Access to a supportive community of fellow bettors</p>
                <p className="text-gray-700">✓ Educational resources to improve your betting skills</p>
                <p className="text-gray-700">✓ Responsive customer support when you need help</p>
                <p className="text-gray-700">✓ A commitment to responsible gambling practices</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Join Our Community</h2>
              <p className="text-gray-700 mb-4">
                Ready to take your sports betting to the next level? We're accepting new members who are serious about improving their 
                betting results and want to be part of a transparent, data-driven community.
              </p>
              <div className="bg-blue-600 text-white p-6 rounded-lg text-center">
                <p className="text-xl font-semibold mb-4">Start Your Journey with WizJock</p>
                <a 
                  href="/apply" 
                  className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Request Access
                </a>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-700 mb-4">
                Have questions about WizJock or want to learn more? We'd love to hear from you.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700"><strong>Email:</strong> hello@wizjock.com</p>
                <p className="text-gray-700"><strong>Support:</strong> support@wizjock.com</p>
                <p className="text-gray-700 mt-2">We typically respond within 24-48 hours.</p>
              </div>
            </section>

            <div className="border-t pt-6 mt-8">
              <p className="text-sm text-gray-600 italic">
                Remember: Past performance does not guarantee future results. Sports betting involves risk, and you should never bet more than you can afford to lose. 
                Please gamble responsibly. Must be 21+ to use our services.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
