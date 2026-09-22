import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { CHAPTER_TWO_CHAT, CHAPTER_TWO_INTRO } from '../../../core/data/story.data';
import { GameStateService } from '../../../core/services/game-state.service';
import { AudioService } from '../../../core/services/audio.service';
import { StorySequence } from '../../../ui/story-sequence/story-sequence';
import { LevelScreen } from '../../../ui/level-screen/level-screen';
import { PixelParticles } from '../../../ui/pixel-particles/pixel-particles';
import { HiddenDigit } from '../../../ui/hidden-digit/hidden-digit';

/** NOVEMBER 14, 2020 — 9:01 PM. Warmer. More alive. She wrote first. */
@Component({
  selector: 'app-chapter-two',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StorySequence, LevelScreen, PixelParticles, HiddenDigit],
  template: `
    @if (phase() === 'card') {
      <div class="card" (click)="toChat()">
        <app-pixel-particles [count]="8" sprite="sparkle" />
        <app-level-screen
          [dateLabel]="intro.dateLabel"
          [timeLabel]="intro.timeLabel"
          [code]="intro.code"
          [title]="intro.title"
        />
        <p class="tap anim-blink">TAP TO CONTINUE</p>
      </div>
    } @else {
      <div class="win crt">
        <header class="win__bar">
          <span class="back" aria-hidden="true">‹</span>
          <span class="who">{{ chat.contactName }}</span>
          <app-hidden-digit [chapter]="2" prefix="CH." />
          <span class="dot" aria-hidden="true"></span>
        </header>

        <app-story-sequence
          [script]="chat.script"
          [dateLabel]="chat.dateLabel"
          (finished)="done()"
        />
      </div>
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
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 26px;
      flex: 1;
      min-height: 0;
      padding: 20px;
      cursor: pointer;
    }

    .tap {
      margin: 0;
      font-family: var(--f-ui);
      font-size: var(--t-xs);
      letter-spacing: 0.22em;
      color: var(--text-dim);
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
      padding: 12px;
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
  `,
})
export class ChapterTwo implements OnInit {
  private readonly game = inject(GameStateService);
  private readonly audio = inject(AudioService);

  protected readonly intro = CHAPTER_TWO_INTRO;
  protected readonly chat = CHAPTER_TWO_CHAT;
  protected readonly phase = signal<'card' | 'chat'>('card');

  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      if (this.timer) clearTimeout(this.timer);
    });
  }

  ngOnInit(): void {
    this.timer = setTimeout(() => this.toChat(), this.game.beat(3600));
  }

  protected toChat(): void {
    if (this.phase() === 'chat') return;
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
    this.audio.play('tap');
    this.phase.set('chat');
  }

  protected done(): void {
    this.game.go('memory-check');
  }
}
