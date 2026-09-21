/**
 * Chapter 04 — "How well do you know us?"
 *
 * Deliberately separate from the memory-check types in `story.models.ts`:
 * those belong to the story chapters and must not change.
 */

export type QuizCategory =
  'know-me' | 'know-her' | 'know-us' | 'who-would' | 'favorites' | 'predict-me';

/** Who an option points at. `custom` = a concrete answer rather than a person. */
export type AnswerTarget = 'me' | 'her' | 'both' | 'custom';

export type QuizDifficulty = 'easy' | 'medium' | 'hard';

export interface QuizChoice {
  readonly id: string;
  readonly label: string;
  readonly target?: AnswerTarget;
}

export interface KnowledgeQuestion {
  readonly id: string;
  readonly category: QuizCategory;
  readonly text: string;
  readonly options: readonly QuizChoice[];
  /** The real answer. Until it is set, `verified` stays false. */
  readonly correctOptionId: string;
  readonly explanation?: string;
  readonly correctReaction?: string;
  readonly wrongReaction?: string;
  readonly difficulty?: QuizDifficulty;
  /** Nudges how often a question comes up. Default 1. */
  readonly weight?: number;
  /**
   * Set to true once `correctOptionId` is the real answer, not a placeholder.
   * Verified questions are always preferred when a run is built.
   */
  readonly verified?: boolean;
}

/** A question as it appears in one run: options already shuffled. */
export interface QuizRound {
  readonly question: KnowledgeQuestion;
  readonly options: readonly QuizChoice[];
}

export interface QuizAnswer {
  readonly questionId: string;
  readonly chosenOptionId: string;
  readonly correct: boolean;
}

export interface QuizRun {
  readonly rounds: readonly QuizRound[];
}

export interface QuizVerdict {
  readonly heading: string;
  readonly status: string;
  readonly line: string;
}
