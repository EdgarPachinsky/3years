import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ChapterMeta } from '../../core/models/story.models';

/**
 * The level select. Every chapter that has been reached can be played again
 * from its own beginning; the rest stay locked.
 */
@Component({
  selector: 'app-chapter-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ul class="levels">
      @for (c of chapters(); track c.index) {
        <li>
          <button
            type="button"
            class="row"
            [class.row--open]="open(c)"
            [disabled]="!open(c)"
            (click)="pick(c)"
          >
            <span class="row__code">{{ c.code }}</span>
            <span class="row__title">{{ c.title }}</span>
            <span class="row__state">{{ open(c) ? 'PLAY ▸' : 'LOCKED' }}</span>
          </button>
        </li>
      }
    </ul>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
    }

    .levels {
      list-style: none;
      width: 100%;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .row {
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      gap: 10px;
      width: 100%;
      min-height: 50px;
      padding: 10px 12px;
      text-align: left;
      background: var(--panel);
      border: 0;
      opacity: 0.45;
      box-shadow: 0 0 0 3px var(--border);
    }

    .row--open {
      opacity: 1;
      cursor: pointer;
      box-shadow:
        0 0 0 3px var(--border),
        0 5px 0 0 rgb(0 0 0 / 40%);
      transition: transform 0.07s steps(2, end);
    }

    .row--open:active {
      transform: translateY(3px);
      box-shadow: 0 0 0 3px var(--border);
    }

    .row__code {
      font-family: var(--f-ui);
      font-size: var(--t-xs);
      letter-spacing: 0.1em;
      color: var(--accent);
    }

    .row__title {
      font-family: var(--f-text);
      font-size: var(--t-sm);
      line-height: 1.35;
      color: var(--text);
    }

    .row__state {
      font-family: var(--f-ui);
      font-size: var(--t-xs);
      letter-spacing: 0.1em;
      white-space: nowrap;
      color: var(--text-dim);
    }

    .row--open .row__state {
      color: var(--accent-2);
    }
  `,
})
export class ChapterMenu {
  readonly chapters = input.required<readonly ChapterMeta[]>();
  /** Highest chapter reached — anything at or below it can be replayed. */
  readonly unlockedThrough = input(1);
  readonly picked = output<ChapterMeta>();

  protected open(chapter: ChapterMeta): boolean {
    return chapter.playable && !!chapter.entry && chapter.index <= this.unlockedThrough();
  }

  protected pick(chapter: ChapterMeta): void {
    if (this.open(chapter)) this.picked.emit(chapter);
  }
}
