/**
 * Story domain types.
 * All narrative content lives in `core/data/story.data.ts` — never inside components.
 */

export type SceneId =
  | 'friend-request'
  | 'chapter-one'
  | 'glitch'
  | 'chapter-two'
  | 'memory-check'
  | 'chapter-three'
  | 'chapter-four'
  | 'chapter-five'
  | 'chapter-teaser'
  | 'menu';

export type Theme = 'ch1' | 'ch2' | 'final';

/** Who sent the message. `me` = Ed, `her` = his wife. */
export type Speaker = 'me' | 'her';

export interface ChatMessage {
  readonly id: string;
  readonly from: Speaker;
  /** Kept EXACTLY as it was really sent. Never translated, corrected or normalised. */
  readonly text: string;
  /** Shown above the bubble when we actually know the real timestamp. */
  readonly time?: string;
  /** How long the "..." indicator runs before this message lands. */
  readonly typingMs?: number;
  /** Extra beat before typing starts. */
  readonly pauseMs?: number;
}

/**
 * A chapter plays as a list of beats: some messages, then a memory check,
 * then more messages. Quizzes sit inside the conversation, not after it.
 */
export type StoryBeat =
  | { readonly kind: 'messages'; readonly messages: readonly ChatMessage[] }
  | { readonly kind: 'quiz'; readonly quiz: QuizQuestion };

export interface ChatChapter {
  readonly id: string;
  readonly dateLabel: string;
  readonly timeLabel: string;
  readonly windowTitle: string;
  readonly contactName: string;
  readonly script: readonly StoryBeat[];
}

export interface QuizOption {
  readonly key: string;
  readonly text: string;
  readonly correct: boolean;
}

export interface QuizQuestion {
  readonly id: string;
  readonly kicker: string;
  readonly prompt: string;
  readonly options: readonly QuizOption[];
  readonly correctTitle: string;
  readonly correctLine: string;
  readonly wrongTitle: string;
  readonly wrongLine: string;
  /**
   * When set, the correct answer is what she really wrote: once she gets it,
   * it lands in the transcript as a message from this person.
   */
  readonly revealAs?: Speaker;
}

/** One of our photos, cut up into a mosaic. */
export interface MosaicPhoto {
  readonly id: string;
  readonly src: string;
  /** Real pixel size — the board takes its shape from this so nothing gets squashed. */
  readonly width: number;
  readonly height: number;
}

/** Used from Chapter 03 onward. Photos drop into /assets/images/. */
export interface Memory {
  readonly id: string;
  readonly title: string;
  readonly dateLabel: string;
  readonly image: string;
  readonly blurb: string;
}

export interface TimelineEntry {
  readonly id: string;
  readonly icon: string;
  readonly dateLabel: string;
  readonly title: string;
  readonly memoryId?: string;
}

export interface ChapterMeta {
  readonly index: number;
  readonly code: string;
  readonly title: string;
  readonly playable: boolean;
  /** Scene this chapter starts from, so it can be replayed from the menu. */
  readonly entry?: SceneId;
}

export interface FriendRequestCopy {
  readonly dateLabel: string;
  readonly timeLabel: string;
  readonly windowTitle: string;
  readonly heading: string;
  readonly name: string;
  readonly handle: string;
  readonly line: string;
  readonly acceptLabel: string;
  readonly rejectLabel: string;
  readonly acceptedTitle: string;
  readonly acceptedLine: string;
  readonly nextTime: string;
  /** Escalating jokes for repeat rejections — playful, never a trap. */
  readonly rejections: readonly { readonly title: string; readonly line: string }[];
}
