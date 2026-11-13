const pictures = {
  moon: { symbol: '🌙', word: 'AY', label: 'Hilal biçiminde ay' },
  horse: { symbol: '🐴', word: 'AT', label: 'At başı' },
  bear: { symbol: '🐻', word: 'AYI', label: 'Ayı başı' },
  honey: { symbol: '🍯', word: 'BAL', label: 'Bal kavanozu' },
  bee: { symbol: '🐝', word: 'ARI', label: 'Arı' },
  eye: { symbol: '👁️', word: 'GÖZ', label: 'Göz' },
  hand: { symbol: '✋', word: 'EL', label: 'Açık el' },
  apple: { symbol: '🍎', word: 'ELMA', label: 'Elma' },
  banana: { symbol: '🍌', word: 'MUZ', label: 'Muz' },
  cat: { symbol: '🐱', word: 'KEDİ', label: 'Kedi başı' },
  snow: { symbol: '❄️', word: 'KAR', label: 'Kar tanesi' },
  salt: { symbol: '🧂', word: 'TUZ', label: 'Tuzlukta tuz' },
  rose: { symbol: '🌹', word: 'GÜL', label: 'Gül' },
  tooth: { symbol: '🦷', word: 'DİŞ', label: 'Diş' },
} as const;

export type RebusPart =
  | { text: string }
  | { picture: keyof typeof pictures; remove?: string; reverse?: true };

export interface RebusPuzzle {
  parts: RebusPart[];
  answer: string;
}

export const rebusPool: RebusPuzzle[] = [
  { parts: [{ text: 'S' }, { picture: 'bear' }], answer: 'SAYI' },
  { parts: [{ picture: 'horse' }, { text: 'EŞ' }], answer: 'ATEŞ' },
  { parts: [{ picture: 'moon' }, { text: 'NA' }], answer: 'AYNA' },
  { parts: [{ picture: 'honey' }, { text: 'IK' }], answer: 'BALIK' },
  { parts: [{ picture: 'honey' }, { text: 'TA' }], answer: 'BALTA' },
  { parts: [{ picture: 'bee' }, { text: 'ZA' }], answer: 'ARIZA' },
  { parts: [{ picture: 'eye' }, { text: 'LÜK' }], answer: 'GÖZLÜK' },
  { parts: [{ picture: 'hand' }, { text: 'MAS' }], answer: 'ELMAS' },
  { parts: [{ picture: 'snow' }, { picture: 'horse' }, { text: 'E' }], answer: 'KARATE' },
  { parts: [{ picture: 'salt' }, { text: 'LUK' }], answer: 'TUZLUK' },
  { parts: [{ picture: 'rose' }, { text: 'ÜMSE' }], answer: 'GÜLÜMSE' },
  { parts: [{ picture: 'tooth' }, { text: 'Lİ' }], answer: 'DİŞLİ' },
  { parts: [{ picture: 'apple', remove: 'MA' }, { text: 'BİSE' }], answer: 'ELBİSE' },
  { parts: [{ picture: 'banana', remove: 'Z' }, { text: 'M' }], answer: 'MUM' },
  { parts: [{ picture: 'cat', remove: 'Dİ' }, { text: 'L' }], answer: 'KEL' },
  { parts: [{ picture: 'bear', remove: 'I' }, { text: 'AK' }], answer: 'AYAK' },
  { parts: [{ picture: 'moon', reverse: true }, { text: 'TAK' }], answer: 'YATAK' },
  { parts: [{ picture: 'horse', reverse: true }, { text: 'VA' }], answer: 'TAVA' },
];

export function getRebusPicture(part: Extract<RebusPart, { picture: string }>) {
  return pictures[part.picture];
}

export function explainRebus(puzzle: RebusPuzzle): string {
  const fragments = puzzle.parts.map(part => {
    if ('text' in part) return part.text;
    const { word } = getRebusPicture(part);
    if (part.remove) return `(${word} − ${part.remove} → ${word.replace(part.remove, '')})`;
    if (part.reverse) return `(${word} tersten → ${[...word].reverse().join('')})`;
    return word;
  });
  return `${fragments.join(' + ')} = ${puzzle.answer}`;
}
