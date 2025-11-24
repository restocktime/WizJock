import { StateData } from '../../data/statesData';

interface StateFAQProps {
  stateData: StateData;
}

export default function StateFAQ({ stateData }: StateFAQProps) {
  const { name, legalStatus, legalSince, legalDetails, memberCount, proTeams } = stateData;

  const totalTeams = (proTeams.nfl?.length || 0) + 
                     (proTeams.nba?.length || 0) + 
                     (proTeams.mlb?.length || 0) + 
                     (proTeams.nhl?.length || 0) + 
                     (proTeams.ncaa?.length || 0);

  // Generate state-specific FAQs
  const faqs = [
    {
      question: `Is sports betting legal in ${name}?`,
      answer: legalStatus === 'legal' 
        ? `Yes! Sports betting became legal in ${name}${legalSince ? ` in ${legalSince}` : ''}. ${legalDetails || `You can legally bet on sports online and at licensed sportsbooks in ${name}.`}`
        : legalStatus === 'pending'
        ? `Sports betting legislation is currently pending in ${name}. ${legalDetails || `We're monitoring the situation closely and will update our members when the law passes.`}`
        : `Sports betting is not yet legal in ${name}. ${legalDetails || `However, legislation is being discussed, and we're optimistic about future legalization. Our analysis is still valuable for educational purposes.`}`,
    },
    {
      question: `What sports are popular in ${name}?`,
      answer: `${name} has a passionate sports culture with strong interest in ${stateData.popularSports?.join(', ') || 'all major sports'}. ${totalTeams > 0 ? `The state is home to ${totalTeams} professional teams across various leagues.` : ''} We provide expert analysis and picks for all ${name} teams and matchups.`,
    },
    {
      question: `How many ${name} members does WizJock have?`,
      answer: memberCount && memberCount > 0
        ? `We currently have ${memberCount} active members from ${name} who are winning with our professional analysis and picks. Our ${name} community is growing rapidly as more bettors discover the value of data-driven betting strategies.`
        : `We have a growing community of ${name} bettors who are winning with our professional analysis. Join our WhatsApp and Discord groups to connect with other ${name} members and share insights.`,
    },
    {
      question: `Do you cover ${name} teams?`,
      answer: totalTeams > 0
        ? `Absolutely! We provide comprehensive coverage of all ${name} teams including ${[
            proTeams.nfl?.length ? `${proTeams.nfl.length} NFL team${proTeams.nfl.length > 1 ? 's' : ''}` : null,
            proTeams.nba?.length ? `${proTeams.nba.length} NBA team${proTeams.nba.length > 1 ? 's' : ''}` : null,
            proTeams.mlb?.length ? `${proTeams.mlb.length} MLB team${proTeams.mlb.length > 1 ? 's' : ''}` : null,
            proTeams.nhl?.length ? `${proTeams.nhl.length} NHL team${proTeams.nhl.length > 1 ? 's' : ''}` : null,
            proTeams.ncaa?.length ? `${proTeams.ncaa.length} NCAA program${proTeams.ncaa.length > 1 ? 's' : ''}` : null,
          ].filter(Boolean).join(', ')}. Our analysts understand the local sports landscape and provide expert insights on every matchup.`
        : `Yes! We cover all major sports and provide analysis relevant to ${name} bettors. Even if ${name} doesn't have professional teams in every league, we help you find value in games across the country.`,
    },
    {
      question: `How do I get started as a ${name} bettor?`,
      answer: `Getting started is easy! First, apply for membership through our application form. Once approved, you'll get access to our member dashboard, daily picks, and private community. ${legalStatus === 'legal' ? `Since sports betting is legal in ${name}, you can immediately start placing bets at licensed sportsbooks.` : `While you wait for sports betting to become legal in ${name}, you can use our analysis for educational purposes and be ready when legislation passes.`} We recommend starting with a bankroll of at least $1,000 and following our unit sizing recommendations.`,
    },
    {
      question: `What makes WizJock different for ${name} bettors?`,
      answer: `We provide localized insights specific to ${name} teams and betting markets. Our analysts understand the ${name} sports culture and track local betting trends. Plus, you'll connect with other ${name} bettors in our community to share insights and strategies. We're not just another national service—we understand what matters to ${name} sports fans.`,
    },
  ];

  return (
    <section className="py-12 sm:py-16 px-4 bg-gradient-to-b from-gray-900 to-black" aria-label={`${name} FAQ`}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-4">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <p className="text-base sm:text-lg text-gray-400">
            Common questions from {name} bettors
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details 
              key={index}
              className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 group"
            >
              <summary className="font-bold text-base sm:text-lg cursor-pointer list-none flex justify-between items-center">
                <span className="pr-4">{faq.question}</span>
                <span className="text-cyan-400 group-open:rotate-180 transition-transform flex-shrink-0">▼</span>
              </summary>
              <p className="text-gray-400 mt-4 text-sm sm:text-base leading-relaxed">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm mb-4">
            Have more questions about sports betting in {name}?
          </p>
          <a 
            href="https://chat.whatsapp.com/FgmkVMnR3SH6aTFjO7QL2k"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-cyan-400 hover:text-cyan-300 font-semibold text-sm"
          >
            Join our WhatsApp community to ask questions →
          </a>
        </div>
      </div>
    </section>
  );
}
