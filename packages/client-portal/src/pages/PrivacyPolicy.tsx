import Footer from '../components/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-sm text-gray-600 mb-8">Last Updated: November 19, 2025</p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
              <p className="text-gray-700 mb-4">
                We collect information that you provide directly to us when you apply for membership or use our services:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Personal Information:</strong> Name, email address, and phone number (collected through our application form)</li>
                <li><strong>Betting Experience:</strong> Self-reported experience level to help us tailor our service</li>
                <li><strong>Communication Preferences:</strong> SMS consent status for text message alerts</li>
                <li><strong>WhatsApp Data:</strong> If you join our WhatsApp community, we may collect your WhatsApp profile information</li>
                <li><strong>Analytics Data:</strong> We use Google Analytics 4 to collect information about how you use our website, including page views, clicks, and browsing behavior</li>
                <li><strong>Technical Information:</strong> IP address, browser type, device information, and cookies for security and fraud prevention</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">
                We use the information we collect for the following purposes:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Process Applications:</strong> Review and respond to membership applications</li>
                <li><strong>Service Delivery:</strong> Send sports betting picks, analysis, and alerts to subscribers</li>
                <li><strong>Communication:</strong> Send confirmation emails, service updates, and respond to inquiries</li>
                <li><strong>Service Improvement:</strong> Analyze usage patterns to improve our platform and content</li>
                <li><strong>Security:</strong> Prevent fraud, abuse, and unauthorized access</li>
                <li><strong>Legal Compliance:</strong> Comply with applicable laws and regulations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Share Your Information</h2>
              <p className="text-gray-700 mb-4">
                We do not sell your personal information. We may share your information with:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Service Providers:</strong> Email service providers (Resend) and analytics providers (Google Analytics) who help us operate our business</li>
                <li><strong>Legal Requirements:</strong> Law enforcement or regulatory authorities when required by law</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              </ul>
              <p className="text-gray-700 mt-4">
                We require all third-party service providers to maintain the confidentiality and security of your information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Your Rights and Choices</h2>
              <p className="text-gray-700 mb-4">
                Depending on your location, you may have the following rights under GDPR, CCPA, and other privacy laws:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications at any time</li>
                <li><strong>Data Portability:</strong> Request a copy of your data in a portable format</li>
                <li><strong>Restrict Processing:</strong> Request that we limit how we use your information</li>
              </ul>
              <p className="text-gray-700 mt-4">
                To exercise any of these rights, please contact us at privacy@wizjock.com. We will respond to your request within 30 days.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Retention</h2>
              <p className="text-gray-700 mb-4">
                We retain your personal information for as long as necessary to provide our services and comply with legal obligations:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Application Data:</strong> Retained for 2 years from submission date</li>
                <li><strong>Subscriber Data:</strong> Retained for the duration of your subscription plus 2 years</li>
                <li><strong>Email Communications:</strong> Retained as required by law</li>
                <li><strong>Analytics Data:</strong> Retained according to Google Analytics 4 settings (typically 14 months)</li>
              </ul>
              <p className="text-gray-700 mt-4">
                After the retention period, we securely delete or anonymize your information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Security Measures</h2>
              <p className="text-gray-700 mb-4">
                We implement appropriate technical and organizational measures to protect your personal information:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>HTTPS encryption for all data transmission</li>
                <li>Secure database storage with access controls</li>
                <li>Regular security audits and updates</li>
                <li>Employee training on data protection</li>
                <li>Rate limiting and fraud prevention measures</li>
              </ul>
              <p className="text-gray-700 mt-4">
                However, no method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Cookies and Tracking Technologies</h2>
              <p className="text-gray-700 mb-4">
                We use cookies and similar tracking technologies to improve your experience:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Essential Cookies:</strong> Required for website functionality</li>
                <li><strong>Analytics Cookies:</strong> Google Analytics to understand how visitors use our site</li>
                <li><strong>Performance Cookies:</strong> Help us improve website performance</li>
              </ul>
              <p className="text-gray-700 mt-4">
                You can control cookies through your browser settings. Note that disabling cookies may affect website functionality.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Children's Privacy</h2>
              <p className="text-gray-700">
                Our services are not intended for individuals under 21 years of age. We do not knowingly collect personal information from anyone under 21. If you believe we have collected information from someone under 21, please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Changes to This Privacy Policy</h2>
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. Your continued use of our services after changes are posted constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700"><strong>Email:</strong> privacy@wizjock.com</p>
                <p className="text-gray-700"><strong>Response Time:</strong> We aim to respond within 7 business days</p>
              </div>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
