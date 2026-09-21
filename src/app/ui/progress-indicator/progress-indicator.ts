import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { PixelHeart } from '../pixel-heart/pixel-heart';

/** A trail of tiny pixel hearts — progress without a corporate progress bar. */
@Component({
  selector: 'app-progress-indicator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PixelHeart],
  template: `
    <div class="trail" [attr.aria-label]="earned() + ' of ' + total() + ' chapters'">
      @for (slot of slots(); track slot.i) {
        <app-pixel-heart [scale]="2" [dim]="!slot.on" [beat]="slot.latest" />
      }
      <span class="count">{{ pad(earned()) }} / {{ pad(total()) }}</span>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .trail {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .count {
      margin-left: 4px;
      font-family: var(--f-ui);
      font-size: var(--t-xs);
      letter-spacing: 0.14em;
      color: var(--text-dim);
    }
  `,
})
export class ProgressIndicator {
  readonly earned = input(0);
  readonly total = input(6);

  protected readonly slots = computed(() =>
    Array.from({ length: this.total() }, (_, i) => ({
      i,
      on: i < this.earned(),
      latest: i === this.earned() - 1,
    })),
  );

  protected pad(n: number): string {
    return n < 10 ? `0${n}` : `${n}`;
  }
}
