import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RelationshipStat, StatValues } from '../../core/models/coop.models';
import { QuizProgress } from '../quiz-progress/quiz-progress';

/** The stat read-out, as retro fill bars. */
@Component({
  selector: 'app-stat-bars',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [QuizProgress],
  template: `
    <div class="bars">
      @for (row of rows(); track row.id) {
        <app-quiz-progress
          [label]="row.label"
          [value]="row.value * reveal()"
          [blocks]="blocks()"
          [showPercent]="false"
        />
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .bars {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
  `,
})
export class StatBars {
  readonly stats = input.required<StatValues>();
  readonly definitions = input.required<readonly RelationshipStat[]>();
  readonly blocks = input(18);
  /** 0 to 1 — lets the caller animate the bars filling. */
  readonly reveal = input(1);

  protected readonly rows = computed(() =>
    this.definitions()
      .filter((stat) => !!stat.barLabel)
      .map((stat) => ({
        id: stat.id,
        label: `${stat.icon} ${stat.barLabel}`,
        value: (this.stats()[stat.id] ?? 0) / 100,
      })),
  );
}
