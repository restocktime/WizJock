import { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { OptimizedLogo } from '../components/OptimizedImage';

interface WishlistItem {
    id: string;
    title: string;
    description: string;
    votes: number;
    status: 'pending' | 'in-progress' | 'completed';
}

const initialWishlist: WishlistItem[] = [
    {
        id: '1',
        title: 'Live Betting Alerts',
        description: 'Real-time push notifications for live betting opportunities',
        votes: 127,
        status: 'in-progress'
    },
    {
        id: '2',
        title: 'Parlay Builder Tool',
        description: 'Interactive tool to build and optimize parlay bets',
        votes: 89,
        status: 'pending'
    },
    {
        id: '3',
        title: 'Historical Performance Analytics',
        description: 'Detailed charts and analytics of past pick performance',
        votes: 156,
        status: 'completed'
    },
    {
        id: '4',
        title: 'Mobile App',
        description: 'Native iOS and Android applications',
        votes: 203,
        status: 'in-progress'
    },
    {
        id: '5',
        title: 'Bankroll Management Tools',
        description: 'Track your betting bankroll and get recommendations',
        votes: 94,
        status: 'pending'
    }
];

export default function Wishlist() {
    const [wishlist, setWishlist] = useState(initialWishlist);
    const [newFeature, setNewFeature] = useState('');
    const [newDescription, setNewDescription] = useState('');

    const handleVote = (id: string) => {
        setWishlist(prev => prev.map(item =>
            item.id === id ? { ...item, votes: item.votes + 1 } : item
        ).sort((a, b) => b.votes - a.votes));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newFeature.trim() && newDescription.trim()) {
            const newItem: WishlistItem = {
                id: Date.now().toString(),
                title: newFeature,
                description: newDescription,
                votes: 1,
                status: 'pending'
            };
            setWishlist(prev => [newItem, ...prev]);
            setNewFeature('');
            setNewDescription('');
        }
    };

    const getStatusBadge = (status: WishlistItem['status']) => {
        const styles = {
            pending: 'bg-gray-700 text-gray-300',
            'in-progress': 'bg-blue-600 text-white',
            completed: 'bg-green-600 text-white'
        };
        const labels = {
            pending: 'Pending',
            'in-progress': 'In Progress',
            completed: 'Completed'
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[status]}`}>
                {labels[status]}
            </span>
        );
    };

    return (
        <div className="min-h-screen flex flex-col bg-black text-white">
            <main className="flex-1 py-12 sm:py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <OptimizedLogo alt="WizJock Logo" className="w-16 h-16 mx-auto mb-4" />
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4">Feature Wishlist</h1>
                        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                            Vote on features you'd like to see or suggest your own. Your feedback shapes our roadmap!
                        </p>
                    </div>

                    {/* Submit New Feature */}
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
                        <h2 className="text-xl font-bold mb-4">Suggest a Feature</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="feature-title" className="block text-sm font-medium text-gray-400 mb-2">
                                    Feature Title
                                </label>
                                <input
                                    id="feature-title"
                                    type="text"
                                    value={newFeature}
                                    onChange={(e) => setNewFeature(e.target.value)}
                                    placeholder="e.g., Discord Integration"
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="feature-description" className="block text-sm font-medium text-gray-400 mb-2">
                                    Description
                                </label>
                                <textarea
                                    id="feature-description"
                                    value={newDescription}
                                    onChange={(e) => setNewDescription(e.target.value)}
                                    placeholder="Describe the feature and why it would be valuable..."
                                    rows={3}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold px-6 py-3 rounded-lg transition"
                            >
                                Submit Feature Request
                            </button>
                        </form>
                    </div>

                    {/* Wishlist Items */}
                    <div className="space-y-4">
                        {wishlist.map((item) => (
                            <div
                                key={item.id}
                                className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold">{item.title}</h3>
                                            {getStatusBadge(item.status)}
                                        </div>
                                        <p className="text-gray-400 mb-4">{item.description}</p>
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => handleVote(item.id)}
                                                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition"
                                            >
                                                <span className="text-2xl">👍</span>
                                                <span className="font-bold">{item.votes}</span>
                                            </button>
                                            <span className="text-sm text-gray-500">votes</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="mt-12 text-center">
                        <p className="text-gray-400 mb-4">Have more ideas? Join our community!</p>
                        <Link
                            to="/apply"
                            className="inline-block bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold px-8 py-4 rounded-lg transition"
                        >
                            Request Access
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
