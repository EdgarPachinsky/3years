import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  CHAPTER_FIVE,
  CHAPTER_FIVE_GENRES,
  CHAPTER_FIVE_ITEMS,
  CHAPTER_FIVE_LEVELS,
  CHAPTER_FIVE_QUESTS,
  CHAPTER_FIVE_STATS,
} from '../../../core/data/chapter-5-content';
import { PLAYERS } from '../../../core/data/players';
import { RelationshipStatId } from '../../../core/models/coop.models';
import { ChapterFiveService } from '../../../core/services/chapter-five.service';
import { GameStateService } from '../../../core/services/game-state.service';
import { AudioService } from '../../../core/services/audio.service';
import { CharacterCard } from '../../../ui/character-card/character-card';
import { ChoiceCard } from '../../../ui/choice-card/choice-card';
import { CoopPlayers } from '../../../ui/coop-players/coop-players';
import { InventoryPicker } from '../../../ui/inventory-picker/inventory-picker';
import { PixelButton } from '../../../ui/pixel-button/pixel-button';
import { PixelParticles } from '../../../ui/pixel-particles/pixel-particles';
import { QuestLog } from '../../../ui/quest-log/quest-log';
import { QuizProgress } from '../../../ui/quiz-progress/quiz-progress';
import { StatBars } from '../../../ui/stat-bars/stat-bars';
import { StatSlider } from '../../../ui/stat-slider/stat-slider';

type Stage =
  | 'intro'
  | 'build'
  | 'stats'
  | 'stats-result'
  | 'inventory'
  | 'genre'
  | 'genre-result'
  | 'quests'
  | 'quest-result'
  | 'coop'
  | 'message'
  | 'level'
  | 'level-result'
  | 'card'
  | 'complete';

/** CHAPTER 05 — she builds the two of us into a little RPG character. */
@Component({
  selector: 'app-chapter-five',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CharacterCard,
    ChoiceCard,
    CoopPlayers,
    InventoryPicker,
    PixelButton,
    PixelParticles,
    QuestLog,
    QuizProgress,
    StatBars,
    StatSlider,
  ],
  templateUrl: './chapter-five.html',
  styleUrl: './chapter-five.scss',
})
export class ChapterFive implements OnInit {
  private readonly game = inject(GameStateService);
  private readonly audio = inject(AudioService);
  protected readonly five = inject(ChapterFiveService);

  protected readonly copy = CHAPTER_FIVE;
  protected readonly players = PLAYERS;
  protected readonly statDefs = CHAPTER_FIVE_STATS;
  protected readonly items = CHAPTER_FIVE_ITEMS;
  protected readonly genres = CHAPTER_FIVE_GENRES;
  protected readonly quests = CHAPTER_FIVE_QUESTS;
  protected readonly levels = CHAPTER_FIVE_LEVELS;

  protected readonly stage = signal<Stage>('intro');
  protected readonly initProgress = signal(0);
  protected readonly statsReveal = signal(0);
  protected readonly together = signal(false);
  protected readonly coopStep = signal(0);
  protected readonly messageStep = signal(0);
  protected readonly cardReveal = signal(0);
  protected readonly viewingCard = signal(false);

  protected readonly pendingQuests = computed(() => {
    const quest = this.five.quest();
    return quest ? [quest] : [];
  });

  private readonly timers = new Set<ReturnType<typeof setTimeout>>();
  private ticker: ReturnType<typeof setInterval> | null = null;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.clear());
  }

  ngOnInit(): void {
    this.five.reset();
  }

  /* -------------------------------------------------------- navigation -- */

  protected begin(): void {
    this.audio.play('tap');
    this.stage.set('build');
    this.runBar(() => {
      this.audio.play('accept');
      this.together.set(true);
      this.at(this.game.beat(1400), () => this.go('stats'));
    });
  }

  protected setStat(id: RelationshipStatId, value: number): void {
    this.five.setStat(id, value);
  }

  protected statsDone(): void {
    this.audio.play('accept');
    this.stage.set('stats-result');
    this.animateStats();
  }

  protected toggleItem(id: string): void {
    this.five.toggleItem(id);
    this.audio.play('heart');
  }

  protected pickGenre(id: string): void {
    this.audio.play('tap');
    this.five.chooseGenre(id);
    this.at(this.game.beat(420), () => this.go('genre-result'));
  }

  protected pickQuest(id: string): void {
    this.audio.play('tap');
    this.five.chooseQuest(id);
    this.at(this.game.beat(420), () => this.go('quest-result'));
  }

  protected pickLevel(id: string): void {
    this.audio.play('tap');
    this.five.chooseLevel(id);
    this.at(this.game.beat(420), () => this.go('level-result'));
  }

  protected toCoop(): void {
    this.audio.play('tap');
    this.stage.set('coop');
    this.together.set(false);
    this.coopStep.set(0);
    this.at(this.game.beat(900), () => {
      this.together.set(true);
      this.audio.play('heart');
    });
    this.at(this.game.beat(2200), () => this.coopStep.set(1));
    this.at(this.game.beat(3400), () => {
      this.coopStep.set(2);
      this.audio.play('in');
    });
    this.at(this.game.beat(4700), () => {
      this.coopStep.set(3);
      this.audio.play('accept');
    });
    this.at(this.game.beat(6200), () => this.go('message'));
  }

  protected toMessage(): void {
    const lines = this.copy.message.lines.length;
    this.messageStep.set(1);
    for (let i = 2; i <= lines; i++) {
      this.at(this.game.beat((i - 1) * 1400), () => this.messageStep.set(i));
    }
    this.at(this.game.beat(lines * 1400), () => this.messageStep.set(lines + 1));
  }

  protected toCard(): void {
    this.audio.play('tap');
    this.stage.set('card');
    this.cardReveal.set(0);
    const steps = this.copy.card.steps.length;
    for (let i = 1; i <= steps; i++) {
      this.at(this.game.beat(i * 520), () => {
        this.cardReveal.set(i);
        this.audio.play('in');
      });
    }
    this.at(this.game.beat((steps + 1) * 520), () => this.audio.play('win'));
  }

  protected finish(): void {
    this.audio.play('tap');
    this.five.finish();
    this.stage.set('complete');
  }

  protected showCard(): void {
    this.audio.play('tap');
    this.viewingCard.set(true);
  }

  protected hideCard(): void {
    this.audio.play('tap');
    this.viewingCard.set(false);
  }

  protected leave(): void {
    this.game.go('chapter-teaser');
  }

  protected go(stage: Stage): void {
    this.stage.set(stage);
    if (stage === 'message') this.toMessage();
  }

  protected next(stage: Stage): void {
    this.audio.play('tap');
    this.go(stage);
  }

  /* ----------------------------------------------------------- helpers -- */

  protected statValue(id: RelationshipStatId): number {
    return this.five.stats()[id] ?? 50;
  }

  protected heartRow(): number[] {
    return Array.from({ length: this.copy.level.hearts }, (_, i) => i);
  }

  private runBar(done: () => void): void {
    this.initProgress.set(0);
    if (this.game.reduceMotion()) {
      this.initProgress.set(1);
      done();
      return;
    }
    let step = 0;
    const steps = 20;
    this.ticker = setInterval(() => {
      step += 1;
      this.initProgress.set(step / steps);
      if (step >= steps) {
        this.stopTicker();
        done();
      }
    }, 70);
  }

  private animateStats(): void {
    this.statsReveal.set(0);
    if (this.game.reduceMotion()) {
      this.statsReveal.set(1);
      return;
    }
    let step = 0;
    const steps = 22;
    this.ticker = setInterval(() => {
      step += 1;
      this.statsReveal.set(step / steps);
      if (step >= steps) this.stopTicker();
    }, 45);
  }

  private stopTicker(): void {
    if (this.ticker) clearInterval(this.ticker);
    this.ticker = null;
  }

  private at(ms: number, run: () => void): void {
    const id = setTimeout(() => {
      this.timers.delete(id);
      run();
    }, ms);
    this.timers.add(id);
  }

  private clear(): void {
    for (const id of this.timers) clearTimeout(id);
    this.timers.clear();
    this.stopTicker();
  }
}
