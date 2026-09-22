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
      <span class="chip__text">{{ prefix() }}{{ digit() }}</span>
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
      line-height: 0;
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
      opacity: 0.55;
      transition:
        opacity 0.25s ease,
        color 0.25s ease;
    }

    .chip:active {
      transform: translateY(1px);
    }

    .chip--found {
      opacity: 1;
      color: var(--accent);
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
