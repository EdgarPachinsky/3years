import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FRIEND_REQUEST } from '../../../core/data/story.data';
import { GameStateService } from '../../../core/services/game-state.service';
import { AudioService } from '../../../core/services/audio.service';
import { PixelButton } from '../../../ui/pixel-button/pixel-button';
import { PixelSprite } from '../../../ui/pixel-sprite/pixel-sprite';
import { PixelParticles } from '../../../ui/pixel-particles/pixel-particles';

type Stage = 'request' | 'rejected' | 'accepted';

/** JUNE 7, 2019 — 8:18 PM. His computer. The request that started everything. */
@Component({
  selector: 'app-friend-request',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PixelButton, PixelSprite, PixelParticles],
  template: `
    <div class="scene">
      <p class="stamp">
        <span>{{ copy.dateLabel }}</span>
        <span class="stamp__time">{{ copy.timeLabel }}</span>
      </p>

      <div class="monitor">
        <div class="screen crt">
          <div class="chrome">
            <span class="chrome__dot"></span>
            <span class="chrome__title">{{ copy.windowTitle }}</span>
          </div>

          <div class="inner">
            @if (stage() === 'request') {
              <p class="heading anim-rise">{{ copy.heading }}</p>
              <div class="profile anim-pop">
                <span class="profile__pic"><app-pixel-sprite name="avatar" [scale]="5" /></span>
                <p class="profile__name">{{ copy.name }}</p>
                <p class="profile__handle">{{ copy.handle }}</p>
                <p class="profile__line">{{ copy.line }}</p>
              </div>
            }

            @if (stage() === 'rejected') {
              <div class="error anim-pop">
                <p class="error__code">{{ rejection().title }}</p>
                <p class="error__line">{{ rejection().line }}</p>
                <span class="error__skull"><app-pixel-sprite name="skull" [scale]="4" /></span>
              </div>
            }

            @if (stage() === 'accepted') {
              <app-pixel-particles [count]="14" sprite="heart" />
              <div class="ok">
                <p class="ok__title anim-pop">
                  {{ copy.acceptedTitle }}
                  <span class="ok__tick"><app-pixel-sprite name="check" [scale]="3" /></span>
                </p>
                @if (step() >= 2) {
                  <p class="ok__sub anim-rise">{{ copy.acceptedLine }}</p>
                }
                @if (step() >= 3) {
                  <p class="ok__time anim-pop">{{ copy.nextTime }}</p>
                }
              </div>
            }
          </div>
        </div>
        <div class="led" aria-hidden="true"></div>
        <div class="neck" aria-hidden="true"></div>
        <div class="foot" aria-hidden="true"></div>
      </div>

      <div class="actions">
        @if (stage() === 'request') {
          <app-pixel-button tone="primary" (pressed)="accept()"
            >{{ copy.acceptLabel }} ❤️</app-pixel-button
          >
          <app-pixel-button tone="danger" (pressed)="reject()"
            >{{ copy.rejectLabel }} 💀</app-pixel-button
          >
        }
        @if (stage() === 'rejected') {
          <app-pixel-button tone="soft" (pressed)="back()">TRY AGAIN</app-pixel-button>
        }
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

    .scene {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0;
      gap: 12px;
    }

    .stamp {
      display: flex;
      justify-content: space-between;
      margin: 0;
      padding: 0 6px;
      font-family: var(--f-ui);
      font-size: var(--t-sm);
      letter-spacing: 0.16em;
      color: var(--text-dim);
    }

    .stamp__time {
      color: var(--accent);
    }

    .monitor {
      position: relative;
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      margin: 0 4px;
      padding: 10px 10px 18px;
      background: var(--panel);
      box-shadow:
        0 -4px 0 0 var(--border),
        0 4px 0 0 var(--border),
        -4px 0 0 0 var(--border),
        4px 0 0 0 var(--border),
        inset 0 4px 0 0 rgb(255 255 255 / 8%);
    }

    .screen {
      position: relative;
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background: var(--screen);
      box-shadow: inset 0 0 0 4px var(--border);
    }

    .chrome {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 10px;
      background: var(--panel-2);
      border-bottom: 4px solid var(--border);
    }

    .chrome__dot {
      width: 8px;
      height: 8px;
      background: var(--accent);
      box-shadow: 12px 0 0 0 var(--accent-2);
    }

    .chrome__title {
      font-family: var(--f-ui);
      font-size: var(--t-sm);
      letter-spacing: 0.18em;
      color: var(--text-dim);
      padding-left: 12px;
    }

    .inner {
      position: relative;
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 14px;
      padding: 16px 14px;
      text-align: center;
    }

    .heading {
      margin: 0;
      font-family: var(--f-pixel);
      font-size: var(--t-sm);
      letter-spacing: 0.2em;
      color: var(--accent);
    }

    .profile {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      width: 100%;
      max-width: 260px;
      padding: 16px 12px;
      background: var(--panel-2);
      box-shadow:
        0 -4px 0 0 var(--border),
        0 4px 0 0 var(--border),
        -4px 0 0 0 var(--border),
        4px 0 0 0 var(--border);
    }

    .profile__pic {
      line-height: 0;
      padding: 6px;
      background: var(--screen);
      box-shadow: 0 0 0 4px var(--border);
    }
    .profile__name {
      margin: 8px 0 0;
      font-family: var(--f-pixel);
      font-size: var(--t-lg);
      color: var(--text);
    }
    .profile__handle {
      margin: 0;
      font-family: var(--f-ui);
      font-size: var(--t-sm);
      letter-spacing: 0.1em;
      color: var(--text-dim);
    }
    .profile__line {
      margin: 6px 0 0;
      font-family: var(--f-text);
      font-size: var(--t-md);
      color: var(--text);
    }

    .error {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }
    .error__code {
      margin: 0;
      font-family: var(--f-pixel);
      font-size: var(--t-lg);
      color: var(--soft-red);
      text-shadow: 3px 0 var(--lavender);
    }
    .error__line {
      margin: 0;
      font-family: var(--f-text);
      font-size: var(--t-md);
      line-height: 1.5;
      color: var(--text);
    }
    .error__skull {
      color: var(--text-dim);
    }

    .ok {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }
    .ok__title {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 0;
      font-family: var(--f-pixel);
      font-size: var(--t-sm);
      line-height: 1.6;
      color: var(--accent);
    }
    .ok__tick {
      color: var(--accent);
      line-height: 0;
    }
    .ok__sub {
      margin: 0;
      font-family: var(--f-ui);
      font-size: var(--t-md);
      letter-spacing: 0.16em;
      color: var(--text);
    }
    .ok__time {
      margin: 4px 0 0;
      font-family: var(--f-pixel);
      font-size: var(--t-xl);
      color: var(--accent-2);
    }

    .led {
      position: absolute;
      right: 16px;
      bottom: 6px;
      width: 8px;
      height: 8px;
      background: var(--accent);
      animation: blink 2.4s steps(1, end) infinite;
    }

    .neck {
      height: 0;
    }
    .foot {
      height: 0;
    }

    .actions {
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: 0 2px;
    }
  `,
})
export class FriendRequest {
  private readonly game = inject(GameStateService);
  private readonly audio = inject(AudioService);

  protected readonly copy = FRIEND_REQUEST;
  protected readonly stage = signal<Stage>('request');
  protected readonly step = signal(1);

  private rejects = signal(0);
  private readonly timers = new Set<ReturnType<typeof setTimeout>>();

  protected readonly rejection = computed(() => {
    const list = this.copy.rejections;
    const i = Math.min(this.rejects(), list.length) - 1;
    return list[Math.max(0, i)];
  });

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      for (const id of this.timers) clearTimeout(id);
      this.timers.clear();
    });
  }

  protected accept(): void {
    this.audio.play('accept');
    this.stage.set('accepted');
    this.step.set(1);
    this.at(this.game.beat(1300), () => this.step.set(2));
    this.at(this.game.beat(2700), () => {
      this.step.set(3);
      this.audio.play('heart');
    });
    this.at(this.game.beat(4300), () => this.game.go('chapter-one'));
  }

  protected reject(): void {
    this.audio.play('reject');
    this.rejects.update((n) => n + 1);
    this.stage.set('rejected');
  }

  protected back(): void {
    this.audio.play('tap');
    this.stage.set('request');
  }

  private at(ms: number, run: () => void): void {
    const id = setTimeout(() => {
      this.timers.delete(id);
      run();
    }, ms);
    this.timers.add(id);
  }
}
