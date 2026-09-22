/** The final chapter: a four-digit hunt across chapters 1-4. */

export type DigitChapter = 1 | 2 | 3 | 4;
export type MiniGameKind = 'catch-hearts' | 'easy-math' | 'memory';

export interface MysteryBox {
  readonly id: string;
  readonly title: string;
  readonly icon: string;
  readonly description?: string;
  readonly game: MiniGameKind;
}

/** One run's secret. Regenerated only when the whole story is restarted. */
export interface FinalSurpriseState {
  readonly digits: readonly [number, number, number, number];
  readonly found: readonly [boolean, boolean, boolean, boolean];
  readonly unlocked: boolean;
  readonly boxId: string | null;
  readonly gameDone: boolean;
  readonly revealed: boolean;
}
