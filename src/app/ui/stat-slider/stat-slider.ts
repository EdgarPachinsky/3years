import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RelationshipStat } from '../../core/models/coop.models';

/**
 * One relationship stat. A real range input, so touch dragging and
 * accessibility both come for free.
 */
@Component({
  selector: 'app-stat-slider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="s" [class.s--fixed]="fixed()">
      <p class="s__title">
        <span class="s__icon" aria-hidden="true">{{ stat().icon }}</span>
        {{ stat().title }}
      </p>

      <div class="s__row">
        <span class="s__end">{{ stat().minLabel }}</span>
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          [value]="value()"
          [disabled]="fixed()"
          [attr.aria-label]="stat().title"
          (input)="onInput($event)"
        />
        <span class="s__end">{{ stat().maxLabel }}</span>
      </div>

      <p class="s__val">{{ fixed() ? 'NOT ADJUSTABLE 😏' : value() + '%' }}</p>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .s {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 12px;
      background: var(--panel);
      box-shadow:
        0 -4px 0 0 var(--border),
        0 4px 0 0 var(--border),
        -4px 0 0 0 var(--border),
        4px 0 0 0 var(--border);
    }

    .s--fixed {
      opacity: 0.85;
    }

    .s__title {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
      font-family: var(--f-ui);
      font-size: var(--t-sm);
      letter-spacing: 0.08em;
      line-height: 1.4;
      color: var(--text);
    }

    .s__icon {
      font-size: var(--t-md);
    }

    .s__row {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .s__end {
      flex: none;
      min-width: 34px;
      font-family: var(--f-ui);
      font-size: var(--t-xs);
      letter-spacing: 0.06em;
      text-align: center;
      color: var(--text-dim);
    }

    .s__val {
      margin: 0;
      font-family: var(--f-pixel);
      font-size: var(--t-xs);
      text-align: right;
      color: var(--accent);
    }

    input[type='range'] {
      flex: 1;
      min-width: 0;
      height: 44px;
      margin: 0;
      background: transparent;
      appearance: none;
      cursor: pointer;
      touch-action: pan-y;
    }

    input[type='range']::-webkit-slider-runnable-track {
      height: 10px;
      background: var(--screen);
      box-shadow: 0 0 0 3px var(--border);
    }

    input[type='range']::-moz-range-track {
      height: 10px;
      background: var(--screen);
      box-shadow: 0 0 0 3px var(--border);
    }

    input[type='range']::-webkit-slider-thumb {
      appearance: none;
      width: 22px;
      height: 22px;
      margin-top: -6px;
      background: var(--accent);
      box-shadow: 0 0 0 3px var(--border);
      border: 0;
      border-radius: 0;
    }

    input[type='range']::-moz-range-thumb {
      width: 22px;
      height: 22px;
      background: var(--accent);
      box-shadow: 0 0 0 3px var(--border);
      border: 0;
      border-radius: 0;
    }

    input[type='range']:disabled::-webkit-slider-thumb {
      background: var(--accent-2);
      cursor: default;
    }

    input[type='range']:disabled::-moz-range-thumb {
      background: var(--accent-2);
      cursor: default;
    }
  `,
})
export class StatSlider {
  readonly stat = input.required<RelationshipStat>();
  readonly value = input(50);
  readonly changed = output<number>();

  protected readonly fixed = computed(() => this.stat().fixed !== undefined);

  protected onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.changed.emit(Number(target.value));
  }
}
