import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ReferralProgram() {
    return (
        <div className="min-h-screen bg-black text-white">
            <Header />

            <main className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
                <div className="text-center mb-16">
                    <div className="inline-block bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-1 rounded-full text-xs font-bold mb-6 uppercase tracking-wider">
                        Partner Program
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6">
                        REFER & EARN
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Share your winning edge with friends. Get rewarded when they join the WizJock community.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-20">
                    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 text-center hover:border-blue-500/50 transition-colors group">
                        <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                            <span className="text-3xl">🔗</span>
                        </div>
                        <h3 className="text-xl font-bold mb-3">1. Get Your Link</h3>
                        <p className="text-gray-400">
                            Sign up for an account to generate your unique referral link in your dashboard.
                        </p>
                    </div>

                    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 text-center hover:border-cyan-500/50 transition-colors group">
                        <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                            <span className="text-3xl">🤝</span>
                        </div>
                        <h3 className="text-xl font-bold mb-3">2. Share with Friends</h3>
                        <p className="text-gray-400">
                            Send your link to friends, family, or your social network.
                        </p>
                    </div>

                    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 text-center hover:border-green-500/50 transition-colors group">
                        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                            <span className="text-3xl">💰</span>
                        </div>
                        <h3 className="text-xl font-bold mb-3">3. Earn Rewards</h3>
                        <p className="text-gray-400">
                            Get <span className="text-green-400 font-bold">$50 credit</span> for every friend who subscribes to a Pro or Elite plan.
                        </p>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-black mb-6">Ready to Start Earning?</h2>
                        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                            Join thousands of members who are already earning free months of access just by sharing their results.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/member-login"
                                className="bg-white text-blue-900 font-bold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                Get Referral Link
                            </Link>
                            <Link
                                to="/apply"
                                className="bg-transparent border-2 border-white text-white font-bold px-8 py-4 rounded-lg hover:bg-white/10 transition-colors"
                            >
                                Apply for Membership
                            </Link>
                        </div>
                    </div>

                    {/* Background decoration */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                        <div className="absolute top-[-50%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-[-50%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-3xl"></div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
