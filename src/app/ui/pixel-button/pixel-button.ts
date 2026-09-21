import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export type PixelButtonTone = 'primary' | 'soft' | 'ghost' | 'danger';

@Component({
  selector: 'app-pixel-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      class="btn"
      [class]="'btn--' + tone()"
      [disabled]="disabled()"
      (click)="pressed.emit()"
    >
      <span class="btn__label"><ng-content /></span>
    </button>
  `,
  styles: `
    :host {
      display: block;
      padding: 0 4px 8px;
    }

    .btn {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      min-height: var(--tap);
      padding: 14px 16px;
      font-family: var(--f-pixel);
      font-size: var(--t-sm);
      line-height: 1.5;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      text-align: center;
      border: 0;
      cursor: pointer;
      transition: transform 0.07s steps(2, end);
    }

    .btn__label {
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .btn--primary {
      color: var(--border);
      background: var(--accent);
    }
    .btn--danger {
      color: var(--cream);
      background: var(--panel-2);
    }
    .btn--soft {
      color: var(--text);
      background: var(--panel-2);
    }
    .btn--ghost {
      color: var(--text-dim);
      background: transparent;
    }

    .btn {
      box-shadow:
        0 -4px 0 0 var(--border),
        0 4px 0 0 var(--border),
        -4px 0 0 0 var(--border),
        4px 0 0 0 var(--border),
        0 8px 0 0 rgb(0 0 0 / 45%);
    }

    .btn--ghost {
      box-shadow:
        0 -4px 0 0 var(--panel-2),
        0 4px 0 0 var(--panel-2),
        -4px 0 0 0 var(--panel-2),
        4px 0 0 0 var(--panel-2);
    }

    .btn:active:not(:disabled) {
      transform: translateY(5px);
      box-shadow:
        0 -4px 0 0 var(--border),
        0 4px 0 0 var(--border),
        -4px 0 0 0 var(--border),
        4px 0 0 0 var(--border);
    }

    .btn:disabled {
      opacity: 0.45;
      cursor: default;
    }
  `,
})
export class PixelButton {
  readonly tone = input<PixelButtonTone>('primary');
  readonly disabled = input(false);
  readonly pressed = output<void>();
}
