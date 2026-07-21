const WORD_BANK = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'perspiciatis', 'unde',
  'omnis', 'iste', 'natus', 'error', 'voluptatem', 'accusantium', 'doloremque',
  'laudantium', 'totam', 'rem', 'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo',
  'inventore', 'veritatis', 'quasi', 'architecto', 'beatae', 'vitae', 'dicta',
  'explicabo', 'nemo', 'ipsam', 'quia', 'voluptas', 'aspernatur', 'aut', 'odit',
  'fugit', 'consequuntur', 'magni', 'dolores', 'eos', 'ratione', 'sequi',
  'nesciunt', 'neque', 'porro', 'quisquam', 'dolorem', 'adipisci', 'numquam',
  'eius', 'modi', 'tempora', 'incidunt', 'magnam', 'quaerat', 'etiam',
];

const CLASSIC_OPENING = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';

export type LoremUnit = 'words' | 'sentences' | 'paragraphs';

export interface LoremOptions {
  unit: LoremUnit;
  count: number;
  startWithLorem: boolean;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickWord(): string {
  return WORD_BANK[randomInt(0, WORD_BANK.length - 1)];
}

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function generateWordList(count: number): string[] {
  return Array.from({ length: Math.max(count, 0) }, pickWord);
}

function generateSentence(): string {
  const wordCount = randomInt(6, 14);
  const words = generateWordList(wordCount);
  words[0] = capitalize(words[0]);
  return words.join(' ') + '.';
}

function generateParagraph(): string {
  const sentenceCount = randomInt(3, 7);
  return Array.from({ length: sentenceCount }, generateSentence).join(' ');
}

export function generateLorem({ unit, count, startWithLorem }: LoremOptions): string {
  const safeCount = Math.max(1, Math.min(count, 500));

  if (unit === 'words') {
    const words = generateWordList(safeCount);
    if (startWithLorem) {
      const opener = 'lorem ipsum dolor sit amet consectetur adipiscing elit'.split(' ');
      for (let i = 0; i < Math.min(opener.length, words.length); i++) {
        words[i] = opener[i];
      }
    }
    words[0] = capitalize(words[0]);
    return words.join(' ');
  }

  if (unit === 'sentences') {
    const sentences = Array.from({ length: safeCount }, generateSentence);
    if (startWithLorem) sentences[0] = CLASSIC_OPENING;
    return sentences.join(' ');
  }

  const paragraphs = Array.from({ length: safeCount }, generateParagraph);
  if (startWithLorem) {
    paragraphs[0] = `${CLASSIC_OPENING} ${paragraphs[0]}`;
  }
  return paragraphs.join('\n\n');
}
