import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { SPRITES, SpriteName } from '../../core/sprites/pixel-sprites';

interface Px {
  readonly k: string;
  readonly x: number;
  readonly y: number;
  readonly f: string;
}

/** Renders a bitmap sprite as crisp SVG rects. Scales without ever blurring. */
@Component({
  selector: 'app-pixel-sprite',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      [attr.viewBox]="'0 0 ' + cols() + ' ' + rows().length"
      [attr.width]="cols() * scale()"
      [attr.height]="rows().length * scale()"
      aria-hidden="true"
      focusable="false"
    >
      @for (p of pixels(); track p.k) {
        <rect [attr.x]="p.x" [attr.y]="p.y" width="1.02" height="1.02" [attr.fill]="p.f" />
      }
    </svg>
  `,
  styles: `
    :host {
      display: inline-block;
      line-height: 0;
    }
  `,
})
export class PixelSprite {
  readonly name = input.required<SpriteName>();
  /** Size of one sprite pixel, in CSS pixels. */
  readonly scale = input(3);

  protected readonly rows = computed(() => SPRITES[this.name()].rows);
  protected readonly cols = computed(() => this.rows()[0]?.length ?? 0);

  protected readonly pixels = computed<Px[]>(() => {
    const sprite = SPRITES[this.name()];
    const palette: Record<string, string> = sprite.palette;
    const out: Px[] = [];
    sprite.rows.forEach((row, y) => {
      [...row].forEach((ch, x) => {
        const fill = palette[ch];
        if (!fill) return;
        out.push({ k: `${x}-${y}`, x, y, f: fill });
      });
    });
    return out;
  });
}
