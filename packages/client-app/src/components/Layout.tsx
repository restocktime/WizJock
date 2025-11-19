import { Outlet } from 'react-router-dom';
import { SportNavigation } from './SportNavigation';

export const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <header className="bg-primary text-white shadow-md sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold tracking-tight">IBY Picks</h1>
                    {/* Placeholder for user menu or settings */}
                </div>
            </header>

            <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
                <SportNavigation />
                <Outlet />
            </main>

            <footer className="bg-white border-t border-gray-200 mt-auto">
                <div className="max-w-4xl mx-auto px-4 py-6 text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} IBY Picks. All rights reserved.
                </div>
            </footer>
        </div>
    );
};
