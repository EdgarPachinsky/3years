import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { CHAPTER_ONE_CHAT, CHAPTER_ONE_OUTRO } from '../../../core/data/story.data';
import { GameStateService } from '../../../core/services/game-state.service';
import { AudioService } from '../../../core/services/audio.service';
import { StorySequence } from '../../../ui/story-sequence/story-sequence';
import { PixelButton } from '../../../ui/pixel-button/pixel-button';

/** JUNE 7, 2019 — 10:35 PM. Something small just started. */
@Component({
  selector: 'app-chapter-one',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StorySequence, PixelButton],
  template: `
    <div class="win crt">
      <header class="win__bar">
        <span class="back" aria-hidden="true">‹</span>
        <span class="who">{{ chat.contactName }}</span>
        <span class="dot" aria-hidden="true"></span>
      </header>

      <app-story-sequence
        [script]="chat.script"
        [dateLabel]="chat.dateLabel"
        (finished)="startOutro()"
      />

      @if (step() > 0) {
        <div class="outro">
          <p class="dots anim-blink">...</p>

          @if (step() >= 2) {
            <p class="beat anim-rise">{{ outro.beat }}</p>
            <p class="when anim-rise">
              {{ outro.dateLabel }}<br />
              <span class="when__time">{{ outro.timeLabel }}</span>
            </p>
          }

          @if (step() >= 3) {
            <ul class="lines">
              @for (line of outro.lines; track line; let i = $index) {
                <li class="anim-pop" [style.animation-delay.ms]="i * 260">{{ line }}</li>
              }
            </ul>
          }

          @if (step() >= 4) {
            <div class="cta anim-rise">
              <app-pixel-button tone="primary" (pressed)="next()"
                >{{ outro.cta }} →</app-pixel-button
              >
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0;
    }

    .win {
      position: relative;
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0;
      margin: 0 4px;
      overflow: hidden;
      background: var(--screen);
      box-shadow:
        0 -4px 0 0 var(--border),
        0 4px 0 0 var(--border),
        -4px 0 0 0 var(--border),
        4px 0 0 0 var(--border);
    }

    .win__bar {
      display: flex;
      align-items: center;
      gap: 10px;
      flex: none;
      padding: 12px 12px;
      background: var(--panel-2);
      border-bottom: 4px solid var(--border);
    }

    .back {
      font-family: var(--f-pixel);
      font-size: var(--t-md);
      color: var(--text-dim);
    }

    .who {
      flex: 1;
      font-family: var(--f-pixel);
      font-size: var(--t-sm);
      letter-spacing: 0.12em;
      color: var(--text);
    }

    .dot {
      width: 8px;
      height: 8px;
      background: var(--accent);
    }

    .outro {
      position: absolute;
      inset: 0;
      z-index: 20;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      padding: 24px 18px;
      text-align: center;
      background: rgb(17 9 22 / 98%);
      animation: rise-fade 0.5s ease-out both;
      overflow-y: auto;
    }

    .dots {
      margin: 0;
      font-family: var(--f-pixel);
      font-size: var(--t-lg);
      color: var(--text-dim);
      letter-spacing: 0.2em;
    }

    .beat {
      margin: 0;
      font-family: var(--f-text);
      font-size: var(--t-lg);
      line-height: 1.5;
      color: var(--text);
    }

    .when {
      margin: 0;
      font-family: var(--f-ui);
      font-size: var(--t-sm);
      letter-spacing: 0.16em;
      line-height: 2;
      color: var(--text-dim);
    }

    .when__time {
      color: var(--accent);
    }

    .lines {
      list-style: none;
      margin: 6px 0 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .lines li {
      font-family: var(--f-pixel);
      font-size: var(--t-sm);
      line-height: 1.6;
      letter-spacing: 0.1em;
      color: var(--text);
      animation-fill-mode: both;
    }

    .lines li:last-child {
      color: var(--accent);
    }

    .cta {
      width: 100%;
      max-width: 280px;
      margin-top: 8px;
    }
  `,
})
export class ChapterOne {
  private readonly game = inject(GameStateService);
  private readonly audio = inject(AudioService);

  protected readonly chat = CHAPTER_ONE_CHAT;
  protected readonly outro = CHAPTER_ONE_OUTRO;
  protected readonly step = signal(0);

  private readonly timers = new Set<ReturnType<typeof setTimeout>>();

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      for (const id of this.timers) clearTimeout(id);
      this.timers.clear();
    });
  }

  protected startOutro(): void {
    this.step.set(1);
    this.at(this.game.beat(1400), () => this.step.set(2));
    this.at(this.game.beat(3200), () => this.step.set(3));
    this.at(this.game.beat(4600), () => this.step.set(4));
  }

  protected next(): void {
    this.audio.play('tap');
    this.game.go('glitch');
  }

  private at(ms: number, run: () => void): void {
    const id = setTimeout(() => {
      this.timers.delete(id);
      run();
    }, ms);
    this.timers.add(id);
  }
}
