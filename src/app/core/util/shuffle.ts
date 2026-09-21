/** Fisher-Yates, on a copy. */
export function shuffled<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** A few distinct items, picked at random. */
export function pickSome<T>(pool: readonly T[], count: number): T[] {
  return shuffled(pool).slice(0, Math.min(count, pool.length));
}
