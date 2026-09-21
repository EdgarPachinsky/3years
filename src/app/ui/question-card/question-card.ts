import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { QuizOption, QuizQuestion } from '../../core/models/story.models';
import { GameStateService } from '../../core/services/game-state.service';
import { AudioService } from '../../core/services/audio.service';
import { PixelButton } from '../pixel-button/pixel-button';
import { PixelSprite } from '../pixel-sprite/pixel-sprite';
import { PixelParticles } from '../pixel-particles/pixel-particles';

type QuizState = 'asking' | 'wrong' | 'correct';

@Component({
  selector: 'app-question-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PixelButton, PixelSprite, PixelParticles],
  template: `
    <section class="q">
      <p class="kicker">{{ question().kicker }}</p>

      <p class="prompt"><span class="caret anim-blink" aria-hidden="true">▌</span>{{ typed() }}</p>

      @if (state() === 'asking') {
        <div class="options">
          @for (o of question().options; track o.key) {
            <button type="button" class="opt" (click)="answer(o)">
              <span class="opt__key">{{ o.key }}</span>
              <span class="opt__text">{{ o.text }}</span>
            </button>
          }
        </div>
      }

      @if (state() === 'wrong') {
        <div class="panel panel--bad anim-pop">
          <p class="panel__title">{{ question().wrongTitle }}</p>
          <p class="panel__line">{{ question().wrongLine }}</p>
        </div>
        <app-pixel-button tone="soft" (pressed)="retry()">TRY AGAIN</app-pixel-button>
      }

      @if (state() === 'correct') {
        <app-pixel-particles [count]="12" sprite="heart" />
        <div class="panel panel--good anim-pop">
          <p class="burst">❤️ ❤️ ✨</p>
          <p class="panel__title">
            {{ question().correctTitle }}
            <span class="tick"><app-pixel-sprite name="check" [scale]="2" /></span>
          </p>
          <p class="panel__line">{{ question().correctLine }}</p>
        </div>
        <app-pixel-button tone="primary" (pressed)="solved.emit()">CONTINUE →</app-pixel-button>
      }
    </section>
  `,
  styles: `
    :host {
      display: block;
      position: relative;
    }

    .q {
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding: 4px;
    }

    .kicker {
      margin: 0;
      font-family: var(--f-pixel);
      font-size: var(--t-sm);
      letter-spacing: 0.18em;
      color: var(--accent);
      text-align: center;
    }

    .prompt {
      margin: 0;
      min-height: 2.4em;
      font-family: var(--f-text);
      font-size: var(--t-lg);
      line-height: 1.4;
      color: var(--text);
      text-align: center;
      overflow-wrap: anywhere;
    }

    .caret {
      color: var(--accent);
      margin-right: 4px;
    }

    .options {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .opt {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      min-height: var(--tap);
      padding: 14px 14px;
      text-align: left;
      background: var(--panel-2);
      border: 0;
      cursor: pointer;
      box-shadow:
        0 -4px 0 0 var(--border),
        0 4px 0 0 var(--border),
        -4px 0 0 0 var(--border),
        4px 0 0 0 var(--border),
        0 8px 0 0 rgb(0 0 0 / 40%);
      transition: transform 0.07s steps(2, end);
    }

    .opt:active {
      transform: translateY(5px);
      box-shadow:
        0 -4px 0 0 var(--border),
        0 4px 0 0 var(--border),
        -4px 0 0 0 var(--border),
        4px 0 0 0 var(--border);
    }

    .opt__key {
      flex: none;
      width: 30px;
      height: 30px;
      display: grid;
      place-items: center;
      font-family: var(--f-pixel);
      font-size: var(--t-sm);
      color: var(--border);
      background: var(--accent);
    }

    .opt__text {
      font-family: var(--f-text);
      font-size: var(--t-md);
      line-height: 1.45;
      color: var(--text);
      overflow-wrap: anywhere;
    }

    .panel {
      padding: 14px;
      text-align: center;
      background: var(--panel-2);
      box-shadow:
        0 -4px 0 0 var(--border),
        0 4px 0 0 var(--border),
        -4px 0 0 0 var(--border),
        4px 0 0 0 var(--border);
    }

    .panel--good {
      color: var(--text);
    }
    .panel--bad {
      animation:
        shake-x 0.4s steps(3, end) 1,
        pop-in 0.22s steps(4, end) both;
    }

    .burst {
      margin: 0 0 8px;
      font-size: var(--t-lg);
      letter-spacing: 0.1em;
    }

    .panel__title {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin: 0;
      font-family: var(--f-pixel);
      font-size: var(--t-sm);
      line-height: 1.6;
      color: var(--accent);
    }

    .panel--bad .panel__title {
      color: var(--lavender);
    }

    .tick {
      color: var(--accent);
      line-height: 0;
    }

    .panel__line {
      margin: 10px 0 0;
      font-family: var(--f-text);
      font-size: var(--t-md);
      line-height: 1.5;
      color: var(--text);
    }
  `,
})
export class QuestionCard implements OnInit {
  private readonly game = inject(GameStateService);
  private readonly audio = inject(AudioService);

  readonly question = input.required<QuizQuestion>();
  readonly solved = output<void>();

  protected readonly state = signal<QuizState>('asking');
  protected readonly typed = signal('');

  private timer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.stopTyping());
  }

  ngOnInit(): void {
    const text = this.question().prompt;
    if (this.game.reduceMotion()) {
      this.typed.set(text);
      return;
    }
    const chars = [...text];
    let i = 0;
    this.timer = setInterval(() => {
      i += 1;
      this.typed.set(chars.slice(0, i).join(''));
      if (i % 3 === 0) this.audio.play('type');
      if (i >= chars.length) this.stopTyping();
    }, 55);
  }

  protected answer(option: QuizOption): void {
    if (option.correct) {
      this.audio.play('win');
      this.state.set('correct');
    } else {
      this.audio.play('reject');
      this.state.set('wrong');
    }
  }

  protected retry(): void {
    this.audio.play('tap');
    this.state.set('asking');
  }

  private stopTyping(): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }
}
