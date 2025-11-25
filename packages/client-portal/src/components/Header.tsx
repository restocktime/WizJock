import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { trackCTAClick } from '../utils/analytics';

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const isActive = (path: string) => location.pathname === path;

    const navLinks = [
        { path: '/about', label: 'About Us' },
        { path: '/why-us', label: 'Why Us' },
        { path: '/how-it-works', label: 'How It Works' },
        { path: '/member-experience', label: 'Member Experience' },
        { path: '/contact', label: 'Contact' },
    ];

    return (
        <header className="bg-black/95 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-800" role="banner">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16 sm:h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 sm:gap-3">
                        <img src="/wizjock-logo.png" alt="WizJock logo" className="h-8 sm:h-12 w-auto" />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden xl:flex items-center gap-6" aria-label="Main navigation">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`text-sm font-medium transition-colors ${isActive(link.path) ? 'text-white' : 'text-gray-300 hover:text-white'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="xl:hidden text-white p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
                        aria-label="Toggle menu"
                        aria-expanded={isMobileMenuOpen}
                    >
                        {isMobileMenuOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>

                    {/* CTA Button - Desktop */}
                    <div className="hidden xl:flex items-center gap-4">
                        <Link
                            to="/member-login"
                            className="text-gray-300 hover:text-white font-medium text-sm"
                        >
                            Log In
                        </Link>
                        <Link
                            to="/apply"
                            onClick={() => trackCTAClick('header')}
                            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold px-6 py-3 rounded-lg text-sm min-h-[44px] items-center flex"
                            aria-label="Get started with WizJock"
                        >
                            GET STARTED
                        </Link>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <nav className="xl:hidden py-4 border-t border-gray-800" aria-label="Mobile navigation">
                        <div className="flex flex-col space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={closeMobileMenu}
                                    className={`text-base font-medium py-2 transition-colors ${isActive(link.path) ? 'text-white' : 'text-gray-300 hover:text-white'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="pt-4 border-t border-gray-800 flex flex-col gap-4">
                                <Link
                                    to="/member-login"
                                    onClick={closeMobileMenu}
                                    className="text-gray-300 hover:text-white font-medium text-center py-2"
                                >
                                    Log In
                                </Link>
                                <Link
                                    to="/apply"
                                    onClick={() => {
                                        trackCTAClick('mobile_menu');
                                        closeMobileMenu();
                                    }}
                                    className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold px-6 py-3 rounded-lg text-center min-h-[44px] flex items-center justify-center"
                                >
                                    GET STARTED
                                </Link>
                            </div>
                        </div>
                    </nav>
                )}
            </div>
        </header>
    );
}
