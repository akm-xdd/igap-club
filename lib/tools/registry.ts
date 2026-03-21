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
];