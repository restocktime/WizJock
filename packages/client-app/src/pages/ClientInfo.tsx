export default function ClientInfo() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Account & Subscription</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Account Details */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-bold mb-4 border-b border-gray-800 pb-2">Profile Information</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs text-gray-500 uppercase mb-1">Name</label>
                            <div className="text-gray-300">John Doe</div>
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 uppercase mb-1">Email</label>
                            <div className="text-gray-300">john.doe@example.com</div>
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 uppercase mb-1">Member Since</label>
                            <div className="text-gray-300">October 2023</div>
                        </div>
                    </div>
                    <button className="mt-6 text-sm text-blue-400 hover:text-blue-300 font-medium">
                        Edit Profile
                    </button>
                </div>

                {/* Subscription Details */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-bold mb-4 border-b border-gray-800 pb-2">Current Plan</h3>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <div className="text-2xl font-black text-white">ELITE ACCESS</div>
                            <div className="text-sm text-gray-400">$99.00 / month</div>
                        </div>
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/50 rounded-full text-xs font-bold uppercase">
                            Active
                        </span>
                    </div>

                    <div className="space-y-2 mb-6">
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                            <span className="text-green-400">✓</span> All Sports Access
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                            <span className="text-green-400">✓</span> Real-time Line Movements
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                            <span className="text-green-400">✓</span> Injury Intelligence
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 rounded-lg text-sm transition-colors">
                            Manage Subscription
                        </button>
                        <button className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 rounded-lg text-sm transition-colors">
                            Billing History
                        </button>
                    </div>
                </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4 border-b border-gray-800 pb-2">Notification Preferences</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="font-medium text-white">New Picks Alerts</div>
                            <div className="text-xs text-gray-500">Get notified when new picks are released</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="font-medium text-white">Injury Updates</div>
                            <div className="text-xs text-gray-500">Get notified about significant player injuries</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}
