import { useEffect } from 'react';
import { OptimizedLogo } from '../components/OptimizedImage';

export default function AdminLogin() {
    useEffect(() => {
        // Redirect to admin dashboard (adjust URL based on your deployment)
        const adminUrl = import.meta.env.VITE_ADMIN_URL || 'https://admin.wizjock.com';
        window.location.href = adminUrl;
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
            <div className="max-w-md w-full bg-gray-800/50 border border-gray-700 rounded-xl shadow-2xl p-8 text-center">
                <div className="mb-6">
                    <OptimizedLogo alt="WizJock Logo" className="w-24 h-24 mx-auto mb-4" />
                    <h1 className="text-3xl font-black text-white mb-2">Admin Portal</h1>
                    <p className="text-gray-400">Redirecting to admin dashboard...</p>
                </div>

                <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
                </div>

                <p className="text-sm text-gray-500 mt-6">
                    If you're not redirected automatically,{' '}
                    <a
                        href={import.meta.env.VITE_ADMIN_URL || 'https://admin.wizjock.com'}
                        className="text-cyan-400 hover:text-cyan-300 underline"
                    >
                        click here
                    </a>
                </p>
            </div>
        </div>
    );
}
