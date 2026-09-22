import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FINAL_BOXES, FINAL_CHAPTER } from '../../../core/data/final-chapter-content';
import { MysteryBox } from '../../../core/models/final.models';
import { FinalSurpriseService } from '../../../core/services/final-surprise.service';
import { GameStateService } from '../../../core/services/game-state.service';
import { AudioService } from '../../../core/services/audio.service';
import { AirpodsReveal } from '../../../ui/airpods-reveal/airpods-reveal';
import { MiniCatch } from '../../../ui/mini-catch/mini-catch';
import { MiniMath } from '../../../ui/mini-math/mini-math';
import { MiniMemory } from '../../../ui/mini-memory/mini-memory';
import { PasswordLock } from '../../../ui/password-lock/password-lock';
import { PixelButton } from '../../../ui/pixel-button/pixel-button';
import { PixelParticles } from '../../../ui/pixel-particles/pixel-particles';
import { QuizProgress } from '../../../ui/quiz-progress/quiz-progress';

type Stage =
  | 'locked'
  | 'granted'
  | 'boxes'
  | 'opening'
  | 'game'
  | 'calculating'
  | 'reveal'
  | 'messages'
  | 'ending';

/** FINAL CHAPTER — the locked room at the end of the story. */
@Component({
  selector: 'app-final-chapter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AirpodsReveal,
    MiniCatch,
    MiniMath,
    MiniMemory,
    PasswordLock,
    PixelButton,
    PixelParticles,
    QuizProgress,
  ],
  templateUrl: './final-chapter.html',
  styleUrl: './final-chapter.scss',
})
export class FinalChapter implements OnInit {
  private readonly game = inject(GameStateService);
  private readonly audio = inject(AudioService);
  protected readonly surprise = inject(FinalSurpriseService);

  protected readonly copy = FINAL_CHAPTER;
  protected readonly boxes = FINAL_BOXES;

  protected readonly stage = signal<Stage>('locked');
  protected readonly denied = signal(false);
  protected readonly attempt = signal('');
  protected readonly calc = signal(0);
  protected readonly messageStep = signal(0);
  protected readonly revealDone = signal(false);

  private readonly lock = viewChild(PasswordLock);
  protected readonly reduce = computed(() => this.game.reduceMotion());

  protected readonly box = computed(
    () => this.boxes.find((b) => b.id === this.surprise.boxId()) ?? null,
  );
  protected readonly canTry = computed(() => this.attempt().length === 4);

  private readonly timers = new Set<ReturnType<typeof setTimeout>>();
  private ticker: ReturnType<typeof setInterval> | null = null;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.clear());
  }

  ngOnInit(): void {
    // Pick up wherever this run left off.
    const s = this.surprise.state();
    if (!s.unlocked) this.stage.set('locked');
    else if (s.revealed) this.stage.set('ending');
    else if (!s.boxId) this.stage.set('boxes');
    else if (!s.gameDone) this.stage.set('game');
    else this.stage.set('reveal');
  }

  /* -------------------------------------------------------------- lock -- */

  protected onType(value: string): void {
    this.attempt.set(value);
    if (this.denied()) this.denied.set(false);
  }

  protected tryUnlock(): void {
    if (!this.canTry()) return;
    if (!this.surprise.check(this.attempt())) {
      this.audio.play('reject');
      this.denied.set(true);
      return;
    }
    this.audio.play('accept');
    this.stage.set('granted');
    this.runBar(() => this.at(this.game.beat(900), () => this.stage.set('boxes')));
  }

  protected retry(): void {
    this.audio.play('tap');
    this.denied.set(false);
    this.attempt.set('');
    this.lock()?.clear();
  }

  /* ------------------------------------------------------------- boxes -- */

  protected pickBox(box: MysteryBox): void {
    this.audio.play('accept');
    this.surprise.chooseBox(box.id);
    this.stage.set('opening');
    this.at(this.game.beat(1200), () => this.stage.set('game'));
  }

  protected gameDone(): void {
    this.surprise.finishGame();
    this.audio.play('win');
    this.stage.set('calculating');
    this.calc.set(0);
    this.runBar(() => this.at(this.game.beat(900), () => this.stage.set('reveal')));
  }

  /* ------------------------------------------------------------ reveal -- */

  protected onRevealDone(): void {
    this.revealDone.set(true);
  }

  protected toMessages(): void {
    this.audio.play('tap');
    this.stage.set('messages');
    this.messageStep.set(1);
    const total = this.copy.reveal.messages.length;
    for (let i = 2; i <= total + 1; i++) {
      this.at(this.game.beat((i - 1) * 1600), () => this.messageStep.set(i));
    }
  }

  protected toEnding(): void {
    this.audio.play('accept');
    this.surprise.markRevealed();
    this.game.completeStory();
    this.stage.set('ending');
  }

  protected toMenu(): void {
    this.audio.play('tap');
    this.game.openMenu();
  }

  /* ----------------------------------------------------------- helpers -- */

  private runBar(done: () => void): void {
    this.calc.set(0);
    if (this.reduce()) {
      this.calc.set(1);
      done();
      return;
    }
    let step = 0;
    const steps = 22;
    this.ticker = setInterval(() => {
      step += 1;
      this.calc.set(step / steps);
      if (step >= steps) {
        this.stopTicker();
        done();
      }
    }, 70);
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
