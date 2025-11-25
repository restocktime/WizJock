import { Outlet, Link, useLocation } from 'react-router-dom';
import { SportNavigation } from './SportNavigation';

export const Layout = () => {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;

    const navLinks = [
        { path: '/injuries', label: 'Injuries', icon: '🚑' },
        { path: '/schedule', label: 'Schedule', icon: '📅' },
        { path: '/referral', label: 'Refer & Earn', icon: '💸' },
        { path: '/info', label: 'Account', icon: '👤' },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-black text-white">
            <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <img src="/wizjock-logo.png" alt="WizJock" className="h-8 w-auto" />
                    </Link>

                    <nav className="flex items-center gap-1 sm:gap-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${isActive(link.path)
                                        ? 'bg-gray-800 text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                                    }`}
                            >
                                <span className="text-base">{link.icon}</span>
                                <span className="hidden sm:inline">{link.label}</span>
                            </Link>
                        ))}
                    </nav>
                </div>
            </header>

            <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
                {/* Only show SportNavigation on home/sport pages */}
                {!['/injuries', '/schedule', '/referral', '/info'].includes(location.pathname) && (
                    <SportNavigation />
                )}
                <Outlet />
            </main>

            <footer className="bg-black border-t border-gray-900 mt-auto">
                <div className="max-w-4xl mx-auto px-4 py-6 text-center text-gray-600 text-sm">
                    &copy; {new Date().getFullYear()} WizJock. All rights reserved.
                </div>
            </footer>
        </div>
    );
};
