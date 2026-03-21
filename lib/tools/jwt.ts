export interface JWTDecoded {
  header: Record<string, any>;
  payload: Record<string, any>;
  signature: string;
}

export function decodeJWT(token: string): JWTDecoded {
  const parts = token.split('.');
  
  if (parts.length !== 3) {
    throw new Error('Invalid JWT format');
  }

  const [headerB64, payloadB64, signature] = parts;

  try {
    const header = JSON.parse(atob(headerB64.replace(/-/g, '+').replace(/_/g, '/')));
    const payload = JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/')));

    return { header, payload, signature };
  } catch {
    throw new Error('Failed to decode JWT');
  }
}