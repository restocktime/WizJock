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
      <div className="min-h-screen">
        
        {/* Hero */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-cyan-900/30 to-blue-800/30"></div>
          <div className="absolute inset-0 opacity-40">
            <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
            <div className="absolute top-40 right-10 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          </div>

          <div className="relative z-10 max-w-5xl mx-auto text-center">
            <div className="inline-block bg-yellow-500/20 border border-yellow-500/50 rounded-full px-6 py-2 mb-8">
              <span className="text-yellow-400 font-bold text-sm">🔒 INVITE-ONLY • ADMIN APPROVAL REQUIRED</span>
            </div>
            
            <img src="/wizjock-logo.png" alt="WizJock" className="w-40 h-40 mx-auto mb-8 object-contain" />
            
            <h1 className="text-6xl md:text-8xl font-black mb-6">
              <span className="gradient-text">WIZJOCK</span>
            </h1>
            
            <p className="text-2xl md:text-3xl text-gray-200 mb-4">
              The Insider's Edge in Sports Betting
            </p>
            
            <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
              Elite AI-powered intelligence for serious bettors. Join the exclusive circle winning consistently with information the public doesn't have.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a href="#coming-soon" className="btn-gradient inline-block px-10 py-4 text-lg">
                Request Invitation
              </a>
              <a href="#coming-soon" className="btn-outline inline-block px-10 py-4 text-lg">
                See Winning Slips
              </a>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto flex flex-wrap justify-center items-center gap-12 md:gap-20">
            <div className="text-center">
              <div className="text-6xl font-black gradient-text">67%</div>
              <div className="text-gray-400 text-sm mt-2">WIN RATE</div>
            </div>
            <div className="hidden md:block w-px h-16 bg-gray-700"></div>
            <div className="text-center">
              <div className="text-6xl font-black gradient-text">$2.4M</div>
              <div className="text-gray-400 text-sm mt-2">WON THIS MONTH</div>
            </div>
            <div className="hidden md:block w-px h-16 bg-gray-700"></div>
            <div className="text-center">
              <div className="text-6xl font-black gradient-text">50K+</div>
              <div className="text-gray-400 text-sm mt-2">MEMBERS</div>
            </div>
          </div>
        </section>

        {/* Winning Slips */}
        <section className="py-20 px-6 bg-black/20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
              Real Wins, Real Money
            </h2>
            <p className="text-xl text-gray-400 text-center mb-16 max-w-2xl mx-auto">
              Our members don't just talk about winning—they prove it.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div key={num} className="glass-card p-4">
                  <img 
                    src={`/slips/slip${num}.png`}
                    alt={`Winning slip ${num}`}
                    className="w-full aspect-[9/16] object-contain bg-gray-900 rounded-lg"
                  />
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <a 
                href="https://chat.whatsapp.com/FgmkVMnR3SH6aTFjO7QL2k"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-4 rounded-xl transition"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Join WhatsApp Community
              </a>
            </div>
          </div>
        </section>

        {/* Why Different - Simplified */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-16">
              Why Pros Pay Premium for <span className="gradient-text">WizJock</span>
            </h2>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold mb-4">AI That Actually Works</h3>
                <p className="text-gray-400 text-lg leading-relaxed">
                  While competitors use basic stats anyone can Google, our proprietary AI processes 10M+ data points daily. 
                  We find value bets the market consistently undervalues. That's a 23% higher win rate than industry average.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-4">Real-Time Intelligence</h3>
                <p className="text-gray-400 text-lg leading-relaxed">
                  Line movements, injury updates, betting sentiment—all monitored 24/7. When conditions change, you know instantly. 
                  Average 4.2 alerts per day that impact betting value.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-4">100% Transparent</h3>
                <p className="text-gray-400 text-lg leading-relaxed">
                  Every pick tracked and timestamped. No cherry-picking wins or hiding losses. 
                  Our 67% win rate is independently verified across thousands of documented bets.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-4">Bankroll Protection</h3>
                <p className="text-gray-400 text-lg leading-relaxed">
                  Precise unit sizing based on confidence levels and your bankroll. 
                  89% of members report improved money management. We're building wealth, not gambling.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-20 px-6 bg-black/20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-block bg-yellow-500/20 border border-yellow-500/50 rounded-full px-6 py-2 mb-6">
                <span className="text-yellow-400 font-bold text-sm">💎 EXCLUSIVE MEMBERSHIP TIERS</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Elite Membership Pricing
              </h2>
              <p className="text-xl text-gray-400">Limited spots per tier</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="glass-card p-8">
                <h3 className="text-2xl font-bold mb-2">Starter</h3>
                <div className="text-5xl font-bold mb-6">$299<span className="text-xl text-gray-400">/mo</span></div>
                <a href="#coming-soon" className="btn-outline w-full inline-block text-center mb-6">Apply Now</a>
                <ul className="space-y-3 text-gray-400">
                  <li>✓ 5 daily picks</li>
                  <li>✓ Basic analytics</li>
                  <li>✓ Community access</li>
                </ul>
              </div>

              <div className="glass-card p-8 border-2 border-cyan-500/50 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-cyan-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                  MOST POPULAR
                </div>
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <div className="text-5xl font-bold mb-6">$799<span className="text-xl text-gray-400">/mo</span></div>
                <a href="#coming-soon" className="btn-gradient w-full inline-block text-center mb-6">Apply Now</a>
                <ul className="space-y-3 text-gray-400">
                  <li>✓ Unlimited picks</li>
                  <li>✓ Advanced AI analytics</li>
                  <li>✓ Real-time alerts</li>
                  <li>✓ Priority support</li>
                </ul>
              </div>

              <div className="glass-card p-8">
                <h3 className="text-2xl font-bold mb-2">Elite</h3>
                <div className="text-5xl font-bold mb-6">$1,999<span className="text-xl text-gray-400">/mo</span></div>
                <a href="#coming-soon" className="btn-outline w-full inline-block text-center mb-6">Apply Now</a>
                <ul className="space-y-3 text-gray-400">
                  <li>✓ Everything in Pro</li>
                  <li>✓ 1-on-1 strategy calls</li>
                  <li>✓ Custom betting models</li>
                  <li>✓ VIP community</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-gray-800">
          <div className="max-w-6xl mx-auto text-center text-gray-400">
            <p>© 2025 WizJock. All rights reserved.</p>
          </div>
        </footer>

      </div>
    </QueryClientProvider>
  );
}

export default App;
