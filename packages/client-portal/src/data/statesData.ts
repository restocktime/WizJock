/**
 * State Data Structure and Management System
 * Centralized data for all 50 US states for location-based SEO
 */

export interface StateData {
  // Basic Information
  name: string;
  slug: string;
  abbreviation: string;
  
  // Legal Information
  legalStatus: 'legal' | 'pending' | 'illegal';
  legalSince?: string;
  legalDetails?: string;
  
  // Demographics
  population: number;
  majorCities: string[];
  
  // Sports Teams
  proTeams: {
    nfl?: string[];
    nba?: string[];
    mlb?: string[];
    nhl?: string[];
    ncaa?: string[];
  };
  
  // Sports Culture
  popularSports: string[];
  
  // SEO & Marketing
  memberCount?: number;
  nearbyStates: string[];
  seoKeywords: string[];
  
  // Content
  heroTagline?: string;
  localInsights?: string;
}

export interface StatesByTier {
  tier1: StateData[];
  tier2: StateData[];
  tier3: StateData[];
}

// Centralized state data for all 50 US states
export const statesData: Record<string, StateData> = {
  // TIER 1: Legal Sports Betting States
  'new-york': {
    name: 'New York',
    slug: 'new-york',
    abbreviation: 'NY',
    legalStatus: 'legal',
    legalSince: '2022',
    legalDetails: 'Online sports betting became legal in New York in January 2022.',
    population: 20201249,
    majorCities: ['New York City', 'Buffalo', 'Rochester', 'Syracuse', 'Albany'],
    proTeams: {
      nfl: ['New York Giants', 'New York Jets', 'Buffalo Bills'],
      nba: ['New York Knicks', 'Brooklyn Nets'],
      mlb: ['New York Yankees', 'New York Mets'],
      nhl: ['New York Rangers', 'New York Islanders', 'Buffalo Sabres'],
      ncaa: ['Syracuse Orange', 'St. John\'s Red Storm'],
    },
    popularSports: ['Football', 'Basketball', 'Baseball', 'Hockey'],
    memberCount: 623,
    nearbyStates: ['new-jersey', 'pennsylvania', 'connecticut', 'massachusetts', 'vermont'],
    seoKeywords: [
      'sports betting new york',
      'new york sports betting picks',
      'ny sports betting analysis',
      'new york betting tips',
    ],
    heroTagline: 'Professional Sports Betting Analysis for New York',
    localInsights: 'New York is one of the largest legal sports betting markets in the US, with passionate fans of the Yankees, Knicks, Giants, and Bills.',
  },
  'new-jersey': {
    name: 'New Jersey',
    slug: 'new-jersey',
    abbreviation: 'NJ',
    legalStatus: 'legal',
    legalSince: '2018',
    legalDetails: 'New Jersey legalized sports betting in 2018 after winning a Supreme Court case.',
    population: 9288994,
    majorCities: ['Newark', 'Jersey City', 'Paterson', 'Elizabeth', 'Trenton'],
    proTeams: {
      nfl: ['New York Giants', 'New York Jets'],
      nba: ['Brooklyn Nets'],
      nhl: ['New Jersey Devils'],
      ncaa: ['Rutgers Scarlet Knights'],
    },
    popularSports: ['Football', 'Basketball', 'Hockey', 'Baseball'],
    memberCount: 412,
    nearbyStates: ['new-york', 'pennsylvania', 'delaware'],
    seoKeywords: [
      'sports betting new jersey',
      'nj sports betting picks',
      'new jersey betting analysis',
    ],
    heroTagline: 'Expert Sports Betting Analysis for New Jersey',
    localInsights: 'New Jersey pioneered legal sports betting and has one of the most mature markets in the country.',
  },
  'pennsylvania': {
    name: 'Pennsylvania',
    slug: 'pennsylvania',
    abbreviation: 'PA',
    legalStatus: 'legal',
    legalSince: '2019',
    legalDetails: 'Pennsylvania legalized online sports betting in 2019.',
    population: 13002700,
    majorCities: ['Philadelphia', 'Pittsburgh', 'Allentown', 'Erie', 'Reading'],
    proTeams: {
      nfl: ['Philadelphia Eagles', 'Pittsburgh Steelers'],
      nba: ['Philadelphia 76ers'],
      mlb: ['Philadelphia Phillies', 'Pittsburgh Pirates'],
      nhl: ['Philadelphia Flyers', 'Pittsburgh Penguins'],
      ncaa: ['Penn State Nittany Lions', 'Pittsburgh Panthers'],
    },
    popularSports: ['Football', 'Hockey', 'Baseball', 'Basketball'],
    memberCount: 487,
    nearbyStates: ['new-york', 'new-jersey', 'ohio', 'west-virginia', 'maryland', 'delaware'],
    seoKeywords: [
      'sports betting pennsylvania',
      'pa sports betting picks',
      'pennsylvania betting analysis',
    ],
    heroTagline: 'Professional Sports Betting Analysis for Pennsylvania',
    localInsights: 'Pennsylvania has passionate sports fans with strong loyalty to the Eagles, Steelers, and Flyers.',
  },
  'illinois': {
    name: 'Illinois',
    slug: 'illinois',
    abbreviation: 'IL',
    legalStatus: 'legal',
    legalSince: '2020',
    legalDetails: 'Illinois launched online sports betting in 2020.',
    population: 12812508,
    majorCities: ['Chicago', 'Aurora', 'Naperville', 'Joliet', 'Rockford'],
    proTeams: {
      nfl: ['Chicago Bears'],
      nba: ['Chicago Bulls'],
      mlb: ['Chicago Cubs', 'Chicago White Sox'],
      nhl: ['Chicago Blackhawks'],
      ncaa: ['Illinois Fighting Illini', 'Northwestern Wildcats'],
    },
    popularSports: ['Football', 'Basketball', 'Baseball', 'Hockey'],
    memberCount: 398,
    nearbyStates: ['indiana', 'wisconsin', 'iowa', 'missouri', 'kentucky'],
    seoKeywords: [
      'sports betting illinois',
      'chicago sports betting picks',
      'illinois betting analysis',
    ],
    heroTagline: 'Expert Sports Betting Analysis for Illinois',
    localInsights: 'Chicago is a major sports market with dedicated fans of the Bears, Bulls, Cubs, and Blackhawks.',
  },
  'michigan': {
    name: 'Michigan',
    slug: 'michigan',
    abbreviation: 'MI',
    legalStatus: 'legal',
    legalSince: '2021',
    legalDetails: 'Michigan legalized online sports betting in 2021.',
    population: 10077331,
    majorCities: ['Detroit', 'Grand Rapids', 'Warren', 'Sterling Heights', 'Ann Arbor'],
    proTeams: {
      nfl: ['Detroit Lions'],
      nba: ['Detroit Pistons'],
      mlb: ['Detroit Tigers'],
      nhl: ['Detroit Red Wings'],
      ncaa: ['Michigan Wolverines', 'Michigan State Spartans'],
    },
    popularSports: ['Football', 'Hockey', 'Basketball', 'Baseball'],
    memberCount: 321,
    nearbyStates: ['ohio', 'indiana', 'wisconsin', 'illinois'],
    seoKeywords: [
      'sports betting michigan',
      'michigan sports betting picks',
      'detroit betting analysis',
    ],
    heroTagline: 'Professional Sports Betting Analysis for Michigan',
    localInsights: 'Michigan has a rich sports tradition with passionate fans of the Wolverines, Spartans, and Red Wings.',
  },
  'virginia': {
    name: 'Virginia',
    slug: 'virginia',
    abbreviation: 'VA',
    legalStatus: 'legal',
    legalSince: '2021',
    legalDetails: 'Virginia legalized online sports betting in 2021.',
    population: 8631393,
    majorCities: ['Virginia Beach', 'Norfolk', 'Chesapeake', 'Richmond', 'Arlington'],
    proTeams: {
      nfl: ['Washington Commanders'],
      nba: ['Washington Wizards'],
      mlb: ['Washington Nationals'],
      nhl: ['Washington Capitals'],
      ncaa: ['Virginia Cavaliers', 'Virginia Tech Hokies'],
    },
    popularSports: ['Football', 'Basketball', 'Baseball', 'Hockey'],
    memberCount: 267,
    nearbyStates: ['maryland', 'west-virginia', 'north-carolina', 'tennessee', 'kentucky'],
    seoKeywords: [
      'sports betting virginia',
      'virginia sports betting picks',
      'va betting analysis',
    ],
    heroTagline: 'Expert Sports Betting Analysis for Virginia',
    localInsights: 'Virginia fans follow DC area teams and have strong college sports traditions with UVA and Virginia Tech.',
  },
  'colorado': {
    name: 'Colorado',
    slug: 'colorado',
    abbreviation: 'CO',
    legalStatus: 'legal',
    legalSince: '2020',
    legalDetails: 'Colorado legalized online sports betting in 2020.',
    population: 5773714,
    majorCities: ['Denver', 'Colorado Springs', 'Aurora', 'Fort Collins', 'Lakewood'],
    proTeams: {
      nfl: ['Denver Broncos'],
      nba: ['Denver Nuggets'],
      mlb: ['Colorado Rockies'],
      nhl: ['Colorado Avalanche'],
      ncaa: ['Colorado Buffaloes', 'Colorado State Rams'],
    },
    popularSports: ['Football', 'Basketball', 'Hockey', 'Baseball'],
    memberCount: 234,
    nearbyStates: ['wyoming', 'nebraska', 'kansas', 'oklahoma', 'new-mexico', 'utah'],
    seoKeywords: [
      'sports betting colorado',
      'denver sports betting picks',
      'colorado betting analysis',
    ],
    heroTagline: 'Professional Sports Betting Analysis for Colorado',
    localInsights: 'Colorado has a thriving sports scene with the Broncos, Nuggets, and Avalanche drawing passionate fans.',
  },
  'indiana': {
    name: 'Indiana',
    slug: 'indiana',
    abbreviation: 'IN',
    legalStatus: 'legal',
    legalSince: '2019',
    legalDetails: 'Indiana legalized sports betting in 2019.',
    population: 6785528,
    majorCities: ['Indianapolis', 'Fort Wayne', 'Evansville', 'South Bend', 'Carmel'],
    proTeams: {
      nfl: ['Indianapolis Colts'],
      nba: ['Indiana Pacers'],
      ncaa: ['Indiana Hoosiers', 'Purdue Boilermakers', 'Notre Dame Fighting Irish'],
    },
    popularSports: ['Football', 'Basketball', 'Baseball'],
    memberCount: 198,
    nearbyStates: ['michigan', 'ohio', 'kentucky', 'illinois'],
    seoKeywords: [
      'sports betting indiana',
      'indiana sports betting picks',
      'indianapolis betting analysis',
    ],
    heroTagline: 'Expert Sports Betting Analysis for Indiana',
    localInsights: 'Indiana is basketball country with passionate fans of the Pacers, Hoosiers, and Boilermakers.',
  },
  'tennessee': {
    name: 'Tennessee',
    slug: 'tennessee',
    abbreviation: 'TN',
    legalStatus: 'legal',
    legalSince: '2020',
    legalDetails: 'Tennessee legalized online sports betting in 2020.',
    population: 6910840,
    majorCities: ['Nashville', 'Memphis', 'Knoxville', 'Chattanooga', 'Clarksville'],
    proTeams: {
      nfl: ['Tennessee Titans'],
      nba: ['Memphis Grizzlies'],
      nhl: ['Nashville Predators'],
      ncaa: ['Tennessee Volunteers', 'Vanderbilt Commodores'],
    },
    popularSports: ['Football', 'Basketball', 'Hockey', 'Baseball'],
    memberCount: 212,
    nearbyStates: ['kentucky', 'virginia', 'north-carolina', 'georgia', 'alabama', 'mississippi', 'arkansas', 'missouri'],
    seoKeywords: [
      'sports betting tennessee',
      'tennessee sports betting picks',
      'nashville betting analysis',
    ],
    heroTagline: 'Professional Sports Betting Analysis for Tennessee',
    localInsights: 'Tennessee has passionate football fans supporting the Titans and Volunteers.',
  },
  'arizona': {
    name: 'Arizona',
    slug: 'arizona',
    abbreviation: 'AZ',
    legalStatus: 'legal',
    legalSince: '2021',
    legalDetails: 'Arizona legalized sports betting in 2021.',
    population: 7151502,
    majorCities: ['Phoenix', 'Tucson', 'Mesa', 'Chandler', 'Scottsdale'],
    proTeams: {
      nfl: ['Arizona Cardinals'],
      nba: ['Phoenix Suns'],
      mlb: ['Arizona Diamondbacks'],
      nhl: ['Arizona Coyotes'],
      ncaa: ['Arizona Wildcats', 'Arizona State Sun Devils'],
    },
    popularSports: ['Football', 'Basketball', 'Baseball', 'Hockey'],
    memberCount: 245,
    nearbyStates: ['california', 'nevada', 'utah', 'colorado', 'new-mexico'],
    seoKeywords: [
      'sports betting arizona',
      'arizona sports betting picks',
      'phoenix betting analysis',
    ],
    heroTagline: 'Expert Sports Betting Analysis for Arizona',
    localInsights: 'Arizona has a growing sports market with the Cardinals, Suns, and strong college rivalries.',
  },

  // TIER 2: Large Population States (No Legal Betting Yet)
  'california': {
    name: 'California',
    slug: 'california',
    abbreviation: 'CA',
    legalStatus: 'illegal',
    legalDetails: 'Sports betting is not yet legal in California. Tribal gaming and ballot measures are ongoing.',
    population: 39538223,
    majorCities: ['Los Angeles', 'San Francisco', 'San Diego', 'San Jose', 'Sacramento'],
    proTeams: {
      nfl: ['Los Angeles Rams', 'Los Angeles Chargers', 'San Francisco 49ers'],
      nba: ['Los Angeles Lakers', 'Los Angeles Clippers', 'Golden State Warriors', 'Sacramento Kings'],
      mlb: ['Los Angeles Dodgers', 'Los Angeles Angels', 'San Francisco Giants', 'San Diego Padres', 'Oakland Athletics'],
      nhl: ['Los Angeles Kings', 'Anaheim Ducks', 'San Jose Sharks'],
      ncaa: ['USC Trojans', 'UCLA Bruins', 'Stanford Cardinal', 'Cal Bears'],
    },
    popularSports: ['Football', 'Basketball', 'Baseball', 'Hockey'],
    memberCount: 892,
    nearbyStates: ['nevada', 'oregon', 'arizona'],
    seoKeywords: [
      'sports betting california',
      'california sports betting picks',
      'best sports betting california',
      'california betting analysis',
    ],
    heroTagline: 'Professional Sports Betting Analysis for California Bettors',
    localInsights: 'California has the largest sports betting market potential in the US, with passionate fans of the Lakers, Dodgers, 49ers, and Warriors.',
  },
  'texas': {
    name: 'Texas',
    slug: 'texas',
    abbreviation: 'TX',
    legalStatus: 'illegal',
    legalDetails: 'Sports betting is currently illegal in Texas, but legislation is being considered.',
    population: 29145505,
    majorCities: ['Houston', 'San Antonio', 'Dallas', 'Austin', 'Fort Worth'],
    proTeams: {
      nfl: ['Dallas Cowboys', 'Houston Texans'],
      nba: ['Dallas Mavericks', 'Houston Rockets', 'San Antonio Spurs'],
      mlb: ['Houston Astros', 'Texas Rangers'],
      nhl: ['Dallas Stars'],
      ncaa: ['Texas Longhorns', 'Texas A&M Aggies', 'Texas Tech Red Raiders'],
    },
    popularSports: ['Football', 'Basketball', 'Baseball', 'Hockey'],
    memberCount: 756,
    nearbyStates: ['oklahoma', 'arkansas', 'louisiana', 'new-mexico'],
    seoKeywords: [
      'sports betting texas',
      'texas sports betting picks',
      'dallas betting analysis',
      'houston betting tips',
    ],
    heroTagline: 'Professional Sports Betting Analysis for Texas',
    localInsights: 'Texas has massive sports culture with the Cowboys, Longhorns, and passionate fans across all major leagues.',
  },
  'florida': {
    name: 'Florida',
    slug: 'florida',
    abbreviation: 'FL',
    legalStatus: 'pending',
    legalDetails: 'Florida sports betting is in legal limbo with ongoing tribal gaming disputes.',
    population: 21538187,
    majorCities: ['Jacksonville', 'Miami', 'Tampa', 'Orlando', 'St. Petersburg'],
    proTeams: {
      nfl: ['Miami Dolphins', 'Tampa Bay Buccaneers', 'Jacksonville Jaguars'],
      nba: ['Miami Heat', 'Orlando Magic'],
      mlb: ['Miami Marlins', 'Tampa Bay Rays'],
      nhl: ['Florida Panthers', 'Tampa Bay Lightning'],
      ncaa: ['Florida Gators', 'Florida State Seminoles', 'Miami Hurricanes'],
    },
    popularSports: ['Football', 'Basketball', 'Baseball', 'Hockey'],
    memberCount: 634,
    nearbyStates: ['georgia', 'alabama'],
    seoKeywords: [
      'sports betting florida',
      'florida sports betting picks',
      'miami betting analysis',
      'tampa betting tips',
    ],
    heroTagline: 'Expert Sports Betting Analysis for Florida',
    localInsights: 'Florida has a vibrant sports scene with the Heat, Dolphins, and strong college football traditions.',
  },
  'ohio': {
    name: 'Ohio',
    slug: 'ohio',
    abbreviation: 'OH',
    legalStatus: 'legal',
    legalSince: '2023',
    legalDetails: 'Ohio legalized sports betting in 2023.',
    population: 11799448,
    majorCities: ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Akron'],
    proTeams: {
      nfl: ['Cleveland Browns', 'Cincinnati Bengals'],
      nba: ['Cleveland Cavaliers'],
      mlb: ['Cleveland Guardians', 'Cincinnati Reds'],
      ncaa: ['Ohio State Buckeyes', 'Cincinnati Bearcats'],
    },
    popularSports: ['Football', 'Basketball', 'Baseball'],
    memberCount: 378,
    nearbyStates: ['michigan', 'pennsylvania', 'west-virginia', 'kentucky', 'indiana'],
    seoKeywords: [
      'sports betting ohio',
      'ohio sports betting picks',
      'cleveland betting analysis',
    ],
    heroTagline: 'Professional Sports Betting Analysis for Ohio',
    localInsights: 'Ohio has passionate sports fans with strong loyalty to the Buckeyes, Browns, and Cavaliers.',
  },
  'georgia': {
    name: 'Georgia',
    slug: 'georgia',
    abbreviation: 'GA',
    legalStatus: 'illegal',
    legalDetails: 'Sports betting is currently illegal in Georgia.',
    population: 10711908,
    majorCities: ['Atlanta', 'Augusta', 'Columbus', 'Macon', 'Savannah'],
    proTeams: {
      nfl: ['Atlanta Falcons'],
      nba: ['Atlanta Hawks'],
      mlb: ['Atlanta Braves'],
      ncaa: ['Georgia Bulldogs', 'Georgia Tech Yellow Jackets'],
    },
    popularSports: ['Football', 'Basketball', 'Baseball'],
    memberCount: 312,
    nearbyStates: ['florida', 'alabama', 'south-carolina', 'north-carolina', 'tennessee'],
    seoKeywords: [
      'sports betting georgia',
      'georgia sports betting picks',
      'atlanta betting analysis',
    ],
    heroTagline: 'Expert Sports Betting Analysis for Georgia',
    localInsights: 'Georgia has passionate football fans supporting the Bulldogs and Falcons.',
  },
  'north-carolina': {
    name: 'North Carolina',
    slug: 'north-carolina',
    abbreviation: 'NC',
    legalStatus: 'legal',
    legalSince: '2024',
    legalDetails: 'North Carolina legalized sports betting in 2024.',
    population: 10439388,
    majorCities: ['Charlotte', 'Raleigh', 'Greensboro', 'Durham', 'Winston-Salem'],
    proTeams: {
      nfl: ['Carolina Panthers'],
      nba: ['Charlotte Hornets'],
      nhl: ['Carolina Hurricanes'],
      ncaa: ['North Carolina Tar Heels', 'Duke Blue Devils', 'NC State Wolfpack'],
    },
    popularSports: ['Basketball', 'Football', 'Hockey'],
    memberCount: 289,
    nearbyStates: ['virginia', 'tennessee', 'georgia', 'south-carolina'],
    seoKeywords: [
      'sports betting north carolina',
      'nc sports betting picks',
      'charlotte betting analysis',
    ],
    heroTagline: 'Professional Sports Betting Analysis for North Carolina',
    localInsights: 'North Carolina is basketball country with passionate fans of the Tar Heels and Blue Devils.',
  },
  'massachusetts': {
    name: 'Massachusetts',
    slug: 'massachusetts',
    abbreviation: 'MA',
    legalStatus: 'legal',
    legalSince: '2023',
    legalDetails: 'Massachusetts legalized sports betting in 2023.',
    population: 7029917,
    majorCities: ['Boston', 'Worcester', 'Springfield', 'Cambridge', 'Lowell'],
    proTeams: {
      nfl: ['New England Patriots'],
      nba: ['Boston Celtics'],
      mlb: ['Boston Red Sox'],
      nhl: ['Boston Bruins'],
      ncaa: ['Boston College Eagles'],
    },
    popularSports: ['Football', 'Basketball', 'Baseball', 'Hockey'],
    memberCount: 298,
    nearbyStates: ['new-york', 'vermont', 'new-hampshire', 'rhode-island', 'connecticut'],
    seoKeywords: [
      'sports betting massachusetts',
      'boston sports betting picks',
      'ma betting analysis',
    ],
    heroTagline: 'Expert Sports Betting Analysis for Massachusetts',
    localInsights: 'Massachusetts has some of the most passionate sports fans with the Patriots, Celtics, Red Sox, and Bruins.',
  },
  'washington': {
    name: 'Washington',
    slug: 'washington',
    abbreviation: 'WA',
    legalStatus: 'legal',
    legalSince: '2020',
    legalDetails: 'Washington legalized retail sports betting in 2020.',
    population: 7705281,
    majorCities: ['Seattle', 'Spokane', 'Tacoma', 'Vancouver', 'Bellevue'],
    proTeams: {
      nfl: ['Seattle Seahawks'],
      mlb: ['Seattle Mariners'],
      nhl: ['Seattle Kraken'],
      ncaa: ['Washington Huskies', 'Washington State Cougars'],
    },
    popularSports: ['Football', 'Baseball', 'Hockey', 'Basketball'],
    memberCount: 267,
    nearbyStates: ['oregon', 'idaho'],
    seoKeywords: [
      'sports betting washington',
      'seattle sports betting picks',
      'washington betting analysis',
    ],
    heroTagline: 'Professional Sports Betting Analysis for Washington',
    localInsights: 'Washington has passionate fans of the Seahawks, Mariners, and the new Kraken.',
  },
  // TIER 3: Remaining States
  'alabama': {
    name: 'Alabama',
    slug: 'alabama',
    abbreviation: 'AL',
    legalStatus: 'illegal',
    legalDetails: 'Sports betting is currently illegal in Alabama.',
    population: 5024279,
    majorCities: ['Birmingham', 'Montgomery', 'Mobile', 'Huntsville', 'Tuscaloosa'],
    proTeams: {
      ncaa: ['Alabama Crimson Tide', 'Auburn Tigers'],
    },
    popularSports: ['Football', 'Basketball', 'Baseball'],
    memberCount: 145,
    nearbyStates: ['tennessee', 'georgia', 'florida', 'mississippi'],
    seoKeywords: [
      'sports betting alabama',
      'alabama sports betting picks',
      'alabama betting analysis',
    ],
    heroTagline: 'Professional Sports Betting Analysis for Alabama',
    localInsights: 'Alabama is college football country with passionate fans of the Crimson Tide and Tigers.',
  },
  'alaska': {
    name: 'Alaska',
    slug: 'alaska',
    abbreviation: 'AK',
    legalStatus: 'illegal',
    legalDetails: 'Sports betting is currently illegal in Alaska.',
    population: 733391,
    majorCities: ['Anchorage', 'Fairbanks', 'Juneau', 'Sitka', 'Ketchikan'],
    proTeams: {},
    popularSports: ['Hockey', 'Basketball', 'Football'],
    memberCount: 12,
    nearbyStates: [],
    seoKeywords: [
      'sports betting alaska',
      'alaska sports betting picks',
    ],
    heroTagline: 'Professional Sports Betting Analysis for Alaska',
    localInsights: 'Alaska bettors follow national teams and enjoy hockey and outdoor sports.',
  },
  'arkansas': {
    name: 'Arkansas',
    slug: 'arkansas',
    abbreviation: 'AR',
    legalStatus: 'legal',
    legalSince: '2019',
    legalDetails: 'Arkansas legalized retail sports betting in 2019.',
    population: 3011524,
    majorCities: ['Little Rock', 'Fort Smith', 'Fayetteville', 'Springdale', 'Jonesboro'],
    proTeams: {
      ncaa: ['Arkansas Razorbacks'],
    },
    popularSports: ['Football', 'Basketball', 'Baseball'],
    memberCount: 87,
    nearbyStates: ['missouri', 'tennessee', 'mississippi', 'louisiana', 'texas', 'oklahoma'],
    seoKeywords: [
      'sports betting arkansas',
      'arkansas sports betting picks',
    ],
    heroTagline: 'Expert Sports Betting Analysis for Arkansas',
    localInsights: 'Arkansas fans are passionate about the Razorbacks and SEC sports.',
  },
  'connecticut': {
    name: 'Connecticut',
    slug: 'connecticut',
    abbreviation: 'CT',
    legalStatus: 'legal',
    legalSince: '2021',
    legalDetails: 'Connecticut legalized sports betting in 2021.',
    population: 3605944,
    majorCities: ['Bridgeport', 'New Haven', 'Stamford', 'Hartford', 'Waterbury'],
    proTeams: {
      ncaa: ['UConn Huskies'],
    },
    popularSports: ['Basketball', 'Football', 'Baseball', 'Hockey'],
    memberCount: 124,
    nearbyStates: ['new-york', 'massachusetts', 'rhode-island'],
    seoKeywords: [
      'sports betting connecticut',
      'ct sports betting picks',
    ],
    heroTagline: 'Professional Sports Betting Analysis for Connecticut',
    localInsights: 'Connecticut fans follow New York and Boston teams, plus the champion UConn Huskies.',
  },
  'delaware': {
    name: 'Delaware',
    slug: 'delaware',
    abbreviation: 'DE',
    legalStatus: 'legal',
    legalSince: '2018',
    legalDetails: 'Delaware was one of the first states to legalize sports betting in 2018.',
    population: 989948,
    majorCities: ['Wilmington', 'Dover', 'Newark', 'Middletown', 'Smyrna'],
    proTeams: {},
    popularSports: ['Football', 'Basketball', 'Baseball'],
    memberCount: 43,
    nearbyStates: ['pennsylvania', 'new-jersey', 'maryland'],
    seoKeywords: [
      'sports betting delaware',
      'delaware sports betting picks',
    ],
    heroTagline: 'Expert Sports Betting Analysis for Delaware',
    localInsights: 'Delaware was a sports betting pioneer and fans follow Philadelphia teams.',
  },
  'hawaii': {
    name: 'Hawaii',
    slug: 'hawaii',
    abbreviation: 'HI',
    legalStatus: 'illegal',
    legalDetails: 'Sports betting is currently illegal in Hawaii.',
    population: 1455271,
    majorCities: ['Honolulu', 'Pearl City', 'Hilo', 'Kailua', 'Waipahu'],
    proTeams: {},
    popularSports: ['Football', 'Basketball', 'Surfing'],
    memberCount: 28,
    nearbyStates: [],
    seoKeywords: [
      'sports betting hawaii',
      'hawaii sports betting picks',
    ],
    heroTagline: 'Professional Sports Betting Analysis for Hawaii',
    localInsights: 'Hawaii bettors follow national teams and enjoy college football.',
  },
  'idaho': {
    name: 'Idaho',
    slug: 'idaho',
    abbreviation: 'ID',
    legalStatus: 'illegal',
    legalDetails: 'Sports betting is currently illegal in Idaho.',
    population: 1839106,
    majorCities: ['Boise', 'Meridian', 'Nampa', 'Idaho Falls', 'Pocatello'],
    proTeams: {
      ncaa: ['Boise State Broncos'],
    },
    popularSports: ['Football', 'Basketball', 'Baseball'],
    memberCount: 45,
    nearbyStates: ['washington', 'oregon', 'nevada', 'utah', 'wyoming', 'montana'],
    seoKeywords: [
      'sports betting idaho',
      'idaho sports betting picks',
    ],
    heroTagline: 'Professional Sports Betting Analysis for Idaho',
    localInsights: 'Idaho fans are passionate about Boise State football and outdoor sports.',
  },
  'iowa': {
    name: 'Iowa',
    slug: 'iowa',
    abbreviation: 'IA',
    legalStatus: 'legal',
    legalSince: '2019',
    legalDetails: 'Iowa legalized sports betting in 2019.',
    population: 3190369,
    majorCities: ['Des Moines', 'Cedar Rapids', 'Davenport', 'Sioux City', 'Iowa City'],
    proTeams: {
      ncaa: ['Iowa Hawkeyes', 'Iowa State Cyclones'],
    },
    popularSports: ['Football', 'Basketball', 'Baseball'],
    memberCount: 98,
    nearbyStates: ['minnesota', 'wisconsin', 'illinois', 'missouri', 'nebraska', 'south-dakota'],
    seoKeywords: [
      'sports betting iowa',
      'iowa sports betting picks',
    ],
    heroTagline: 'Expert Sports Betting Analysis for Iowa',
    localInsights: 'Iowa has passionate college sports fans supporting the Hawkeyes and Cyclones.',
  },
  'kansas': {
    name: 'Kansas',
    slug: 'kansas',
    abbreviation: 'KS',
    legalStatus: 'legal',
    legalSince: '2022',
    legalDetails: 'Kansas legalized sports betting in 2022.',
    population: 2937880,
    majorCities: ['Wichita', 'Overland Park', 'Kansas City', 'Olathe', 'Topeka'],
    proTeams: {
      nfl: ['Kansas City Chiefs'],
      mlb: ['Kansas City Royals'],
      ncaa: ['Kansas Jayhawks', 'Kansas State Wildcats'],
    },
    popularSports: ['Football', 'Basketball', 'Baseball'],
    memberCount: 89,
    nearbyStates: ['nebraska', 'missouri', 'oklahoma', 'colorado'],
    seoKeywords: [
      'sports betting kansas',
      'kansas sports betting picks',
    ],
    heroTagline: 'Professional Sports Betting Analysis for Kansas',
    localInsights: 'Kansas fans support the Chiefs, Royals, and have strong college basketball traditions.',
  },
  'kentucky': {
    name: 'Kentucky',
    slug: 'kentucky',
    abbreviation: 'KY',
    legalStatus: 'legal',
    legalSince: '2023',
    legalDetails: 'Kentucky legalized sports betting in 2023.',
    population: 4505836,
    majorCities: ['Louisville', 'Lexington', 'Bowling Green', 'Owensboro', 'Covington'],
    proTeams: {
      ncaa: ['Kentucky Wildcats', 'Louisville Cardinals'],
    },
    popularSports: ['Basketball', 'Football', 'Horse Racing'],
    memberCount: 134,
    nearbyStates: ['indiana', 'ohio', 'west-virginia', 'virginia', 'tennessee', 'missouri', 'illinois'],
    seoKeywords: [
      'sports betting kentucky',
      'kentucky sports betting picks',
    ],
    heroTagline: 'Expert Sports Betting Analysis for Kentucky',
    localInsights: 'Kentucky is basketball country with passionate fans of the Wildcats and Cardinals.',
  },
  'louisiana': {
    name: 'Louisiana',
    slug: 'louisiana',
    abbreviation: 'LA',
    legalStatus: 'legal',
    legalSince: '2021',
    legalDetails: 'Louisiana legalized sports betting in 2021.',
    population: 4657757,
    majorCities: ['New Orleans', 'Baton Rouge', 'Shreveport', 'Lafayette', 'Lake Charles'],
    proTeams: {
      nfl: ['New Orleans Saints'],
      nba: ['New Orleans Pelicans'],
      ncaa: ['LSU Tigers'],
    },
    popularSports: ['Football', 'Basketball', 'Baseball'],
    memberCount: 156,
    nearbyStates: ['texas', 'arkansas', 'mississippi'],
    seoKeywords: [
      'sports betting louisiana',
      'louisiana sports betting picks',
      'new orleans betting analysis',
    ],
    heroTagline: 'Professional Sports Betting Analysis for Louisiana',
    localInsights: 'Louisiana has passionate fans of the Saints, Pelicans, and LSU Tigers.',
  },
  'maine': {
    name: 'Maine',
    slug: 'maine',
    abbreviation: 'ME',
    legalStatus: 'legal',
    legalSince: '2022',
    legalDetails: 'Maine legalized sports betting in 2022.',
    population: 1362359,
    majorCities: ['Portland', 'Lewiston', 'Bangor', 'South Portland', 'Auburn'],
    proTeams: {},
    popularSports: ['Hockey', 'Football', 'Basketball'],
    memberCount: 38,
    nearbyStates: ['new-hampshire'],
    seoKeywords: [
      'sports betting maine',
      'maine sports betting picks',
    ],
    heroTagline: 'Expert Sports Betting Analysis for Maine',
    localInsights: 'Maine fans follow Boston teams and enjoy hockey and outdoor sports.',
  },
  'maryland': {
    name: 'Maryland',
    slug: 'maryland',
    abbreviation: 'MD',
    legalStatus: 'legal',
    legalSince: '2021',
    legalDetails: 'Maryland legalized sports betting in 2021.',
    population: 6177224,
    majorCities: ['Baltimore', 'Columbia', 'Germantown', 'Silver Spring', 'Waldorf'],
    proTeams: {
      nfl: ['Baltimore Ravens'],
      mlb: ['Baltimore Orioles'],
      ncaa: ['Maryland Terrapins'],
    },
    popularSports: ['Football', 'Baseball', 'Basketball', 'Lacrosse'],
    memberCount: 198,
    nearbyStates: ['pennsylvania', 'delaware', 'virginia', 'west-virginia'],
    seoKeywords: [
      'sports betting maryland',
      'maryland sports betting picks',
      'baltimore betting analysis',
    ],
    heroTagline: 'Professional Sports Betting Analysis for Maryland',
    localInsights: 'Maryland has passionate fans of the Ravens, Orioles, and Terrapins.',
  },
  'minnesota': {
    name: 'Minnesota',
    slug: 'minnesota',
    abbreviation: 'MN',
    legalStatus: 'illegal',
    legalDetails: 'Sports betting is currently illegal in Minnesota, but legislation is being considered.',
    population: 5706494,
    majorCities: ['Minneapolis', 'St. Paul', 'Rochester', 'Duluth', 'Bloomington'],
    proTeams: {
      nfl: ['Minnesota Vikings'],
      nba: ['Minnesota Timberwolves'],
      mlb: ['Minnesota Twins'],
      nhl: ['Minnesota Wild'],
      ncaa: ['Minnesota Golden Gophers'],
    },
    popularSports: ['Football', 'Hockey', 'Basketball', 'Baseball'],
    memberCount: 187,
    nearbyStates: ['wisconsin', 'iowa', 'south-dakota', 'north-dakota'],
    seoKeywords: [
      'sports betting minnesota',
      'minnesota sports betting picks',
      'minneapolis betting analysis',
    ],
    heroTagline: 'Expert Sports Betting Analysis for Minnesota',
    localInsights: 'Minnesota has passionate fans of the Vikings, Timberwolves, Twins, and Wild.',
  },
  'mississippi': {
    name: 'Mississippi',
    slug: 'mississippi',
    abbreviation: 'MS',
    legalStatus: 'legal',
    legalSince: '2018',
    legalDetails: 'Mississippi legalized retail sports betting in 2018.',
    population: 2961279,
    majorCities: ['Jackson', 'Gulfport', 'Southaven', 'Hattiesburg', 'Biloxi'],
    proTeams: {
      ncaa: ['Ole Miss Rebels', 'Mississippi State Bulldogs'],
    },
    popularSports: ['Football', 'Basketball', 'Baseball'],
    memberCount: 76,
    nearbyStates: ['tennessee', 'alabama', 'louisiana', 'arkansas'],
    seoKeywords: [
      'sports betting mississippi',
      'mississippi sports betting picks',
    ],
    heroTagline: 'Professional Sports Betting Analysis for Mississippi',
    localInsights: 'Mississippi fans are passionate about SEC football with Ole Miss and Mississippi State.',
  },
  'missouri': {
    name: 'Missouri',
    slug: 'missouri',
    abbreviation: 'MO',
    legalStatus: 'illegal',
    legalDetails: 'Sports betting is currently illegal in Missouri.',
    population: 6154913,
    majorCities: ['Kansas City', 'St. Louis', 'Springfield', 'Columbia', 'Independence'],
    proTeams: {
      nfl: ['Kansas City Chiefs'],
      mlb: ['St. Louis Cardinals', 'Kansas City Royals'],
      nhl: ['St. Louis Blues'],
      ncaa: ['Missouri Tigers'],
    },
    popularSports: ['Football', 'Baseball', 'Hockey', 'Basketball'],
    memberCount: 178,
    nearbyStates: ['iowa', 'illinois', 'kentucky', 'tennessee', 'arkansas', 'oklahoma', 'kansas', 'nebraska'],
    seoKeywords: [
      'sports betting missouri',
      'missouri sports betting picks',
      'kansas city betting analysis',
    ],
    heroTagline: 'Professional Sports Betting Analysis for Missouri',
    localInsights: 'Missouri has passionate fans of the Chiefs, Cardinals, and Blues.',
  },
  'montana': {
    name: 'Montana',
    slug: 'montana',
    abbreviation: 'MT',
    legalStatus: 'legal',
    legalSince: '2020',
    legalDetails: 'Montana legalized sports betting in 2020.',
    population: 1084225,
    majorCities: ['Billings', 'Missoula', 'Great Falls', 'Bozeman', 'Butte'],
    proTeams: {
      ncaa: ['Montana Grizzlies', 'Montana State Bobcats'],
    },
    popularSports: ['Football', 'Basketball', 'Rodeo'],
    memberCount: 32,
    nearbyStates: ['idaho', 'wyoming', 'north-dakota', 'south-dakota'],
    seoKeywords: [
      'sports betting montana',
      'montana sports betting picks',
    ],
    heroTagline: 'Expert Sports Betting Analysis for Montana',
    localInsights: 'Montana fans enjoy college football and outdoor sports.',
  },
  'nebraska': {
    name: 'Nebraska',
    slug: 'nebraska',
    abbreviation: 'NE',
    legalStatus: 'illegal',
    legalDetails: 'Sports betting is currently illegal in Nebraska.',
    population: 1961504,
    majorCities: ['Omaha', 'Lincoln', 'Bellevue', 'Grand Island', 'Kearney'],
    proTeams: {
      ncaa: ['Nebraska Cornhuskers'],
    },
    popularSports: ['Football', 'Basketball', 'Baseball'],
    memberCount: 67,
    nearbyStates: ['south-dakota', 'iowa', 'missouri', 'kansas', 'colorado', 'wyoming'],
    seoKeywords: [
      'sports betting nebraska',
      'nebraska sports betting picks',
    ],
    heroTagline: 'Professional Sports Betting Analysis for Nebraska',
    localInsights: 'Nebraska has some of the most passionate college football fans supporting the Cornhuskers.',
  },
  'nevada': {
    name: 'Nevada',
    slug: 'nevada',
    abbreviation: 'NV',
    legalStatus: 'legal',
    legalSince: '1949',
    legalDetails: 'Nevada has had legal sports betting since 1949 and is the original sports betting state.',
    population: 3104614,
    majorCities: ['Las Vegas', 'Henderson', 'Reno', 'North Las Vegas', 'Sparks'],
    proTeams: {
      nfl: ['Las Vegas Raiders'],
      nhl: ['Vegas Golden Knights'],
      ncaa: ['UNLV Rebels', 'Nevada Wolf Pack'],
    },
    popularSports: ['Football', 'Hockey', 'Basketball', 'Baseball'],
    memberCount: 245,
    nearbyStates: ['california', 'oregon', 'idaho', 'utah', 'arizona'],
    seoKeywords: [
      'sports betting nevada',
      'las vegas sports betting picks',
      'nevada betting analysis',
    ],
    heroTagline: 'Professional Sports Betting Analysis for Nevada',
    localInsights: 'Nevada is the sports betting capital with the Raiders, Golden Knights, and decades of betting culture.',
  },
  'new-hampshire': {
    name: 'New Hampshire',
    slug: 'new-hampshire',
    abbreviation: 'NH',
    legalStatus: 'legal',
    legalSince: '2019',
    legalDetails: 'New Hampshire legalized sports betting in 2019.',
    population: 1377529,
    majorCities: ['Manchester', 'Nashua', 'Concord', 'Derry', 'Rochester'],
    proTeams: {},
    popularSports: ['Hockey', 'Football', 'Basketball'],
    memberCount: 52,
    nearbyStates: ['maine', 'massachusetts', 'vermont'],
    seoKeywords: [
      'sports betting new hampshire',
      'nh sports betting picks',
    ],
    heroTagline: 'Expert Sports Betting Analysis for New Hampshire',
    localInsights: 'New Hampshire fans follow Boston teams and enjoy hockey and outdoor sports.',
  },
  'new-mexico': {
    name: 'New Mexico',
    slug: 'new-mexico',
    abbreviation: 'NM',
    legalStatus: 'legal',
    legalSince: '2018',
    legalDetails: 'New Mexico legalized retail sports betting in 2018.',
    population: 2117522,
    majorCities: ['Albuquerque', 'Las Cruces', 'Rio Rancho', 'Santa Fe', 'Roswell'],
    proTeams: {
      ncaa: ['New Mexico Lobos', 'New Mexico State Aggies'],
    },
    popularSports: ['Football', 'Basketball', 'Baseball'],
    memberCount: 58,
    nearbyStates: ['colorado', 'oklahoma', 'texas', 'arizona'],
    seoKeywords: [
      'sports betting new mexico',
      'new mexico sports betting picks',
    ],
    heroTagline: 'Professional Sports Betting Analysis for New Mexico',
    localInsights: 'New Mexico fans enjoy college sports and follow regional professional teams.',
  },
  'north-dakota': {
    name: 'North Dakota',
    slug: 'north-dakota',
    abbreviation: 'ND',
    legalStatus: 'illegal',
    legalDetails: 'Sports betting is currently illegal in North Dakota.',
    population: 779094,
    majorCities: ['Fargo', 'Bismarck', 'Grand Forks', 'Minot', 'West Fargo'],
    proTeams: {
      ncaa: ['North Dakota Fighting Hawks'],
    },
    popularSports: ['Hockey', 'Football', 'Basketball'],
    memberCount: 24,
    nearbyStates: ['minnesota', 'south-dakota', 'montana'],
    seoKeywords: [
      'sports betting north dakota',
      'north dakota sports betting picks',
    ],
    heroTagline: 'Expert Sports Betting Analysis for North Dakota',
    localInsights: 'North Dakota fans enjoy hockey and college sports.',
  },
  'oklahoma': {
    name: 'Oklahoma',
    slug: 'oklahoma',
    abbreviation: 'OK',
    legalStatus: 'illegal',
    legalDetails: 'Sports betting is currently illegal in Oklahoma.',
    population: 3959353,
    majorCities: ['Oklahoma City', 'Tulsa', 'Norman', 'Broken Arrow', 'Edmond'],
    proTeams: {
      nba: ['Oklahoma City Thunder'],
      ncaa: ['Oklahoma Sooners', 'Oklahoma State Cowboys'],
    },
    popularSports: ['Football', 'Basketball', 'Baseball'],
    memberCount: 112,
    nearbyStates: ['kansas', 'missouri', 'arkansas', 'texas', 'new-mexico', 'colorado'],
    seoKeywords: [
      'sports betting oklahoma',
      'oklahoma sports betting picks',
    ],
    heroTagline: 'Professional Sports Betting Analysis for Oklahoma',
    localInsights: 'Oklahoma has passionate fans of the Thunder, Sooners, and Cowboys.',
  },
  'oregon': {
    name: 'Oregon',
    slug: 'oregon',
    abbreviation: 'OR',
    legalStatus: 'legal',
    legalSince: '2019',
    legalDetails: 'Oregon legalized sports betting in 2019.',
    population: 4237256,
    majorCities: ['Portland', 'Salem', 'Eugene', 'Gresham', 'Hillsboro'],
    proTeams: {
      nba: ['Portland Trail Blazers'],
      ncaa: ['Oregon Ducks', 'Oregon State Beavers'],
    },
    popularSports: ['Basketball', 'Football', 'Soccer'],
    memberCount: 134,
    nearbyStates: ['washington', 'idaho', 'nevada', 'california'],
    seoKeywords: [
      'sports betting oregon',
      'oregon sports betting picks',
      'portland betting analysis',
    ],
    heroTagline: 'Expert Sports Betting Analysis for Oregon',
    localInsights: 'Oregon has passionate fans of the Trail Blazers, Ducks, and Beavers.',
  },
  'rhode-island': {
    name: 'Rhode Island',
    slug: 'rhode-island',
    abbreviation: 'RI',
    legalStatus: 'legal',
    legalSince: '2018',
    legalDetails: 'Rhode Island legalized sports betting in 2018.',
    population: 1097379,
    majorCities: ['Providence', 'Warwick', 'Cranston', 'Pawtucket', 'East Providence'],
    proTeams: {},
    popularSports: ['Hockey', 'Football', 'Basketball'],
    memberCount: 41,
    nearbyStates: ['massachusetts', 'connecticut'],
    seoKeywords: [
      'sports betting rhode island',
      'ri sports betting picks',
    ],
    heroTagline: 'Expert Sports Betting Analysis for Rhode Island',
    localInsights: 'Rhode Island fans follow Boston teams and enjoy all major sports.',
  },
  'south-carolina': {
    name: 'South Carolina',
    slug: 'south-carolina',
    abbreviation: 'SC',
    legalStatus: 'illegal',
    legalDetails: 'Sports betting is currently illegal in South Carolina.',
    population: 5118425,
    majorCities: ['Charleston', 'Columbia', 'North Charleston', 'Mount Pleasant', 'Rock Hill'],
    proTeams: {
      ncaa: ['South Carolina Gamecocks', 'Clemson Tigers'],
    },
    popularSports: ['Football', 'Basketball', 'Baseball'],
    memberCount: 143,
    nearbyStates: ['north-carolina', 'georgia'],
    seoKeywords: [
      'sports betting south carolina',
      'south carolina sports betting picks',
    ],
    heroTagline: 'Professional Sports Betting Analysis for South Carolina',
    localInsights: 'South Carolina has passionate college football fans supporting the Gamecocks and Tigers.',
  },
  'south-dakota': {
    name: 'South Dakota',
    slug: 'south-dakota',
    abbreviation: 'SD',
    legalStatus: 'legal',
    legalSince: '2020',
    legalDetails: 'South Dakota legalized retail sports betting in 2020.',
    population: 886667,
    majorCities: ['Sioux Falls', 'Rapid City', 'Aberdeen', 'Brookings', 'Watertown'],
    proTeams: {
      ncaa: ['South Dakota Coyotes', 'South Dakota State Jackrabbits'],
    },
    popularSports: ['Football', 'Basketball', 'Baseball'],
    memberCount: 29,
    nearbyStates: ['north-dakota', 'minnesota', 'iowa', 'nebraska', 'wyoming', 'montana'],
    seoKeywords: [
      'sports betting south dakota',
      'south dakota sports betting picks',
    ],
    heroTagline: 'Expert Sports Betting Analysis for South Dakota',
    localInsights: 'South Dakota fans enjoy college sports and outdoor activities.',
  },
  'utah': {
    name: 'Utah',
    slug: 'utah',
    abbreviation: 'UT',
    legalStatus: 'illegal',
    legalDetails: 'Sports betting is currently illegal in Utah.',
    population: 3271616,
    majorCities: ['Salt Lake City', 'West Valley City', 'Provo', 'West Jordan', 'Orem'],
    proTeams: {
      nba: ['Utah Jazz'],
      ncaa: ['Utah Utes', 'BYU Cougars'],
    },
    popularSports: ['Basketball', 'Football', 'Skiing'],
    memberCount: 87,
    nearbyStates: ['idaho', 'wyoming', 'colorado', 'new-mexico', 'arizona', 'nevada'],
    seoKeywords: [
      'sports betting utah',
      'utah sports betting picks',
    ],
    heroTagline: 'Professional Sports Betting Analysis for Utah',
    localInsights: 'Utah has passionate fans of the Jazz, Utes, and Cougars.',
  },
  'vermont': {
    name: 'Vermont',
    slug: 'vermont',
    abbreviation: 'VT',
    legalStatus: 'legal',
    legalSince: '2024',
    legalDetails: 'Vermont legalized sports betting in 2024.',
    population: 643077,
    majorCities: ['Burlington', 'South Burlington', 'Rutland', 'Barre', 'Montpelier'],
    proTeams: {},
    popularSports: ['Hockey', 'Basketball', 'Skiing'],
    memberCount: 21,
    nearbyStates: ['new-york', 'new-hampshire', 'massachusetts'],
    seoKeywords: [
      'sports betting vermont',
      'vermont sports betting picks',
    ],
    heroTagline: 'Expert Sports Betting Analysis for Vermont',
    localInsights: 'Vermont fans follow Boston teams and enjoy winter sports.',
  },
  'west-virginia': {
    name: 'West Virginia',
    slug: 'west-virginia',
    abbreviation: 'WV',
    legalStatus: 'legal',
    legalSince: '2018',
    legalDetails: 'West Virginia legalized sports betting in 2018.',
    population: 1793716,
    majorCities: ['Charleston', 'Huntington', 'Morgantown', 'Parkersburg', 'Wheeling'],
    proTeams: {
      ncaa: ['West Virginia Mountaineers'],
    },
    popularSports: ['Football', 'Basketball', 'Baseball'],
    memberCount: 56,
    nearbyStates: ['pennsylvania', 'ohio', 'kentucky', 'virginia', 'maryland'],
    seoKeywords: [
      'sports betting west virginia',
      'west virginia sports betting picks',
    ],
    heroTagline: 'Expert Sports Betting Analysis for West Virginia',
    localInsights: 'West Virginia has passionate fans of the Mountaineers and regional professional teams.',
  },
  'wisconsin': {
    name: 'Wisconsin',
    slug: 'wisconsin',
    abbreviation: 'WI',
    legalStatus: 'illegal',
    legalDetails: 'Sports betting is currently illegal in Wisconsin.',
    population: 5893718,
    majorCities: ['Milwaukee', 'Madison', 'Green Bay', 'Kenosha', 'Racine'],
    proTeams: {
      nfl: ['Green Bay Packers'],
      nba: ['Milwaukee Bucks'],
      mlb: ['Milwaukee Brewers'],
      ncaa: ['Wisconsin Badgers'],
    },
    popularSports: ['Football', 'Basketball', 'Baseball', 'Hockey'],
    memberCount: 189,
    nearbyStates: ['michigan', 'illinois', 'iowa', 'minnesota'],
    seoKeywords: [
      'sports betting wisconsin',
      'wisconsin sports betting picks',
      'milwaukee betting analysis',
    ],
    heroTagline: 'Professional Sports Betting Analysis for Wisconsin',
    localInsights: 'Wisconsin has some of the most passionate fans with the Packers, Bucks, and Badgers.',
  },
  'wyoming': {
    name: 'Wyoming',
    slug: 'wyoming',
    abbreviation: 'WY',
    legalStatus: 'legal',
    legalSince: '2021',
    legalDetails: 'Wyoming legalized sports betting in 2021.',
    population: 576851,
    majorCities: ['Cheyenne', 'Casper', 'Laramie', 'Gillette', 'Rock Springs'],
    proTeams: {
      ncaa: ['Wyoming Cowboys'],
    },
    popularSports: ['Football', 'Basketball', 'Rodeo'],
    memberCount: 18,
    nearbyStates: ['montana', 'south-dakota', 'nebraska', 'colorado', 'utah', 'idaho'],
    seoKeywords: [
      'sports betting wyoming',
      'wyoming sports betting picks',
    ],
    heroTagline: 'Expert Sports Betting Analysis for Wyoming',
    localInsights: 'Wyoming fans enjoy college sports and outdoor activities.',
  },
};

// Organize states by priority tiers
export const statesByTier: StatesByTier = {
  // Tier 1: Legal sports betting states (prioritized by market size and maturity)
  tier1: [
    statesData['new-york'],
    statesData['new-jersey'],
    statesData['pennsylvania'],
    statesData['illinois'],
    statesData['michigan'],
    statesData['virginia'],
    statesData['colorado'],
    statesData['indiana'],
    statesData['tennessee'],
    statesData['arizona'],
    statesData['ohio'],
    statesData['massachusetts'],
    statesData['maryland'],
    statesData['louisiana'],
    statesData['washington'],
    statesData['kansas'],
    statesData['kentucky'],
    statesData['north-carolina'],
    statesData['nevada'],
  ],
  
  // Tier 2: Large population states without legal betting (high potential)
  tier2: [
    statesData['california'],
    statesData['texas'],
    statesData['florida'],
    statesData['georgia'],
    statesData['minnesota'],
    statesData['wisconsin'],
    statesData['missouri'],
    statesData['oklahoma'],
  ],
  
  // Tier 3: Remaining states
  tier3: [
    statesData['connecticut'],
    statesData['oregon'],
    statesData['iowa'],
    statesData['arkansas'],
    statesData['mississippi'],
    statesData['west-virginia'],
    statesData['delaware'],
    statesData['rhode-island'],
    statesData['new-hampshire'],
    statesData['maine'],
    statesData['new-mexico'],
    statesData['montana'],
    statesData['south-dakota'],
    statesData['wyoming'],
    statesData['vermont'],
    statesData['alabama'],
    statesData['south-carolina'],
    statesData['nebraska'],
    statesData['idaho'],
    statesData['utah'],
    statesData['north-dakota'],
    statesData['alaska'],
    statesData['hawaii'],
  ],
};

// All states in a flat array
export const allStates: StateData[] = Object.values(statesData);

// Helper Functions

/**
 * Get state data by slug
 * @param slug - State slug (e.g., 'california', 'new-york')
 * @returns StateData object or null if not found
 */
export function getStateData(slug: string): StateData | null {
  return statesData[slug] || null;
}

/**
 * Search states by name, abbreviation, or city
 * @param query - Search query string
 * @returns Array of matching StateData objects
 */
export function searchStates(query: string): StateData[] {
  if (!query || query.trim() === '') {
    return allStates;
  }
  
  const lowerQuery = query.toLowerCase().trim();
  
  return allStates.filter(state => 
    state.name.toLowerCase().includes(lowerQuery) ||
    state.abbreviation.toLowerCase().includes(lowerQuery) ||
    state.slug.toLowerCase().includes(lowerQuery) ||
    state.majorCities.some(city => city.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get states by legal status
 * @param status - Legal status ('legal', 'pending', or 'illegal')
 * @returns Array of StateData objects with matching status
 */
export function getStatesByLegalStatus(status: StateData['legalStatus']): StateData[] {
  return allStates.filter(state => state.legalStatus === status);
}

/**
 * Get states by region (nearby states)
 * @param stateSlug - State slug to find nearby states for
 * @returns Array of StateData objects for nearby states
 */
export function getNearbyStates(stateSlug: string): StateData[] {
  const state = getStateData(stateSlug);
  if (!state) {
    return [];
  }
  
  return state.nearbyStates
    .map(slug => getStateData(slug))
    .filter((s): s is StateData => s !== null);
}

/**
 * Get total count of states
 * @returns Total number of states
 */
export function getTotalStatesCount(): number {
  return allStates.length;
}

/**
 * Get count of states by legal status
 * @returns Object with counts for each legal status
 */
export function getStatesCountByStatus(): Record<StateData['legalStatus'], number> {
  return {
    legal: getStatesByLegalStatus('legal').length,
    pending: getStatesByLegalStatus('pending').length,
    illegal: getStatesByLegalStatus('illegal').length,
  };
}
