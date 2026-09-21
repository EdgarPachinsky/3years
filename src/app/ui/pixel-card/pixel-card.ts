import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** A pixel window: optional retro title bar plus content. */
@Component({
  selector: 'app-pixel-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (heading()) {
      <header class="bar">
        <span class="bar__dots" aria-hidden="true"></span>
        <span class="bar__title">{{ heading() }}</span>
        <span class="bar__box" aria-hidden="true"></span>
      </header>
    }
    <div class="body" [style.padding.px]="pad()">
      <ng-content />
    </div>
  `,
  styles: `
    :host {
      display: block;
      position: relative;
      background: var(--panel);
      box-shadow:
        0 -4px 0 0 var(--border),
        0 4px 0 0 var(--border),
        -4px 0 0 0 var(--border),
        4px 0 0 0 var(--border);
    }

    .bar {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 10px;
      background: var(--panel-2);
      border-bottom: 4px solid var(--border);
    }

    .bar__title {
      flex: 1;
      font-family: var(--f-ui);
      font-size: var(--t-sm);
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--text-dim);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .bar__dots {
      width: 8px;
      height: 8px;
      background: var(--accent);
      box-shadow: 12px 0 0 0 var(--accent-2);
      margin-right: 12px;
    }

    .bar__box {
      width: 10px;
      height: 10px;
      border: 3px solid var(--text-dim);
      opacity: 0.6;
    }

    .body {
      padding: 14px;
    }
  `,
})
export class PixelCard {
  readonly heading = input<string>('');
  readonly pad = input(14);
}
