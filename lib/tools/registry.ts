export interface Tool {
  slug: string;
  name: string;
  description: string;
}

export const toolsRegistry: Tool[] = [
  {
    slug: 'uuid-generator',
    name: 'UUID Generator',
    description: 'Generate v4 UUIDs instantly',
  },
  {
    slug: 'base64',
    name: 'Base64 Encode/Decode',
    description: 'Encode and decode base64 strings',
  },
  {
    slug: 'jwt-parser',
    name: 'JWT Parser',
    description: 'Decode and inspect JWT tokens',
  },
  {
    slug: 'epoch-converter',
    name: 'Epoch & Timezone Converter',
    description: 'Convert epoch timestamps and compare times across timezones',
  },
  {
    slug: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Format, validate, and explore JSON with a live tree view',
  },
  {
    slug: 'lorem-ipsum',
    name: 'Lorem Ipsum Generator',
    description: 'Generate placeholder text by words, sentences, or paragraphs',
  },
];