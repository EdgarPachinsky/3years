import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PixelSprite } from '../pixel-sprite/pixel-sprite';

/** A level title card: date stamp, chapter code, chapter name. */
@Component({
  selector: 'app-level-screen',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PixelSprite],
  template: `
    <div class="card">
      @if (dateLabel()) {
        <p class="stamp">
          {{ dateLabel() }}
          @if (timeLabel()) {
            <span class="stamp__time">{{ timeLabel() }}</span>
          }
        </p>
      }
      <div class="rule"></div>
      <p class="code">{{ code() }}</p>
      <h1 class="name">{{ title() }}</h1>
      @if (showSprite()) {
        <span class="deco anim-bob"><app-pixel-sprite name="heart" [scale]="5" /></span>
      }
      <ng-content />
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      text-align: center;
      padding: 8px 4px;
      animation: rise-fade 0.5s ease-out both;
    }

    .stamp {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin: 0;
      font-family: var(--f-ui);
      font-size: var(--t-sm);
      letter-spacing: 0.2em;
      color: var(--text-dim);
    }

    .stamp__time {
      color: var(--accent);
    }

    .rule {
      width: 64px;
      height: 4px;
      background: repeating-linear-gradient(90deg, var(--accent) 0 4px, transparent 4px 8px);
    }

    .code {
      margin: 6px 0 0;
      font-family: var(--f-ui);
      font-size: var(--t-md);
      letter-spacing: 0.3em;
      color: var(--text-dim);
    }

    .name {
      margin: 0;
      font-family: var(--f-pixel);
      font-size: var(--t-lg);
      line-height: 1.5;
      color: var(--text);
      text-shadow: 0 4px 0 var(--border);
    }

    .deco {
      color: var(--accent);
      line-height: 0;
      margin-top: 6px;
    }
  `,
})
export class LevelScreen {
  readonly dateLabel = input('');
  readonly timeLabel = input('');
  readonly code = input('');
  readonly title = input('');
  readonly showSprite = input(true);
}
