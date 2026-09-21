import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CHAPTERS, MAIN_MENU } from '../../../core/data/story.data';
import { ChapterMeta } from '../../../core/models/story.models';
import { ChapterFiveService } from '../../../core/services/chapter-five.service';
import { GameStateService } from '../../../core/services/game-state.service';
import { AudioService } from '../../../core/services/audio.service';
import { ChapterMenu } from '../../../ui/chapter-menu/chapter-menu';
import { CharacterCard } from '../../../ui/character-card/character-card';
import { PixelButton } from '../../../ui/pixel-button/pixel-button';
import { PixelHeart } from '../../../ui/pixel-heart/pixel-heart';
import { PixelParticles } from '../../../ui/pixel-particles/pixel-particles';

/** The chapter list, reachable from anywhere in the story. */
@Component({
  selector: 'app-main-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ChapterMenu, CharacterCard, PixelButton, PixelHeart, PixelParticles],
  template: `
    @if (showingCard() && five.savedView(); as card) {
      <div class="wrap wrap--card">
        <app-pixel-particles [count]="8" sprite="heart" />
        <app-character-card
          [stats]="card.stats"
          [klass]="card.klass"
          [inventory]="card.inventory"
          [genre]="card.genre"
          [quest]="card.quest"
          [level]="card.level"
          [reveal]="8"
        />
        <div class="cta">
          <app-pixel-button tone="soft" (pressed)="closeCard()">{{
            copy.cardBack
          }}</app-pixel-button>
        </div>
      </div>
    } @else {
      <div class="wrap">
        <header class="head">
          <app-pixel-heart [scale]="5" [beat]="true" />
          <h1 class="title">{{ copy.title }}</h1>
          <p class="kicker">{{ copy.kicker }}</p>
        </header>

        @if (five.savedCard()) {
          <div class="card-cta">
            <app-pixel-button tone="primary" (pressed)="openCard()">{{
              copy.card
            }}</app-pixel-button>
          </div>
        }

        <app-chapter-menu
          [chapters]="chapters"
          [unlockedThrough]="game.unlockedThrough()"
          (picked)="play($event)"
        />

        <p class="hint">{{ copy.hint }}</p>

        <div class="cta">
          @if (game.returnScene()) {
            <app-pixel-button tone="primary" (pressed)="back()">↩ {{ copy.back }}</app-pixel-button>
          }
          <app-pixel-button tone="ghost" (pressed)="restart()"
            >↺ {{ copy.restart }}</app-pixel-button
          >
        </div>
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

    .wrap {
      position: relative;
      display: flex;
      flex: 1;
      min-height: 0;
      flex-direction: column;
      align-items: center;
      gap: 14px;
      padding: 12px 8px 20px;
      overflow-y: auto;
      text-align: center;
    }

    .head {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }

    .title {
      margin: 0;
      font-family: var(--f-pixel);
      font-size: var(--t-lg);
      color: var(--text);
      text-shadow: 0 4px 0 var(--border);
    }

    .kicker {
      margin: 0;
      font-family: var(--f-ui);
      font-size: var(--t-xs);
      letter-spacing: 0.24em;
      color: var(--text-dim);
    }

    .card-cta {
      width: 100%;
      max-width: 300px;
    }

    .hint {
      margin: 2px 0 0;
      font-family: var(--f-ui);
      font-size: var(--t-xs);
      letter-spacing: 0.1em;
      color: var(--text-dim);
      opacity: 0.7;
    }

    .cta {
      width: 100%;
      max-width: 300px;
      margin-top: auto;
      padding-top: 6px;
    }

    .wrap--card .cta {
      margin-top: 10px;
    }
  `,
})
export class MainMenu {
  protected readonly game = inject(GameStateService);
  protected readonly five = inject(ChapterFiveService);
  private readonly audio = inject(AudioService);

  protected readonly copy = MAIN_MENU;
  protected readonly chapters = CHAPTERS;
  protected readonly showingCard = signal(false);

  protected play(chapter: ChapterMeta): void {
    this.audio.play('tap');
    this.game.playChapter(chapter);
  }

  protected openCard(): void {
    this.audio.play('heart');
    this.showingCard.set(true);
  }

  protected closeCard(): void {
    this.audio.play('tap');
    this.showingCard.set(false);
  }

  protected back(): void {
    this.audio.play('tap');
    this.game.closeMenu();
  }

  protected restart(): void {
    this.audio.play('tap');
    this.game.restart();
  }
}
