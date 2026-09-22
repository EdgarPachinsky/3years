import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CHAPTER_THREE, CHAPTER_THREE_PHOTOS } from '../../../core/data/story.data';
import { MosaicPhoto } from '../../../core/models/story.models';
import { GameStateService } from '../../../core/services/game-state.service';
import { AudioService } from '../../../core/services/audio.service';
import { pickSome } from '../../../core/util/shuffle';
import { LevelScreen } from '../../../ui/level-screen/level-screen';
import { MosaicBoard } from '../../../ui/mosaic-board/mosaic-board';
import { PixelButton } from '../../../ui/pixel-button/pixel-button';
import { PixelParticles } from '../../../ui/pixel-particles/pixel-particles';
import { HiddenDigit } from '../../../ui/hidden-digit/hidden-digit';

type Phase = 'intro' | 'loading' | 'playing' | 'solved' | 'outro';

/** CHAPTER 03 — four of our photos, in pieces, waiting to be put back. */
@Component({
  selector: 'app-chapter-three',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LevelScreen, MosaicBoard, PixelButton, PixelParticles, HiddenDigit],
  template: `
    @switch (phase()) {
      @case ('intro') {
        <div class="card" (click)="begin()">
          <app-pixel-particles [count]="8" sprite="sparkle" />
          <app-level-screen [code]="copy.code" [title]="copy.title" />
          <p class="kicker">{{ copy.kicker }}</p>
          <p class="tap anim-blink">TAP TO CONTINUE</p>
        </div>
      }

      @case ('outro') {
        <div class="card">
          <app-pixel-particles [count]="12" sprite="heart" />
          <p class="found">{{ copy.outroTitle }}</p>
          <p class="line">{{ copy.outroLine }}</p>
          <div class="cta">
            <app-pixel-button tone="primary" (pressed)="leave()">
              {{ copy.cta }} →
            </app-pixel-button>
          </div>
        </div>
      }

      @default {
        <div class="play">
          <header class="bar">
            <span class="bar__label">MOSAIC {{ pad(round() + 1) }} / {{ pad(total) }}</span>
            <app-hidden-digit [chapter]="3" prefix="REEL " />
            @if (grid() > 2 && phase() === 'playing') {
              <button
                type="button"
                class="peek"
                (pointerdown)="peek(true)"
                (pointerup)="peek(false)"
                (pointercancel)="peek(false)"
                (pointerleave)="peek(false)"
                (contextmenu)="$event.preventDefault()"
              >
                HOLD TO PEEK
              </button>
            }
          </header>

          <div class="stage">
            @if (phase() === 'loading') {
              <p class="loading anim-blink">{{ copy.loading }}</p>
            } @else {
              <app-mosaic-board
                [photo]="photo()"
                [grid]="grid()"
                [peeking]="peeking()"
                (solvedChange)="onSolved()"
              />
            }
          </div>

          <footer class="foot">
            @if (phase() === 'solved') {
              <p class="found anim-pop">{{ copy.solvedTitle }} ✓</p>
              <p class="line">{{ line() }}</p>
              <div class="cta">
                <app-pixel-button tone="primary" (pressed)="next()">
                  {{ copy.next }} →
                </app-pixel-button>
              </div>
            } @else {
              <p class="hint">{{ copy.hint }}</p>
            }
          </footer>
        </div>
      }
    }
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0;
    }

    .card {
      position: relative;
      display: flex;
      flex: 1;
      min-height: 0;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 18px;
      padding: 20px;
      text-align: center;
    }

    .kicker,
    .tap {
      margin: 0;
      font-family: var(--f-ui);
      font-size: var(--t-xs);
      letter-spacing: 0.2em;
      color: var(--text-dim);
    }

    .play {
      display: flex;
      flex: 1;
      min-height: 0;
      flex-direction: column;
      gap: 10px;
      padding: 2px 2px 0;
    }

    .bar {
      display: flex;
      flex: none;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      min-height: 44px;
    }

    .bar__label {
      font-family: var(--f-pixel);
      font-size: var(--t-sm);
      letter-spacing: 0.1em;
      color: var(--accent);
    }

    .peek {
      min-height: 40px;
      padding: 8px 12px;
      font-family: var(--f-ui);
      font-size: var(--t-xs);
      letter-spacing: 0.12em;
      color: var(--text-dim);
      background: transparent;
      border: 3px solid var(--panel-2);
      cursor: pointer;
      user-select: none;
      touch-action: none;
    }

    .peek:active {
      color: var(--accent);
      border-color: var(--accent);
    }

    .stage {
      position: relative;
      display: flex;
      flex: 1;
      min-height: 0;
      align-items: center;
      justify-content: center;
    }

    .loading,
    .hint {
      margin: 0;
      font-family: var(--f-ui);
      font-size: var(--t-xs);
      letter-spacing: 0.16em;
      text-align: center;
      color: var(--text-dim);
    }

    .foot {
      flex: none;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      min-height: 76px;
      padding: 6px 0 2px;
    }

    .found {
      margin: 0;
      font-family: var(--f-pixel);
      font-size: var(--t-sm);
      line-height: 1.6;
      letter-spacing: 0.08em;
      color: var(--accent);
    }

    .line {
      margin: 0;
      font-family: var(--f-text);
      font-size: var(--t-md);
      color: var(--text);
      text-align: center;
    }

    .cta {
      width: 100%;
      max-width: 280px;
    }
  `,
})
export class ChapterThree implements OnInit {
  private readonly game = inject(GameStateService);
  private readonly audio = inject(AudioService);

  protected readonly copy = CHAPTER_THREE;
  protected readonly total = CHAPTER_THREE.rounds.length;

  /** Four different photos, fresh every time the chapter is played. */
  private readonly photos: MosaicPhoto[] = pickSome(
    CHAPTER_THREE_PHOTOS,
    CHAPTER_THREE.rounds.length,
  );

  protected readonly phase = signal<Phase>('intro');
  protected readonly round = signal(0);
  protected readonly peeking = signal(false);
  /** The title card ignores taps for a moment, so a double tap cannot skip it. */
  protected readonly canSkip = signal(false);

  protected readonly photo = computed(() => this.photos[this.round()]);
  protected readonly grid = computed(() => this.copy.rounds[this.round()]);
  protected readonly line = computed(() => this.copy.solvedLines[this.round()]);

  private readonly timers = new Set<ReturnType<typeof setTimeout>>();

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      for (const id of this.timers) clearTimeout(id);
      this.timers.clear();
    });
  }

  ngOnInit(): void {
    this.at(this.game.beat(900), () => this.canSkip.set(true));
    this.at(this.game.beat(5000), () => this.start());
    this.warm(0);
  }

  /** From a tap on the title card. */
  protected begin(): void {
    if (!this.canSkip()) return;
    this.audio.play('tap');
    this.start();
  }

  private start(): void {
    if (this.phase() !== 'intro') return;
    this.load(0);
  }

  protected onSolved(): void {
    this.peeking.set(false);
    this.at(this.game.beat(700), () => this.phase.set('solved'));
  }

  protected next(): void {
    this.audio.play('tap');
    const nextRound = this.round() + 1;
    if (nextRound >= this.total) {
      this.phase.set('outro');
      return;
    }
    this.round.set(nextRound);
    this.load(nextRound);
  }

  protected leave(): void {
    this.game.go('chapter-four');
  }

  protected peek(on: boolean): void {
    if (this.phase() !== 'playing') return;
    this.peeking.set(on);
  }

  protected pad(n: number): string {
    return n < 10 ? `0${n}` : `${n}`;
  }

  /** Hold on the loading card until the photo is actually decoded. */
  private load(index: number): void {
    this.phase.set('loading');
    this.peeking.set(false);
    this.warm(index + 1);

    let ready = false;
    let held = false;
    const open = () => {
      if (ready && held && this.round() === index) this.phase.set('playing');
    };

    const img = new Image();
    img.onload = () => {
      ready = true;
      open();
    };
    img.onerror = () => {
      ready = true;
      open();
    };
    img.src = this.photos[index].src;

    this.at(this.game.beat(700), () => {
      held = true;
      open();
    });
  }

  /** Quietly fetch the next photo while she is busy with this one. */
  private warm(index: number): void {
    const photo = this.photos[index];
    if (!photo) return;
    const img = new Image();
    img.src = photo.src;
  }

  private at(ms: number, run: () => void): void {
    const id = setTimeout(() => {
      this.timers.delete(id);
      run();
    }, ms);
    this.timers.add(id);
  }
}
