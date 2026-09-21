import {
  ChapterMeta,
  ChatChapter,
  ChatMessage,
  FriendRequestCopy,
  Memory,
  QuizQuestion,
  TimelineEntry,
} from '../models/story.models';

/* ==========================================================================
   OUR STORY — all content lives here.
   Edit this file to change words, dates, photos or questions.
   The real messages are kept EXACTLY as they were sent: no translation,
   no spelling fixes, no normalised transliteration. That is the point.
   ========================================================================== */

export const TOTAL_CHAPTERS = 6;

/** Every message in a chapter, flattened — quizzes dropped. */
export function chapterMessages(chapter: ChatChapter): readonly ChatMessage[] {
  return chapter.script.flatMap((beat) => (beat.kind === 'messages' ? beat.messages : []));
}

export const CHAPTERS: readonly ChapterMeta[] = [
  {
    index: 1,
    code: 'CHAPTER 01',
    title: 'THE BEGINNING',
    playable: true,
    entry: 'friend-request',
  },
  { index: 2, code: 'CHAPTER 02', title: 'FOUND AGAIN', playable: true, entry: 'chapter-two' },
  {
    index: 3,
    code: 'CHAPTER 03',
    title: 'OUR MEMORIES',
    playable: true,
    entry: 'chapter-three',
  },
  {
    index: 4,
    code: 'CHAPTER 04',
    title: 'HOW WELL DO YOU KNOW US?',
    playable: true,
    entry: 'chapter-four',
  },
  {
    index: 5,
    code: 'CHAPTER 05',
    title: 'TWO OF US',
    playable: true,
    entry: 'chapter-five',
  },
  { index: 6, code: 'FINAL CHAPTER', title: 'ONE LAST SURPRISE', playable: false },
];

/* ------------------------------------------------ JUNE 7, 2019 — 8:18 PM -- */
export const FRIEND_REQUEST: FriendRequestCopy = {
  dateLabel: 'JUNE 7, 2019',
  timeLabel: '8:18 PM',
  windowTitle: 'CONNECT.EXE',
  heading: 'FRIEND REQUEST',
  name: 'ED',
  handle: '@ed',
  line: 'wants to connect with you.',
  acceptLabel: 'ACCEPT',
  rejectLabel: 'REJECT',
  acceptedTitle: 'FRIEND REQUEST ACCEPTED',
  acceptedLine: 'CONNECTION ESTABLISHED',
  nextTime: '10:35 PM',
  rejections: [
    {
      title: 'ERROR 404',
      line: 'Apparently that was not the correct historical decision. 😂',
    },
    {
      title: 'ERROR 409',
      line: 'Rejected again? The last 7 years strongly disagree with you. 😅',
    },
    {
      title: 'ERROR 418',
      line: 'The timeline refuses. Somebody has to accept this request. 🫠',
    },
  ],
};

/* ---------------------------------------------- JUNE 7, 2019 — 10:35 PM -- */

/**
 * Memory check, mid-conversation. The correct option is what she actually
 * wrote that night, so getting it right puts her own message back in the chat.
 * NOTE: the two wrong options are invented — swap them for anything funnier.
 */
export const CH1_WEATHER_CHECK: QuizQuestion = {
  id: 'ch1-weather',
  kicker: 'MEMORY CHECK',
  prompt: 'isk qez mot inch exanak er? 👀',
  revealAs: 'her',
  options: [
    { key: 'A', text: 'Շոգ ա, չեմ դիմանում', correct: false },
    { key: 'B', text: 'Հով,դաժե մի քիչ ցուրտ', correct: true },
    { key: 'C', text: 'Անձրև ա գալիս', correct: false },
  ],
  correctTitle: 'MEMORY RESTORED',
  correctLine: 'Cool night. A little cold. Exactly that. 🌙',
  wrongTitle: 'MEMORY CORRUPTED 😂',
  wrongLine: 'Hmmmm… check the weather again.',
};

/** Second memory check. Wrong options invented — edit freely. */
export const CH1_TEN_MINUTES_CHECK: QuizQuestion = {
  id: 'ch1-ten-minutes',
  kicker: 'MEMORY CHECK',
  prompt: 'u du inch patasxanecir? 😄',
  revealAs: 'her',
  options: [
    { key: 'A', text: 'Դե խլի տեսնեմ ինչ ես ասում😅', correct: true },
    { key: 'B', text: 'Չէ, զբաղված եմ 😄', correct: false },
    { key: 'C', text: '10 րոպեն քիչ ա 😄', correct: false },
  ],
  correctTitle: 'MEMORY RESTORED',
  correctLine: 'And that is exactly what you said. 😄',
  wrongTitle: 'MEMORY CORRUPTED 😂',
  wrongLine: 'Close. But no, that is not it.',
};

export const CHAPTER_ONE_CHAT: ChatChapter = {
  id: 'ch1',
  dateLabel: 'JUNE 7, 2019',
  timeLabel: '10:35 PM',
  windowTitle: 'MESSAGES',
  contactName: 'ED',
  script: [
    {
      kind: 'messages',
      messages: [
        {
          id: 'c1m1',
          from: 'me',
          text: 'Tat bari ush ereko 😀 lav es ?',
          time: '10:35 PM',
          typingMs: 1500,
          pauseMs: 500,
        },
        {
          id: 'c1m2',
          from: 'her',
          text: 'Բարի ուշ երեկո Էդ ջան արդեն հա',
          time: '10:46 PM',
          typingMs: 2800,
          pauseMs: 900,
        },
        { id: 'c1m3', from: 'me', text: 'ho qnac cheir?', typingMs: 1200, pauseMs: 700 },
        { id: 'c1m4', from: 'her', text: 'չէ հա', typingMs: 1800, pauseMs: 500 },
        {
          id: 'c1m5',
          from: 'me',
          text: 'lava lava , inch exanaka dzer mot ?',
          typingMs: 1900,
          pauseMs: 700,
        },
      ],
    },

    { kind: 'quiz', quiz: CH1_WEATHER_CHECK },

    {
      kind: 'messages',
      messages: [
        {
          id: 'c1m7',
          from: 'me',
          text: 'Haa , mer motela nuyn@ , ese durs@ qaylum ei , heto hisha dzez 😄 asi mi 10 rope xlem qezic😄😄',
          typingMs: 3200,
          pauseMs: 900,
        },
        { id: 'c1m8', from: 'her', text: 'Եվ?😄', typingMs: 1100, pauseMs: 700 },
        {
          id: 'c1m9',
          from: 'me',
          text: 'Ev tenc 😄 vonc vor tenum es xlum em',
          typingMs: 2100,
          pauseMs: 700,
        },
      ],
    },

    { kind: 'quiz', quiz: CH1_TEN_MINUTES_CHECK },
  ],
};

export const CHAPTER_ONE_OUTRO = {
  beat: 'And that was the beginning.',
  dateLabel: 'JUNE 7, 2019',
  timeLabel: '10:35 PM',
  lines: ['ONE MESSAGE', 'ONE FRIEND REQUEST', 'ONE VERY LONG STORY'],
  cta: 'CONTINUE',
} as const;

/* ------------------------------------------- THE GLITCH — the lost part -- */
export const GLITCH_SCRIPT = {
  interrupted: 'CONNECTION INTERRUPTED',
  error: 'TIMELINE ERROR',
  years: ['2019', '2019', '2020', '2019', '2020', '2019', '2020', '2020'],
  lost: 'SIGNAL LOST',
  reconnecting: 'RECONNECTING...',
  restored: 'SIGNAL RESTORED',
} as const;

/* ------------------------------------------ NOVEMBER 14, 2020 — 9:01 PM -- */
export const CHAPTER_TWO_INTRO = {
  dateLabel: 'NOVEMBER 14, 2020',
  timeLabel: '9:01 PM',
  code: 'CHAPTER 02',
  title: 'FOUND AGAIN',
} as const;

export const CHAPTER_TWO_CHAT: ChatChapter = {
  id: 'ch2',
  dateLabel: 'NOVEMBER 14, 2020',
  timeLabel: '9:01 PM',
  windowTitle: 'MESSAGES',
  contactName: 'ED',
  script: [
    {
      kind: 'messages',
      messages: [
        { id: 'c2m1', from: 'her', text: 'Էդ բարև', time: '9:01 PM', typingMs: 1600, pauseMs: 700 },
        { id: 'c2m2', from: 'her', text: 'Լավ ես?', typingMs: 900, pauseMs: 300 },
        { id: 'c2m3', from: 'me', text: 'Barev Normal du asa', typingMs: 1600, pauseMs: 800 },
        {
          id: 'c2m4',
          from: 'her',
          text: 'Ես հեչ, դուք զինվորներդ որ լավ լինեք , ես էլ լավ կլինեմ',
          typingMs: 2600,
          pauseMs: 600,
        },
        {
          id: 'c2m5',
          from: 'me',
          text: 'Dzer lav linelu hamar enq menq',
          typingMs: 1900,
          pauseMs: 700,
        },
        { id: 'c2m6', from: 'her', text: 'Հա, ուրեմն լավ եմ )', typingMs: 1500, pauseMs: 600 },
        { id: 'c2m7', from: 'me', text: 'uremn esel em lav )', typingMs: 1400, pauseMs: 700 },
      ],
    },
  ],
};

/* ------------------------------------------------------- MEMORY CHECK --- */
export const MEMORY_CHECK: QuizQuestion = {
  id: 'q-remember',
  kicker: 'MEMORY CHECK',
  prompt: 'vonc el hishar? 👀',
  options: [
    { key: 'A', text: 'Հիշում էի, չէի գրում', correct: true },
    { key: 'B', text: 'Չէի հիշում, բայց ձև էի տալիս 😂', correct: false },
    { key: 'C', text: 'Դու էիր առաջինը գրել', correct: false },
  ],
  correctTitle: 'MEMORY RESTORED',
  correctLine: 'Okay… you remember this one. 😏',
  wrongTitle: 'MEMORY CORRUPTED 😂',
  wrongLine: 'Hmmmm… that’s not how I remember it.',
};

/* ------------------------------------------- CHAPTER 03 — OUR MEMORIES -- */

/**
 * Every photo in /public/assets/chapter-3/images. Four are picked at random
 * each time the chapter is played, so it is never quite the same run twice.
 *
 * The list is generated from the folder by scripts/generate-chapter-3-photos.mjs
 * on `npm start` and `npm run build` — just drop photos in, nothing to edit.
 */
export { CHAPTER_THREE_PHOTOS } from './chapter-3-photos.generated';

export const CHAPTER_THREE = {
  code: 'CHAPTER 03',
  title: 'OUR MEMORIES',
  kicker: 'FOUR MEMORIES, IN PIECES',
  hint: 'TAP A PIECE, THEN TAP WHERE IT BELONGS',
  loading: 'LOADING MEMORY...',
  solvedTitle: 'MEMORY FOUND',
  /** One line per solved mosaic, in order. */
  solvedLines: [
    'I remember this one. ❤️',
    'Look at us.',
    'This one still gets me. 😄',
    'And that is only four of them.',
  ],
  next: 'NEXT',
  /** Board size for each of the four rounds. */
  rounds: [2, 3, 3, 4],
  outroTitle: 'MEMORY ARCHIVE RESTORED',
  outroLine: 'Four out of about a thousand.',
  cta: 'CONTINUE',
} as const;

/* ------------------------------------------------------- MAIN MENU ------ */
export const MAIN_MENU = {
  kicker: 'CHAPTER SELECT',
  title: '3 YEARS',
  back: 'BACK TO WHERE I WAS',
  restart: 'PLAY FROM THE START',
  hint: 'Picking a chapter starts it from the beginning.',
  /** Only appears once Chapter 05 has produced a card. */
  card: '❤️ OUR CHARACTER CARD',
  cardBack: '↩ BACK TO THE MENU',
} as const;

/* --------------------------------------------------- COMING UP NEXT ----- */
export const CHAPTER_TEASER = {
  code: 'FINAL CHAPTER',
  title: 'ONE LAST SURPRISE',
  status: 'LOADING MEMORY...',
  line: 'More of this is still loading. ❤️',
  hint: 'Your progress is saved on this phone.',
} as const;

/* --------------------------------------------------------------------------
   Seeds for the later chapters. Drop real photos into /assets/images/
   using these exact filenames and they appear automatically.
   -------------------------------------------------------------------------- */
export const MEMORIES: readonly Memory[] = [
  {
    id: 'first-message',
    title: 'The first message',
    dateLabel: 'JUNE 7, 2019',
    image: 'assets/images/first-message.jpg',
    blurb: 'Where all of it started.',
  },
  {
    id: 'memory-01',
    title: 'Memory 01',
    dateLabel: '',
    image: 'assets/images/memory-01.jpg',
    blurb: '',
  },
  {
    id: 'memory-02',
    title: 'Memory 02',
    dateLabel: '',
    image: 'assets/images/memory-02.jpg',
    blurb: '',
  },
  {
    id: 'trip-01',
    title: 'Our trip',
    dateLabel: '',
    image: 'assets/images/trip-01.jpg',
    blurb: '',
  },
  {
    id: 'wedding',
    title: 'The wedding',
    dateLabel: 'SEPTEMBER 23',
    image: 'assets/images/wedding.jpg',
    blurb: '',
  },
];

export const TIMELINE: readonly TimelineEntry[] = [
  {
    id: 't1',
    icon: '💬',
    dateLabel: 'JUN 7, 2019',
    title: 'First message',
    memoryId: 'first-message',
  },
  { id: 't2', icon: '❤️', dateLabel: 'NOV 14, 2020', title: 'Found again' },
  { id: 't3', icon: '📸', dateLabel: '', title: 'A memory', memoryId: 'memory-01' },
  { id: 't4', icon: '🌍', dateLabel: '', title: 'A trip', memoryId: 'trip-01' },
  { id: 't5', icon: '💍', dateLabel: 'SEP 23', title: 'Wedding day', memoryId: 'wedding' },
  { id: 't6', icon: '🎁', dateLabel: 'SEP 25', title: 'One little surprise' },
];
