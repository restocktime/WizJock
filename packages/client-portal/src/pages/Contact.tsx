import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { OptimizedLogo } from '../components/OptimizedImage';

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-black/95 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-800" role="banner">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link to="/" className="flex items-center gap-2 sm:gap-3">
              <OptimizedLogo alt="WizJock logo" className="h-8 sm:h-12 w-auto" />
              <span className="text-lg sm:text-2xl font-black text-white">WIZJOCK</span>
            </Link>

            <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
              <Link to="/about" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                About Us
              </Link>
              <Link to="/why-us" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                Why Us
              </Link>
              <Link to="/how-it-works" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                How It Works
              </Link>
              <Link to="/member-experience" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                Member Experience
              </Link>
              <Link to="/contact" className="text-white transition-colors text-sm font-medium border-b-2 border-cyan-500">
                Contact
              </Link>
            </nav>

            <Link 
              to="/apply" 
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm min-h-[44px] flex items-center"
            >
              GET STARTED
            </Link>
          </div>
        </div>
      </header>
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-gray-600 mb-8">
            Have questions or need assistance? We're here to help. Reach out to us using the information below.
          </p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Get in Touch</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">📧 General Inquiries</h3>
                  <p className="text-gray-700 mb-2">
                    For general questions about WizJock, membership, or our services:
                  </p>
                  <a href="mailto:hello@wizjock.com" className="text-blue-600 hover:underline font-semibold">
                    hello@wizjock.com
                  </a>
                </div>

                <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">🛟 Customer Support</h3>
                  <p className="text-gray-700 mb-2">
                    For technical issues, account questions, or subscription help:
                  </p>
                  <a href="mailto:support@wizjock.com" className="text-green-600 hover:underline font-semibold">
                    support@wizjock.com
                  </a>
                </div>

                <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-r-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">🔒 Privacy Concerns</h3>
                  <p className="text-gray-700 mb-2">
                    For data privacy requests or questions about how we handle your information:
                  </p>
                  <a href="mailto:privacy@wizjock.com" className="text-purple-600 hover:underline font-semibold">
                    privacy@wizjock.com
                  </a>
                </div>

                <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">💼 Business Inquiries</h3>
                  <p className="text-gray-700 mb-2">
                    For partnerships, media inquiries, or business opportunities:
                  </p>
                  <a href="mailto:business@wizjock.com" className="text-orange-600 hover:underline font-semibold">
                    business@wizjock.com
                  </a>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Response Times</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span><strong>General Inquiries:</strong> We typically respond within 24-48 hours</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span><strong>Customer Support:</strong> We aim to respond within 2 business days</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span><strong>Privacy Requests:</strong> We respond within 7 business days as required by law</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">ℹ</span>
                    <span><strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM EST</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-gray-300 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">How do I apply for membership?</h3>
                  <p className="text-gray-700">
                    Visit our <a href="/apply" className="text-blue-600 hover:underline">application page</a> and fill out the form. 
                    We'll review your application and get back to you within 24-48 hours.
                  </p>
                </div>

                <div className="border-l-4 border-gray-300 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">What sports do you cover?</h3>
                  <p className="text-gray-700">
                    We provide picks and analysis for NFL, NBA, NCAA Football, NCAA Basketball, UFC, and select other sports. 
                    Our focus is on providing quality over quantity.
                  </p>
                </div>

                <div className="border-l-4 border-gray-300 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">How do I access the WhatsApp community?</h3>
                  <p className="text-gray-700">
                    Once your membership is approved and you've subscribed, we'll send you an invitation link to join our private WhatsApp group.
                  </p>
                </div>

                <div className="border-l-4 border-gray-300 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Can I cancel my subscription?</h3>
                  <p className="text-gray-700">
                    Yes, you can cancel anytime. Your access will continue until the end of your current billing period. 
                    See our <a href="/terms" className="text-blue-600 hover:underline">Terms of Use</a> for details.
                  </p>
                </div>

                <div className="border-l-4 border-gray-300 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Do you guarantee profits?</h3>
                  <p className="text-gray-700">
                    No. Past performance does not guarantee future results. Sports betting involves risk, and we encourage responsible gambling. 
                    Visit our <a href="/responsible-gambling" className="text-blue-600 hover:underline">Responsible Gambling</a> page for more information.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Join Our Community</h2>
              <p className="text-gray-700 mb-4">
                Interested in becoming a member? Start by submitting an application.
              </p>
              <div className="bg-blue-600 text-white p-6 rounded-lg text-center">
                <p className="text-xl font-semibold mb-4">Ready to Get Started?</p>
                <a 
                  href="/apply" 
                  className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Request Access
                </a>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Additional Resources</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <a href="/privacy" className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all">
                  <h3 className="font-semibold text-gray-900 mb-1">Privacy Policy</h3>
                  <p className="text-sm text-gray-600">Learn how we protect your data</p>
                </a>
                <a href="/terms" className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all">
                  <h3 className="font-semibold text-gray-900 mb-1">Terms of Use</h3>
                  <p className="text-sm text-gray-600">Read our terms and conditions</p>
                </a>
                <a href="/responsible-gambling" className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all">
                  <h3 className="font-semibold text-gray-900 mb-1">Responsible Gambling</h3>
                  <p className="text-sm text-gray-600">Resources and support</p>
                </a>
                <a href="/about" className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all">
                  <h3 className="font-semibold text-gray-900 mb-1">About Us</h3>
                  <p className="text-sm text-gray-600">Learn more about WizJock</p>
                </a>
              </div>
            </section>

            <div className="bg-gray-100 border-l-4 border-gray-400 p-6 rounded-r-lg">
              <p className="text-gray-700">
                <strong>Note:</strong> We receive a high volume of emails and do our best to respond to everyone. 
                If your inquiry is urgent, please mention "URGENT" in your subject line. For account-specific issues, 
                please include your registered email address in your message.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
