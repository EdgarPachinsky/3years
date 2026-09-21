import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MEMORY_CHECK } from '../../../core/data/story.data';
import { GameStateService } from '../../../core/services/game-state.service';
import { QuestionCard } from '../../../ui/question-card/question-card';

/** The first little game: does she remember who was waiting? */
@Component({
  selector: 'app-memory-check',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [QuestionCard],
  template: `
    <div class="wrap crt">
      <app-question-card [question]="question" (solved)="next()" />
    </div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0;
    }

    .wrap {
      position: relative;
      flex: 1;
      min-height: 0;
      margin: 0 4px;
      padding: 18px 14px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      justify-content: center;
      background: var(--screen);
      box-shadow:
        0 -4px 0 0 var(--border),
        0 4px 0 0 var(--border),
        -4px 0 0 0 var(--border),
        4px 0 0 0 var(--border);
    }
  `,
})
export class MemoryCheck {
  private readonly game = inject(GameStateService);
  protected readonly question = MEMORY_CHECK;

  protected next(): void {
    this.game.go('chapter-three');
  }
}
