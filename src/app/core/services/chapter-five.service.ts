import { Injectable, computed, signal } from '@angular/core';
import {
  CHAPTER_FIVE,
  CHAPTER_FIVE_CLASSES,
  CHAPTER_FIVE_GENRES,
  CHAPTER_FIVE_ITEMS,
  CHAPTER_FIVE_LEVELS,
  CHAPTER_FIVE_QUESTS,
  CHAPTER_FIVE_STATS,
} from '../data/chapter-5-content';
import { CharacterClass, CoopBuild, RelationshipStatId, StatValues } from '../models/coop.models';

function defaultStats(): StatValues {
  const out = {} as StatValues;
  for (const stat of CHAPTER_FIVE_STATS) {
    out[stat.id] = stat.fixed ?? stat.start ?? 50;
  }
  return out;
}

/**
 * Holds one playthrough of Chapter 05 and turns it into a character card.
 * Nothing here judges anything — it only remembers what she picked.
 */
@Injectable({ providedIn: 'root' })
export class ChapterFiveService {
  private readonly _stats = signal<StatValues>(defaultStats());
  private readonly _inventory = signal<string[]>([]);
  private readonly _genreId = signal<string | null>(null);
  private readonly _questId = signal<string | null>(null);
  private readonly _levelId = signal<string | null>(null);
  private readonly _completed = signal(false);
  /** The last finished card, kept apart from whatever run is in progress. */
  private readonly _saved = signal<CoopBuild | null>(null);

  readonly stats = this._stats.asReadonly();
  readonly inventoryIds = this._inventory.asReadonly();
  readonly genreId = this._genreId.asReadonly();
  readonly questId = this._questId.asReadonly();
  readonly levelId = this._levelId.asReadonly();
  readonly completed = this._completed.asReadonly();
  readonly savedCard = this._saved.asReadonly();

  readonly limit = CHAPTER_FIVE.inventory.limit;

  readonly characterClass = computed<CharacterClass>(() => this.classFor(this._stats()));
  readonly inventory = computed(() =>
    this._inventory()
      .map((id) => CHAPTER_FIVE_ITEMS.find((i) => i.id === id))
      .filter((i) => !!i),
  );
  readonly genre = computed(
    () => CHAPTER_FIVE_GENRES.find((g) => g.id === this._genreId()) ?? null,
  );
  readonly quest = computed(
    () => CHAPTER_FIVE_QUESTS.available.find((q) => q.id === this._questId()) ?? null,
  );
  readonly level = computed(
    () => CHAPTER_FIVE_LEVELS.find((l) => l.id === this._levelId()) ?? null,
  );
  readonly full = computed(() => this._inventory().length >= this.limit);

  readonly build = computed<CoopBuild>(() => ({
    stats: this._stats(),
    inventoryIds: this._inventory(),
    genreId: this._genreId(),
    questId: this._questId(),
    nextLevelId: this._levelId(),
    classId: this.characterClass().id,
    completed: this._completed(),
  }));

  /** The finished card, resolved into everything the card component needs. */
  readonly savedView = computed(() => {
    const build = this._saved();
    if (!build) return null;
    const stats = { ...defaultStats(), ...build.stats };
    return {
      stats,
      klass: CHAPTER_FIVE_CLASSES.find((c) => c.id === build.classId) ?? this.classFor(stats),
      inventory: build.inventoryIds
        .map((id) => CHAPTER_FIVE_ITEMS.find((i) => i.id === id))
        .filter((i) => !!i),
      genre: CHAPTER_FIVE_GENRES.find((g) => g.id === build.genreId) ?? null,
      quest: CHAPTER_FIVE_QUESTS.available.find((q) => q.id === build.questId) ?? null,
      level: CHAPTER_FIVE_LEVELS.find((l) => l.id === build.nextLevelId) ?? null,
    };
  });

  constructor() {
    this._saved.set(this.load());
  }

  /* ------------------------------------------------------------ choices -- */

  setStat(id: RelationshipStatId, value: number): void {
    this._stats.update((all) => ({ ...all, [id]: Math.round(Math.min(100, Math.max(0, value))) }));
  }

  /** Tapping an item adds it, tapping it again takes it back out. */
  toggleItem(id: string): void {
    this._inventory.update((all) => {
      if (all.includes(id)) return all.filter((x) => x !== id);
      if (all.length >= this.limit) return all;
      return [...all, id];
    });
  }

  chooseGenre(id: string): void {
    this._genreId.set(id);
  }

  chooseQuest(id: string): void {
    this._questId.set(id);
  }

  chooseLevel(id: string): void {
    this._levelId.set(id);
  }

  /** Lock the card in and keep it, so she can open it again later. */
  finish(): void {
    this._completed.set(true);
    const build = this.build();
    this._saved.set(build);
    this.save(build);
  }

  /** Fresh playthrough — used whenever the chapter is entered again. */
  reset(): void {
    this._stats.set(defaultStats());
    this._inventory.set([]);
    this._genreId.set(null);
    this._questId.set(null);
    this._levelId.set(null);
    this._completed.set(false);
  }

  /* ------------------------------------------------------------- class --- */

  private classFor(stats: StatValues): CharacterClass {
    const matches = CHAPTER_FIVE_CLASSES.filter((c) => {
      try {
        return c.when(stats);
      } catch {
        return false;
      }
    });
    const best = [...matches].sort((a, b) => b.priority - a.priority)[0];
    return best ?? CHAPTER_FIVE_CLASSES[CHAPTER_FIVE_CLASSES.length - 1];
  }

  /* ----------------------------------------------------------- storage --- */

  private load(): CoopBuild | null {
    try {
      const raw = localStorage.getItem(CHAPTER_FIVE.storageKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as Partial<CoopBuild>;
      if (!parsed.stats) return null;
      return {
        stats: parsed.stats as StatValues,
        inventoryIds: Array.isArray(parsed.inventoryIds) ? parsed.inventoryIds : [],
        genreId: parsed.genreId ?? null,
        questId: parsed.questId ?? null,
        nextLevelId: parsed.nextLevelId ?? null,
        classId: parsed.classId ?? null,
        completed: parsed.completed ?? false,
      };
    } catch {
      return null;
    }
  }

  private save(build: CoopBuild): void {
    try {
      localStorage.setItem(CHAPTER_FIVE.storageKey, JSON.stringify(build));
    } catch {
      /* private mode — the card still shows, it just will not come back later */
    }
  }
}
