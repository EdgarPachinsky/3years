import { KnowledgeQuestion, QuizCategory } from '../models/quiz.models';

/* ==========================================================================
   CHAPTER 04 — HOW WELL DO YOU KNOW US?
   ==========================================================================

   ⚠️  EVERY ANSWER IN THIS FILE IS A PLACEHOLDER.

   The question text is real. The option labels are generic filler, and
   `correctOptionId` just points at the first option, because nobody but you
   knows the truth. Nothing here is a claim about either of you.

   To fill one in:
     1. rewrite the `label`s so they are the real choices,
     2. point `correctOptionId` at the right one,
     3. set `verified: true`,
     4. optionally give it its own `correctReaction` / `wrongReaction`.

   The engine always prefers verified questions and only falls back to
   unverified ones when there are not enough real ones for a full run, so the
   chapter stays playable while you work through them.
   ========================================================================== */

export const CATEGORY_LABELS: Readonly<Record<QuizCategory, string>> = {
  'know-me': 'KNOW ME',
  'know-her': 'KNOW HER',
  'know-us': 'KNOW US',
  'who-would': 'WHO WOULD',
  favorites: 'FAVORITES',
  'predict-me': 'PREDICT ME',
};

/** ME / HER, for the "who would" questions. */
const WHO = [
  { id: 'me', label: 'ME', target: 'me' as const },
  { id: 'her', label: 'HER', target: 'her' as const },
];

/** ME / HER / BOTH, for the "know us" questions. */
const WHO_OR_BOTH = [
  { id: 'me', label: 'ME', target: 'me' as const },
  { id: 'her', label: 'HER', target: 'her' as const },
  { id: 'both', label: 'BOTH OF US', target: 'both' as const },
];

/** A concrete answer rather than a person. */
const c = (id: string, label: string) => ({ id, label, target: 'custom' as const });

export const CHAPTER_FOUR_QUESTIONS: readonly KnowledgeQuestion[] = [
  /* ------------------------------------------------------------ KNOW ME -- */
  {
    id: 'km-talk-for-hours',
    category: 'know-me',
    text: 'What could Ed talk about for hours?',
    options: [
      c('football', 'Football'),
      c('tech', 'Tech and code'),
      c('films', 'Films and series'),
      c('plans', 'Plans for the future'),
    ],
    correctOptionId: 'football',
  },
  {
    id: 'km-football-or-movie',
    category: 'know-me',
    text: 'Football match or movie night — what does Ed pick?',
    options: [
      c('football', 'The football match'),
      c('movie', 'Movie night'),
      c('depends', 'Depends entirely on the day'),
    ],
    correctOptionId: 'football',
  },
  {
    id: 'km-annoys-quickly',
    category: 'know-me',
    text: 'What annoys Ed surprisingly quickly?',
    options: [
      c('slow-internet', 'Slow internet'),
      c('interrupted', 'Being interrupted'),
      c('waiting', 'Waiting in a queue'),
      c('plans-change', 'Plans changing last minute'),
    ],
    correctOptionId: 'slow-internet',
  },
  {
    id: 'km-spend-money',
    category: 'know-me',
    text: 'What is Ed most likely to spend money on?',
    options: [
      c('tech', 'Tech'),
      c('football', 'Football stuff'),
      c('food', 'Food'),
      c('trip', 'A trip'),
    ],
    correctOptionId: 'football',
  },
  {
    id: 'km-all-day-hobby',
    category: 'know-me',
    text: 'What could Ed happily do for an entire day?',
    options: [
      c('gaming', 'Gaming'),
      c('building', 'Building something'),
      c('football', 'Football'),
      c('series', 'Watching series'),
    ],
    correctOptionId: 'gaming',
  },
  {
    id: 'km-free-weekend',
    category: 'know-me',
    text: 'A completely free weekend. What does Ed choose?',
    options: [
      c('somewhere', 'Go somewhere'),
      c('home', 'Stay home'),
      c('friends', 'See friends'),
      c('project', 'Work on a project'),
    ],
    correctOptionId: 'home',
  },
  {
    id: 'km-gift',
    category: 'know-me',
    text: 'What gift would make Ed genuinely excited?',
    options: [
      c('tech', 'Something tech'),
      c('football', 'Something football'),
      c('handmade', 'Something you made'),
      c('trip', 'A surprise trip'),
    ],
    correctOptionId: 'football',
  },
  {
    id: 'km-when-tired',
    category: 'know-me',
    text: 'What does Ed say when he is tired?',
    options: [
      c('five-min', 'Just 5 more minutes'),
      c('not-tired', 'I am not tired'),
      c('order-food', 'Let us order something'),
      c('sleep', 'I am going to sleep'),
    ],
    correctOptionId: 'sleep',
  },
  {
    id: 'km-day-off',
    category: 'know-me',
    text: 'An unexpected day off. What does Ed do first?',
    options: [
      c('sleep-in', 'Sleep in'),
      c('project', 'Start a project'),
      c('plan-with-her', 'Plan something with her'),
      c('play', 'Play something'),
    ],
    correctOptionId: 'plan-with-her',
  },

  /* ----------------------------------------------------------- KNOW HER -- */
  {
    id: 'kh-free-evening',
    category: 'know-her',
    text: 'Her ideal way to spend a free evening?',
    options: [
      c('quiet-in', 'A quiet night in'),
      c('out', 'Going out somewhere'),
      c('together', 'Watching something together'),
      c('films', 'Watching films'),
    ],
    correctOptionId: 'films',
  },
  {
    id: 'kh-gift',
    category: 'know-her',
    text: 'What kind of gift makes her happiest?',
    options: [
      c('thoughtful', 'Something small and thoughtful'),
      c('big', 'Something big and obvious'),
      c('experience', 'An experience, not a thing'),
      c('surprise', 'Anything, as long as it is a surprise'),
    ],
    correctOptionId: 'surprise',
  },
  {
    id: 'kh-dinner',
    category: 'know-her',
    text: 'What is she most likely to choose for dinner?',
    options: [
      c('usual', 'The usual favourite'),
      c('new', 'Something she has never tried'),
      c('home', 'Something at home'),
      c('whatever', 'You choose'),
    ],
    correctOptionId: 'usual',
  },
  {
    id: 'kh-never-bored',
    category: 'know-her',
    text: 'What could she never get bored of?',
    options: [
      c('music', 'Music'),
      c('talking', 'Talking for hours'),
      c('series', 'Her favourite series'),
      c('travel', 'Going somewhere new'),
    ],
    correctOptionId: 'travel',
  },
  {
    id: 'kh-trip',
    category: 'know-her',
    text: 'What kind of trip would she choose?',
    options: [
      c('sea', 'Somewhere by the sea'),
      c('city', 'A busy city'),
      c('mountains', 'Mountains and quiet'),
      c('anywhere', 'Anywhere, as long as it is together'),
    ],
    correctOptionId: 'anywhere',
  },
  {
    id: 'kh-mood',
    category: 'know-her',
    text: 'What instantly improves her mood?',
    options: [
      c('food', 'Food'),
      c('music', 'Music'),
      c('attention', 'Being paid attention to'),
      c('nap', 'A nap'),
    ],
    correctOptionId: 'food',
  },
  {
    id: 'kh-when-tired',
    category: 'know-her',
    text: 'What does she usually do when she is tired?',
    options: [
      c('quiet', 'Goes quiet'),
      c('talks', 'Talks even more'),
      c('scrolls', 'Scrolls her phone'),
      c('sleeps', 'Falls asleep immediately'),
    ],
    correctOptionId: 'sleeps',
  },
  {
    id: 'kh-movie-type',
    category: 'know-her',
    text: 'Her favourite type of film?',
    options: [
      c('comedy', 'Comedy'),
      c('romance', 'Romance'),
      c('thriller', 'Thriller'),
      c('animation', 'Animation'),
    ],
    correctOptionId: 'comedy',
  },
  {
    id: 'kh-spontaneous-buy',
    category: 'know-her',
    text: 'What is she most likely to buy on impulse?',
    options: [
      c('clothes', 'Clothes'),
      c('home', 'Something for the home'),
      c('snacks', 'Snacks'),
      c('gift', 'A gift for someone else'),
    ],
    correctOptionId: 'clothes',
  },
  {
    id: 'kh-lazy-sunday',
    category: 'know-her',
    text: 'Her perfect lazy Sunday?',
    options: [
      c('bed', 'Not leaving the bed'),
      c('walk', 'A long slow walk'),
      c('cooking', 'Cooking something nice'),
      c('nothing', 'Absolutely nothing, together'),
    ],
    correctOptionId: 'bed',
  },

  /* ------------------------------------------------------------ KNOW US -- */
  {
    id: 'ku-after-argument',
    category: 'know-us',
    text: 'Who speaks first after an argument?',
    options: WHO_OR_BOTH,
    correctOptionId: 'me',
  },
  {
    id: 'ku-spontaneous-plan',
    category: 'know-us',
    text: 'Who is more likely to suggest a spontaneous plan?',
    options: WHO_OR_BOTH,
    correctOptionId: 'her',
  },
  {
    id: 'ku-stay-home',
    category: 'know-us',
    text: 'Who is more likely to say "let us just stay home"?',
    options: WHO_OR_BOTH,
    correctOptionId: 'me',
  },
  {
    id: 'ku-tiny-details',
    category: 'know-us',
    text: 'Who remembers tiny details better?',
    options: WHO_OR_BOTH,
    correctOptionId: 'her',
  },
  {
    id: 'ku-photos',
    category: 'know-us',
    text: 'Who takes more photos?',
    options: WHO_OR_BOTH,
    correctOptionId: 'her',
  },
  {
    id: 'ku-adventure',
    category: 'know-us',
    text: 'Who turns a normal evening into an adventure?',
    options: WHO_OR_BOTH,
    correctOptionId: 'her',
  },
  {
    id: 'ku-actually-does-it',
    category: 'know-us',
    text: 'Who says "we should definitely do that" and actually does it?',
    options: WHO_OR_BOTH,
    correctOptionId: 'her',
  },
  {
    id: 'ku-makes-laugh',
    category: 'know-us',
    text: 'Who makes the other laugh when they are annoyed?',
    options: WHO_OR_BOTH,
    correctOptionId: 'me',
  },
  {
    id: 'ku-order-food',
    category: 'know-us',
    text: 'Who suggests ordering food instead of cooking?',
    options: WHO_OR_BOTH,
    correctOptionId: 'me',
  },
  {
    id: 'ku-change-plans',
    category: 'know-us',
    text: 'Who changes plans at the last minute?',
    options: WHO_OR_BOTH,
    correctOptionId: 'her',
  },
  {
    id: 'ku-one-more-episode',
    category: 'know-us',
    text: 'Who says "one more episode"?',
    options: WHO_OR_BOTH,
    correctOptionId: 'both',
  },
  {
    id: 'ku-asleep-first',
    category: 'know-us',
    text: 'Who falls asleep first during a film?',
    options: WHO_OR_BOTH,
    correctOptionId: 'me',
  },

  /* ---------------------------------------------------------- WHO WOULD -- */
  {
    id: 'ww-zombie',
    category: 'who-would',
    text: 'Who would survive a zombie apocalypse longer?',
    options: WHO,
    correctOptionId: 'me',
  },
  {
    id: 'ww-unnecessary',
    category: 'who-would',
    text: 'Who would spend money on something completely unnecessary?',
    options: WHO,
    correctOptionId: 'her',
  },
  {
    id: 'ww-lost',
    category: 'who-would',
    text: 'Who would get lost even with Google Maps?',
    options: WHO,
    correctOptionId: 'her',
  },
  {
    id: 'ww-five-minutes',
    category: 'who-would',
    text: 'Who would say "5 more minutes" and mean 30?',
    options: WHO,
    correctOptionId: 'her',
  },
  {
    id: 'ww-asleep-movie',
    category: 'who-would',
    text: 'Who would fall asleep during the film?',
    options: WHO,
    correctOptionId: 'me',
  },
  {
    id: 'ww-11pm',
    category: 'who-would',
    text: 'Who would suddenly suggest going somewhere at 11 PM?',
    options: WHO,
    correctOptionId: 'her',
  },
  {
    id: 'ww-laughing',
    category: 'who-would',
    text: 'Who would start laughing at the worst possible moment?',
    options: WHO,
    correctOptionId: 'her',
  },
  {
    id: 'ww-shopping',
    category: 'who-would',
    text: 'Who would turn a quick shop into a 3-hour mission?',
    options: WHO,
    correctOptionId: 'her',
  },
  {
    id: 'ww-no-phone',
    category: 'who-would',
    text: 'Who would survive longer without their phone?',
    options: WHO,
    correctOptionId: 'her',
  },
  {
    id: 'ww-we-dont-need-this',
    category: 'who-would',
    text: 'Who would say "we do not need this" and buy it anyway?',
    options: WHO,
    correctOptionId: 'me',
  },

  /* ---------------------------------------------------------- FAVORITES -- */
  {
    id: 'fv-marvel-hero',
    category: 'favorites',
    text: 'Ed’s favourite Marvel hero?',
    options: [
      c('iron-man', 'Iron Man'),
      c('spider-man', 'Spider-Man'),
      c('thor', 'Thor'),
      c('strange', 'Doctor Strange'),
    ],
    correctOptionId: 'spider-man',
  },
  {
    id: 'fv-marvel-movie',
    category: 'favorites',
    text: 'Ed’s favourite Marvel film?',
    options: [c('a', 'Spider Man'), c('b', 'Doctor Strange '), c('c', 'Hulk'), c('d', 'Avengers')],
    correctOptionId: 'd',
  },
  {
    id: 'fv-footballer',
    category: 'favorites',
    text: 'Ed’s favourite football player?',
    options: [
      c('a', 'Leonel Messi'),
      c('b', 'Cristiano Ronaldo'),
      c('c', 'Karim Benzema'),
      c('d', 'Didier Drogba'),
    ],
    correctOptionId: 'b',
  },
  {
    id: 'fv-game',
    category: 'favorites',
    text: 'Ed’s favourite game?',
    options: [
      c('a', 'Split Fiction'),
      c('b', 'RETURNAL'),
      c('c', "Marvel's Spider Man"),
      c('d', 'FIFA'),
    ],
    correctOptionId: 'b',
  },
  {
    id: 'fv-song',
    category: 'favorites',
    text: 'Our song?',
    options: [
      c('a', 'Gidayyat & Hovannii - Сомбреро'),
      c('b', "Ramil' - Сияй"),
      c('c', 'Lady Gaga, Bruno Mars - Die With A Smile'),
    ],
    correctOptionId: 'a',
  },
  {
    id: 'fv-food',
    category: 'favorites',
    text: 'Ed’s favourite food?',
    options: [c('a', 'Something homemade'), c('b', 'Barbecue'), c('c', 'Pizza'), c('d', 'Vopper')],
    correctOptionId: 'd',
  },
  {
    id: 'fv-place',
    category: 'favorites',
    text: 'Our favourite place?',
    options: [c('a', 'Sinnabon'), c('b', 'Black Angus'), c('c', 'M Caffe')],
    correctOptionId: 'a',
  },
  {
    id: 'fv-vacation',
    category: 'favorites',
    text: 'Our favourite kind of holiday?',
    options: [
      c('sea', 'Sea and sun'),
      c('city', 'A city to walk around'),
      c('mountains', 'Mountains and quiet'),
      c('road', 'A road trip'),
    ],
    correctOptionId: 'sea',
  },
  {
    id: 'fv-relax',
    category: 'favorites',
    text: 'Ed’s favourite way to switch off?',
    options: [
      c('game', 'A game'),
      c('film', 'A film'),
      c('football', 'Football'),
      c('nothing', 'Doing nothing at all'),
    ],
    correctOptionId: 'football',
  },
  {
    id: 'fv-movie-type',
    category: 'favorites',
    text: 'Ed’s favourite type of film?',
    options: [
      c('action', 'Action'),
      c('comedy', 'Comedy'),
      c('scifi', 'Sci-fi'),
      c('horror', 'Horror'),
    ],
    correctOptionId: 'horror',
  },
  {
    id: 'fv-together',
    category: 'favorites',
    text: 'Our favourite thing to do together?',
    options: [
      c('a', 'Sex'),
      c('b', 'Watching Films'),
      c('c', 'Eating tasty food'),
      c('d', 'Everything'),
    ],
    correctOptionId: 'd',
  },

  /* --------------------------------------------------------- PREDICT ME -- */
  {
    id: 'pm-free-week',
    category: 'predict-me',
    text: 'Ed gets one completely free week. What does he do?',
    options: [
      c('travel', 'Travel somewhere'),
      c('football', 'Play football every day'),
      c('build', 'Stay home and build something'),
      c('games', 'Play games all week'),
    ],
    correctOptionId: 'travel',
  },
  {
    id: 'pm-500',
    category: 'predict-me',
    text: 'Ed gets $500 he must spend on something fun. What does he pick?',
    options: [
      c('football', 'Football stuff'),
      c('tech', 'Tech'),
      c('trip', 'A trip'),
      c('random', 'Something completely random'),
    ],
    correctOptionId: 'tech',
  },
  {
    id: 'pm-skill',
    category: 'predict-me',
    text: 'Ed can instantly master one skill. Which one?',
    options: [
      c('football', 'Football'),
      c('programming', 'Programming'),
      c('music', 'Music'),
      c('other', 'Something else entirely'),
    ],
    correctOptionId: 'other',
  },
  {
    id: 'pm-teleport',
    category: 'predict-me',
    text: 'Ed can teleport anywhere for one weekend. Where does he go?',
    options: [
      c('warm', 'Somewhere warm'),
      c('stadium', 'A stadium'),
      c('new', 'Somewhere he has never been'),
      c('her', 'Wherever she is'),
    ],
    correctOptionId: 'her',
  },
];

/* ==========================================================================
   Everything the chapter says. No copy lives in the components.
   ========================================================================== */
export const CHAPTER_FOUR = {
  code: 'CHAPTER 04',
  title: 'HOW WELL DO YOU KNOW US?',
  subtitle:
    'Okay... enough history.\nLet’s see if you actually know the two idiots in this relationship. 😂',

  /** The little boot-up panel on the intro screen. */
  database: {
    heading: 'KNOWLEDGE DATABASE',
    rows: [
      { label: 'ED', percent: 83 },
      { label: 'HER', percent: 75 },
      { label: 'US', percent: 100 },
    ],
    syncing: 'SYNCING...',
    ready: 'READY?',
  },

  settings: {
    questionsPerRun: 10,
    avoidRecentQuestions: true,
    guaranteeCategoryDiversity: true,
    /** How many question ids to remember before the oldest start dropping off. */
    memory: 40,
    storageKey: 'chapter4-seen-questions',
    lastRunKey: 'chapter4-last-run',
  },

  labels: {
    progress: 'MEMORY SYNC',
    database: 'MEMORY DATABASE',
    corrupted: 'CORRUPTED DATA DETECTED',
    correct: 'CORRECT',
    wrong: 'INCORRECT',
    restored: 'MEMORY DATABASE RESTORED',
    online: 'ALL SYSTEMS ONLINE ❤️',
  },

  /** Used when a question has no reaction of its own. Picked at random. */
  reactions: {
    correct: [
      'Okay...\nyou actually pay attention. 👀❤️',
      'HOW DID YOU KNOW THAT?! 👀❤️',
      'Correct. Obviously. 😏',
      'Scary. In a good way. ✨',
    ],
    wrong: [
      'We need to talk.😂',
      'Hmmmm... we need to have a meeting. 😂',
      'Not even close. I love you anyway. ❤️',
      'Wrong, but confidently wrong. Respect. 😅',
    ],
  },

  buttons: {
    start: 'LET’S FIND OUT →',
    next: 'NEXT →',
    retry: 'TRY ANOTHER SET →',
    continue: 'CONTINUE →',
  },

  /** Score bands, checked from the top down against correct / total. */
  results: [
    {
      min: 1,
      heading: 'MEMORY SYNC: 100%',
      status: 'SYSTEM STATUS',
      line: 'SHE KNOWS TOO MUCH. 💀❤️',
    },
    {
      min: 0.8,
      heading: 'CONNECTION',
      status: 'EXTREMELY STRONG ❤️',
      line: 'Okay...\nyou actually pay attention. 👀',
    },
    {
      min: 0.5,
      heading: 'CONNECTION',
      status: 'STABLE',
      line: 'Not bad.\n\nWe have some studying to do. 😂',
    },
    {
      min: 0,
      heading: 'CONNECTION ERROR',
      status: 'SIGNAL WEAK',
      line: 'Bro...\n\nWe have been married for THREE YEARS. 💀',
    },
  ],
} as const;
