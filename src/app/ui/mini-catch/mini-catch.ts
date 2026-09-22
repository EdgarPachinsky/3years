import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FINAL_CHAPTER } from '../../core/data/final-chapter-content';
import { AudioService } from '../../core/services/audio.service';

interface Drop {
  readonly id: number;
  readonly x: number;
  y: number;
}

/** Drag the basket, catch five hearts. Impossible to lose. */
@Component({
  selector: 'app-mini-catch',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="game">
      <p class="title">{{ copy.title }}</p>
      <p class="hint">{{ copy.hint }}</p>

      <div
        class="field"
        (pointerdown)="aim($event)"
        (pointermove)="aim($event)"
        (touchmove)="$event.preventDefault()"
      >
        @for (drop of drops(); track drop.id) {
          <span class="heart" [style.left.%]="drop.x" [style.top.%]="drop.y">❤️</span>
        }
        <span class="basket" [style.left.%]="basket()">🧺</span>
      </div>

      <p class="count">{{ copy.counter }}: {{ caught() }} / {{ copy.target }}</p>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .game {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .title {
      margin: 0;
      font-family: var(--f-pixel);
      font-size: var(--t-sm);
      letter-spacing: 0.1em;
      text-align: center;
      color: var(--accent);
    }

    .hint,
    .count {
      margin: 0;
      font-family: var(--f-ui);
      font-size: var(--t-xs);
      letter-spacing: 0.14em;
      text-align: center;
      color: var(--text-dim);
    }

    .count {
      color: var(--text);
    }

    .field {
      position: relative;
      height: 46vh;
      max-height: 340px;
      overflow: hidden;
      background: var(--screen);
      touch-action: none;
      box-shadow:
        0 -4px 0 0 var(--border),
        0 4px 0 0 var(--border),
        -4px 0 0 0 var(--border),
        4px 0 0 0 var(--border);
    }

    .heart,
    .basket {
      position: absolute;
      font-size: 26px;
      line-height: 1;
      transform: translateX(-50%);
      pointer-events: none;
    }

    .basket {
      bottom: 6px;
      font-size: 32px;
      transition: left 0.06s linear;
    }
  `,
})
export class MiniCatch implements OnInit {
  private readonly audio = inject(AudioService);

  readonly reduceMotion = input(false);
  readonly finished = output<void>();

  protected readonly copy = FINAL_CHAPTER.games.catch;
  protected readonly drops = signal<Drop[]>([]);
  protected readonly basket = signal(50);
  protected readonly caught = signal(0);

  private timer: ReturnType<typeof setInterval> | null = null;
  private seed = 0;
  private done = false;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.stop());
  }

  ngOnInit(): void {
    if (this.reduceMotion()) {
      // No falling objects to chase — just hand it to her.
      this.caught.set(this.copy.target);
      this.finish();
      return;
    }
    this.timer = setInterval(() => this.tick(), 40);
  }

  protected aim(event: PointerEvent): void {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const pct = ((event.clientX - rect.left) / rect.width) * 100;
    this.basket.set(Math.min(96, Math.max(4, pct)));
  }

  private tick(): void {
    if (this.done) return;

    // a new heart now and then, never more than three at once
    if (Math.random() < 0.05 && this.drops().length < 3) {
      this.seed += 1;
      this.drops.update((all) => [...all, { id: this.seed, x: 10 + Math.random() * 80, y: -6 }]);
    }

    const keep: Drop[] = [];
    let got = 0;
    for (const drop of this.drops()) {
      const y = drop.y + 2.2;
      if (y >= 86 && y <= 100 && Math.abs(drop.x - this.basket()) <= 14) {
        got += 1;
        continue;
      }
      if (y < 108) keep.push({ ...drop, y });
    }
    this.drops.set(keep);

    if (got > 0) {
      this.audio.play('heart');
      this.caught.update((n) => Math.min(this.copy.target, n + got));
      if (this.caught() >= this.copy.target) this.finish();
    }
  }

  private finish(): void {
    if (this.done) return;
    this.done = true;
    this.stop();
    this.audio.play('win');
    this.finished.emit();
  }

  private stop(): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }
}
