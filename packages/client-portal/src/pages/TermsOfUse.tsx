import Footer from '../components/Footer';

export default function TermsOfUse() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Use</h1>
          <p className="text-sm text-gray-600 mb-8">Last Updated: November 19, 2025</p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700">
                By accessing or using WizJock's services, you agree to be bound by these Terms of Use and our Privacy Policy. 
                If you do not agree to these terms, please do not use our services. We reserve the right to modify these terms 
                at any time, and your continued use constitutes acceptance of any changes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Service Description</h2>
              <p className="text-gray-700 mb-4">
                WizJock provides sports betting analysis, picks, and educational content to help subscribers make informed betting decisions. Our services include:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Daily sports betting picks and analysis</li>
                <li>Access to our private WhatsApp community</li>
                <li>Performance tracking and transparency</li>
                <li>Educational content on betting strategies</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Eligibility Requirements</h2>
              <p className="text-gray-700 mb-4">
                To use WizJock's services, you must meet the following requirements:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Age:</strong> You must be at least 21 years of age</li>
                <li><strong>Legal Jurisdiction:</strong> You must be located in a jurisdiction where sports betting is legal</li>
                <li><strong>Responsible Gambling:</strong> You commit to gambling responsibly and within your means</li>
                <li><strong>Accurate Information:</strong> You agree to provide accurate and complete information when applying</li>
              </ul>
              <p className="text-gray-700 mt-4">
                We reserve the right to verify your age and location and to refuse service to anyone who does not meet these requirements.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Subscription Terms</h2>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">4.1 Pricing and Billing</h3>
              <p className="text-gray-700 mb-4">
                Subscription pricing is displayed on our website and may vary based on the plan you select. By subscribing, you authorize us to charge your payment method on a recurring basis according to your chosen billing cycle.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">4.2 Cancellation Policy</h3>
              <p className="text-gray-700 mb-4">
                You may cancel your subscription at any time through your account settings or by contacting us. Cancellations take effect at the end of your current billing period. You will continue to have access to the service until that date.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">4.3 Refund Policy</h3>
              <p className="text-gray-700">
                Due to the nature of our service (immediate access to picks and analysis), we generally do not offer refunds. However, we may consider refund requests on a case-by-case basis within the first 7 days of your initial subscription. Contact us at support@wizjock.com to request a refund.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Important Disclaimers</h2>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <p className="text-gray-900 font-semibold mb-2">⚠️ PAST PERFORMANCE DOES NOT GUARANTEE FUTURE RESULTS</p>
                <p className="text-gray-700">
                  Any performance statistics, ROI figures, or win rates displayed on our website or in our communications represent 
                  historical results only. These results do not guarantee or predict future performance. Sports betting involves risk, 
                  and you may lose money.
                </p>
              </div>

              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>No Guarantee of Profits:</strong> We do not guarantee that you will make money using our picks or analysis</li>
                <li><strong>Not Financial Advice:</strong> Our content is for informational and entertainment purposes only and should not be considered financial or investment advice</li>
                <li><strong>Your Responsibility:</strong> You are solely responsible for your own betting decisions and any resulting wins or losses</li>
                <li><strong>Independent Research:</strong> You should conduct your own research and due diligence before placing any bets</li>
                <li><strong>Risk of Loss:</strong> Sports betting carries inherent risk, and you should never bet more than you can afford to lose</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Prohibited Conduct</h2>
              <p className="text-gray-700 mb-4">
                When using WizJock's services, you agree NOT to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Share picks, analysis, or content outside of our authorized community</li>
                <li>Resell, redistribute, or commercialize our content without permission</li>
                <li>Harass, threaten, or abuse other members or staff</li>
                <li>Use our service for any illegal activity</li>
                <li>Attempt to hack, reverse engineer, or compromise our systems</li>
                <li>Create multiple accounts to circumvent restrictions</li>
                <li>Use automated tools or bots to access our service</li>
                <li>Impersonate WizJock staff or other members</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Violation of these rules may result in immediate termination of your subscription without refund.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Intellectual Property</h2>
              <p className="text-gray-700 mb-4">
                All content provided through WizJock, including picks, analysis, graphics, logos, and text, is owned by WizJock 
                and protected by copyright and other intellectual property laws.
              </p>
              <p className="text-gray-700">
                As a subscriber, you receive a limited, non-exclusive, non-transferable license to access and use our content 
                for your personal, non-commercial use only. This license terminates when your subscription ends.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>WizJock is not liable for any betting losses you incur</li>
                <li>Our service is provided "AS IS" without warranties of any kind</li>
                <li>We do not warrant that our service will be uninterrupted, error-free, or secure</li>
                <li>Our total liability to you shall not exceed the amount you paid for your subscription in the past 12 months</li>
                <li>We are not liable for indirect, incidental, consequential, or punitive damages</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Indemnification</h2>
              <p className="text-gray-700">
                You agree to indemnify and hold harmless WizJock, its officers, employees, and agents from any claims, damages, 
                losses, or expenses (including legal fees) arising from your use of our service, your violation of these terms, 
                or your violation of any rights of another party.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Dispute Resolution</h2>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">10.1 Governing Law</h3>
              <p className="text-gray-700 mb-4">
                These Terms of Use shall be governed by and construed in accordance with the laws of the United States, 
                without regard to conflict of law principles.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">10.2 Informal Resolution</h3>
              <p className="text-gray-700">
                If you have a dispute with WizJock, please contact us first at support@wizjock.com to attempt to resolve 
                the issue informally. Most disputes can be resolved through good-faith communication.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Termination</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to suspend or terminate your access to our services at any time for any reason, including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Violation of these Terms of Use</li>
                <li>Fraudulent or illegal activity</li>
                <li>Non-payment of subscription fees</li>
                <li>Abusive behavior toward staff or members</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Upon termination, your right to access our service immediately ceases, and we may delete your account and data.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Changes to Service</h2>
              <p className="text-gray-700">
                We reserve the right to modify, suspend, or discontinue any aspect of our service at any time without notice. 
                We are not liable to you or any third party for any modification, suspension, or discontinuation of the service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Severability</h2>
              <p className="text-gray-700">
                If any provision of these Terms of Use is found to be invalid or unenforceable, the remaining provisions shall 
                continue in full force and effect.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have questions about these Terms of Use, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700"><strong>Email:</strong> support@wizjock.com</p>
                <p className="text-gray-700"><strong>Response Time:</strong> We aim to respond within 2 business days</p>
              </div>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
