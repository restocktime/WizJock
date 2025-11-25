import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ClientInfo() {
    return (
        <div className="min-h-screen bg-black text-white">
            <Header />

            <main className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
                <div className="text-center mb-16">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6">
                        CLIENT DASHBOARD
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Your command center for sports betting intelligence.
                        Everything you need to beat the books in one place.
                    </p>
                </div>

                {/* Feature Grid */}
                <div className="grid md:grid-cols-2 gap-12 mb-20">
                    <div className="space-y-8">
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center text-2xl">
                                📱
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Daily Picks Feed</h3>
                                <p className="text-gray-400">
                                    Access your personalized feed of AI-generated picks. Filter by sport, bet type, and confidence level.
                                    Get push notifications for lock-of-the-week alerts.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-cyan-600/20 rounded-lg flex items-center justify-center text-2xl">
                                📊
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Performance Tracking</h3>
                                <p className="text-gray-400">
                                    Visualize your betting history with interactive charts. Track your ROI, win rate, and bankroll growth over time.
                                    Identify your strengths and weaknesses.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center text-2xl">
                                💰
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Bankroll Management</h3>
                                <p className="text-gray-400">
                                    Set your starting bankroll and unit size. Our system automatically calculates recommended bet sizes
                                    for every pick based on your risk tolerance.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-2 shadow-2xl">
                        {/* Placeholder for dashboard screenshot */}
                        <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center text-gray-600">
                            [Dashboard Screenshot]
                        </div>
                    </div>
                </div>

                {/* Subscription Info */}
                <div className="border-t border-gray-800 pt-16">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl font-black mb-8">Subscription Management</h2>
                        <p className="text-gray-400 mb-8">
                            Manage your subscription, update payment methods, and view billing history directly from your client portal settings.
                            You can upgrade, downgrade, or cancel at any time.
                        </p>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <Link
                                to="/member-login"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-lg transition-colors"
                            >
                                Log In to Dashboard
                            </Link>
                            <Link
                                to="/contact"
                                className="bg-gray-800 hover:bg-gray-700 text-white font-bold px-8 py-4 rounded-lg transition-colors"
                            >
                                Contact Support
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
