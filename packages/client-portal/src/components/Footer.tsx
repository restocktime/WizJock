import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-xl font-bold mb-4">WizJock</h3>
            <p className="text-gray-400 text-sm mb-4">
              Data-driven sports betting analysis and community.
            </p>
            <p className="text-yellow-400 text-sm font-semibold">
              🔞 Gamble responsibly. 21+
            </p>
          </div>

          {/* Quick Links */}
          <nav aria-label="Quick links">
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/apply" className="text-gray-400 hover:text-white transition-colors">
                  Request Access
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          {/* Member & Admin Access */}
          <div role="navigation" aria-label="Member and Admin Access">
            <h4 className="text-lg font-semibold mb-4">Access</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/member-experience" className="text-gray-400 hover:text-white transition-colors">
                  Member Experience
                </Link>
              </li>
              <li>
                <Link to="/member-login" className="text-gray-400 hover:text-white transition-colors">
                  Member Login
                </Link>
              </li>
              <li>
                <Link to="/admin-login" className="text-gray-400 hover:text-white transition-colors">
                  Admin Portal
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="text-gray-400 hover:text-white transition-colors">
                  Feature Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <nav aria-label="Legal information">
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link to="/responsible-gambling" className="text-gray-400 hover:text-white transition-colors">
                  Responsible Gambling
                </Link>
              </li>
            </ul>
          </nav>

          {/* Support */}
          <div role="complementary" aria-label="Support information">
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="mailto:hello@wizjock.com" className="text-gray-400 hover:text-white transition-colors">
                  hello@wizjock.com
                </a>
              </li>
              <li>
                <a href="mailto:support@wizjock.com" className="text-gray-400 hover:text-white transition-colors">
                  support@wizjock.com
                </a>
              </li>
            </ul>
            <div className="mt-4">
              <p className="text-gray-400 text-sm">Need help?</p>
              <p className="text-gray-400 text-sm">
                Call <a href="tel:1-800-426-2537" className="text-blue-400 hover:underline">1-800-GAMBLER</a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} WizJock. All rights reserved.
            </p>
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm mb-1">
                Past performance does not guarantee future results.
              </p>
              <p className="text-yellow-400 text-sm font-semibold">
                Gamble responsibly. Must be 21 years or older.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
