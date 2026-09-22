import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** The MEMORY DATABASE bar. Blocks fill as she gets things right. */
@Component({
  selector: 'app-quiz-progress',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="db" [class.db--glitch]="glitch()" [class.db--centre]="centred()">
      @if (label()) {
        <p class="db__label">
          <span>{{ label() }}</span>
          @if (caption()) {
            <span class="db__caption">{{ caption() }}</span>
          }
        </p>
      }
      <p class="db__bar">{{ bar() }}</p>
      @if (showPercent()) {
        <p class="db__pct">{{ percent() }}%</p>
      }
      @if (status()) {
        <p class="db__status">{{ status() }}</p>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .db {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    /* opt-in: the whole readout sits centred inside a centred screen */
    .db--centre {
      align-items: center;
    }

    .db--centre .db__label {
      justify-content: center;
    }

    .db--centre .db__bar,
    .db--centre .db__pct,
    .db--centre .db__status {
      text-align: center;
    }

    .db--glitch .db__bar {
      animation: shake-x 0.3s steps(3, end) 1;
      color: var(--lavender);
    }

    .db__label {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      margin: 0;
      font-family: var(--f-ui);
      font-size: var(--t-xs);
      letter-spacing: 0.16em;
      color: var(--text-dim);
    }

    .db__caption {
      color: var(--accent);
    }

    .db__bar {
      margin: 0;
      /* the surrounding screen may be centred; the bar always reads left */
      text-align: left;
      font-family: var(--f-ui);
      font-size: var(--t-md);
      line-height: 1.2;
      letter-spacing: 0.02em;
      color: var(--accent);
      word-break: break-all;
      transition: color 0.2s ease;
    }

    .db__pct,
    .db__status {
      margin: 0;
      text-align: left;
      font-family: var(--f-pixel);
      font-size: var(--t-xs);
      letter-spacing: 0.1em;
      color: var(--text-dim);
    }

    .db__status {
      color: var(--lavender);
    }
  `,
})
export class QuizProgress {
  readonly label = input('');
  readonly caption = input('');
  readonly status = input('');
  /** 0 to 1. */
  readonly value = input(0);
  readonly blocks = input(20);
  readonly showPercent = input(true);
  readonly glitch = input(false);
  /** Centre the label, bar and percent — for screens that are centred themselves. */
  readonly centred = input(false);

  protected readonly percent = computed(() =>
    Math.round(Math.min(1, Math.max(0, this.value())) * 100),
  );

  protected readonly bar = computed(() => {
    const total = this.blocks();
    const filled = Math.round(Math.min(1, Math.max(0, this.value())) * total);
    return '█'.repeat(filled) + '░'.repeat(Math.max(0, total - filled));
  });
}
