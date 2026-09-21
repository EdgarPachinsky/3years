import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { InventoryItem } from '../../core/models/coop.models';

interface Slot {
  readonly index: number;
  readonly item: InventoryItem | null;
}

/** A twelve-slot RPG bag, plus the things that can go in it. */
@Component({
  selector: 'app-inventory-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="inv">
      <div class="grid">
        @for (slot of slots(); track slot.index) {
          <div class="cell" [class.cell--full]="!!slot.item">
            @if (slot.item; as item) {
              <span class="cell__icon anim-pop" [title]="item.title">{{ item.icon }}</span>
            }
          </div>
        }
      </div>

      <p class="count">
        {{ counterLabel() }} <span class="count__n">{{ chosen().length }} / {{ limit() }}</span>
      </p>

      <div class="items">
        @for (item of items(); track item.id) {
          <button
            type="button"
            class="chip"
            [class.chip--on]="isChosen(item.id)"
            [class.chip--off]="!isChosen(item.id) && chosen().length >= limit()"
            [attr.aria-pressed]="isChosen(item.id)"
            (click)="toggled.emit(item.id)"
          >
            <span class="chip__icon" aria-hidden="true">{{ item.icon }}</span>
            <span class="chip__label">{{ item.title }}</span>
          </button>
        }
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .inv {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 4px;
      padding: 4px;
      background: var(--border);
    }

    .cell {
      aspect-ratio: 1;
      display: grid;
      place-items: center;
      background: var(--screen);
      box-shadow: inset 0 0 0 3px var(--panel-2);
      transition: box-shadow 0.2s ease;
    }

    .cell--full {
      background: var(--panel);
      box-shadow: inset 0 0 0 3px var(--accent);
    }

    .cell__icon {
      font-size: var(--t-lg);
      line-height: 1;
    }

    .count {
      display: flex;
      justify-content: space-between;
      margin: 0;
      font-family: var(--f-ui);
      font-size: var(--t-xs);
      letter-spacing: 0.16em;
      color: var(--text-dim);
    }

    .count__n {
      color: var(--accent);
    }

    .items {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
    }

    .chip {
      display: flex;
      align-items: center;
      gap: 8px;
      min-height: 48px;
      padding: 10px 8px;
      text-align: left;
      background: var(--panel-2);
      border: 0;
      cursor: pointer;
      box-shadow: 0 0 0 3px var(--border);
      transition:
        transform 0.1s steps(2, end),
        opacity 0.2s ease;
    }

    .chip:active {
      transform: translateY(2px);
    }

    .chip--on {
      background: var(--panel);
      box-shadow: 0 0 0 3px var(--accent);
    }

    .chip--off {
      opacity: 0.4;
    }

    .chip__icon {
      flex: none;
      font-size: var(--t-md);
    }

    .chip__label {
      font-family: var(--f-ui);
      font-size: var(--t-xs);
      letter-spacing: 0.06em;
      line-height: 1.3;
      color: var(--text);
      overflow-wrap: anywhere;
    }
  `,
})
export class InventoryPicker {
  readonly items = input.required<readonly InventoryItem[]>();
  readonly chosen = input.required<readonly InventoryItem[]>();
  readonly limit = input(5);
  readonly cells = input(12);
  readonly counterLabel = input('SELECTED');
  readonly toggled = output<string>();

  protected readonly slots = computed<Slot[]>(() => {
    const picked = this.chosen();
    return Array.from({ length: this.cells() }, (_, index) => ({
      index,
      item: picked[index] ?? null,
    }));
  });

  protected isChosen(id: string): boolean {
    return this.chosen().some((item) => item.id === id);
  }
}
