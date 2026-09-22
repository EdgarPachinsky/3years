import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { SceneId } from '../../core/models/story.models';
import { GameStateService } from '../../core/services/game-state.service';
import { AudioService } from '../../core/services/audio.service';
import { ProgressIndicator } from '../../ui/progress-indicator/progress-indicator';
import { PixelSprite } from '../../ui/pixel-sprite/pixel-sprite';
import { PixelButton } from '../../ui/pixel-button/pixel-button';
import { GlitchTransition } from '../../ui/glitch-transition/glitch-transition';
import { FriendRequest } from '../scenes/friend-request/friend-request';
import { ChapterOne } from '../scenes/chapter-one/chapter-one';
import { ChapterTwo } from '../scenes/chapter-two/chapter-two';
import { MemoryCheck } from '../scenes/memory-check/memory-check';
import { ChapterThree } from '../scenes/chapter-three/chapter-three';
import { ChapterFour } from '../scenes/chapter-four/chapter-four';
import { ChapterFive } from '../scenes/chapter-five/chapter-five';
import { FinalChapter } from '../scenes/final-chapter/final-chapter';
import { MainMenu } from '../scenes/main-menu/main-menu';
import { ChapterTeaser } from '../scenes/chapter-teaser/chapter-teaser';

/** Scenes that offer the menu button. Everything except the menu itself. */
const WITH_MENU = new Set<SceneId>([
  'friend-request',
  'chapter-one',
  'chapter-two',
  'memory-check',
  'chapter-three',
  'chapter-four',
  'chapter-five',
  'final-chapter',
  // the end screen too, otherwise it is a dead end with no way back
  'chapter-teaser',
]);

/** The whole game lives inside one phone-sized frame. */
@Component({
  selector: 'app-game-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ProgressIndicator,
    PixelSprite,
    PixelButton,
    GlitchTransition,
    FriendRequest,
    ChapterOne,
    ChapterTwo,
    MemoryCheck,
    ChapterThree,
    ChapterFour,
    ChapterFive,
    FinalChapter,
    ChapterTeaser,
    MainMenu,
  ],
  templateUrl: './game-shell.html',
  styleUrl: './game-shell.scss',
})
export class GameShell {
  protected readonly game = inject(GameStateService);
  protected readonly audio = inject(AudioService);

  /** The menu is reachable from everywhere except the menu itself. */
  protected readonly showMenuButton = computed(() => WITH_MENU.has(this.game.scene()));

  protected afterGlitch(): void {
    this.game.go('chapter-two');
  }
}
