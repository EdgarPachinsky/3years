import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PixelSprite } from '../pixel-sprite/pixel-sprite';

@Component({
  selector: 'app-pixel-heart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PixelSprite],
  template: `<app-pixel-sprite name="heart" [scale]="scale()" />`,
  styles: `
    :host {
      display: inline-block;
      line-height: 0;
      color: var(--accent);
      transition:
        color 0.3s ease,
        opacity 0.3s ease;
    }

    :host([data-dim='true']) {
      color: var(--text-dim);
      opacity: 0.35;
    }
    :host([data-beat='true']) {
      animation: heart-beat 1.4s steps(3, end) infinite;
    }

    @keyframes heart-beat {
      0%,
      100% {
        transform: scale(1);
      }
      12% {
        transform: scale(1.18);
      }
      24% {
        transform: scale(1);
      }
      36% {
        transform: scale(1.12);
      }
      48% {
        transform: scale(1);
      }
    }
  `,
  host: {
    '[attr.data-dim]': 'dim()',
    '[attr.data-beat]': 'beat()',
  },
})
export class PixelHeart {
  readonly scale = input(3);
  readonly dim = input(false);
  readonly beat = input(false);
}
