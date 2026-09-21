import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CHAPTER_FOUR } from '../../core/data/chapter-4-content';
import { QuizVerdict } from '../../core/models/quiz.models';
import { PixelButton } from '../pixel-button/pixel-button';
import { PixelParticles } from '../pixel-particles/pixel-particles';
import { QuizProgress } from '../quiz-progress/quiz-progress';

/** The score screen. Meant to be funny, never a judgement. */
@Component({
  selector: 'app-quiz-result',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PixelButton, PixelParticles, QuizProgress],
  template: `
    <div class="res">
      <app-pixel-particles [count]="14" sprite="heart" />

      <p class="res__restored">{{ labels.restored }}</p>

      <app-quiz-progress [value]="ratio()" [blocks]="20" />

      <p class="res__online">{{ labels.online }}</p>

      <div class="res__verdict">
        <p class="res__heading">{{ verdict().heading }}</p>
        <p class="res__status">{{ verdict().status }}</p>
        <p class="res__line">{{ verdict().line }}</p>
      </div>

      <p class="res__score">{{ correct() }} / {{ total() }}</p>

      <div class="res__cta">
        <app-pixel-button tone="primary" (pressed)="again.emit()">{{
          buttons.retry
        }}</app-pixel-button>
        <app-pixel-button tone="soft" (pressed)="onward.emit()">{{
          buttons.continue
        }}</app-pixel-button>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      position: relative;
      flex: 1;
      min-height: 0;
    }

    .res {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 14px;
      height: 100%;
      overflow-y: auto;
      padding: 14px 10px 20px;
      text-align: center;
    }

    app-quiz-progress {
      width: 100%;
    }

    .res__restored {
      margin: 0;
      font-family: var(--f-pixel);
      font-size: var(--t-sm);
      line-height: 1.6;
      letter-spacing: 0.08em;
      color: var(--accent);
    }

    .res__online {
      margin: 0;
      font-family: var(--f-ui);
      font-size: var(--t-sm);
      letter-spacing: 0.14em;
      color: var(--text);
    }

    .res__verdict {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 14px 12px;
      width: 100%;
      background: var(--panel);
      box-shadow:
        0 -4px 0 0 var(--border),
        0 4px 0 0 var(--border),
        -4px 0 0 0 var(--border),
        4px 0 0 0 var(--border);
    }

    .res__heading {
      margin: 0;
      font-family: var(--f-pixel);
      font-size: var(--t-sm);
      line-height: 1.6;
      color: var(--text-dim);
    }

    .res__status {
      margin: 0;
      font-family: var(--f-pixel);
      font-size: var(--t-md);
      line-height: 1.6;
      color: var(--accent);
    }

    .res__line {
      margin: 0;
      font-family: var(--f-text);
      font-size: var(--t-md);
      line-height: 1.5;
      white-space: pre-line;
      color: var(--text);
    }

    .res__score {
      margin: 0;
      font-family: var(--f-pixel);
      font-size: var(--t-xl);
      color: var(--accent-2);
    }

    .res__cta {
      width: 100%;
      max-width: 300px;
      margin-top: auto;
    }
  `,
})
export class QuizResult {
  readonly correct = input.required<number>();
  readonly total = input.required<number>();
  readonly verdict = input.required<QuizVerdict>();
  readonly again = output<void>();
  readonly onward = output<void>();

  protected readonly labels = CHAPTER_FOUR.labels;
  protected readonly buttons = CHAPTER_FOUR.buttons;
  protected readonly ratio = computed(() => (this.total() > 0 ? this.correct() / this.total() : 0));
}
