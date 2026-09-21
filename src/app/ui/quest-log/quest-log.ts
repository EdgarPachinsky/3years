import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Quest } from '../../core/models/coop.models';

/** The RPG quest board: what is done, and what is still waiting. */
@Component({
  selector: 'app-quest-log',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="log">
      <header class="log__head">{{ heading() }}</header>
      <ul class="log__list">
        @for (quest of done(); track quest.id) {
          <li class="row row--done">
            <span class="row__mark" aria-hidden="true">✓</span>
            <span class="row__title">{{ quest.title }}</span>
          </li>
        }
        @for (quest of pending(); track quest.id) {
          <li class="row row--new">
            <span class="row__mark" aria-hidden="true">○</span>
            <span class="row__title">{{ quest.title }}</span>
          </li>
        }
        @for (slot of blanks(); track slot) {
          <li class="row row--empty">
            <span class="row__mark" aria-hidden="true">○</span>
            <span class="row__title">____________________</span>
          </li>
        }
      </ul>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }

    .log {
      background: var(--panel);
      box-shadow:
        0 -4px 0 0 var(--border),
        0 4px 0 0 var(--border),
        -4px 0 0 0 var(--border),
        4px 0 0 0 var(--border);
    }

    .log__head {
      padding: 10px;
      font-family: var(--f-pixel);
      font-size: var(--t-xs);
      letter-spacing: 0.16em;
      text-align: center;
      color: var(--accent);
      background: var(--panel-2);
      border-bottom: 4px solid var(--border);
    }

    .log__list {
      list-style: none;
      margin: 0;
      padding: 10px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .row {
      display: flex;
      align-items: baseline;
      gap: 10px;
      font-family: var(--f-ui);
      font-size: var(--t-xs);
      letter-spacing: 0.06em;
      line-height: 1.4;
    }

    .row__mark {
      flex: none;
      width: 14px;
    }

    .row--done {
      color: var(--text);
    }

    .row--done .row__mark {
      color: var(--accent);
    }

    .row--new {
      color: var(--accent-2);
      animation: rise-fade 0.4s ease-out both;
    }

    .row--empty {
      color: var(--text-dim);
      opacity: 0.55;
    }

    .row__title {
      overflow-wrap: anywhere;
    }
  `,
})
export class QuestLog {
  readonly heading = input('OUR QUEST LOG');
  readonly done = input.required<readonly Quest[]>();
  readonly pending = input<readonly Quest[]>([]);
  readonly blankSlots = input(3);

  protected blanks(): number[] {
    const n = Math.max(0, this.blankSlots() - this.pending().length);
    return Array.from({ length: n }, (_, i) => i);
  }
}
