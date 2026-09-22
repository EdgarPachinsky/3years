import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CHAPTER_FOUR } from '../../../core/data/chapter-4-content';
import { QuizAnswer, QuizRun } from '../../../core/models/quiz.models';
import { ChapterFourQuizService } from '../../../core/services/chapter-four-quiz.service';
import { GameStateService } from '../../../core/services/game-state.service';
import { AudioService } from '../../../core/services/audio.service';
import { AnswerFeedback } from '../../../ui/answer-feedback/answer-feedback';
import { PixelButton } from '../../../ui/pixel-button/pixel-button';
import { PixelParticles } from '../../../ui/pixel-particles/pixel-particles';
import { QuizProgress } from '../../../ui/quiz-progress/quiz-progress';
import { HiddenDigit } from '../../../ui/hidden-digit/hidden-digit';
import { QuizQuestionCard } from '../../../ui/quiz-question-card/quiz-question-card';
import { QuizResult } from '../../../ui/quiz-result/quiz-result';

type Phase = 'intro' | 'question' | 'feedback' | 'result';

/** CHAPTER 04 — a different quiz every time it is played. */
@Component({
  selector: 'app-chapter-four',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AnswerFeedback,
    PixelButton,
    PixelParticles,
    QuizProgress,
    QuizQuestionCard,
    QuizResult,
    HiddenDigit,
  ],
  template: `
    @switch (phase()) {
      @case ('intro') {
        <div class="intro">
          <app-pixel-particles [count]="7" sprite="sparkle" />

          <p class="intro__code">{{ copy.code }}</p>
          <h1 class="intro__title">{{ copy.title }}</h1>
          <p class="intro__sub">{{ copy.subtitle }}</p>

          <section class="db">
            <p class="db__head">{{ copy.database.heading }}</p>
            <div class="db__rule"></div>
            @for (row of copy.database.rows; track row.label) {
              <app-quiz-progress
                [label]="row.label"
                [value]="(row.percent / 100) * sync()"
                [blocks]="12"
                [showPercent]="false"
              />
            }
            <div class="db__rule"></div>
            <p class="db__sync" [class.anim-blink]="!ready()">
              {{ ready() ? copy.database.ready : copy.database.syncing }}
            </p>
          </section>

          @if (ready()) {
            <div class="intro__cta anim-rise">
              <app-pixel-button tone="primary" (pressed)="start()">
                {{ copy.buttons.start }}
              </app-pixel-button>
            </div>
          }
        </div>
      }

      @case ('result') {
        <app-quiz-result
          [correct]="score()"
          [total]="total()"
          [verdict]="verdict()"
          (again)="playAgain()"
          (onward)="leave()"
        />
      }

      @default {
        <div class="play">
          <header class="bar">
            <span class="sector"><app-hidden-digit [chapter]="4" prefix="SECTOR " /></span>
            <app-quiz-progress
              [label]="copy.labels.database"
              [caption]="pad(index() + 1) + ' / ' + pad(total())"
              [value]="databaseValue()"
              [status]="glitch() ? copy.labels.corrupted : ''"
              [glitch]="glitch()"
            />
          </header>

          <div class="stage">
            @if (phase() === 'question' && current(); as round) {
              <app-quiz-question-card [round]="round" (picked)="answer($event)" />
            }
            @if (phase() === 'feedback') {
              <app-answer-feedback
                [correct]="lastCorrect()"
                [reaction]="lastReaction()"
                [explanation]="lastExplanation()"
                [nextLabel]="isLast() ? copy.buttons.continue : copy.buttons.next"
                (next)="advance()"
              />
            }
          </div>
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

    .intro {
      position: relative;
      display: flex;
      flex: 1;
      min-height: 0;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 14px;
      padding: 16px 12px;
      overflow-y: auto;
      text-align: center;
    }

    .intro__code {
      margin: 0;
      font-family: var(--f-ui);
      font-size: var(--t-sm);
      letter-spacing: 0.3em;
      color: var(--text-dim);
    }

    .intro__title {
      margin: 0;
      font-family: var(--f-pixel);
      font-size: var(--t-lg);
      line-height: 1.5;
      color: var(--text);
      text-shadow: 0 4px 0 var(--border);
    }

    .intro__sub {
      margin: 0;
      font-family: var(--f-text);
      font-size: var(--t-md);
      line-height: 1.5;
      white-space: pre-line;
      color: var(--text-dim);
    }

    .db {
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 100%;
      max-width: 320px;
      padding: 14px 12px;
      background: var(--panel);
      box-shadow:
        0 -4px 0 0 var(--border),
        0 4px 0 0 var(--border),
        -4px 0 0 0 var(--border),
        4px 0 0 0 var(--border);
    }

    .db__head {
      margin: 0;
      font-family: var(--f-pixel);
      font-size: var(--t-xs);
      letter-spacing: 0.14em;
      color: var(--accent);
    }

    .db__rule {
      height: 3px;
      background: repeating-linear-gradient(90deg, var(--text-dim) 0 3px, transparent 3px 6px);
      opacity: 0.5;
    }

    .db__sync {
      margin: 0;
      font-family: var(--f-ui);
      font-size: var(--t-xs);
      letter-spacing: 0.2em;
      color: var(--text-dim);
    }

    .intro__cta {
      width: 100%;
      max-width: 300px;
    }

    .play {
      display: flex;
      flex: 1;
      min-height: 0;
      flex-direction: column;
      gap: 12px;
      padding: 4px 0 0;
    }

    .bar {
      position: relative;
      flex: none;
      /* line the progress bar up with the cards below it */
      padding: 0 6px;
    }

    .sector {
      position: absolute;
      right: 2px;
      bottom: -6px;
      z-index: 2;
    }

    /*
     * overflow-y: auto makes overflow-x: auto too, and that clips at the
     * padding box — so the pixel borders, which are box-shadows painted 4px
     * OUTSIDE each card, need horizontal padding here or they get cut off.
     */
    .stage {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 0 6px 8px;
    }
  `,
})
export class ChapterFour implements OnInit {
  private readonly game = inject(GameStateService);
  private readonly audio = inject(AudioService);
  private readonly quiz = inject(ChapterFourQuizService);

  protected readonly copy = CHAPTER_FOUR;
  protected readonly phase = signal<Phase>('intro');
  protected readonly sync = signal(0);
  protected readonly ready = signal(false);
  protected readonly glitch = signal(false);

  private readonly run = signal<QuizRun | null>(null);
  protected readonly index = signal(0);
  private readonly answers = signal<QuizAnswer[]>([]);

  protected readonly lastCorrect = signal(false);
  protected readonly lastReaction = signal('');
  protected readonly lastExplanation = signal('');

  protected readonly total = computed(() => this.run()?.rounds.length ?? 0);
  protected readonly current = computed(() => this.run()?.rounds[this.index()] ?? null);
  protected readonly score = computed(() => this.answers().filter((a) => a.correct).length);
  protected readonly isLast = computed(() => this.index() >= this.total() - 1);
  protected readonly databaseValue = computed(() =>
    this.total() > 0 ? this.score() / this.total() : 0,
  );
  protected readonly verdict = computed(() => this.quiz.verdict(this.score(), this.total()));

  private readonly timers = new Set<ReturnType<typeof setTimeout>>();
  private ticker: ReturnType<typeof setInterval> | null = null;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.clear());
  }

  ngOnInit(): void {
    this.bootDatabase();
  }

  protected start(): void {
    this.audio.play('tap');
    this.newRun();
  }

  protected answer(optionId: string): void {
    const round = this.current();
    if (!round || this.phase() !== 'question') return;

    const correct = optionId === round.question.correctOptionId;
    this.answers.update((all) => [
      ...all,
      { questionId: round.question.id, chosenOptionId: optionId, correct },
    ]);
    this.lastCorrect.set(correct);
    this.lastReaction.set(this.quiz.reaction(round.question, correct));
    this.lastExplanation.set(round.question.explanation ?? '');
    this.audio.play(correct ? 'win' : 'reject');

    if (!correct) {
      this.glitch.set(true);
      this.at(this.game.beat(900), () => this.glitch.set(false));
    }

    this.phase.set('feedback');
  }

  protected advance(): void {
    this.audio.play('tap');
    if (this.isLast()) {
      this.phase.set('result');
      this.audio.play('accept');
      return;
    }
    this.index.update((i) => i + 1);
    this.phase.set('question');
  }

  protected playAgain(): void {
    this.audio.play('tap');
    this.newRun();
  }

  protected leave(): void {
    this.game.go('chapter-five');
  }

  protected pad(n: number): string {
    return n < 10 ? `0${n}` : `${n}`;
  }

  /* ------------------------------------------------------------ private -- */

  private newRun(): void {
    this.run.set(this.quiz.generate());
    this.index.set(0);
    this.answers.set([]);
    this.glitch.set(false);
    this.phase.set('question');
  }

  /** The little boot-up sequence on the intro screen. */
  private bootDatabase(): void {
    if (this.game.reduceMotion()) {
      this.sync.set(1);
      this.ready.set(true);
      return;
    }
    let step = 0;
    const steps = 24;
    this.ticker = setInterval(() => {
      step += 1;
      this.sync.set(Math.min(1, step / steps));
      if (step >= steps) {
        this.stopTicker();
        this.at(600, () => this.ready.set(true));
      }
    }, 60);
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
