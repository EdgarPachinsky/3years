import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

/**
 * Four boxes over one real input: the phone shows a numeric keypad, backspace
 * behaves normally, and the boxes are just a picture of what has been typed.
 */
@Component({
  selector: 'app-password-lock',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="lock" [class.lock--bad]="denied()" (click)="focus()">
      <div class="boxes" aria-hidden="true">
        @for (slot of slots(); track slot.i) {
          <span class="box" [class.box--on]="slot.filled" [class.box--live]="slot.active">
            {{ slot.char }}
          </span>
        }
      </div>
      <input
        #field
        class="field"
        type="text"
        inputmode="numeric"
        autocomplete="one-time-code"
        pattern="[0-9]*"
        maxlength="4"
        aria-label="Four digit password"
        [value]="value()"
        (input)="onInput($event)"
      />
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .lock {
      position: relative;
      cursor: text;
    }

    .lock--bad .boxes {
      animation: shake-x 0.4s steps(3, end) 1;
    }

    .boxes {
      display: flex;
      justify-content: center;
      gap: 10px;
    }

    .box {
      display: grid;
      place-items: center;
      width: 54px;
      height: 62px;
      font-family: var(--f-pixel);
      font-size: var(--t-lg);
      color: var(--text);
      background: var(--panel);
      box-shadow:
        0 -4px 0 0 var(--border),
        0 4px 0 0 var(--border),
        -4px 0 0 0 var(--border),
        4px 0 0 0 var(--border);
      transition: box-shadow 0.2s ease;
    }

    .box--on {
      background: var(--panel-2);
    }

    .box--live {
      box-shadow:
        0 -4px 0 0 var(--accent),
        0 4px 0 0 var(--accent),
        -4px 0 0 0 var(--accent),
        4px 0 0 0 var(--accent);
    }

    .lock--bad .box {
      box-shadow:
        0 -4px 0 0 var(--lavender),
        0 4px 0 0 var(--lavender),
        -4px 0 0 0 var(--lavender),
        4px 0 0 0 var(--lavender);
    }

    /* the real input sits invisibly on top so the keyboard behaves normally */
    .field {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      padding: 0;
      border: 0;
      outline: none;
      color: transparent;
      background: transparent;
      caret-color: transparent;
      font-size: 16px; /* stops iOS zooming in on focus */
      text-align: center;
    }

    .field:focus-visible + .boxes {
      outline: none;
    }
  `,
})
export class PasswordLock {
  readonly denied = input(false);
  readonly changed = output<string>();
  readonly completed = output<string>();

  protected readonly value = signal('');
  private readonly field = viewChild<ElementRef<HTMLInputElement>>('field');

  protected readonly slots = computed(() => {
    const v = this.value();
    return Array.from({ length: 4 }, (_, i) => ({
      i,
      char: v[i] ?? '',
      filled: i < v.length,
      active: i === v.length,
    }));
  });

  protected focus(): void {
    this.field()?.nativeElement.focus();
  }

  clear(): void {
    this.value.set('');
    this.changed.emit('');
  }

  protected onInput(event: Event): void {
    const el = event.target as HTMLInputElement;
    const digits = el.value.replace(/\D/g, '').slice(0, 4);
    el.value = digits;
    this.value.set(digits);
    this.changed.emit(digits);
    if (digits.length === 4) this.completed.emit(digits);
  }
}
