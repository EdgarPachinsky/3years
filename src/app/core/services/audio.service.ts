import { Injectable, signal } from '@angular/core';

export type Sfx = 'tap' | 'accept' | 'reject' | 'in' | 'out' | 'type' | 'glitch' | 'win' | 'heart';

interface Tone {
  readonly freq: number;
  readonly dur: number;
  readonly type: OscillatorType;
  readonly gain: number;
  readonly slide?: number;
}

const SFX: Record<Sfx, readonly Tone[]> = {
  tap: [{ freq: 520, dur: 0.05, type: 'square', gain: 0.05 }],
  accept: [
    { freq: 523, dur: 0.08, type: 'square', gain: 0.06 },
    { freq: 784, dur: 0.09, type: 'square', gain: 0.06 },
    { freq: 1047, dur: 0.14, type: 'square', gain: 0.05 },
  ],
  reject: [{ freq: 220, dur: 0.14, type: 'sawtooth', gain: 0.05, slide: 90 }],
  in: [{ freq: 880, dur: 0.06, type: 'square', gain: 0.045 }],
  out: [{ freq: 660, dur: 0.05, type: 'square', gain: 0.04 }],
  type: [{ freq: 1200, dur: 0.02, type: 'square', gain: 0.02 }],
  glitch: [{ freq: 90, dur: 0.3, type: 'sawtooth', gain: 0.05, slide: 40 }],
  win: [
    { freq: 659, dur: 0.08, type: 'square', gain: 0.055 },
    { freq: 880, dur: 0.08, type: 'square', gain: 0.055 },
    { freq: 1175, dur: 0.18, type: 'square', gain: 0.05 },
  ],
  heart: [{ freq: 988, dur: 0.07, type: 'triangle', gain: 0.06 }],
};

/** A warm little loop — two bars, gentle, nostalgic. [step, semitone] */
const MELODY = [0, 4, 7, 12, 9, 7, 4, 7, 2, 5, 9, 14, 11, 9, 5, 9];
const BASS = [0, 0, 5, 5, 7, 7, 5, 5];
const ROOT = 261.63; // C4
const STEP = 0.24; // seconds per 8th note

/**
 * All audio is generated with the Web Audio API — no files to load.
 *
 * Both toggles start ON, but browsers refuse to make any sound before the
 * person has interacted with the page. So nothing is heard until her first tap
 * — which in this story is the ACCEPT button on the friend request — and the
 * music fades in from there.
 */
@Injectable({ providedIn: 'root' })
export class AudioService {
  readonly sfxOn = signal(true);
  readonly musicOn = signal(true);

  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  private nextNote = 0;
  private step = 0;
  private unlocked = false;

  constructor() {
    this.armUnlock();
  }

  /**
   * Waits for the very first gesture, opens the audio context inside it (which
   * is the only moment a browser allows), then starts the music a tick later —
   * the delay matters, because if that first tap was the music button itself we
   * must not swell the loop up just to fade it straight back out.
   */
  private armUnlock(): void {
    if (typeof document === 'undefined') return;
    const unlock = () => {
      document.removeEventListener('pointerdown', unlock);
      document.removeEventListener('keydown', unlock);
      this.unlocked = true;
      this.ensureCtx();
      setTimeout(() => {
        if (this.musicOn()) this.startMusic();
      }, 0);
    };
    document.addEventListener('pointerdown', unlock);
    document.addEventListener('keydown', unlock);
  }

  toggleSfx(): void {
    const next = !this.sfxOn();
    this.sfxOn.set(next);
    if (next) {
      this.ensureCtx();
      this.play('tap');
    }
  }

  toggleMusic(): void {
    const next = !this.musicOn();
    this.musicOn.set(next);
    if (!next) {
      this.stopMusic();
      return;
    }
    if (this.unlocked) this.startMusic();
  }

  play(name: Sfx): void {
    if (!this.sfxOn()) return;
    const ctx = this.ensureCtx();
    if (!ctx) return;
    let at = ctx.currentTime;
    for (const tone of SFX[name]) {
      this.blip(ctx, tone, at);
      at += tone.dur * 0.75;
    }
  }

  private blip(ctx: AudioContext, tone: Tone, at: number): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = tone.type;
    osc.frequency.setValueAtTime(tone.freq, at);
    if (tone.slide) osc.frequency.exponentialRampToValueAtTime(tone.slide, at + tone.dur);
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(tone.gain, at + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + tone.dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(at);
    osc.stop(at + tone.dur + 0.02);
  }

  private startMusic(): void {
    if (this.timer) return;
    const ctx = this.ensureCtx();
    if (!ctx) return;
    this.musicGain = ctx.createGain();
    this.musicGain.gain.value = 0.0001;
    this.musicGain.gain.exponentialRampToValueAtTime(0.16, ctx.currentTime + 1.2);
    this.musicGain.connect(ctx.destination);
    this.nextNote = ctx.currentTime + 0.1;
    this.step = 0;
    this.timer = setInterval(() => this.schedule(), 90);
  }

  private stopMusic(): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    const ctx = this.ctx;
    const gain = this.musicGain;
    if (ctx && gain) {
      gain.gain.cancelScheduledValues(ctx.currentTime);
      gain.gain.setValueAtTime(Math.max(gain.gain.value, 0.0001), ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
      setTimeout(() => gain.disconnect(), 600);
    }
    this.musicGain = null;
  }

  private schedule(): void {
    const ctx = this.ctx;
    const out = this.musicGain;
    if (!ctx || !out) return;
    while (this.nextNote < ctx.currentTime + 0.4) {
      const i = this.step;
      this.voice(
        ctx,
        out,
        ROOT * Math.pow(2, MELODY[i % MELODY.length]! / 12),
        this.nextNote,
        STEP * 0.9,
        'square',
        0.16,
      );
      if (i % 2 === 0) {
        const b = BASS[(i / 2) % BASS.length]!;
        this.voice(
          ctx,
          out,
          (ROOT / 2) * Math.pow(2, b / 12),
          this.nextNote,
          STEP * 1.6,
          'triangle',
          0.3,
        );
      }
      this.nextNote += STEP;
      this.step = (this.step + 1) % (MELODY.length * 2);
    }
  }

  private voice(
    ctx: AudioContext,
    out: GainNode,
    freq: number,
    at: number,
    dur: number,
    type: OscillatorType,
    level: number,
  ): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, at);
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(level, at + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    osc.connect(gain).connect(out);
    osc.start(at);
    osc.stop(at + dur + 0.05);
  }

  private ensureCtx(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      this.ctx = new Ctor();
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
    return this.ctx;
  }
}
