import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { PixelSprite } from '../pixel-sprite/pixel-sprite';
import { SpriteName } from '../../core/sprites/pixel-sprites';

interface Particle {
  readonly k: number;
  readonly left: number;
  readonly delay: number;
  readonly dur: number;
  readonly scale: number;
  readonly hue: string;
}

const HUES = ['var(--accent)', 'var(--strawberry)', 'var(--lavender)', 'var(--orange)'];

/** A drift of little pixel hearts / sparkles floating up through the screen. */
@Component({
  selector: 'app-pixel-particles',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PixelSprite],
  template: `
    @for (p of particles(); track p.k) {
      <span
        class="p"
        [style.left.%]="p.left"
        [style.animation-delay.ms]="p.delay"
        [style.animation-duration.ms]="p.dur"
        [style.color]="p.hue"
        [style.transform]="'scale(' + p.scale + ')'"
      >
        <app-pixel-sprite [name]="sprite()" [scale]="3" />
      </span>
    }
  `,
  styles: `
    :host {
      position: absolute;
      inset: 0;
      overflow: hidden;
      pointer-events: none;
      z-index: 30;
    }

    .p {
      position: absolute;
      bottom: 12%;
      line-height: 0;
      opacity: 0;
      animation-name: float-up;
      animation-timing-function: steps(14, end);
      animation-fill-mode: both;
    }
  `,
})
export class PixelParticles {
  readonly count = input(10);
  readonly sprite = input<SpriteName>('heart');
  readonly spread = input(1);

  protected readonly particles = computed<Particle[]>(() => {
    const n = this.count();
    const out: Particle[] = [];
    for (let i = 0; i < n; i++) {
      out.push({
        k: i,
        left: 8 + ((i * 37) % 84),
        delay: (i % 5) * 160 + ((i * 53) % 220),
        dur: 1800 + ((i * 311) % 1400),
        scale: 0.8 + (i % 4) * 0.18,
        hue: HUES[i % HUES.length],
      });
    }
    return out;
  });
}
