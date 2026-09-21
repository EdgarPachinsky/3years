import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/** A big tappable card. Used for game genres, side quests and next levels. */
@Component({
  selector: 'app-choice-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      class="card"
      [class.card--on]="selected()"
      [class.card--dim]="dimmed()"
      (click)="picked.emit()"
    >
      <span class="card__icon" aria-hidden="true">{{ icon() }}</span>
      <span class="card__body">
        <span class="card__title">{{ title() }}</span>
        @if (subtitle()) {
          <span class="card__sub">{{ subtitle() }}</span>
        }
      </span>
    </button>
  `,
  styles: `
    :host {
      display: block;
    }

    .card {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      min-height: var(--tap);
      padding: 14px 12px;
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
      transition:
        transform 0.12s steps(2, end),
        opacity 0.25s ease;
    }

    .card:active {
      transform: translateY(5px);
      box-shadow:
        0 -4px 0 0 var(--border),
        0 4px 0 0 var(--border),
        -4px 0 0 0 var(--border),
        4px 0 0 0 var(--border);
    }

    .card--on {
      transform: scale(1.02);
      background: var(--panel);
      box-shadow:
        0 -4px 0 0 var(--accent),
        0 4px 0 0 var(--accent),
        -4px 0 0 0 var(--accent),
        4px 0 0 0 var(--accent);
    }

    .card--dim {
      opacity: 0.35;
    }

    .card__icon {
      flex: none;
      width: 34px;
      font-size: var(--t-lg);
      text-align: center;
    }

    .card__body {
      display: flex;
      flex-direction: column;
      gap: 3px;
      min-width: 0;
    }

    .card__title {
      font-family: var(--f-ui);
      font-size: var(--t-sm);
      letter-spacing: 0.08em;
      line-height: 1.4;
      color: var(--text);
    }

    .card__sub {
      font-family: var(--f-text);
      font-size: var(--t-sm);
      line-height: 1.4;
      color: var(--text-dim);
    }
  `,
})
export class ChoiceCard {
  readonly icon = input('');
  readonly title = input('');
  readonly subtitle = input('');
  readonly selected = input(false);
  readonly dimmed = input(false);
  readonly picked = output<void>();
}
