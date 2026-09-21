import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GameShell } from './game/game-shell/game-shell';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GameShell],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
