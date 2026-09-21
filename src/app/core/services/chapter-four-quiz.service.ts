import { Injectable, isDevMode } from '@angular/core';
import { CHAPTER_FOUR, CHAPTER_FOUR_QUESTIONS } from '../data/chapter-4-content';
import {
  KnowledgeQuestion,
  QuizCategory,
  QuizRound,
  QuizRun,
  QuizVerdict,
} from '../models/quiz.models';
import { shuffled } from '../util/shuffle';

const SETTINGS = CHAPTER_FOUR.settings;

/**
 * Builds a fresh quiz every time Chapter 04 is played.
 *
 * Priority when choosing, best first:
 *   1. questions with a real answer (`verified`)
 *   2. questions she has not seen
 *   3. questions she saw longest ago
 * and never a question from the run she just finished.
 *
 * Categories are filled round-robin rather than by shuffling the whole pool,
 * so every run spreads across KNOW ME / KNOW US / WHO WOULD and the rest
 * instead of landing on ten questions from whichever category is biggest.
 */
@Injectable({ providedIn: 'root' })
export class ChapterFourQuizService {
  private warned = false;

  generate(): QuizRun {
    const pool = CHAPTER_FOUR_QUESTIONS;
    this.warnAboutPlaceholders(pool);

    const wanted = Math.min(SETTINGS.questionsPerRun, pool.length);
    let seen = SETTINGS.avoidRecentQuestions ? this.read(SETTINGS.storageKey) : [];

    // Whole pool been round? Wipe the slate and start again.
    if (seen.length >= pool.length) seen = [];

    const lastRun = this.read(SETTINGS.lastRunKey);
    const fresh = pool.filter((q) => !lastRun.includes(q.id));
    const candidates = fresh.length >= wanted ? fresh : pool;

    const picked = SETTINGS.guaranteeCategoryDiversity
      ? this.pickAcrossCategories(candidates, seen, wanted)
      : this.rank(candidates, seen).slice(0, wanted);

    const rounds: QuizRound[] = shuffled(picked).map((question) => ({
      question,
      // Never the same option order twice — the position is not a hint.
      options: shuffled(question.options),
    }));

    this.remember(
      rounds.map((r) => r.question.id),
      seen,
    );
    return { rounds };
  }

  /** Which result band a score falls into. */
  verdict(correct: number, total: number): QuizVerdict {
    const ratio = total > 0 ? correct / total : 0;
    const band =
      CHAPTER_FOUR.results.find((r) => ratio >= r.min) ??
      CHAPTER_FOUR.results[CHAPTER_FOUR.results.length - 1];
    return { heading: band.heading, status: band.status, line: band.line };
  }

  /** A reaction for this question, or one of the general ones. */
  reaction(question: KnowledgeQuestion, correct: boolean): string {
    const own = correct ? question.correctReaction : question.wrongReaction;
    if (own) return own;
    const pool = correct ? CHAPTER_FOUR.reactions.correct : CHAPTER_FOUR.reactions.wrong;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  /** Start the rotation over — used by "play from the start". */
  forget(): void {
    try {
      localStorage.removeItem(SETTINGS.storageKey);
      localStorage.removeItem(SETTINGS.lastRunKey);
    } catch {
      /* private mode */
    }
  }

  /* ------------------------------------------------------------ picking -- */

  /** One from each category in turn, so a run is never all one flavour. */
  private pickAcrossCategories(
    candidates: readonly KnowledgeQuestion[],
    seen: readonly string[],
    wanted: number,
  ): KnowledgeQuestion[] {
    const buckets = new Map<QuizCategory, KnowledgeQuestion[]>();
    for (const question of this.rank(candidates, seen)) {
      const bucket = buckets.get(question.category) ?? [];
      bucket.push(question);
      buckets.set(question.category, bucket);
    }

    const order = shuffled([...buckets.keys()]);
    const picked: KnowledgeQuestion[] = [];

    while (picked.length < wanted) {
      let took = false;
      for (const category of order) {
        if (picked.length >= wanted) break;
        const next = buckets.get(category)?.shift();
        if (!next) continue;
        picked.push(next);
        took = true;
      }
      if (!took) break; // every bucket is empty
    }

    return picked;
  }

  /** Best first: real answers, then unseen, then longest ago. */
  private rank(
    questions: readonly KnowledgeQuestion[],
    seen: readonly string[],
  ): KnowledgeQuestion[] {
    const recency = new Map(seen.map((id, i) => [id, i]));
    const score = (q: KnowledgeQuestion): number => {
      const placeholder = q.verified ? 0 : 1000;
      const lastSeen = recency.has(q.id) ? recency.get(q.id)! + 1 : 0;
      const nudge = 1 / Math.max(0.01, q.weight ?? 1);
      return placeholder + lastSeen + nudge;
    };
    // Shuffle first so equal scores do not always resolve the same way.
    return shuffled(questions).sort((a, b) => score(a) - score(b));
  }

  /* ------------------------------------------------------------ storage -- */

  private remember(ids: readonly string[], seen: readonly string[]): void {
    const next = [...seen.filter((id) => !ids.includes(id)), ...ids].slice(-SETTINGS.memory);
    this.write(SETTINGS.storageKey, next);
    this.write(SETTINGS.lastRunKey, [...ids]);
  }

  private read(key: string): string[] {
    try {
      const raw = localStorage.getItem(key);
      const parsed: unknown = raw ? JSON.parse(raw) : null;
      return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : [];
    } catch {
      return [];
    }
  }

  private write(key: string, value: readonly string[]): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* private mode — the quiz still plays, it just repeats sooner */
    }
  }

  private warnAboutPlaceholders(pool: readonly KnowledgeQuestion[]): void {
    if (!isDevMode() || this.warned) return;
    this.warned = true;
    const pending = pool.filter((q) => !q.verified);
    if (pending.length === 0) return;
    console.warn(
      `[chapter 4] ${pending.length} of ${pool.length} questions still have placeholder answers. ` +
        `Set the real correctOptionId and verified: true in chapter-4-content.ts.`,
    );
  }
}
