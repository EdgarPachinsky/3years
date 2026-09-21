import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CHAPTER_TEASER, CHAPTERS } from '../../../core/data/story.data';
import { ChapterMeta } from '../../../core/models/story.models';
import { GameStateService } from '../../../core/services/game-state.service';
import { AudioService } from '../../../core/services/audio.service';
import { PixelButton } from '../../../ui/pixel-button/pixel-button';
import { PixelHeart } from '../../../ui/pixel-heart/pixel-heart';
import { PixelParticles } from '../../../ui/pixel-particles/pixel-particles';
import { ChapterMenu } from '../../../ui/chapter-menu/chapter-menu';

/** End of the playable build — the next levels are still being written. */
@Component({
  selector: 'app-chapter-teaser',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PixelButton, PixelHeart, PixelParticles, ChapterMenu],
  template: `
    <div class="wrap">
      <app-pixel-particles [count]="7" sprite="heart" />

      <p class="status anim-blink">{{ teaser.status }}</p>
      <app-pixel-heart [scale]="7" [beat]="true" />

      <div class="next">
        <p class="next__code">{{ teaser.code }}</p>
        <p class="next__title">{{ teaser.title }}</p>
      </div>

      <p class="line">{{ teaser.line }}</p>

      <p class="pick">PICK A CHAPTER</p>
      <app-chapter-menu
        [chapters]="chapters"
        [unlockedThrough]="game.unlockedThrough()"
        (picked)="play($event)"
      />

      <p class="hint">{{ teaser.hint }}</p>
      <div class="cta">
        <app-pixel-button tone="ghost" (pressed)="restart()"
          >↺ PLAY FROM THE START</app-pixel-button
        >
      </div>
    </div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0;
    }

    .wrap {
      position: relative;
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 18px 14px 24px;
      text-align: center;
    }

    .status {
      margin: 0;
      font-family: var(--f-ui);
      font-size: var(--t-sm);
      letter-spacing: 0.2em;
      color: var(--text-dim);
    }

    .next {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .next__code {
      margin: 0;
      font-family: var(--f-ui);
      font-size: var(--t-sm);
      letter-spacing: 0.3em;
      color: var(--text-dim);
    }
    .next__title {
      margin: 0;
      font-family: var(--f-pixel);
      font-size: var(--t-lg);
      color: var(--text);
      text-shadow: 0 4px 0 var(--border);
    }

    .line {
      margin: 0;
      font-family: var(--f-text);
      font-size: var(--t-md);
      color: var(--text);
    }

    .pick {
      margin: 10px 0 0;
      font-family: var(--f-ui);
      font-size: var(--t-xs);
      letter-spacing: 0.22em;
      color: var(--text-dim);
    }

    .hint {
      margin: 8px 0 0;
      font-family: var(--f-ui);
      font-size: var(--t-xs);
      letter-spacing: 0.12em;
      color: var(--text-dim);
      opacity: 0.7;
    }

    .cta {
      width: 100%;
      max-width: 300px;
    }
  `,
})
export class ChapterTeaser {
  protected readonly game = inject(GameStateService);
  private readonly audio = inject(AudioService);

  protected readonly teaser = CHAPTER_TEASER;
  protected readonly chapters = CHAPTERS;

  protected play(chapter: ChapterMeta): void {
    this.audio.play('tap');
    this.game.playChapter(chapter);
  }

  protected restart(): void {
    this.audio.play('tap');
    this.game.restart();
  }
}
