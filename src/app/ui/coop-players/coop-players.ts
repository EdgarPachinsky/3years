import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PLAYERS } from '../../core/data/players';
import { PixelSprite } from '../pixel-sprite/pixel-sprite';
import { PixelHeart } from '../pixel-heart/pixel-heart';

/** Two little people who start apart and end up next to each other. */
@Component({
  selector: 'app-coop-players',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PixelSprite, PixelHeart],
  template: `
    <div class="duo" [class.duo--together]="together()">
      <figure class="p p--one">
        <app-pixel-sprite name="avatar" [scale]="scale()" />
        @if (showLabels()) {
          <figcaption>{{ players.one.label }}</figcaption>
        }
      </figure>

      <span class="link" aria-hidden="true">
        @if (together()) {
          <app-pixel-heart [scale]="3" [beat]="true" />
        } @else {
          <span class="link__dots">· · ·</span>
        }
      </span>

      <figure class="p p--two">
        <app-pixel-sprite name="avatar2" [scale]="scale()" />
        @if (showLabels()) {
          <figcaption>{{ players.two.label }}</figcaption>
        }
      </figure>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .duo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 26px;
      transition: gap 1.1s cubic-bezier(0.3, 0.8, 0.3, 1);
    }

    .duo--together {
      gap: 4px;
    }

    .p {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      margin: 0;
      transition: transform 1.1s cubic-bezier(0.3, 0.8, 0.3, 1);
    }

    .p--one {
      transform: translateX(-14px);
    }

    .p--two {
      transform: translateX(14px);
    }

    .duo--together .p--one,
    .duo--together .p--two {
      transform: translateX(0);
    }

    figcaption {
      font-family: var(--f-pixel);
      font-size: var(--t-xs);
      letter-spacing: 0.1em;
      color: var(--text-dim);
    }

    .link {
      display: grid;
      place-items: center;
      min-width: 26px;
      line-height: 0;
    }

    .link__dots {
      font-family: var(--f-ui);
      font-size: var(--t-md);
      color: var(--text-dim);
      opacity: 0.6;
    }
  `,
})
export class CoopPlayers {
  readonly together = input(false);
  readonly scale = input(4);
  readonly showLabels = input(true);
  protected readonly players = PLAYERS;
}
