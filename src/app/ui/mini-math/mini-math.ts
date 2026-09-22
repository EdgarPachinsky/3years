import { ChangeDetectionStrategy, Component, OnInit, inject, output, signal } from '@angular/core';
import { FINAL_CHAPTER } from '../../core/data/final-chapter-content';
import { AudioService } from '../../core/services/audio.service';
import { shuffled } from '../../core/util/shuffle';

interface Sum {
  readonly text: string;
  readonly answer: number;
  readonly options: readonly number[];
}

/** Four very easy sums. A wrong answer just asks again. */
@Component({
  selector: 'app-mini-math',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="game">
      <p class="title">{{ copy.title }}</p>
      <p class="hint">{{ copy.hint }}</p>

      @if (current(); as sum) {
        <p class="count">{{ index() + 1 }} / {{ copy.rounds }}</p>
        <p class="sum">{{ sum.text }}</p>

        <div class="opts">
          @for (option of sum.options; track option) {
            <button type="button" class="opt" [disabled]="!!feedback()" (click)="answer(option)">
              {{ option }}
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

    .sum {
      margin: 6px 0;
      font-family: var(--f-pixel);
      font-size: var(--t-xl);
      color: var(--text);
    }

    .opts {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
      width: 100%;
      max-width: 300px;
    }

    .opt {
      min-height: var(--tap);
      padding: 14px;
      font-family: var(--f-pixel);
      font-size: var(--t-md);
      color: var(--text);
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
export class MiniMath implements OnInit {
  private readonly audio = inject(AudioService);
  readonly finished = output<void>();

  protected readonly copy = FINAL_CHAPTER.games.math;
  protected readonly index = signal(0);
  protected readonly feedback = signal('');
  protected readonly correct = signal(true);
  protected readonly current = signal<Sum | null>(null);

  private timer: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.current.set(this.make());
  }

  protected answer(choice: number): void {
    const sum = this.current();
    if (!sum || this.feedback()) return;

    if (choice !== sum.answer) {
      this.correct.set(false);
      this.audio.play('reject');
      this.feedback.set(`${this.copy.wrong}  ${this.copy.retry}`);
      this.timer = setTimeout(() => this.feedback.set(''), 1100);
      return;
    }

    this.correct.set(true);
    this.audio.play('win');
    this.feedback.set(this.copy.correct);
    this.timer = setTimeout(() => {
      this.feedback.set('');
      const next = this.index() + 1;
      if (next >= this.copy.rounds) {
        this.finished.emit();
        return;
      }
      this.index.set(next);
      this.current.set(this.make());
    }, 800);
  }

  /** Small numbers only — this is meant to be fun, not hard. */
  private make(): Sum {
    const times = Math.random() < 0.4;
    const a = times ? 2 + Math.floor(Math.random() * 7) : 3 + Math.floor(Math.random() * 12);
    const b = times ? 2 + Math.floor(Math.random() * 7) : 3 + Math.floor(Math.random() * 12);
    const answer = times ? a * b : a + b;
    const wrongs = new Set<number>();
    while (wrongs.size < 3) {
      const delta = 1 + Math.floor(Math.random() * 5);
      const candidate = Math.random() < 0.5 ? answer - delta : answer + delta;
      if (candidate > 0 && candidate !== answer) wrongs.add(candidate);
    }
    return {
      text: `${a} ${times ? '×' : '+'} ${b} = ?`,
      answer,
      options: shuffled([answer, ...wrongs]),
    };
  }
}
