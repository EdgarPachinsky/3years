import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CHAPTER_FIVE, CHAPTER_FIVE_STATS } from '../../core/data/chapter-5-content';
import { PLAYERS } from '../../core/data/players';
import {
  CharacterClass,
  GameGenre,
  InventoryItem,
  NextLevelChoice,
  Quest,
  StatValues,
} from '../../core/models/coop.models';
import { StatBars } from '../stat-bars/stat-bars';

/** The collectible at the end. Everything on it came from her choices. */
@Component({
  selector: 'app-character-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StatBars],
  template: `
    <article class="card">
      <header class="card__top">{{ copy.title }}</header>

      @if (reveal() >= 2) {
        <p class="card__players anim-pop">
          {{ players.one.label }} <span class="plus">+</span> {{ players.two.label }}
        </p>
      }

      @if (reveal() >= 3 && klass(); as k) {
        <div class="block anim-rise">
          <p class="block__label">{{ copy.classLabel }}</p>
          <p class="block__value">{{ k.title }}</p>
          <p class="card__level">{{ copy.levelLabel }}</p>
        </div>
      }

      @if (reveal() >= 4) {
        <div class="block anim-rise">
          <app-stat-bars [stats]="stats()" [definitions]="definitions" [blocks]="16" />
        </div>
      }

      @if (reveal() >= 5 && inventory().length) {
        <div class="block anim-rise">
          <p class="block__label">{{ copy.inventoryLabel }}</p>
          <p class="card__icons">
            @for (item of inventory(); track item.id) {
              <span>{{ item.icon }}</span>
            }
          </p>
        </div>
      }

      @if (reveal() >= 6 && genre(); as g) {
        <div class="block anim-rise">
          <p class="block__label">{{ copy.genreLabel }}</p>
          <p class="block__value">{{ g.icon }} {{ g.title }}</p>
        </div>
      }

      @if (reveal() >= 7 && quest(); as q) {
        <div class="block anim-rise">
          <p class="block__label">{{ copy.questLabel }}</p>
          <p class="block__value">{{ q.title }}</p>
        </div>
      }

      @if (reveal() >= 8 && level(); as l) {
        <div class="block anim-rise">
          <p class="block__label">{{ copy.nextLabel }}</p>
          <p class="block__value">{{ l.icon }} {{ l.resultText }}</p>
        </div>
      }

      @if (reveal() >= 8 && klass(); as k) {
        <div class="block block--skill anim-rise">
          <p class="block__label">{{ copy.skillLabel }}</p>
          <p class="card__skill">{{ k.skill }}</p>
        </div>
      }
    </article>
  `,
  styles: `
    :host {
      display: block;
    }

    .card {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 14px 12px 18px;
      background: var(--panel);
      box-shadow:
        0 -5px 0 0 var(--accent),
        0 5px 0 0 var(--accent),
        -5px 0 0 0 var(--accent),
        5px 0 0 0 var(--accent),
        0 0 0 9px var(--border);
    }

    .card__top {
      font-family: var(--f-pixel);
      font-size: var(--t-md);
      letter-spacing: 0.08em;
      text-align: center;
      color: var(--accent);
    }

    .card__players {
      margin: 0;
      font-family: var(--f-pixel);
      font-size: var(--t-lg);
      text-align: center;
      color: var(--text);
    }

    .plus {
      color: var(--accent-2);
    }

    .block {
      display: flex;
      flex-direction: column;
      gap: 5px;
      padding: 10px;
      background: var(--panel-2);
      box-shadow: 0 0 0 3px var(--border);
    }

    .block--skill {
      background: var(--screen);
    }

    .block__label {
      margin: 0;
      font-family: var(--f-ui);
      font-size: var(--t-xs);
      letter-spacing: 0.2em;
      color: var(--text-dim);
    }

    .block__value {
      margin: 0;
      font-family: var(--f-ui);
      font-size: var(--t-sm);
      letter-spacing: 0.06em;
      line-height: 1.4;
      color: var(--text);
      overflow-wrap: anywhere;
    }

    .card__level {
      margin: 0;
      font-family: var(--f-pixel);
      font-size: var(--t-xs);
      color: var(--accent-2);
    }

    .card__icons {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin: 0;
      font-size: var(--t-lg);
    }

    .card__skill {
      margin: 0;
      font-family: var(--f-text);
      font-size: var(--t-md);
      line-height: 1.5;
      color: var(--text);
    }
  `,
})
export class CharacterCard {
  readonly stats = input.required<StatValues>();
  readonly klass = input<CharacterClass | null>(null);
  readonly inventory = input<readonly InventoryItem[]>([]);
  readonly genre = input<GameGenre | null>(null);
  readonly quest = input<Quest | null>(null);
  readonly level = input<NextLevelChoice | null>(null);
  /** 0 to 8 — lets the card assemble itself one row at a time. */
  readonly reveal = input(8);

  protected readonly copy = CHAPTER_FIVE.card;
  protected readonly players = PLAYERS;
  protected readonly definitions = CHAPTER_FIVE_STATS;
}
