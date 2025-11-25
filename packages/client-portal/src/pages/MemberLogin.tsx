import { useEffect } from 'react';
import { OptimizedLogo } from '../components/OptimizedImage';

export default function MemberLogin() {
    useEffect(() => {
        // Redirect to member dashboard (adjust URL based on your deployment)
        const memberUrl = import.meta.env.VITE_MEMBER_URL || 'https://client.wizjock.com';
        window.location.href = memberUrl;
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
            <div className="max-w-md w-full bg-gray-800/50 border border-gray-700 rounded-xl shadow-2xl p-8 text-center">
                <div className="mb-6">
                    <OptimizedLogo alt="WizJock Logo" className="w-24 h-24 mx-auto mb-4" />
                    <h1 className="text-3xl font-black text-white mb-2">Member Dashboard</h1>
                    <p className="text-gray-400">Redirecting to your dashboard...</p>
                </div>

                <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                </div>

                <p className="text-sm text-gray-500 mt-6">
                    If you're not redirected automatically,{' '}
                    <a
                        href={import.meta.env.VITE_MEMBER_URL || 'http://localhost:5175'}
                        className="text-green-400 hover:text-green-300 underline"
                    >
                        click here
                    </a>
                </p>
            </div>
        </div>
    );
}
