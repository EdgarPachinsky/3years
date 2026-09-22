import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { PixelParticles } from '../pixel-particles/pixel-particles';

/**
 * The case fades in, the lid swings open, the buds rise out.
 * Softer and rounder than the rest of the game on purpose — the reward should
 * feel like it came from somewhere nicer than the pixel world around it.
 */
@Component({
  selector: 'app-airpods-reveal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PixelParticles],
  template: `
    <div class="pods" [attr.data-step]="step()">
      <span class="glow" aria-hidden="true"></span>
      <span class="floor" aria-hidden="true"></span>

      @if (step() >= 3) {
        <app-pixel-particles [count]="10" sprite="sparkle" />
      }

      <div class="case" role="img" aria-label="AirPods case opening">
        <span class="bud bud--l" aria-hidden="true"></span>
        <span class="bud bud--r" aria-hidden="true"></span>
        <span class="body" aria-hidden="true"></span>
        <span class="lid" aria-hidden="true"></span>
        <span class="light" aria-hidden="true"></span>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .pods {
      position: relative;
      display: grid;
      place-items: center;
      min-height: 250px;
      padding: 26px 0 14px;
      perspective: 700px;
    }

    /* a soft warm halo that fades all the way out — no hard edge, no smudge */
    .glow {
      position: absolute;
      width: 280px;
      height: 280px;
      border-radius: 50%;
      background: radial-gradient(
        circle at 50% 50%,
        rgb(255 210 168 / 22%) 0%,
        rgb(255 210 168 / 10%) 30%,
        rgb(255 210 168 / 3%) 52%,
        transparent 72%
      );
      opacity: 0;
      transition: opacity 0.9s ease;
    }

    /* the case casts a small, soft shadow so it sits somewhere instead of floating */
    .floor {
      position: absolute;
      bottom: 22px;
      width: 120px;
      height: 18px;
      border-radius: 50%;
      background: radial-gradient(
        ellipse at 50% 50%,
        rgb(0 0 0 / 40%) 0%,
        rgb(0 0 0 / 14%) 45%,
        transparent 72%
      );
      opacity: 0;
      transition: opacity 0.9s ease;
    }

    .pods[data-step='0'] .glow,
    .pods[data-step='0'] .floor {
      opacity: 0;
    }
    .pods:not([data-step='0']) .glow,
    .pods:not([data-step='0']) .floor {
      opacity: 1;
    }

    .case {
      position: relative;
      width: 128px;
      height: 98px;
      transform-style: preserve-3d;
      opacity: 0;
      transform: translateY(14px) scale(0.9);
      transition:
        opacity 0.7s ease,
        transform 0.7s cubic-bezier(0.2, 0.8, 0.3, 1);
    }

    .pods:not([data-step='0']) .case {
      opacity: 1;
      transform: translateY(0) scale(1);
    }

    .body {
      position: absolute;
      inset: auto 0 0;
      height: 72px;
      border-radius: 24px;
      background:
        linear-gradient(
          100deg,
          rgb(0 0 0 / 7%) 0%,
          transparent 16%,
          transparent 84%,
          rgb(0 0 0 / 9%) 100%
        ),
        linear-gradient(180deg, #ffffff 0%, #f2f3f7 42%, #dfe1e8 100%);
      box-shadow:
        inset 0 2px 2px rgb(255 255 255 / 95%),
        inset 0 -3px 6px rgb(0 0 0 / 10%),
        0 12px 24px rgb(0 0 0 / 40%);
      z-index: 3;
    }

    /* the seam where the lid meets the case */
    .body::after {
      content: '';
      position: absolute;
      inset: 0 0 auto;
      height: 3px;
      border-radius: 24px 24px 0 0;
      background: linear-gradient(
        90deg,
        transparent,
        rgb(0 0 0 / 14%) 22%,
        rgb(0 0 0 / 14%) 78%,
        transparent
      );
    }

    .lid {
      position: absolute;
      inset: 16px 0 auto;
      height: 32px;
      border-radius: 22px 22px 6px 6px;
      background: linear-gradient(180deg, #eceef3 0%, #ffffff 100%);
      box-shadow:
        inset 0 -2px 3px rgb(255 255 255 / 90%),
        0 -6px 14px rgb(0 0 0 / 22%);
      transform-origin: bottom center;
      transform: rotateX(0deg);
      transition: transform 0.85s cubic-bezier(0.3, 0.9, 0.3, 1);
      z-index: 4;
    }

    .pods[data-step='2'] .lid,
    .pods[data-step='3'] .lid,
    .pods[data-step='4'] .lid {
      transform: rotateX(-112deg);
    }

    .bud {
      position: absolute;
      bottom: 34px;
      width: 24px;
      height: 24px;
      border-radius: 50% 50% 44% 44%;
      background: linear-gradient(165deg, #ffffff 0%, #f4f5f9 55%, #e2e4ea 100%);
      box-shadow:
        inset 0 1px 1px rgb(255 255 255 / 95%),
        0 4px 10px rgb(0 0 0 / 32%);
      opacity: 0;
      transform: translateY(10px);
      transition:
        transform 0.8s cubic-bezier(0.2, 0.9, 0.3, 1),
        opacity 0.4s ease;
      z-index: 2;
    }

    /* the stem */
    .bud::after {
      content: '';
      position: absolute;
      top: 19px;
      left: 50%;
      width: 9px;
      height: 32px;
      border-radius: 0 0 5px 5px;
      background: linear-gradient(90deg, #e6e8ee 0%, #fbfbfd 38%, #ffffff 52%, #e0e2e9 100%);
      transform: translateX(-50%);
    }

    /* the speaker grille on the front of the bud */
    .bud::before {
      content: '';
      position: absolute;
      top: 7px;
      left: 50%;
      width: 9px;
      height: 4px;
      border-radius: 2px;
      background: rgb(120 126 138 / 35%);
      transform: translateX(-50%);
      z-index: 2;
    }

    .bud--l {
      left: 28px;
    }
    .bud--r {
      right: 28px;
    }

    .pods[data-step='3'] .bud,
    .pods[data-step='4'] .bud {
      opacity: 1;
      /* high enough that the stems clear the case and read as AirPods */
      transform: translateY(-52px);
    }

    .pods[data-step='3'] .bud--r,
    .pods[data-step='4'] .bud--r {
      transition-delay: 0.12s;
    }

    /* the little status light */
    .light {
      position: absolute;
      left: 50%;
      bottom: 18px;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #9aa0a6;
      transform: translateX(-50%);
      z-index: 5;
      transition:
        background 0.5s ease,
        box-shadow 0.5s ease;
    }

    .pods[data-step='3'] .light,
    .pods[data-step='4'] .light {
      background: #5ad07a;
      box-shadow: 0 0 10px 2px rgb(90 208 122 / 70%);
    }

    @media (prefers-reduced-motion: reduce) {
      .case,
      .lid,
      .bud,
      .glow,
      .floor,
      .light {
        transition: none !important;
      }
    }
  `,
})
export class AirpodsReveal implements OnInit {
  readonly instant = input(false);
  readonly done = output<void>();

  protected readonly step = signal(0);

  private readonly timers = new Set<ReturnType<typeof setTimeout>>();

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      for (const id of this.timers) clearTimeout(id);
      this.timers.clear();
    });
  }

  ngOnInit(): void {
    if (this.instant()) {
      this.step.set(4);
      this.done.emit();
      return;
    }
    this.at(200, () => this.step.set(1));
    this.at(1100, () => this.step.set(2));
    this.at(2100, () => this.step.set(3));
    this.at(3200, () => {
      this.step.set(4);
      this.done.emit();
    });
  }

  private at(ms: number, run: () => void): void {
    const id = setTimeout(() => {
      this.timers.delete(id);
      run();
    }, ms);
    this.timers.add(id);
  }
}
