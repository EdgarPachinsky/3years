import {
  CharacterClass,
  GameGenre,
  InventoryItem,
  NextLevelChoice,
  Quest,
  RelationshipStat,
} from '../models/coop.models';

/* ==========================================================================
   CHAPTER 05 — TWO OF US
   ==========================================================================
   Nothing here is scored. Every screen is a choice, and every choice is right.

   The wording below comes from the chapter brief. Anything that reads as a
   claim about the two of you — the completed quests especially — is meant to
   be edited. Nothing was invented beyond what the brief already said.
   ========================================================================== */

/** The sliders. `fixed` means it is shown but not adjustable. */
export const CHAPTER_FIVE_STATS: readonly RelationshipStat[] = [
  {
    id: 'love',
    title: 'HOW MUCH LOVE IS IN HERE?',
    icon: '❤️',
    minLabel: 'SOME',
    maxLabel: 'ALL OF IT',
    barLabel: 'LOVE',
    fixed: 100,
  },
  {
    id: 'chaos',
    title: 'HOW CHAOTIC ARE WE?',
    icon: '😂',
    minLabel: 'CALM',
    maxLabel: 'CHAOS',
    barLabel: 'CHAOS',
    start: 60,
  },
  {
    id: 'competition',
    title: 'HOW COMPETITIVE ARE WE?',
    icon: '😈',
    minLabel: '😇',
    maxLabel: '😈',
    barLabel: 'COMPETITION',
    start: 50,
  },
  {
    id: 'wanderlust',
    title: 'HOW OFTEN DO WE SAY "LET’S GO SOMEWHERE"?',
    icon: '🚗',
    minLabel: 'NEVER',
    maxLabel: 'ALWAYS',
    barLabel: 'LET’S GO',
    start: 55,
  },
  {
    id: 'food',
    title: 'HOW MUCH FOOD IS INVOLVED?',
    icon: '🍕',
    minLabel: '🥗',
    maxLabel: '🍕',
    barLabel: 'FOOD',
    start: 70,
  },
  {
    id: 'adventure',
    title: 'HOW ADVENTUROUS ARE WE?',
    icon: '🌍',
    minLabel: '🏠',
    maxLabel: '🌍',
    barLabel: 'ADVENTURE',
    start: 50,
  },
  {
    id: 'laziness',
    title: 'HOW LAZY ARE WE TOGETHER?',
    icon: '💤',
    minLabel: '⚡',
    maxLabel: '💤',
    barLabel: 'LAZINESS',
    start: 55,
  },
  {
    id: 'romance',
    title: 'HOW ROMANTIC ARE WE?',
    icon: '🌹',
    minLabel: '😐',
    maxLabel: '❤️',
    barLabel: 'ROMANCE',
    start: 65,
  },
];

export const CHAPTER_FIVE_ITEMS: readonly InventoryItem[] = [
  { id: 'love', title: 'LOVE', icon: '❤️' },
  { id: 'football', title: 'FOOTBALL', icon: '⚽' },
  { id: 'photos', title: 'PHOTOS', icon: '📸' },
  { id: 'food', title: 'FOOD', icon: '🍕' },
  { id: 'games', title: 'GAMES', icon: '🎮' },
  { id: 'travel', title: 'TRAVEL', icon: '✈️' },
  { id: 'jokes', title: 'INSIDE JOKES', icon: '😂' },
  { id: 'talks', title: 'LATE-NIGHT TALKS', icon: '☕' },
  { id: 'surprises', title: 'SURPRISES', icon: '🎁' },
  { id: 'tech', title: 'TECHNOLOGY', icon: '💻' },
  { id: 'dates', title: 'DATES', icon: '🌹' },
  { id: 'sleep', title: 'SLEEP', icon: '💤' },
];

export const CHAPTER_FIVE_GENRES: readonly GameGenre[] = [
  {
    id: 'co-op',
    title: 'CO-OP ADVENTURE',
    icon: '❤️',
    description: 'Two players. One life.',
    resultTitle: 'CO-OP ADVENTURE',
    resultLines: [
      { label: '', value: 'TWO PLAYERS\nONE LIFE\nINFINITE SIDE QUESTS' },
      { label: 'MAIN OBJECTIVE', value: 'Stay together.' },
      {
        label: 'SECONDARY OBJECTIVES',
        value: 'Eat everything.\nGo everywhere.\nTake too many photos.',
      },
      { label: 'DIFFICULTY', value: '😂 EXTREME' },
    ],
  },
  {
    id: 'comedy',
    title: 'CHAOTIC COMEDY',
    icon: '😂',
    description: 'Nothing goes to plan. Ever.',
    resultTitle: 'CHAOTIC COMEDY',
    resultLines: [
      { label: 'GENRE', value: 'CHAOTIC COMEDY' },
      { label: 'PLOT', value: 'Two people try to have\na normal day.' },
      { label: 'RESULT', value: 'They don’t.' },
      { label: 'RATING', value: '❤️❤️❤️❤️❤️' },
    ],
  },
  {
    id: 'survival',
    title: 'SURVIVAL GAME',
    icon: '⚔️',
    description: 'Somehow still standing.',
    resultTitle: 'SURVIVAL GAME',
    resultLines: [
      { label: 'CONDITIONS', value: 'Harsh.' },
      { label: 'RESOURCES', value: 'Snacks. Mostly snacks.' },
      { label: 'TEAM STATUS', value: 'Two players.\nStill alive.\nStill laughing.' },
      { label: 'SURVIVAL RATE', value: '100% so far ❤️' },
    ],
  },
  {
    id: 'open-world',
    title: 'OPEN WORLD',
    icon: '🌎',
    description: 'The map is not finished.',
    resultTitle: 'OPEN WORLD: UNLOCKED',
    resultLines: [
      { label: 'MAIN QUEST', value: 'Build a life together.' },
      { label: 'SIDE QUESTS', value: 'Unlimited.' },
      { label: 'MAP', value: 'Still loading...' },
      { label: 'UNKNOWN LOCATIONS', value: 'A LOT.' },
      { label: 'FAST TRAVEL', value: 'Probably food. 😂' },
    ],
  },
  {
    id: 'racing',
    title: 'RACING GAME',
    icon: '🏎️',
    description: 'Somebody is always late.',
    resultTitle: 'RACING GAME',
    resultLines: [
      { label: 'TRACK', value: 'Ordinary weekdays.' },
      { label: 'OBJECTIVE', value: 'Leave the house on time.' },
      { label: 'BEST LAP', value: 'Never recorded.' },
      { label: 'RATING', value: '😂 CHAOTIC' },
    ],
  },
  {
    id: 'puzzle',
    title: 'PUZZLE GAME',
    icon: '🧩',
    description: 'Figuring it out as we go.',
    resultTitle: 'PUZZLE GAME',
    resultLines: [
      { label: 'MECHANIC', value: 'Two people solving\nthe same thing\nfrom opposite sides.' },
      { label: 'HINTS', value: 'Rarely used.' },
      { label: 'COMPLETION', value: 'Ongoing.' },
      { label: 'RATING', value: '❤️ WORTH IT' },
    ],
  },
];

/**
 * ⚠️  EDIT THESE. They are the brief's own examples, not facts I decided.
 * Anything marked `completed` is claimed as already done.
 */
export const CHAPTER_FIVE_QUESTS: {
  readonly completed: readonly Quest[];
  readonly available: readonly Quest[];
} = {
  completed: [
    { id: 'meet', title: 'MEET', completed: true },
    { id: 'fall-in-love', title: 'FALL IN LOVE', completed: true },
    { id: 'chaos', title: 'SURVIVE THE CHAOS', completed: true },
    { id: 'married', title: 'GET MARRIED', completed: true },
  ],
  available: [
    { id: 'new-place', title: 'VISIT SOMEWHERE WE’VE NEVER BEEN', icon: '🌍' },
    { id: 'cook', title: 'COOK SOMETHING TOGETHER', icon: '🍳' },
    { id: 'lazy-day', title: 'HAVE A COMPLETELY LAZY MOVIE DAY', icon: '🎬' },
    { id: 'competitive', title: 'DO SOMETHING COMPETITIVE', icon: '⚽' },
    { id: 'photo', title: 'MAKE A RIDICULOUS PHOTO', icon: '📸' },
    { id: 'play', title: 'PLAY A GAME TOGETHER', icon: '🎮' },
    { id: 'night', title: 'GO SOMEWHERE AT NIGHT', icon: '🌙' },
    { id: 'trip', title: 'PLAN A FUTURE TRIP', icon: '✈️' },
  ],
};

export const CHAPTER_FIVE_LEVELS: readonly NextLevelChoice[] = [
  { id: 'adventures', title: 'MORE ADVENTURES', icon: '🌍', resultText: 'MORE ADVENTURES' },
  { id: 'moments', title: 'MORE LITTLE MOMENTS', icon: '🏠', resultText: 'MORE LITTLE MOMENTS' },
  { id: 'places', title: 'NEW PLACES', icon: '✈️', resultText: 'NEW PLACES' },
  { id: 'chaos', title: 'MORE CHAOS', icon: '😂', resultText: 'MORE CHAOS' },
  { id: 'all', title: 'ALL OF THE ABOVE', icon: '❤️', resultText: 'ALL OF THE ABOVE' },
];

/**
 * Classes, checked highest priority first. The last one always matches, so
 * there is never a playthrough without a title.
 */
export const CHAPTER_FIVE_CLASSES: readonly CharacterClass[] = [
  {
    id: 'chaotic-love',
    title: 'LOVING CHAOTIC DUO',
    description: 'Deeply in love. Deeply unserious.',
    skill: 'Turning a five-minute errand into a whole evening.',
    priority: 90,
    when: (s) => s.chaos >= 65 && s.romance >= 60,
  },
  {
    id: 'homebody',
    title: 'PROFESSIONAL HOME-BODY TEAM',
    description: 'The sofa is the main character.',
    skill: 'Cancelling plans with absolutely no regrets. 😂',
    priority: 85,
    when: (s) => s.laziness >= 70 && s.adventure <= 40,
  },
  {
    id: 'adventure',
    title: 'THE ADVENTURE COUPLE',
    description: 'Always halfway out the door.',
    skill: 'Saying "let’s go" before checking the weather.',
    priority: 80,
    when: (s) => s.adventure >= 70 || s.wanderlust >= 75,
  },
  {
    id: 'food',
    title: 'THE FOOD-FUELED DUO',
    description: 'Every plan is secretly a food plan.',
    skill: 'Choosing a destination entirely by what is nearby to eat.',
    priority: 75,
    when: (s) => s.food >= 75,
  },
  {
    id: 'competitive',
    title: 'CHAOS WITH BENEFITS',
    description: 'Nothing is ever just a friendly game.',
    skill: 'Turning literally anything into a competition.',
    priority: 70,
    when: (s) => s.competition >= 70 && s.chaos >= 50,
  },
  {
    id: 'unstoppable',
    title: 'THE UNSTOPPABLE TWO',
    description: 'High on everything. Slowing down for nothing.',
    skill: 'Having far too much energy for two people.',
    priority: 65,
    when: (s) => s.adventure >= 60 && s.chaos >= 60 && s.laziness <= 45,
  },
  {
    id: 'coop',
    title: 'THE CO-OP SPECIALISTS',
    description: 'Balanced, steady, and quietly unbeatable.',
    skill: 'Doing random things together and calling it a plan.',
    priority: 0,
    when: () => true,
  },
];

/* --------------------------------------------------------------- COPY ---- */
export const CHAPTER_FIVE = {
  code: 'CHAPTER 05',
  title: 'TWO OF US',
  intro: {
    lines: ['One person can do a lot.', 'Two people...', 'can cause significantly more chaos. 😂'],
    button: 'BUILD US →',
  },

  build: {
    heading: 'BUILD OUR CHARACTER',
    playerOne: 'PLAYER 1',
    playerTwo: 'PLAYER 2',
    classLabel: 'CLASS',
    className: 'CO-OP DUO',
    detected: 'TWO PLAYERS DETECTED',
    initializing: 'INITIALIZING...',
    ready: 'CO-OP MODE READY ✓',
  },

  stats: {
    heading: 'OUR RELATIONSHIP STATS',
    hint: 'No wrong answers. Just drag.',
    button: 'THAT’S US →',
    complete: 'CHARACTER BUILD COMPLETE ✓',
    resultHeading: 'OUR CHARACTER BUILD',
    classLabel: 'CLASS',
  },

  inventory: {
    heading: 'OUR INVENTORY',
    subtitle: 'Choose 5 things that belong in it.',
    limit: 5,
    acquired: 'ITEMS ACQUIRED ✓',
    counter: 'SELECTED',
  },

  genre: {
    heading: 'IF WE WERE A GAME...',
    question: 'WHAT KIND OF GAME WOULD WE BE?',
  },

  quests: {
    heading: 'OUR QUEST LOG',
    chooseHeading: 'CHOOSE OUR NEXT SIDE QUEST',
    chooseSub: 'What should we unlock?',
    added: 'QUEST ADDED ✓',
    status: 'STATUS',
    locked: 'LOCKED 🔒',
    someday: 'MAYBE SOMEDAY...',
  },

  coop: {
    heading: 'TWO PLAYER MODE',
    statusLabel: 'STATUS',
    connected: 'CONNECTED ✓',
    modeLabel: 'CO-OP MODE',
    online: 'ONLINE ❤️',
    detected: 'TWO PLAYERS DETECTED',
    activated: 'CO-OP MODE ACTIVATED ✓',
  },

  message: {
    lines: [
      'Some levels are played alone.',
      'Some memories are yours alone.',
      'But this one?',
      'This one is co-op.',
    ],
    outro: 'READY FOR THE NEXT LEVEL?',
  },

  level: {
    currentLabel: 'CURRENT LEVEL',
    currentName: 'MARRIAGE',
    currentLevel: 'LV. 3',
    hearts: 5,
    nextLabel: 'NEXT LEVEL',
    unknown: '???',
    question: 'What should we unlock next?',
    accepted: 'NEW QUEST ACCEPTED ✓',
    ready: 'READY FOR THE NEXT LEVEL.',
  },

  card: {
    building: 'CARD INITIALIZING...',
    steps: [
      'PLAYER 1',
      'PLAYER 2',
      'CLASS',
      'STATS',
      'INVENTORY',
      'GAME TYPE',
      'QUEST',
      'NEXT LEVEL',
    ],
    done: 'CHARACTER CARD COMPLETE',
    ready: 'READY.',
    title: 'TWO OF US ❤️',
    levelLabel: 'LEVEL 03',
    skillLabel: 'SPECIAL SKILL',
    classLabel: 'CLASS',
    genreLabel: 'GAME TYPE',
    inventoryLabel: 'INVENTORY',
    questLabel: 'NEXT QUEST',
    nextLabel: 'NEXT LEVEL',
  },

  complete: {
    heading: 'CHAPTER 05 COMPLETE',
    lines: ['TWO PLAYERS', 'ONE TEAM'],
    viewCard: 'VIEW OUR CARD',
    cont: 'CONTINUE →',
  },

  buttons: {
    next: 'CONTINUE →',
  },

  storageKey: 'chapter5-card',
} as const;
