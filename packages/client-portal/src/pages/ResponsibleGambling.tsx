import Footer from '../components/Footer';

export default function ResponsibleGambling() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Responsible Gambling</h1>
          <p className="text-sm text-gray-600 mb-8">Last Updated: November 19, 2025</p>

          <div className="prose prose-lg max-w-none">
            <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8">
              <p className="text-xl font-semibold text-gray-900 mb-2">🔞 You Must Be 21+ to Use This Service</p>
              <p className="text-gray-700">
                WizJock is committed to promoting responsible gambling. Sports betting should be entertaining, not a way to make money or solve financial problems.
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Gamble Responsibly</h2>
              <p className="text-gray-700 mb-4">
                Gambling should be fun and entertaining. When it stops being fun, it's time to stop. Remember:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Only bet what you can afford to lose</li>
                <li>Set a budget and stick to it</li>
                <li>Never chase your losses</li>
                <li>Don't gamble when you're upset, depressed, or under the influence</li>
                <li>Take regular breaks from gambling</li>
                <li>Keep gambling in balance with other activities in your life</li>
                <li>Don't borrow money to gamble</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Warning Signs of Problem Gambling</h2>
              <p className="text-gray-700 mb-4">
                Problem gambling can affect anyone. Be aware of these warning signs:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Spending more money or time on gambling than you can afford</li>
                <li>Having arguments with family or friends about money and gambling</li>
                <li>Losing interest in usual activities or hobbies</li>
                <li>Feeling guilty or anxious about your gambling</li>
                <li>Lying to others about how much you gamble</li>
                <li>Borrowing money or selling possessions to gamble</li>
                <li>Repeatedly trying and failing to cut down or stop gambling</li>
                <li>Missing work or school because of gambling</li>
                <li>Using gambling to escape problems or relieve stress</li>
                <li>Chasing losses by gambling more to win back money</li>
              </ul>
              <p className="text-gray-700 mt-4">
                If you recognize any of these signs in yourself or someone you know, please seek help immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Get Help Now</h2>
              
              <div className="bg-blue-50 border-2 border-blue-500 rounded-lg p-6 mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">National Problem Gambling Helpline</h3>
                <p className="text-3xl font-bold text-blue-600 mb-2">1-800-GAMBLER</p>
                <p className="text-xl font-semibold text-gray-700 mb-2">(1-800-426-2537)</p>
                <p className="text-gray-700">
                  Free, confidential support available 24/7. Trained specialists can help you or a loved one with problem gambling.
                </p>
              </div>

              <div className="space-y-4">
                <div className="border-l-4 border-gray-300 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-1">National Council on Problem Gambling (NCPG)</h4>
                  <p className="text-gray-700">Website: <a href="https://www.ncpgambling.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.ncpgambling.org</a></p>
                  <p className="text-gray-700">Helpline: 1-800-522-4700</p>
                </div>

                <div className="border-l-4 border-gray-300 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-1">Gamblers Anonymous</h4>
                  <p className="text-gray-700">Website: <a href="https://www.gamblersanonymous.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.gamblersanonymous.org</a></p>
                  <p className="text-gray-700">Find local meetings and support groups</p>
                </div>

                <div className="border-l-4 border-gray-300 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-1">National Suicide Prevention Lifeline</h4>
                  <p className="text-gray-700">If you're in crisis: Call or text 988</p>
                  <p className="text-gray-700">Available 24/7 for free, confidential support</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">State-Specific Resources</h2>
              <p className="text-gray-700 mb-4">
                Many states offer additional resources and self-exclusion programs:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Arizona:</strong> 1-800-NEXT-STEP (1-800-639-8783)</li>
                <li><strong>Colorado:</strong> 1-800-522-4700 or <a href="https://www.colorado.gov/problem-gambling" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">colorado.gov/problem-gambling</a></li>
                <li><strong>Illinois:</strong> 1-800-GAMBLER (1-800-426-2537)</li>
                <li><strong>Indiana:</strong> 1-800-9-WITH-IT (1-800-994-8448)</li>
                <li><strong>Michigan:</strong> 1-800-270-7117</li>
                <li><strong>New Jersey:</strong> 1-800-GAMBLER (1-800-426-2537)</li>
                <li><strong>New York:</strong> 1-877-8-HOPENY (1-877-846-7369)</li>
                <li><strong>Pennsylvania:</strong> 1-800-GAMBLER (1-800-426-2537)</li>
                <li><strong>Tennessee:</strong> 1-800-889-9789</li>
                <li><strong>Virginia:</strong> 1-888-532-3500</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Visit your state's gaming commission website for more information about local resources and self-exclusion programs.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Self-Exclusion Programs</h2>
              <p className="text-gray-700 mb-4">
                Self-exclusion allows you to voluntarily ban yourself from gambling activities. Options include:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Sportsbook Self-Exclusion:</strong> Most legal sportsbooks offer self-exclusion tools in account settings</li>
                <li><strong>State Programs:</strong> Many states maintain self-exclusion lists that ban you from all licensed gambling facilities</li>
                <li><strong>WizJock Self-Exclusion:</strong> Contact us at support@wizjock.com to permanently close your account</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Setting Limits</h2>
              <p className="text-gray-700 mb-4">
                Protect yourself by setting clear limits before you start gambling:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">💰 Money Limits</h4>
                  <p className="text-gray-700">Decide how much you can afford to lose before you start. Never exceed this amount.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">⏰ Time Limits</h4>
                  <p className="text-gray-700">Set a time limit for gambling sessions. Use alarms or reminders to help you stick to it.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">🎯 Win/Loss Limits</h4>
                  <p className="text-gray-700">Decide in advance when you'll stop, whether you're winning or losing.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">📅 Frequency Limits</h4>
                  <p className="text-gray-700">Limit how often you gamble. Don't make it a daily activity.</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Tips for Family and Friends</h2>
              <p className="text-gray-700 mb-4">
                If you're concerned about someone's gambling:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Talk to them in a calm, non-judgmental way</li>
                <li>Express your concerns with specific examples</li>
                <li>Encourage them to seek professional help</li>
                <li>Offer to help them find resources or attend counseling</li>
                <li>Set boundaries to protect yourself financially</li>
                <li>Seek support for yourself through groups like Gam-Anon</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Commitment</h2>
              <p className="text-gray-700 mb-4">
                WizJock is committed to promoting responsible gambling:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>We verify that all members are 21 years of age or older</li>
                <li>We provide clear disclaimers that past performance doesn't guarantee future results</li>
                <li>We encourage bankroll management and responsible betting practices</li>
                <li>We will close accounts upon request for self-exclusion</li>
                <li>We provide easy access to problem gambling resources</li>
                <li>We never encourage chasing losses or betting beyond your means</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Additional Resources</h2>
              <div className="space-y-3">
                <p className="text-gray-700">
                  <strong>BeGambleAware:</strong> <a href="https://www.begambleaware.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.begambleaware.org</a>
                </p>
                <p className="text-gray-700">
                  <strong>Gambling Therapy:</strong> <a href="https://www.gamblingtherapy.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.gamblingtherapy.org</a>
                </p>
                <p className="text-gray-700">
                  <strong>Smart Recovery:</strong> <a href="https://www.smartrecovery.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.smartrecovery.org</a>
                </p>
              </div>
            </section>

            <div className="bg-gray-100 border-2 border-gray-300 rounded-lg p-6 mt-8">
              <p className="text-center text-gray-900 font-semibold text-lg">
                Remember: Gambling should be entertainment, not a way to make money. If it's not fun anymore, it's time to stop.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
