import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CHAPTER_FOUR } from '../../core/data/chapter-4-content';
import { PixelButton } from '../pixel-button/pixel-button';
import { PixelParticles } from '../pixel-particles/pixel-particles';

/** The beat after an answer. Never moves on by itself. */
@Component({
  selector: 'app-answer-feedback',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PixelButton, PixelParticles],
  template: `
    <div class="fb" [class.fb--ok]="correct()" [class.fb--bad]="!correct()">
      @if (correct()) {
        <app-pixel-particles [count]="10" sprite="heart" />
      }

      <p class="fb__mark">
        {{ correct() ? '✓ ' + labels.correct : '✕ ' + labels.wrong }}
      </p>

      <p class="fb__line">{{ reaction() }}</p>

      @if (explanation()) {
        <p class="fb__why">{{ explanation() }}</p>
      }

      <div class="fb__cta">
        <app-pixel-button tone="primary" (pressed)="next.emit()">{{
          nextLabel()
        }}</app-pixel-button>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      position: relative;
    }

    .fb {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 18px 14px;
      text-align: center;
      background: var(--panel);
      box-shadow:
        0 -4px 0 0 var(--border),
        0 4px 0 0 var(--border),
        -4px 0 0 0 var(--border),
        4px 0 0 0 var(--border);
      animation: pop-in 0.24s steps(4, end) both;
    }

    .fb--bad {
      animation:
        shake-x 0.36s steps(3, end) 1,
        pop-in 0.24s steps(4, end) both;
    }

    .fb__mark {
      margin: 0;
      font-family: var(--f-pixel);
      font-size: var(--t-md);
      letter-spacing: 0.1em;
      color: var(--accent);
    }

    .fb--bad .fb__mark {
      color: var(--lavender);
    }

    .fb__line {
      margin: 0;
      font-family: var(--f-text);
      font-size: var(--t-md);
      line-height: 1.5;
      white-space: pre-line;
      color: var(--text);
    }

    .fb__why {
      margin: 0;
      font-family: var(--f-text);
      font-size: var(--t-sm);
      line-height: 1.5;
      color: var(--text-dim);
    }

    .fb__cta {
      width: 100%;
      max-width: 280px;
      margin-top: 4px;
    }
  `,
})
export class AnswerFeedback {
  readonly correct = input.required<boolean>();
  readonly reaction = input('');
  readonly explanation = input('');
  readonly nextLabel = input<string>(CHAPTER_FOUR.buttons.next);
  readonly next = output<void>();

  protected readonly labels = CHAPTER_FOUR.labels;
}
