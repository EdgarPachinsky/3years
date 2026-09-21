import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  output,
  signal,
} from '@angular/core';
import { CHAPTER_ONE_CHAT, GLITCH_SCRIPT, chapterMessages } from '../../core/data/story.data';
import { GameStateService } from '../../core/services/game-state.service';
import { AudioService } from '../../core/services/audio.service';

type Phase = 'interrupted' | 'error' | 'fragments' | 'lost' | 'reconnect' | 'restored';

const BARS = 16;
const SHARD_COLORS = ['var(--accent)', 'var(--lavender)', 'var(--cream)', 'var(--soft-red)'];

/**
 * The break in the timeline. Everything that happened between June 2019 and
 * November 2020 is told here, and only here, without a single word of it.
 */
@Component({
  selector: 'app-glitch-transition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="glitch" [attr.data-phase]="phase()">
      @if (ghostVisible()) {
        <div class="ghost" aria-hidden="true">
          @for (g of ghosts; track g.id) {
            <span class="gb" [class.gb--me]="g.me" [style.--d]="g.i">{{ g.text }}</span>
          }
        </div>
      }

      <div class="bars" aria-hidden="true"></div>

      @if (phase() === 'fragments') {
        <div class="shards" aria-hidden="true">
          @for (s of shards; track s.k) {
            <i
              [style.animation-delay.ms]="s.d"
              [style.--tx]="s.x"
              [style.--ty]="s.y"
              [style.width.px]="s.s"
              [style.height.px]="s.s"
              [style.background]="s.c"
            ></i>
          }
        </div>
      }

      <div class="content">
        @switch (phase()) {
          @case ('interrupted') {
            <p class="line line--warn" [attr.data-text]="script.interrupted">
              {{ script.interrupted }}
            </p>
          }
          @case ('error') {
            <p class="line line--err" [attr.data-text]="script.error">{{ script.error }}</p>
            <p class="year">{{ year() }}</p>
          }
          @case ('fragments') {
            <p class="year">{{ year() }}</p>
          }
          @case ('lost') {
            <p class="line line--lost">{{ script.lost }}</p>
          }
          @case ('reconnect') {
            <p class="line line--dim">{{ script.reconnecting }}</p>
            <p class="bar">{{ bar() }}</p>
            <p class="pct">{{ pct() }}%</p>
          }
          @case ('restored') {
            <p class="line line--ok">{{ script.restored }}</p>
          }
        }
      </div>

      @if (skippable()) {
        <button type="button" class="skip" (click)="finish()">SKIP ▸</button>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
      position: absolute;
      inset: 0;
      z-index: 60;
    }

    .glitch {
      position: absolute;
      inset: 0;
      background: var(--screen);
      overflow: hidden;
      animation: flicker 0.6s steps(3, end) infinite;
    }

    .glitch[data-phase='lost'] {
      background: #000;
      animation: none;
    }
    .glitch[data-phase='reconnect'] {
      background: #05030a;
      animation: none;
    }
    .glitch[data-phase='restored'] {
      background: var(--screen);
      animation: none;
    }

    .content {
      position: absolute;
      inset: 0;
      z-index: 3;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 18px;
      padding: 24px;
      text-align: center;
    }

    .ghost {
      position: absolute;
      inset: 0;
      z-index: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      gap: 10px;
      padding: 56px 16px;
      opacity: 0.5;
    }

    .gb {
      align-self: flex-start;
      max-width: 78%;
      padding: 10px 12px;
      font-family: var(--f-text);
      font-size: var(--t-sm);
      line-height: 1.4;
      background: var(--her-bubble);
      color: var(--her-text);
      box-shadow: 0 0 0 3px var(--border);
    }

    .gb--me {
      align-self: flex-end;
      background: var(--me-bubble);
      color: var(--me-text);
    }

    .glitch[data-phase='interrupted'] .gb,
    .glitch[data-phase='error'] .gb {
      animation: flicker 0.5s steps(3, end) infinite;
      animation-delay: calc(var(--d) * 90ms);
    }

    .glitch[data-phase='fragments'] .gb {
      animation: bubble-break 1.1s steps(7, end) forwards;
      animation-delay: calc(var(--d) * 120ms);
    }

    @keyframes bubble-break {
      0% {
        opacity: 0.6;
        transform: translateX(0) scaleY(1);
      }
      30% {
        opacity: 0.95;
        transform: translateX(-12px) scaleY(1.06);
      }
      60% {
        opacity: 0.5;
        transform: translateX(16px) scaleY(0.3);
      }
      100% {
        opacity: 0;
        transform: translateX(-28px) scaleY(0);
      }
    }

    .bars {
      position: absolute;
      inset: 0;
      z-index: 2;
      pointer-events: none;
      opacity: 0;
      background: repeating-linear-gradient(
        0deg,
        rgb(255 77 126 / 16%) 0 3px,
        transparent 3px 9px,
        rgb(183 156 232 / 14%) 9px 12px,
        transparent 12px 24px
      );
    }

    .glitch[data-phase='error'] .bars,
    .glitch[data-phase='fragments'] .bars {
      opacity: 1;
      animation: scan-drift 0.7s linear infinite;
    }

    .shards {
      position: absolute;
      inset: 0;
      z-index: 2;
      pointer-events: none;
    }

    .shards i {
      position: absolute;
      top: 50%;
      left: 50%;
      animation: shard 1.5s steps(9, end) infinite both;
    }

    @keyframes shard {
      0% {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
      }
      100% {
        transform: translate(calc(-50% + var(--tx) * 1px), calc(-50% + var(--ty) * 1px)) scale(0.2);
        opacity: 0;
      }
    }

    .line {
      position: relative;
      margin: 0;
      font-family: var(--f-pixel);
      font-size: var(--t-md);
      line-height: 1.7;
      letter-spacing: 0.08em;
    }

    .line--warn {
      color: var(--orange);
    }
    .line--err {
      color: var(--soft-red);
    }
    .line--lost {
      color: #6b5470;
    }
    .line--dim {
      color: var(--text-dim);
    }
    .line--ok {
      color: var(--accent);
      animation: pop-in 0.3s steps(4, end) both;
    }

    .line[data-text]::after {
      content: attr(data-text);
      position: absolute;
      inset: 0;
      color: var(--lavender);
      animation: glitch-slice 0.5s steps(2, end) infinite;
    }

    .year {
      margin: 0;
      font-family: var(--f-pixel);
      font-size: clamp(30px, 10vw, 46px);
      color: var(--cream);
      text-shadow:
        4px 0 var(--soft-red),
        -4px 0 var(--lavender);
      animation: shake-x 0.16s steps(2, end) infinite;
    }

    .bar {
      margin: 0;
      font-family: var(--f-ui);
      font-size: var(--t-lg);
      letter-spacing: 0.04em;
      color: var(--accent);
      word-break: break-all;
    }

    .pct {
      margin: 0;
      font-family: var(--f-pixel);
      font-size: var(--t-sm);
      color: var(--text-dim);
    }

    .skip {
      position: absolute;
      right: 14px;
      bottom: 14px;
      z-index: 5;
      padding: 10px 14px;
      min-height: 44px;
      font-family: var(--f-ui);
      font-size: var(--t-xs);
      letter-spacing: 0.14em;
      color: var(--text-dim);
      background: transparent;
      border: 3px solid var(--panel-2);
      cursor: pointer;
    }
  `,
})
export class GlitchTransition implements OnInit {
  private readonly game = inject(GameStateService);
  private readonly audio = inject(AudioService);

  readonly complete = output<void>();

  protected readonly script = GLITCH_SCRIPT;
  protected readonly phase = signal<Phase>('interrupted');
  protected readonly year = signal<string>(GLITCH_SCRIPT.years[0]);
  protected readonly filled = signal(0);
  protected readonly skippable = signal(false);

  protected readonly ghosts = chapterMessages(CHAPTER_ONE_CHAT)
    .slice(0, 5)
    .map((m, i) => ({
      id: m.id,
      i,
      me: m.from === 'me',
      text: m.text,
    }));

  protected readonly shards = Array.from({ length: 30 }, (_, k) => ({
    k,
    d: (k % 9) * 70,
    c: SHARD_COLORS[k % SHARD_COLORS.length],
    s: 8 + (k % 4) * 5,
    x: Math.round(Math.cos((k / 30) * Math.PI * 2) * (100 + (k % 5) * 30)),
    y: Math.round(Math.sin((k / 30) * Math.PI * 2) * (150 + (k % 4) * 30)),
  }));

  protected readonly ghostVisible = computed(() =>
    ['interrupted', 'error', 'fragments'].includes(this.phase()),
  );

  protected readonly bar = computed(
    () => '█'.repeat(this.filled()) + '░'.repeat(BARS - this.filled()),
  );
  protected readonly pct = computed(() => Math.round((this.filled() / BARS) * 100));

  private readonly timers = new Set<ReturnType<typeof setTimeout>>();
  private scrambler: ReturnType<typeof setInterval> | null = null;
  private loader: ReturnType<typeof setInterval> | null = null;
  private finished = false;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.clear());
  }

  ngOnInit(): void {
    const quick = this.game.reduceMotion();
    const t = quick
      ? { error: 300, frag: 600, lost: 900, reconnect: 1300, restored: 2300, end: 3000 }
      : { error: 1600, frag: 3400, lost: 5400, reconnect: 6800, restored: 9400, end: 10800 };

    this.audio.play('glitch');

    this.at(t.error, () => {
      this.phase.set('error');
      this.startScramble();
    });
    this.at(t.frag, () => this.phase.set('fragments'));
    this.at(t.lost, () => {
      this.stopScramble();
      this.phase.set('lost');
      this.audio.play('glitch');
    });
    this.at(t.reconnect, () => {
      this.phase.set('reconnect');
      this.startLoader(quick ? 55 : 120);
    });
    this.at(t.restored, () => {
      this.phase.set('restored');
      this.audio.play('accept');
    });
    this.at(t.end, () => this.finish());
    if (!quick) this.at(2800, () => this.skippable.set(true));
  }

  protected finish(): void {
    if (this.finished) return;
    this.finished = true;
    this.clear();
    this.complete.emit();
  }

  private startScramble(): void {
    let i = 0;
    this.scrambler = setInterval(() => {
      i += 1;
      this.year.set(this.script.years[i % this.script.years.length]);
    }, 130);
  }

  private stopScramble(): void {
    if (this.scrambler) clearInterval(this.scrambler);
    this.scrambler = null;
  }

  private startLoader(stepMs: number): void {
    this.loader = setInterval(() => {
      this.filled.update((n) => Math.min(BARS, n + 1));
      if (this.filled() >= BARS && this.loader) {
        clearInterval(this.loader);
        this.loader = null;
      }
    }, stepMs);
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
    this.stopScramble();
    if (this.loader) clearInterval(this.loader);
    this.loader = null;
  }
}
