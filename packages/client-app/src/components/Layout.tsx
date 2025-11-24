import { Outlet } from 'react-router-dom';
import { SportNavigation } from './SportNavigation';

export const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-black text-white">
            <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {/* Logo placeholder */}
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center text-white font-black text-xs">
                            WJ
                        </div>
                        <h1 className="text-xl font-black tracking-tight text-white">WIZJOCK</h1>
                    </div>
                    {/* Placeholder for user menu or settings */}
                    <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700"></div>
                </div>
            </header>

            <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
                <SportNavigation />
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
