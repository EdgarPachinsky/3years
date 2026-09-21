import { Injectable, computed, signal } from '@angular/core';
import { ChapterMeta, SceneId, Theme } from '../models/story.models';
import { TOTAL_CHAPTERS } from '../data/story.data';

interface SavedGame {
  scene: SceneId;
  hearts: number;
  maxChapter: number;
}

const STORAGE_KEY = 'three-years:v1';
const FIRST_SCENE: SceneId = 'friend-request';

/** Which theme each scene plays in. */
const SCENE_THEME: Record<SceneId, Theme> = {
  'friend-request': 'ch1',
  'chapter-one': 'ch1',
  glitch: 'ch1',
  'chapter-two': 'ch2',
  'memory-check': 'ch2',
  'chapter-three': 'ch2',
  'chapter-four': 'ch2',
  'chapter-five': 'ch2',
  'chapter-teaser': 'ch2',
  menu: 'ch2',
};

/** How many hearts are lit once a scene has been reached. */
const SCENE_HEARTS: Record<SceneId, number> = {
  'friend-request': 0,
  'chapter-one': 0,
  glitch: 1,
  'chapter-two': 1,
  'memory-check': 1,
  'chapter-three': 2,
  'chapter-four': 3,
  'chapter-five': 4,
  'chapter-teaser': 5,
  menu: 0,
};

/** Which chapter each scene belongs to — this is what unlocks the menu. */
const SCENE_CHAPTER: Record<SceneId, number> = {
  'friend-request': 1,
  'chapter-one': 1,
  glitch: 1,
  'chapter-two': 2,
  'memory-check': 2,
  'chapter-three': 3,
  'chapter-four': 4,
  'chapter-five': 5,
  'chapter-teaser': 5,
  menu: 1,
};

@Injectable({ providedIn: 'root' })
export class GameStateService {
  private readonly _scene = signal<SceneId>(FIRST_SCENE);
  private readonly _hearts = signal(0);
  private readonly _maxChapter = signal(1);
  private readonly _resumeScene = signal<SceneId | null>(null);
  private readonly _returnScene = signal<SceneId | null>(null);

  readonly scene = this._scene.asReadonly();
  readonly hearts = this._hearts.asReadonly();
  /** Highest chapter reached so far — every chapter up to it can be replayed. */
  readonly unlockedThrough = this._maxChapter.asReadonly();
  /** A saved run worth offering to continue (null on a first visit). */
  readonly resumeScene = this._resumeScene.asReadonly();
  /** Where the menu was opened from, so she can step straight back. */
  readonly returnScene = this._returnScene.asReadonly();

  readonly theme = computed<Theme>(() => SCENE_THEME[this._scene()]);
  readonly totalChapters = TOTAL_CHAPTERS;

  readonly reduceMotion = signal(false);

  constructor() {
    this.detectReducedMotion();
    const saved = this.read();
    if (saved) {
      this._hearts.set(saved.hearts);
      this._maxChapter.set(saved.maxChapter);
      if (saved.scene !== FIRST_SCENE) this._resumeScene.set(saved.scene);
    }
  }

  go(scene: SceneId): void {
    this._scene.set(scene);
    this._hearts.update((h) => Math.max(h, SCENE_HEARTS[scene]));
    this._maxChapter.update((c) => Math.max(c, SCENE_CHAPTER[scene]));
    this._resumeScene.set(null);
    this._returnScene.set(null);
    this.write();
  }

  /** Step out to the chapter list, remembering where she was. */
  openMenu(): void {
    const from = this._scene();
    if (from === 'menu') return;
    this.go('menu');
    this._returnScene.set(from);
  }

  /** Back to the chapter she stepped out of. It restarts from its beginning. */
  closeMenu(): void {
    this.go(this._returnScene() ?? FIRST_SCENE);
  }

  /** Can this chapter be opened from the menu? */
  canPlay(chapter: ChapterMeta): boolean {
    return chapter.playable && !!chapter.entry && chapter.index <= this._maxChapter();
  }

  /** Replay a chapter from its beginning. Nothing already earned is lost. */
  playChapter(chapter: ChapterMeta): void {
    if (!this.canPlay(chapter) || !chapter.entry) return;
    this.go(chapter.entry);
  }

  resume(): void {
    const target = this._resumeScene() ?? FIRST_SCENE;
    this._resumeScene.set(null);
    this._scene.set(target);
  }

  restart(): void {
    this._resumeScene.set(null);
    this._hearts.set(0);
    this._maxChapter.set(1);
    this._scene.set(FIRST_SCENE);
    this.write();
  }

  /** Pause length helper — reduced motion collapses every dramatic beat. */
  beat(ms: number): number {
    return this.reduceMotion() ? Math.min(ms, 120) : ms;
  }

  private detectReducedMotion(): void {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.reduceMotion.set(mq.matches);
    mq.addEventListener('change', (e) => this.reduceMotion.set(e.matches));
  }

  private read(): SavedGame | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as Partial<SavedGame>;
      if (!parsed.scene || !(parsed.scene in SCENE_THEME)) return null;
      return {
        scene: parsed.scene,
        hearts: parsed.hearts ?? 0,
        maxChapter: parsed.maxChapter ?? SCENE_CHAPTER[parsed.scene],
      };
    } catch {
      return null;
    }
  }

  private write(): void {
    try {
      const payload: SavedGame = {
        scene: this._scene(),
        hearts: this._hearts(),
        maxChapter: this._maxChapter(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* private mode — the story still plays, it just will not resume */
    }
  }
}
