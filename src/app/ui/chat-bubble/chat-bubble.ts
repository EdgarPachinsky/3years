import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Speaker } from '../../core/models/story.models';

@Component({
  selector: 'app-chat-bubble',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="row" [class.row--me]="from() === 'me'">
      <div class="col">
        @if (time()) {
          <span class="time">{{ time() }}</span>
        }
        <p class="bubble">{{ text() }}</p>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .row {
      display: flex;
      justify-content: flex-start;
      padding: 6px 0;
    }
    .row--me {
      justify-content: flex-end;
    }

    .col {
      display: flex;
      flex-direction: column;
      gap: 4px;
      max-width: 84%;
      animation: pop-in 0.22s steps(4, end) both;
    }

    .row--me .col {
      align-items: flex-end;
    }

    .time {
      font-family: var(--f-ui);
      font-size: var(--t-xs);
      letter-spacing: 0.12em;
      color: var(--text-dim);
      padding: 0 6px;
    }

    .bubble {
      margin: 0;
      padding: 11px 13px;
      font-family: var(--f-text);
      font-size: var(--t-md);
      line-height: 1.55;
      overflow-wrap: anywhere;
      background: var(--her-bubble);
      color: var(--her-text);
      box-shadow:
        0 -4px 0 0 var(--border),
        0 4px 0 0 var(--border),
        -4px 0 0 0 var(--border),
        4px 0 0 0 var(--border);
    }

    .row--me .bubble {
      background: var(--me-bubble);
      color: var(--me-text);
    }
  `,
})
export class ChatBubble {
  readonly from = input<Speaker>('her');
  readonly text = input.required<string>();
  readonly time = input<string | undefined>(undefined);
}
