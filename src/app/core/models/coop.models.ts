/**
 * Chapter 05 — "Two of us".
 * No scoring here: every value is a choice she made, not an answer she got right.
 */

export type RelationshipStatId =
  'love' | 'chaos' | 'adventure' | 'food' | 'competition' | 'laziness' | 'romance' | 'wanderlust';

export type StatValues = Record<RelationshipStatId, number>;

export interface RelationshipStat {
  readonly id: RelationshipStatId;
  readonly title: string;
  readonly icon: string;
  readonly minLabel: string;
  readonly maxLabel: string;
  /** Where the slider starts, 0-100. */
  readonly start?: number;
  /** Shown on the results card and the character card. */
  readonly barLabel?: string;
  /** Some stats are not adjustable — love, for instance. */
  readonly fixed?: number;
}

export interface InventoryItem {
  readonly id: string;
  readonly title: string;
  readonly icon: string;
  readonly description?: string;
}

export interface GameGenre {
  readonly id: string;
  readonly title: string;
  readonly icon: string;
  readonly description: string;
  readonly resultTitle: string;
  /** The little fake store page. Lines are rendered one per row. */
  readonly resultLines: readonly { readonly label: string; readonly value: string }[];
}

export interface Quest {
  readonly id: string;
  readonly title: string;
  readonly icon?: string;
  readonly completed?: boolean;
}

export interface NextLevelChoice {
  readonly id: string;
  readonly title: string;
  readonly icon: string;
  readonly resultText: string;
}

export interface CharacterClass {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  /** The joke line on the character card. */
  readonly skill: string;
  /** Higher wins when more than one rule matches. */
  readonly priority: number;
  readonly when: (stats: StatValues) => boolean;
}

/** Everything she built in one playthrough. */
export interface CoopBuild {
  readonly stats: StatValues;
  readonly inventoryIds: readonly string[];
  readonly genreId: string | null;
  readonly questId: string | null;
  readonly nextLevelId: string | null;
  readonly classId: string | null;
  readonly completed: boolean;
}
