/**
 * Who the two players are, in the words she will read.
 *
 * She is the one holding the phone, so player two is addressed directly.
 * Swap 'YOU' for her actual name if you would rather the card said it.
 */
export const PLAYERS = {
  one: { id: 'me', label: 'ED' },
  two: { id: 'her', label: 'YOU' },
} as const;
