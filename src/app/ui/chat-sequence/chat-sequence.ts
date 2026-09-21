import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ChatMessage, Speaker } from '../../core/models/story.models';
import { GameStateService } from '../../core/services/game-state.service';
import { AudioService } from '../../core/services/audio.service';
import { ChatBubble } from '../chat-bubble/chat-bubble';
import { TypingIndicator } from '../typing-indicator/typing-indicator';

/**
 * Plays a list of real messages back, one at a time, with typing indicators.
 * Nothing here is tappable: the conversation cannot be skipped or rushed by
 * accident. Appending more messages to the input list simply makes it carry on
 * from where it stopped, so a chapter can pause for a memory check and resume.
 */
@Component({
  selector: 'app-chat-sequence',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ChatBubble, TypingIndicator],
  template: `
    <div #scroller class="scroll">
      <div class="inner">
        <ng-content select="[chatHeader]" />
        @for (m of shown(); track m.id) {
          <app-chat-bubble [from]="m.from" [text]="m.text" [time]="m.time" />
        }
        @if (typing(); as who) {
          <app-typing-indicator [from]="who" />
        }
        <ng-content />
        <div class="pad"></div>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      min-height: 0;
      flex: 1;
    }

    .scroll {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
      scroll-behavior: smooth;
    }

    .inner {
      display: flex;
      flex-direction: column;
      padding: 4px 6px 0;
    }

    .pad {
      height: 8px;
      flex: none;
    }
  `,
})
export class ChatSequence implements OnInit {
  private readonly game = inject(GameStateService);
  private readonly audio = inject(AudioService);

  readonly messages = input.required<readonly ChatMessage[]>();
  /** Beat held after the last message before `finished` fires. */
  readonly tailMs = input(900);
  readonly finished = output<void>();

  protected readonly shown = signal<ChatMessage[]>([]);
  protected readonly typing = signal<Speaker | null>(null);

  private readonly scroller = viewChild<ElementRef<HTMLDivElement>>('scroller');
  private readonly timers = new Set<ReturnType<typeof setTimeout>>();
  private index = 0;
  private running = false;
  private started = false;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.clear());

    // Input signals settle during change detection, so the parent cannot hand us
    // new messages and start us in the same tick. Watching the list instead means
    // appending to it is all it takes to continue.
    effect(() => {
      const total = this.messages().length;
      if (this.started && !this.running && this.index < total) this.start();
    });
  }

  ngOnInit(): void {
    this.started = true;
    this.start();
  }

  private start(): void {
    this.running = true;
    this.step();
  }

  private step(): void {
    const list = this.messages();
    if (this.index >= list.length) {
      this.typing.set(null);
      this.wait(this.game.beat(this.tailMs()), () => {
        this.running = false;
        this.finished.emit();
      });
      return;
    }

    const message = list[this.index];
    this.wait(this.game.beat(message.pauseMs ?? 400), () => {
      this.typing.set(message.from);
      this.wait(this.game.beat(message.typingMs ?? 1200), () => {
        this.typing.set(null);
        this.shown.update((all) => [...all, message]);
        this.audio.play(message.from === 'me' ? 'out' : 'in');
        this.index += 1;
        this.scrollDown();
        this.step();
      });
    });
  }

  private wait(ms: number, run: () => void): void {
    const id = setTimeout(() => {
      this.timers.delete(id);
      run();
    }, ms);
    this.timers.add(id);
  }

  private clear(): void {
    for (const id of this.timers) clearTimeout(id);
    this.timers.clear();
  }

  private scrollDown(): void {
    setTimeout(() => {
      const el = this.scroller()?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    }, 30);
  }
}
