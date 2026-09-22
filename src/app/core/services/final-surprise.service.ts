import { Injectable, computed, signal } from '@angular/core';
import { DigitChapter, FinalSurpriseState } from '../models/final.models';

const KEY = 'final-surprise:v1';

/** 1-9 — zero is left out so the digits never read as an O. */
function rollDigits(): [number, number, number, number] {
  const d = () => 1 + Math.floor(Math.random() * 9);
  return [d(), d(), d(), d()];
}

function fresh(): FinalSurpriseState {
  return {
    digits: rollDigits(),
    found: [false, false, false, false],
    unlocked: false,
    boxId: null,
    gameDone: false,
    revealed: false,
  };
}

/**
 * The password belongs to the run, not to the page.
 *
 * It is rolled once when a run begins and then persisted, so navigating,
 * refreshing and continuing all restore the same four digits. Only an explicit
 * "play from the start" rolls a new one — `GameStateService.restart()` calls
 * `newRun()` for exactly that reason.
 */
@Injectable({ providedIn: 'root' })
export class FinalSurpriseService {
  private readonly _state = signal<FinalSurpriseState>(fresh());

  readonly state = this._state.asReadonly();
  readonly digits = computed(() => this._state().digits);
  readonly found = computed(() => this._state().found);
  readonly unlocked = computed(() => this._state().unlocked);
  readonly boxId = computed(() => this._state().boxId);
  readonly gameDone = computed(() => this._state().gameDone);
  readonly revealed = computed(() => this._state().revealed);
  readonly foundCount = computed(() => this._state().found.filter(Boolean).length);
  readonly allFound = computed(() => this.foundCount() === 4);

  /** The answer. Only ever compared against, never shown. */
  private readonly password = computed(() => this._state().digits.join(''));

  constructor() {
    const saved = this.load();
    if (saved) this._state.set(saved);
    else this.persist();
  }

  digitFor(chapter: DigitChapter): number {
    return this._state().digits[chapter - 1];
  }

  isFound(chapter: DigitChapter): boolean {
    return this._state().found[chapter - 1];
  }

  /** Called when she taps the little number in a chapter. */
  discover(chapter: DigitChapter): boolean {
    if (this.isFound(chapter)) return false;
    const found = [...this._state().found] as [boolean, boolean, boolean, boolean];
    found[chapter - 1] = true;
    this.patch({ found });
    return true;
  }

  check(attempt: string): boolean {
    const ok = attempt.trim() === this.password();
    if (ok) this.patch({ unlocked: true });
    return ok;
  }

  chooseBox(id: string): void {
    this.patch({ boxId: id });
  }

  finishGame(): void {
    this.patch({ gameDone: true });
  }

  markRevealed(): void {
    this.patch({ revealed: true });
  }

  /** A brand new secret. Only on an explicit restart of the whole story. */
  newRun(): void {
    this._state.set(fresh());
    this.persist();
  }

  /* ----------------------------------------------------------- storage --- */

  private patch(part: Partial<FinalSurpriseState>): void {
    this._state.update((s) => ({ ...s, ...part }));
    this.persist();
  }

  private load(): FinalSurpriseState | null {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      const p = JSON.parse(raw) as Partial<FinalSurpriseState>;
      if (!Array.isArray(p.digits) || p.digits.length !== 4) return null;
      if (!p.digits.every((d) => typeof d === 'number')) return null;
      const found =
        Array.isArray(p.found) && p.found.length === 4 ? p.found : [false, false, false, false];
      return {
        digits: p.digits as [number, number, number, number],
        found: found as [boolean, boolean, boolean, boolean],
        unlocked: !!p.unlocked,
        boxId: p.boxId ?? null,
        gameDone: !!p.gameDone,
        revealed: !!p.revealed,
      };
    } catch {
      return null;
    }
  }

  private persist(): void {
    try {
      localStorage.setItem(KEY, JSON.stringify(this._state()));
    } catch {
      /* private mode — the hunt still works, it just will not survive a reload */
    }
  }
}
