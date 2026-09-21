/**
 * Tiny bitmap sprites. Each row is one pixel row; each character maps to a
 * palette colour. `.` is transparent. Rendered as crisp SVG rects by
 * <app-pixel-sprite>, so they scale to any size without blurring.
 */
export interface Sprite {
  readonly rows: readonly string[];
  readonly palette: Readonly<Record<string, string>>;
}

const INK = 'var(--border)';

export const SPRITES = {
  heart: {
    rows: ['.XX.XX.', 'XXXXXXX', 'XXXXXXX', '.XXXXX.', '..XXX..', '...X...'],
    palette: { X: 'currentColor' },
  },

  sparkle: {
    rows: ['...X...', '...X...', '..XXX..', 'XXXXXXX', '..XXX..', '...X...', '...X...'],
    palette: { X: 'currentColor' },
  },

  flower: {
    rows: ['.A...A.', 'AAA.AAA', 'AABBBAA', '.ABBBA.', 'AABBBAA', 'AAA.AAA', '.A...A.'],
    palette: { A: 'var(--strawberry)', B: 'var(--orange)' },
  },

  envelope: {
    rows: [
      'XXXXXXXXXXX',
      'XBBBBBBBBBX',
      'XBXBBBBBXBX',
      'XBBXBBBXBBX',
      'XBBBXBXBBBX',
      'XBBBBXBBBBX',
      'XXXXXXXXXXX',
    ],
    palette: { X: INK, B: 'var(--cream)' },
  },

  gift: {
    rows: [
      '..B...B..',
      '.BBB.BBB.',
      '..BB.BB..',
      'AAAABAAAA',
      'AAAABAAAA',
      '.AAABAAA.',
      '.AAABAAA.',
      '.AAABAAA.',
      '.AAAAAAA.',
    ],
    palette: { A: 'var(--coral)', B: 'var(--lavender)' },
  },

  skull: {
    rows: ['.XXXXX.', 'XXXXXXX', 'X.XXX.X', 'X.XXX.X', 'XXXXXXX', '.XXXXX.', '.X.X.X.'],
    palette: { X: 'currentColor' },
  },

  menu: {
    rows: ['XXXXXXX', '.......', 'XXXXXXX', '.......', 'XXXXXXX'],
    palette: { X: 'currentColor' },
  },

  check: {
    rows: [
      '.......XX',
      '......XX.',
      'X....XX..',
      'XX..XX...',
      '.XXXX....',
      '..XX.....',
      '.........',
    ],
    palette: { X: 'currentColor' },
  },

  cursor: {
    rows: [
      'X.......',
      'XX......',
      'XBX.....',
      'XBBX....',
      'XBBBX...',
      'XBBBBX..',
      'XBBBBBX.',
      'XBBBBBBX',
      'XBBBXXXX',
      'XBXBX...',
      'XX.XBX..',
      'X...XX..',
    ],
    palette: { X: INK, B: 'var(--cream)' },
  },

  /** Player two, so the two of them are not the same sprite. */
  avatar2: {
    rows: [
      '..HHHHHHHH..',
      '.HHHHHHHHHH.',
      '.HHFFFFFFHH.',
      '.HHFEFFEFHH.',
      '.HFFFFFFFFH.',
      '.HFFFMMFFFH.',
      '.HHFFFFFFHH.',
      '..HHFFFFHH..',
      '..SSSSSSSS..',
      '.SSSSSSSSSS.',
      'SSSSSSSSSSSS',
      'SS.SSSSSS.SS',
    ],
    palette: {
      H: '#5a2b3f',
      F: 'var(--peach)',
      E: '#3b2233',
      M: 'var(--soft-red)',
      S: 'var(--strawberry)',
    },
  },

  /** The little guy in the friend-request card. */
  avatar: {
    rows: [
      '...HHHHHH...',
      '..HHHHHHHH..',
      '..HFFFFFFH..',
      '..HFEFFEFH..',
      '..FFFFFFFF..',
      '..FFFMMFFF..',
      '...FFFFFF...',
      '....FFFF....',
      '..SSSSSSSS..',
      '.SSSSSSSSSS.',
      'SSSSSSSSSSSS',
      'SS.SSSSSS.SS',
    ],
    palette: {
      H: '#3b2233',
      F: 'var(--peach)',
      E: '#3b2233',
      M: 'var(--soft-red)',
      S: 'var(--coral)',
    },
  },
} as const satisfies Record<string, Sprite>;

export type SpriteName = keyof typeof SPRITES;
