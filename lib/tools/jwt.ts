export interface JWTDecoded {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
}

function base64UrlDecode(input: string): string {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder('utf-8').decode(bytes);
}

export function decodeJWT(token: string): JWTDecoded {
  const parts = token.split('.');

  if (parts.length !== 3) {
    throw new Error('Invalid JWT format');
  }

  const [headerB64, payloadB64, signature] = parts;

  if (!headerB64 || !payloadB64) {
    throw new Error('Invalid JWT format');
  }

  try {
    const header = JSON.parse(base64UrlDecode(headerB64));
    const payload = JSON.parse(base64UrlDecode(payloadB64));

    return { header, payload, signature };
  } catch {
    throw new Error('Failed to decode JWT');
  }
}

export function isInsecureAlg(alg: unknown): boolean {
  return typeof alg !== 'string' || alg.trim() === '' || alg.toLowerCase() === 'none';
}

export interface ClaimInfo {
  label: string;
  isDate?: boolean;
}

/** Metadata for RFC 7519 registered claims, used to show jwt.io-style hover hints. */
export const REGISTERED_CLAIMS: Record<string, ClaimInfo> = {
  iss: { label: 'Issuer' },
  sub: { label: 'Subject' },
  aud: { label: 'Audience' },
  exp: { label: 'Expiration Time (seconds since Unix epoch)', isDate: true },
  nbf: { label: 'Not Before (seconds since Unix epoch)', isDate: true },
  iat: { label: 'Issued At (seconds since Unix epoch)', isDate: true },
  jti: { label: 'JWT ID' },
};

export type ExpiryState = 'expired' | 'not-yet-valid' | 'valid' | 'none';

export interface ExpiryStatus {
  state: ExpiryState;
  label: string;
}

/** Reads `exp`/`nbf` off a decoded payload and summarizes the token's current validity window. */
export function getExpiryStatus(payload: Record<string, unknown>): ExpiryStatus {
  const now = Date.now();
  const exp = typeof payload.exp === 'number' ? payload.exp * 1000 : null;
  const nbf = typeof payload.nbf === 'number' ? payload.nbf * 1000 : null;

  if (exp !== null && now >= exp) {
    return { state: 'expired', label: 'Token expired' };
  }
  if (nbf !== null && now < nbf) {
    return { state: 'not-yet-valid', label: 'Token not yet valid' };
  }
  if (exp !== null || nbf !== null) {
    return { state: 'valid', label: 'Token is currently valid' };
  }
  return { state: 'none', label: 'Token has no expiration or not-before claim' };
}
