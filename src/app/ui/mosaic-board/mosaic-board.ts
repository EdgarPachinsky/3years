import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { MosaicPhoto } from '../../core/models/story.models';
import { AudioService } from '../../core/services/audio.service';
import { shuffled } from '../../core/util/shuffle';

interface Slot {
  readonly i: number;
  readonly piece: number;
}

/**
 * One photo, cut into a grid and scrambled. Tap a piece, then tap where it
 * belongs — the two swap. Every arrangement is reachable, so it can never
 * become unsolvable.
 */
@Component({
  selector: 'app-mosaic-board',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="board"
      [class.board--solved]="solved()"
      [class.board--peek]="peeking()"
      [style.width]="fitWidth()"
      [style.background-image]="peeking() ? url() : null"
      [style.aspect-ratio]="photo().width + ' / ' + photo().height"
      [style.grid-template-columns]="'repeat(' + grid() + ', 1fr)'"
    >
      @for (slot of slots(); track slot.i) {
        <button
          type="button"
          class="tile"
          [class.tile--picked]="picked() === slot.i"
          [class.tile--home]="slot.piece === slot.i"
          [disabled]="solved()"
          [style.background-image]="url()"
          [style.background-size]="spriteSize()"
          [style.background-position]="positionOf(slot.piece)"
          [attr.aria-label]="'Piece ' + (slot.piece + 1) + ' of ' + total()"
          (click)="tap(slot.i)"
        ></button>
      }
    </div>
  `,
  styles: `
    /*
     * Pinned to the stage rather than stretched into it. A flex item does not
     * reliably stretch when the container's height comes from min-height (it
     * does on a phone, it does not on a desktop window), and when that failed
     * the measured height was 11px and the board was sized down to nothing.
     * inset: 0 gives the same box every time.
     */
    :host {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /*
     * An empty grid has no size of its own, and container-query units resolve
     * to zero against a flex-grown height — so the board is measured instead
     * and given a pixel width that fits the space without squashing the photo.
     */
    .board {
      display: grid;
      gap: 3px;
      max-width: 100%;
      padding: 4px;
      background: var(--border);
      transition: gap 0.35s steps(4, end);
    }

    .board--solved {
      gap: 0;
      box-shadow: 0 0 0 4px var(--accent);
    }

    .tile {
      position: relative;
      min-width: 0;
      min-height: 0;
      padding: 0;
      border: 0;
      cursor: pointer;
      background-color: var(--panel);
      background-repeat: no-repeat;
      transition:
        transform 0.12s steps(3, end),
        opacity 0.2s ease;
    }

    .tile:disabled {
      cursor: default;
    }

    .tile--picked {
      z-index: 2;
      transform: scale(0.9);
      box-shadow:
        0 0 0 3px var(--accent),
        0 0 0 6px var(--border);
    }

    /* a quiet nudge that a piece is already where it belongs */
    .tile--home::after {
      content: '';
      position: absolute;
      right: 3px;
      bottom: 3px;
      width: 5px;
      height: 5px;
      background: var(--accent-2);
      opacity: 0.75;
    }

    .board--solved .tile--home::after {
      opacity: 0;
    }

    .board--peek {
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }

    .board--peek .tile {
      opacity: 0.2;
    }
  `,
})
export class MosaicBoard implements OnInit {
  private readonly audio = inject(AudioService);
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly photo = input.required<MosaicPhoto>();
  /** 2 = 2x2, 3 = 3x3, and so on. */
  readonly grid = input(3);
  readonly peeking = input(false);
  readonly solvedChange = output<void>();

  private readonly box = signal({ w: 0, h: 0 });
  protected readonly tiles = signal<number[]>([]);
  protected readonly picked = signal<number | null>(null);
  protected readonly solved = signal(false);

  protected readonly total = computed(() => this.grid() * this.grid());
  protected readonly url = computed(() => `url('${this.photo().src}')`);
  protected readonly spriteSize = computed(() => {
    const pct = this.grid() * 100;
    return `${pct}% ${pct}%`;
  });
  protected readonly slots = computed<Slot[]>(() => this.tiles().map((piece, i) => ({ i, piece })));

  /** The widest the board can be before it would be taller than the space it has. */
  protected readonly fitWidth = computed(() => {
    const { w, h } = this.box();
    const photo = this.photo();
    // Anything this small is a bad measurement, not a real box. Fill the width
    // instead — too tall is recoverable, invisible is not.
    if (w < 60 || h < 60) return '100%';
    const frame = 8; // the 4px pixel border on each side
    const ratio = photo.width / photo.height;
    return `${Math.floor(Math.min(w, (h - frame) * ratio))}px`;
  });

  private observer: ResizeObserver | null = null;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.observer?.disconnect());

    // A new photo or a new grid size means a fresh board.
    effect(() => {
      this.photo();
      this.grid();
      this.deal();
    });
  }

  ngOnInit(): void {
    const el = this.host.nativeElement as HTMLElement;
    const read = () => this.box.set({ w: el.clientWidth, h: el.clientHeight });
    read();
    if (typeof ResizeObserver === 'undefined') return;
    this.observer = new ResizeObserver(read);
    this.observer.observe(el);
  }

  protected positionOf(piece: number): string {
    const n = this.grid();
    if (n < 2) return '0% 0%';
    const col = piece % n;
    const row = Math.floor(piece / n);
    return `${(col / (n - 1)) * 100}% ${(row / (n - 1)) * 100}%`;
  }

  protected tap(slot: number): void {
    if (this.solved()) return;
    const first = this.picked();

    if (first === null) {
      this.picked.set(slot);
      this.audio.play('tap');
      return;
    }
    if (first === slot) {
      this.picked.set(null);
      return;
    }

    this.tiles.update((all) => {
      const next = [...all];
      [next[first], next[slot]] = [next[slot], next[first]];
      return next;
    });
    this.picked.set(null);
    this.audio.play('heart');
    this.check();
  }

  private check(): void {
    if (!this.tiles().every((piece, i) => piece === i)) return;
    this.solved.set(true);
    this.audio.play('win');
    this.solvedChange.emit();
  }

  /** Scramble, and never hand her a board that is already finished. */
  private deal(): void {
    const count = this.total();
    const ordered = Array.from({ length: count }, (_, i) => i);
    let next = ordered;
    for (let attempt = 0; attempt < 12; attempt++) {
      next = shuffled(ordered);
      const misplaced = next.filter((piece, i) => piece !== i).length;
      if (misplaced >= Math.max(2, Math.ceil(count * 0.6))) break;
    }
    this.tiles.set(next);
    this.picked.set(null);
    this.solved.set(false);
  }
}
