import { MysteryBox } from '../models/final.models';

/* ==========================================================================
   FINAL CHAPTER — ONE LAST SURPRISE
   All copy lives here. The four digits are runtime state, not content.
   ========================================================================== */

export const FINAL_BOXES: readonly MysteryBox[] = [
  { id: 'box-01', title: 'BOX 01', icon: '🎁', description: 'Feels light.', game: 'catch-hearts' },
  { id: 'box-02', title: 'BOX 02', icon: '🎁', description: 'Rattles a bit.', game: 'easy-math' },
  { id: 'box-03', title: 'BOX 03', icon: '🎁', description: 'Suspiciously quiet.', game: 'memory' },
];

export const FINAL_CHAPTER = {
  code: 'FINAL CHAPTER',
  title: 'ONE LAST SURPRISE',

  lock: {
    locks: '🔒 🔒 🔒 🔒',
    required: 'PASSWORD REQUIRED',
    hintLabel: 'HINT',
    hint: 'You’ve already seen the password.\n\nYou just didn’t know\nyou were looking at it. 👀',
    foundLabel: 'DIGITS FOUND',
    unlock: 'UNLOCK',
    deniedTitle: 'ACCESS DENIED ❌',
    denied: 'Hmm...\n\nYou’ve definitely seen\nthe numbers before. 👀',
    tryAgain: 'TRY AGAIN',
    grantedTitle: 'ACCESS GRANTED ✓',
    granted: 'FINAL CHAPTER\nUNLOCKED',
  },

  boxes: {
    heading: 'ONE LAST SURPRISE',
    sub: 'Choose one.',
    opening: 'OPENING...',
  },

  games: {
    catch: {
      title: 'CATCH THE HEARTS',
      hint: 'Drag to move. Catch 5.',
      counter: 'HEARTS',
      target: 5,
      done: 'YOU GOT THEM ALL! ❤️',
    },
    math: {
      title: 'QUICK MATHS',
      hint: 'Four easy ones. No pressure.',
      rounds: 4,
      correct: 'CORRECT! ✓',
      wrong: 'ALMOST! 😂',
      retry: 'TRY AGAIN',
      done: 'NAILED IT ❤️',
    },
    memory: {
      title: 'WHICH ONE WAS HERE?',
      hint: 'Look closely...',
      rounds: 3,
      watch: 'REMEMBER THESE',
      ask: 'WHICH ONE WAS HERE?',
      correct: 'CORRECT! ✓',
      wrong: 'ALMOST! 😂',
      retry: 'TRY AGAIN',
      done: 'GOOD MEMORY ❤️',
    },
    rewardLabel: 'REWARD UNLOCKED ✓',
  },

  calculating: {
    label: 'CALCULATING FINAL REWARD...',
    found: 'REWARD FOUND.',
  },

  reveal: {
    title: '🎧 AIRPODS 5 🎧',
    statusLabel: 'STATUS',
    status: 'CURRENTLY IN TRANSIT 😂',
    arrivalLabel: 'ARRIVAL',
    arrival: '25.09.2026',
    messages: [
      'Yeah...\n\nI know you were probably expecting\nyour present today. 😂',
      'But...\n\nwhy would I give you AirPods 4\ntwo days before AirPods 5 arrive? 😏',
      'So until the real present arrives...',
    ],
    gifts: [
      { icon: '🌹', text: 'here are your flowers' },
      { icon: '🎮', text: 'and this stupid little game' },
      { icon: '❤️', text: 'to keep you busy.' },
    ],
  },

  ending: {
    heading: 'ONE LAST SURPRISE',
    items: [
      { icon: '🌹', text: 'FLOWERS' },
      { icon: '🎮', text: 'THIS GAME' },
      { icon: '❤️', text: 'THREE YEARS OF US' },
    ],
    actualLabel: 'ACTUAL PRESENT',
    actual: '🎧 AIRPODS 5',
    arrivingLabel: 'ARRIVING',
    arriving: '25.09.2026',
    lines: ['Happy 3rd anniversary. ❤️', 'The game ends here.', 'Us doesn’t.'],
  },

  buttons: {
    next: 'CONTINUE →',
    open: 'OPEN IT →',
    menu: '☰ BACK TO THE MENU',
  },
} as const;
