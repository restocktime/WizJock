export default function ReferralProgram() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Refer & Earn</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 text-center hover:border-blue-500/50 transition-colors">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🔗</span>
                    </div>
                    <h3 className="text-lg font-bold mb-2">1. Get Your Link</h3>
                    <p className="text-sm text-gray-400">
                        Copy your unique referral link below.
                    </p>
                </div>

                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 text-center hover:border-cyan-500/50 transition-colors">
                    <div className="w-12 h-12 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🤝</span>
                    </div>
                    <h3 className="text-lg font-bold mb-2">2. Share with Friends</h3>
                    <p className="text-sm text-gray-400">
                        Send it to your network.
                    </p>
                </div>

                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 text-center hover:border-green-500/50 transition-colors">
                    <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">💰</span>
                    </div>
                    <h3 className="text-lg font-bold mb-2">3. Earn Rewards</h3>
                    <p className="text-sm text-gray-400">
                        Get <span className="text-green-400 font-bold">$50 credit</span> for every signup.
                    </p>
                </div>
            </div>

            <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-xl p-8 text-center">
                <h3 className="text-xl font-bold mb-4">Your Unique Referral Link</h3>
                <div className="flex max-w-md mx-auto gap-2">
                    <input
                        type="text"
                        readOnly
                        value="https://wizjock.com/apply?ref=USER123"
                        className="flex-1 bg-black border border-gray-700 rounded-lg px-4 py-3 text-gray-300 font-mono text-sm focus:outline-none focus:border-blue-500"
                    />
                    <button
                        onClick={() => navigator.clipboard.writeText('https://wizjock.com/apply?ref=USER123')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg transition-colors"
                    >
                        Copy
                    </button>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                    Terms and conditions apply. Credits are applied to your next billing cycle.
                </p>
            </div>
        </div>
    );
}
