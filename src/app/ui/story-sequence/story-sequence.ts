import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { ChatMessage, QuizQuestion, StoryBeat } from '../../core/models/story.models';
import { AudioService } from '../../core/services/audio.service';
import { ChatSequence } from '../chat-sequence/chat-sequence';
import { QuestionCard } from '../question-card/question-card';

/**
 * Plays a chapter script: messages, then a memory check, then more messages.
 * The quiz rises over the conversation so the message she is answering stays
 * on screen, and a correct answer drops into the chat as her own reply.
 */
@Component({
  selector: 'app-story-sequence',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ChatSequence, QuestionCard],
  template: `
    <app-chat-sequence [messages]="queue()" (finished)="onSegmentDone()">
      @if (dateLabel()) {
        <p chatHeader class="daystamp">{{ dateLabel() }}</p>
      }
    </app-chat-sequence>

    @if (quiz(); as q) {
      <div class="scrim" aria-hidden="true"></div>
      <div class="sheet">
        <app-question-card [question]="q" (solved)="onSolved(q)" />
      </div>
    }
  `,
  styles: `
    :host {
      position: relative;
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0;
    }

    .daystamp {
      margin: 10px auto 6px;
      padding: 5px 10px;
      font-family: var(--f-ui);
      font-size: var(--t-xs);
      letter-spacing: 0.18em;
      color: var(--text-dim);
      background: var(--panel);
      box-shadow: 0 0 0 3px var(--border);
    }

    .scrim {
      position: absolute;
      inset: 0;
      z-index: 24;
      pointer-events: none;
      background: linear-gradient(180deg, transparent 0%, rgb(17 9 22 / 78%) 58%);
    }

    .sheet {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 25;
      max-height: 80%;
      overflow-y: auto;
      padding: 14px 12px;
      background: var(--panel);
      box-shadow: 0 -4px 0 0 var(--border);
      animation: sheet-up 0.34s ease-out both;
    }

    @keyframes sheet-up {
      from {
        transform: translateY(26px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `,
})
export class StorySequence implements OnInit {
  private readonly audio = inject(AudioService);

  readonly script = input.required<readonly StoryBeat[]>();
  readonly dateLabel = input('');
  readonly finished = output<void>();

  protected readonly queue = signal<ChatMessage[]>([]);
  protected readonly quiz = signal<QuizQuestion | null>(null);

  private cursor = 0;

  ngOnInit(): void {
    this.pump();
  }

  /** The chat ran out of queued messages — either a quiz is next, or we are done. */
  protected onSegmentDone(): void {
    const beat = this.script()[this.cursor];
    if (!beat) {
      this.finished.emit();
      return;
    }
    if (beat.kind === 'quiz') {
      this.quiz.set(beat.quiz);
      return;
    }
    // Shouldn't happen: pump() always drains consecutive message beats.
    this.pump();
  }

  protected onSolved(question: QuizQuestion): void {
    this.audio.play('tap');
    this.quiz.set(null);
    this.cursor += 1;

    const before = this.queue().length;
    const reply = this.answerOf(question);
    if (reply) this.queue.update((all) => [...all, reply]);
    this.pump();

    // Growing the queue is enough — the chat picks itself back up.
    if (this.queue().length === before) this.finished.emit();
  }

  /** Her real reply, rebuilt from the option she just got right. */
  private answerOf(question: QuizQuestion): ChatMessage | null {
    const who = question.revealAs;
    if (!who) return null;
    const correct = question.options.find((o) => o.correct);
    if (!correct) return null;
    return {
      id: `${question.id}-answer`,
      from: who,
      text: correct.text,
      typingMs: 1600,
      pauseMs: 600,
    };
  }

  /** Queue up every message beat waiting at the cursor. */
  private pump(): void {
    const script = this.script();
    const add: ChatMessage[] = [];
    while (this.cursor < script.length) {
      const beat = script[this.cursor];
      if (beat.kind !== 'messages') break;
      add.push(...beat.messages);
      this.cursor += 1;
    }
    if (add.length) this.queue.update((all) => [...all, ...add]);
  }
}
