import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Speaker } from '../../core/models/story.models';

@Component({
  selector: 'app-typing-indicator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="row" [class.row--me]="from() === 'me'">
      <div class="dots" aria-label="typing"><i></i><i></i><i></i></div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .row {
      display: flex;
      justify-content: flex-start;
      padding: 5px 0 8px;
    }
    .row--me {
      justify-content: flex-end;
    }

    .dots {
      display: flex;
      gap: 5px;
      padding: 12px 14px;
      background: var(--her-bubble);
      box-shadow:
        0 -4px 0 0 var(--border),
        0 4px 0 0 var(--border),
        -4px 0 0 0 var(--border),
        4px 0 0 0 var(--border);
    }

    .row--me .dots {
      background: var(--me-bubble);
    }

    i {
      width: 6px;
      height: 6px;
      background: var(--her-text);
      animation: dot 1.1s steps(2, end) infinite;
    }

    .row--me i {
      background: var(--me-text);
    }

    i:nth-child(2) {
      animation-delay: 0.18s;
    }
    i:nth-child(3) {
      animation-delay: 0.36s;
    }

    @keyframes dot {
      0%,
      100% {
        opacity: 0.25;
        transform: translateY(0);
      }
      40% {
        opacity: 1;
        transform: translateY(-3px);
      }
    }
  `,
})
export class TypingIndicator {
  readonly from = input<Speaker>('her');
}
