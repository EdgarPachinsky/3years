import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { DigitChapter } from '../../core/models/final.models';
import { FinalSurpriseService } from '../../core/services/final-surprise.service';
import { AudioService } from '../../core/services/audio.service';
import { PixelParticles } from '../pixel-particles/pixel-particles';

/**
 * A little number tucked into a chapter's own furniture — a model number, a
 * sector, a reel. It reads as part of the machine until she taps it.
 */
@Component({
  selector: 'app-hidden-digit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PixelParticles],
  template: `
    <button
      type="button"
      class="chip"
      [class.chip--found]="found()"
      [attr.aria-label]="found() ? 'Hidden digit found' : 'Something is written here'"
      (click)="take()"
    >
      <span class="chip__text">
        <span class="chip__prefix">{{ prefix() }}</span
        ><span class="chip__digit">{{ digit() }}</span>
      </span>
      @if (found()) {
        <span class="chip__tick" aria-hidden="true">✓</span>
      }
    </button>

    @if (celebrating()) {
      <span class="burst" aria-hidden="true">
        <app-pixel-particles [count]="6" sprite="sparkle" />
      </span>
      <span class="toast">HIDDEN DIGIT FOUND ✓</span>
    }
  `,
  styles: `
    :host {
      position: relative;
      display: inline-block;
      line-height: 1;
    }

    .chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      min-width: 34px;
      min-height: 30px;
      padding: 5px 7px;
      font-family: var(--f-ui);
      font-size: var(--t-xs);
      letter-spacing: 0.1em;
      color: var(--text-dim);
      background: transparent;
      border: 0;
      cursor: pointer;
      opacity: 0.9;
      transition:
        opacity 0.25s ease,
        color 0.25s ease;
    }

    /* a dotted rule under the whole tag says "this one can be tapped" */
    .chip__text {
      /* the host sits on line-height: 0 — give the text its own box back so
         the dotted rule lands under it, not through it */
      line-height: 1.4;
      padding-bottom: 2px;
      white-space: pre;
      border-bottom: 2px dotted var(--text-dim);
    }

    /* the number itself reads a shade warmer than the label around it */
    .chip__digit {
      color: var(--accent);
      animation: digit-hint 2.6s ease-in-out infinite;
    }

    /* a slow, quiet breath — enough to catch the eye, not enough to shout */
    @keyframes digit-hint {
      0%,
      100% {
        opacity: 0.75;
        text-shadow: none;
      }
      50% {
        opacity: 1;
        text-shadow: 0 0 6px var(--glow);
      }
    }

    .chip:active {
      transform: translateY(1px);
    }

    .chip--found {
      opacity: 1;
      color: var(--accent);
    }

    /* once it is collected it stops asking for attention */
    .chip--found .chip__text {
      border-bottom-color: transparent;
    }

    .chip--found .chip__digit {
      animation: none;
      opacity: 1;
    }

    .chip__tick {
      font-size: var(--t-xs);
    }

    .burst {
      position: absolute;
      inset: -30px -20px;
      pointer-events: none;
    }

    .toast {
      position: absolute;
      top: calc(100% + 6px);
      right: 0;
      z-index: 50;
      display: block;
      padding: 6px 8px;
      font-family: var(--f-pixel);
      font-size: var(--t-xs);
      letter-spacing: 0.06em;
      white-space: nowrap;
      color: var(--border);
      background: var(--accent);
      box-shadow: 0 0 0 3px var(--border);
      animation: pop-in 0.24s steps(4, end) both;
    }
  `,
})
export class HiddenDigit {
  private readonly surprise = inject(FinalSurpriseService);
  private readonly audio = inject(AudioService);

  readonly chapter = input.required<DigitChapter>();
  /** Makes it look like part of the machine: 'PX-', 'SECTOR ', 'REEL '. */
  readonly prefix = input('');

  protected readonly celebrating = signal(false);
  protected readonly digit = computed(() => this.surprise.digitFor(this.chapter()));
  protected readonly found = computed(() => this.surprise.found()[this.chapter() - 1]);

  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      if (this.timer) clearTimeout(this.timer);
    });
  }

  protected take(): void {
    const isNew = this.surprise.discover(this.chapter());
    if (!isNew) return;
    this.audio.play('win');
    this.celebrating.set(true);
    this.timer = setTimeout(() => this.celebrating.set(false), 1900);
  }
}
