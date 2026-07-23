'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  generateCharacterString,
  generateByteString,
  generatePassphrase,
  generateFromPattern,
  characterModeEntropy,
  byteModeEntropy,
  passphraseModeEntropy,
  patternModeEntropy,
  generateBulk,
  MAX_BULK_SECRETS,
  type CharacterModeOptions,
  type ByteModeOptions,
  type ByteEncoding,
  type PassphraseModeOptions,
  type PassphraseSeparator,
  type EntropyEstimate,
} from '@/lib/tools/secret-generator';
import { Copy, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

type Mode = 'characters' | 'bytes' | 'passphrase' | 'pattern';

const MODE_TABS: { label: string; value: Mode }[] = [
  { label: 'Characters', value: 'characters' },
  { label: 'Bytes', value: 'bytes' },
  { label: 'Passphrase', value: 'passphrase' },
  { label: 'Pattern', value: 'pattern' },
];

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}

const ENTROPY_COLOR: Record<EntropyEstimate['label'], string> = {
  Weak: 'text-red-700 bg-red-50 border-red-200',
  Fair: 'text-amber-700 bg-amber-50 border-amber-200',
  Strong: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  'Very Strong': 'text-emerald-800 bg-emerald-100 border-emerald-300',
};

function EntropyBadge({ entropy }: { entropy: EntropyEstimate }) {
  return (
    <div className={cn('inline-flex w-fit items-center gap-1.5 rounded-md border px-2.5 py-1 text-sm font-medium', ENTROPY_COLOR[entropy.label])}>
      ~{entropy.bits} bits &middot; {entropy.label}
    </div>
  );
}

function PillToggle<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1 rounded-lg border-2 border-black bg-white p-0.5 text-sm">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            'cursor-pointer rounded-md px-2.5 py-1',
            value === opt.value ? 'bg-black text-white' : 'text-black/60 hover:text-black'
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-4 accent-black"
      />
      {label}
    </label>
  );
}

function ResultsList({ values }: { values: string[] }) {
  if (values.length === 0) return null;

  return (
    <div className="space-y-2">
      {values.map((value, i) => (
        <div key={i} className="flex items-center justify-between gap-2 rounded-lg border-2 border-black bg-white px-3 py-2">
          <span className="min-w-0 flex-1 truncate font-mono text-sm">{value}</span>
          <Button variant="ghost" size="icon-sm" onClick={() => copyToClipboard(value)}>
            <Copy size={13} />
          </Button>
        </div>
      ))}
    </div>
  );
}

function Disclaimer() {
  return (
    <div className="flex items-start gap-2 rounded-lg border-2 border-black bg-amber-50 p-3 text-sm">
      <ShieldAlert size={16} className="mt-0.5 shrink-0 text-amber-700" />
      <p>
        Generated entirely in your browser using the Web Crypto API. We never see, transmit, or
        store this value - nothing is sent to any server. If you navigate away without saving it,
        it&apos;s gone for good; there&apos;s no way for us to recover it.
      </p>
    </div>
  );
}

const DEFAULT_CHAR_OPTIONS: CharacterModeOptions = {
  length: 16,
  groups: { uppercase: true, lowercase: true, digits: true, symbols: false },
  excludeAmbiguous: false,
  prefix: '',
  suffix: '',
};

const CHAR_PRESETS: { label: string; options: CharacterModeOptions }[] = [
  {
    label: 'Password',
    options: { length: 16, groups: { uppercase: true, lowercase: true, digits: true, symbols: true }, excludeAmbiguous: true, prefix: '', suffix: '' },
  },
  {
    label: 'PIN',
    options: { length: 6, groups: { uppercase: false, lowercase: false, digits: true, symbols: false }, excludeAmbiguous: false, prefix: '', suffix: '' },
  },
  {
    label: 'API Key',
    options: { length: 32, groups: { uppercase: true, lowercase: true, digits: true, symbols: false }, excludeAmbiguous: true, prefix: 'key_', suffix: '' },
  },
  {
    label: 'Alphanumeric',
    options: { length: 20, groups: { uppercase: true, lowercase: true, digits: true, symbols: false }, excludeAmbiguous: false, prefix: '', suffix: '' },
  },
];

function CharacterModePanel({
  options,
  setOptions,
}: {
  options: CharacterModeOptions;
  setOptions: (o: CharacterModeOptions) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {CHAR_PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => setOptions(preset.options)}
            className="cursor-pointer rounded-md border-2 border-black bg-white px-2.5 py-1 text-xs hover:bg-black hover:text-white"
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm font-medium">Length</label>
        <Input
          type="number"
          min={1}
          max={128}
          value={options.length}
          onChange={(e) => {
            const next = Number(e.target.value);
            setOptions({ ...options, length: Number.isFinite(next) ? Math.max(1, Math.min(next, 128)) : 1 });
          }}
          className="w-24"
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <Checkbox checked={options.groups.uppercase} onChange={(v) => setOptions({ ...options, groups: { ...options.groups, uppercase: v } })} label="Uppercase (A-Z)" />
        <Checkbox checked={options.groups.lowercase} onChange={(v) => setOptions({ ...options, groups: { ...options.groups, lowercase: v } })} label="Lowercase (a-z)" />
        <Checkbox checked={options.groups.digits} onChange={(v) => setOptions({ ...options, groups: { ...options.groups, digits: v } })} label="Digits (0-9)" />
        <Checkbox checked={options.groups.symbols} onChange={(v) => setOptions({ ...options, groups: { ...options.groups, symbols: v } })} label="Symbols (!@#...)" />
      </div>

      <Checkbox
        checked={options.excludeAmbiguous ?? false}
        onChange={(v) => setOptions({ ...options, excludeAmbiguous: v })}
        label="Exclude ambiguous characters (0 O o I l 1)"
      />

      <div className="space-y-2">
        <label className="text-sm font-medium">Custom charset (overrides the toggles above)</label>
        <Input
          value={options.customCharset ?? ''}
          onChange={(e) => setOptions({ ...options, customCharset: e.target.value })}
          placeholder="e.g. ABCDEF0123456789"
          className="font-mono"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Prefix</label>
          <Input value={options.prefix ?? ''} onChange={(e) => setOptions({ ...options, prefix: e.target.value })} placeholder="sk_live_" className="font-mono" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Suffix</label>
          <Input value={options.suffix ?? ''} onChange={(e) => setOptions({ ...options, suffix: e.target.value })} className="font-mono" />
        </div>
      </div>
    </div>
  );
}

const DEFAULT_BYTE_OPTIONS: ByteModeOptions = { byteLength: 32, encoding: 'hex', prefix: '', suffix: '' };

const BYTE_PRESETS: { label: string; options: ByteModeOptions }[] = [
  { label: 'Hex Secret (32B)', options: { byteLength: 32, encoding: 'hex', prefix: '', suffix: '' } },
  { label: 'Base64url Token (32B)', options: { byteLength: 32, encoding: 'base64url', prefix: '', suffix: '' } },
  { label: 'Signing Key (64B)', options: { byteLength: 64, encoding: 'hex', prefix: '', suffix: '' } },
];

const ENCODING_OPTIONS: { label: string; value: ByteEncoding }[] = [
  { label: 'Hex', value: 'hex' },
  { label: 'Base64', value: 'base64' },
  { label: 'Base64url', value: 'base64url' },
  { label: 'Base32', value: 'base32' },
];

function ByteModePanel({ options, setOptions }: { options: ByteModeOptions; setOptions: (o: ByteModeOptions) => void }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {BYTE_PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => setOptions(preset.options)}
            className="cursor-pointer rounded-md border-2 border-black bg-white px-2.5 py-1 text-xs hover:bg-black hover:text-white"
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium">Byte length</label>
          <Input
            type="number"
            min={1}
            max={256}
            value={options.byteLength}
            onChange={(e) => {
              const next = Number(e.target.value);
              setOptions({ ...options, byteLength: Number.isFinite(next) ? Math.max(1, Math.min(next, 256)) : 1 });
            }}
            className="w-24"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium">Encoding</label>
          <PillToggle options={ENCODING_OPTIONS} value={options.encoding} onChange={(v) => setOptions({ ...options, encoding: v })} />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Prefix</label>
          <Input value={options.prefix ?? ''} onChange={(e) => setOptions({ ...options, prefix: e.target.value })} className="font-mono" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Suffix</label>
          <Input value={options.suffix ?? ''} onChange={(e) => setOptions({ ...options, suffix: e.target.value })} className="font-mono" />
        </div>
      </div>
    </div>
  );
}

const DEFAULT_PASSPHRASE_OPTIONS: PassphraseModeOptions = { wordCount: 5, separator: '-', capitalize: false, appendNumber: false };

const SEPARATOR_OPTIONS: { label: string; value: PassphraseSeparator }[] = [
  { label: '-', value: '-' },
  { label: '_', value: '_' },
  { label: '.', value: '.' },
  { label: 'space', value: ' ' },
  { label: 'none', value: '' },
];

function PassphraseModePanel({ options, setOptions }: { options: PassphraseModeOptions; setOptions: (o: PassphraseModeOptions) => void }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium">Word count</label>
          <Input
            type="number"
            min={2}
            max={12}
            value={options.wordCount}
            onChange={(e) => {
              const next = Number(e.target.value);
              setOptions({ ...options, wordCount: Number.isFinite(next) ? Math.max(2, Math.min(next, 12)) : 2 });
            }}
            className="w-24"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium">Separator</label>
          <PillToggle options={SEPARATOR_OPTIONS} value={options.separator} onChange={(v) => setOptions({ ...options, separator: v })} />
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <Checkbox checked={options.capitalize ?? false} onChange={(v) => setOptions({ ...options, capitalize: v })} label="Capitalize each word" />
        <Checkbox checked={options.appendNumber ?? false} onChange={(v) => setOptions({ ...options, appendNumber: v })} label="Append a random number" />
      </div>
    </div>
  );
}

function PatternModePanel({ pattern, setPattern }: { pattern: string; setPattern: (p: string) => void }) {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <label className="text-sm font-medium">Template</label>
        <Input value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder="AAAA-9999-aaaa-****" className="font-mono" />
      </div>
      <p className="text-xs text-muted-foreground">
        <span className="font-mono">A</span> = uppercase letter &middot;{' '}
        <span className="font-mono">a</span> = lowercase letter &middot;{' '}
        <span className="font-mono">9</span> = digit &middot;{' '}
        <span className="font-mono">*</span> = any letter/digit &middot;{' '}
        <span className="font-mono">X</span> = letter/digit/symbol &middot; other characters pass through unchanged
      </p>
    </div>
  );
}

export default function SecretGenerator() {
  const [mode, setMode] = useState<Mode>('characters');
  const [charOptions, setCharOptions] = useState(DEFAULT_CHAR_OPTIONS);
  const [byteOptions, setByteOptions] = useState(DEFAULT_BYTE_OPTIONS);
  const [passphraseOptions, setPassphraseOptions] = useState(DEFAULT_PASSPHRASE_OPTIONS);
  const [pattern, setPattern] = useState('AAAA-9999-aaaa-****');
  const [bulkCount, setBulkCount] = useState(1);
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState('');

  const entropy = useMemo(() => {
    try {
      if (mode === 'characters') return characterModeEntropy(charOptions);
      if (mode === 'bytes') return byteModeEntropy(byteOptions);
      if (mode === 'passphrase') return passphraseModeEntropy(passphraseOptions);
      return patternModeEntropy(pattern);
    } catch {
      return null;
    }
  }, [mode, charOptions, byteOptions, passphraseOptions, pattern]);

  const handleGenerate = () => {
    setError('');
    try {
      const generator = () => {
        if (mode === 'characters') return generateCharacterString(charOptions);
        if (mode === 'bytes') return generateByteString(byteOptions);
        if (mode === 'passphrase') return generatePassphrase(passphraseOptions);
        return generateFromPattern(pattern);
      };
      setResults(generateBulk(bulkCount, generator));
    } catch (e) {
      setResults([]);
      setError(e instanceof Error ? e.message : 'Could not generate a value with these options');
    }
  };

  return (
    <div className="space-y-6">
      <Disclaimer />

      <div className="flex justify-center">
        <PillToggle options={MODE_TABS} value={mode} onChange={setMode} />
      </div>

      {mode === 'characters' && <CharacterModePanel options={charOptions} setOptions={setCharOptions} />}
      {mode === 'bytes' && <ByteModePanel options={byteOptions} setOptions={setByteOptions} />}
      {mode === 'passphrase' && <PassphraseModePanel options={passphraseOptions} setOptions={setPassphraseOptions} />}
      {mode === 'pattern' && <PatternModePanel pattern={pattern} setPattern={setPattern} />}

      {entropy && <EntropyBadge entropy={entropy} />}

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Count</label>
          <Input
            type="number"
            min={1}
            max={MAX_BULK_SECRETS}
            value={bulkCount}
            onChange={(e) => {
              const next = Number(e.target.value);
              setBulkCount(Number.isFinite(next) ? Math.max(1, Math.min(next, MAX_BULK_SECRETS)) : 1);
            }}
            className="w-20"
          />
        </div>
        <Button onClick={handleGenerate}>Generate</Button>
      </div>

      {error && <p className="rounded bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Results</CardTitle>
          </CardHeader>
          <CardContent>
            <ResultsList values={results} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
