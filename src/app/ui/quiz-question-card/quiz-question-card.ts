import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CATEGORY_LABELS } from '../../core/data/chapter-4-content';
import { QuizChoice, QuizRound } from '../../core/models/quiz.models';

const ICONS: Record<string, string> = {
  me: '❤️',
  her: '💕',
  both: '💞',
  custom: '▸',
};

@Component({
  selector: 'app-quiz-question-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="q">
      <p class="q__cat">{{ categoryLabel() }}</p>
      <p class="q__text">{{ round().question.text }}</p>

      <div class="q__opts">
        @for (option of round().options; track option.id) {
          <button type="button" class="opt" [disabled]="locked()" (click)="picked.emit(option.id)">
            <span class="opt__icon" aria-hidden="true">{{ icon(option) }}</span>
            <span class="opt__label">{{ option.label }}</span>
          </button>
        }
      </div>
    </article>
  `,
  styles: `
    :host {
      display: block;
    }

    .q {
      display: flex;
      flex-direction: column;
      gap: 14px;
      animation: rise-fade 0.32s ease-out both;
    }

    .q__cat {
      margin: 0;
      font-family: var(--f-pixel);
      font-size: var(--t-xs);
      letter-spacing: 0.2em;
      color: var(--accent);
      text-align: center;
    }

    .q__text {
      margin: 0;
      padding: 16px 14px;
      font-family: var(--f-text);
      font-size: var(--t-lg);
      line-height: 1.4;
      text-align: center;
      color: var(--text);
      overflow-wrap: anywhere;
      background: var(--panel);
      box-shadow:
        0 -4px 0 0 var(--border),
        0 4px 0 0 var(--border),
        -4px 0 0 0 var(--border),
        4px 0 0 0 var(--border);
    }

    .q__opts {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 4px;
    }

    .opt {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      min-height: var(--tap);
      padding: 14px;
      text-align: left;
      background: var(--panel-2);
      border: 0;
      cursor: pointer;
      box-shadow:
        0 -4px 0 0 var(--border),
        0 4px 0 0 var(--border),
        -4px 0 0 0 var(--border),
        4px 0 0 0 var(--border),
        0 8px 0 0 rgb(0 0 0 / 40%);
      transition: transform 0.07s steps(2, end);
    }

    .opt:active:not(:disabled) {
      transform: translateY(5px);
      box-shadow:
        0 -4px 0 0 var(--border),
        0 4px 0 0 var(--border),
        -4px 0 0 0 var(--border),
        4px 0 0 0 var(--border);
    }

    .opt:disabled {
      opacity: 0.5;
      cursor: default;
    }

    .opt__icon {
      flex: none;
      width: 28px;
      text-align: center;
      font-size: var(--t-md);
      color: var(--accent);
    }

    .opt__label {
      font-family: var(--f-text);
      font-size: var(--t-md);
      line-height: 1.4;
      color: var(--text);
      overflow-wrap: anywhere;
    }
  `,
})
export class QuizQuestionCard {
  readonly round = input.required<QuizRound>();
  readonly locked = input(false);
  readonly picked = output<string>();

  protected categoryLabel(): string {
    return CATEGORY_LABELS[this.round().question.category];
  }

  protected icon(option: QuizChoice): string {
    return ICONS[option.target ?? 'custom'] ?? '▸';
  }
}
