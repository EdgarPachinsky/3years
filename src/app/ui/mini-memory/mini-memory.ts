import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FINAL_CHAPTER } from '../../core/data/final-chapter-content';
import { AudioService } from '../../core/services/audio.service';
import { shuffled } from '../../core/util/shuffle';

const POOL = ['❤️', '⭐', '🌹', '🎮', '🍕', '🎁', '☕', '📸', '⚽', '✈️'];

/** Four icons for a moment, then: which one was here? */
@Component({
  selector: 'app-mini-memory',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="game">
      <p class="title">{{ copy.title }}</p>
      <p class="count">{{ index() + 1 }} / {{ copy.rounds }}</p>

      @if (watching()) {
        <p class="hint">{{ copy.watch }}</p>
        <div class="row row--big">
          @for (icon of shown(); track icon) {
            <span class="icon anim-pop">{{ icon }}</span>
          }
        </div>
      } @else {
        <p class="hint">{{ copy.ask }}</p>
        <div class="opts">
          @for (icon of options(); track icon) {
            <button type="button" class="opt" [disabled]="!!feedback()" (click)="answer(icon)">
              {{ icon }}
            </button>
          }
        </div>
      }

      @if (feedback(); as fb) {
        <p class="fb" [class.fb--bad]="!correct()">{{ fb }}</p>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .game {
      display: flex;
      flex-direction: column;
      gap: 12px;
      align-items: center;
    }

    .title {
      margin: 0;
      font-family: var(--f-pixel);
      font-size: var(--t-sm);
      letter-spacing: 0.1em;
      color: var(--accent);
    }

    .hint,
    .count {
      margin: 0;
      font-family: var(--f-ui);
      font-size: var(--t-xs);
      letter-spacing: 0.14em;
      color: var(--text-dim);
    }

    .row {
      display: flex;
      justify-content: center;
      gap: 14px;
      padding: 20px 12px;
      width: 100%;
      background: var(--screen);
      box-shadow:
        0 -4px 0 0 var(--border),
        0 4px 0 0 var(--border),
        -4px 0 0 0 var(--border),
        4px 0 0 0 var(--border);
    }

    .icon {
      font-size: 30px;
      line-height: 1;
    }

    .opts {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
      width: 100%;
      max-width: 300px;
    }

    .opt {
      min-height: 60px;
      font-size: 28px;
      background: var(--panel-2);
      border: 0;
      cursor: pointer;
      box-shadow:
        0 -4px 0 0 var(--border),
        0 4px 0 0 var(--border),
        -4px 0 0 0 var(--border),
        4px 0 0 0 var(--border),
        0 8px 0 0 rgb(0 0 0 / 40%);
    }

    .opt:active:not(:disabled) {
      transform: translateY(5px);
      box-shadow:
        0 -4px 0 0 var(--border),
        0 4px 0 0 var(--border),
        -4px 0 0 0 var(--border),
        4px 0 0 0 var(--border);
    }

    .fb {
      margin: 0;
      font-family: var(--f-pixel);
      font-size: var(--t-sm);
      color: var(--accent);
    }

    .fb--bad {
      color: var(--lavender);
    }
  `,
})
export class MiniMemory implements OnInit {
  private readonly audio = inject(AudioService);

  readonly reduceMotion = input(false);
  readonly finished = output<void>();

  protected readonly copy = FINAL_CHAPTER.games.memory;
  protected readonly index = signal(0);
  protected readonly watching = signal(true);
  protected readonly shown = signal<string[]>([]);
  protected readonly options = signal<string[]>([]);
  protected readonly feedback = signal('');
  protected readonly correct = signal(true);

  private target = '';
  private readonly timers = new Set<ReturnType<typeof setTimeout>>();

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      for (const id of this.timers) clearTimeout(id);
      this.timers.clear();
    });
  }

  ngOnInit(): void {
    this.deal();
  }

  protected answer(icon: string): void {
    if (this.feedback()) return;

    if (icon !== this.target) {
      this.correct.set(false);
      this.audio.play('reject');
      this.feedback.set(`${this.copy.wrong}  ${this.copy.retry}`);
      this.at(1100, () => this.feedback.set(''));
      return;
    }

    this.correct.set(true);
    this.audio.play('win');
    this.feedback.set(this.copy.correct);
    this.at(800, () => {
      this.feedback.set('');
      const next = this.index() + 1;
      if (next >= this.copy.rounds) {
        this.finished.emit();
        return;
      }
      this.index.set(next);
      this.deal();
    });
  }

  private deal(): void {
    const picked = shuffled(POOL).slice(0, 4);
    this.shown.set(picked);
    this.target = picked[Math.floor(Math.random() * picked.length)];
    const decoys = shuffled(POOL.filter((i) => !picked.includes(i))).slice(0, 3);
    this.options.set(shuffled([this.target, ...decoys]));
    this.watching.set(true);
    this.at(this.reduceMotion() ? 900 : 2000, () => this.watching.set(false));
  }

  private at(ms: number, run: () => void): void {
    const id = setTimeout(() => {
      this.timers.delete(id);
      run();
    }, ms);
    this.timers.add(id);
  }
}
