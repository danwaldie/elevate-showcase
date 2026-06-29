// Stateless HMAC auth using Web Crypto (available in the Workers/Pages runtime).
// Personal link code:  `<memberId>.<sig>`  where sig = HMAC(SERVER_SECRET, "code:<memberId>")
// Session token:       `<payloadB64url>.<sig>` where payload = {sub, exp}

const enc = new TextEncoder()
const dec = new TextDecoder()

function b64urlFromBytes(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf)
  let str = ''
  for (const b of bytes) str += String.fromCharCode(b)
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}
function b64urlToBytes(s: string): Uint8Array {
  let t = s.replace(/-/g, '+').replace(/_/g, '/')
  const pad = t.length % 4
  if (pad) t += '='.repeat(4 - pad)
  const bin = atob(t)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}
const b64urlFromString = (s: string) => b64urlFromBytes(enc.encode(s))
const stringFromB64url = (s: string) => dec.decode(b64urlToBytes(s))

async function hmacB64url(secret: string, msg: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(msg))
  return b64urlFromBytes(sig)
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

export async function signCode(secret: string, memberId: string): Promise<string> {
  const sig = await hmacB64url(secret, `code:${memberId}`)
  return `${memberId}.${sig}`
}

export async function verifyCode(secret: string, code: string): Promise<string | null> {
  const i = code.lastIndexOf('.')
  if (i <= 0) return null
  const memberId = code.slice(0, i)
  const sig = code.slice(i + 1)
  const expected = await hmacB64url(secret, `code:${memberId}`)
  return timingSafeEqual(sig, expected) ? memberId : null
}

export async function issueToken(
  secret: string,
  memberId: string,
  ttlSec = 60 * 60 * 24 * 30,
): Promise<string> {
  const payload = { sub: memberId, exp: Math.floor(Date.now() / 1000) + ttlSec }
  const body = b64urlFromString(JSON.stringify(payload))
  const sig = await hmacB64url(secret, `tok:${body}`)
  return `${body}.${sig}`
}

export async function verifyToken(secret: string, token: string): Promise<string | null> {
  const i = token.lastIndexOf('.')
  if (i <= 0) return null
  const body = token.slice(0, i)
  const sig = token.slice(i + 1)
  const expected = await hmacB64url(secret, `tok:${body}`)
  if (!timingSafeEqual(sig, expected)) return null
  try {
    const payload = JSON.parse(stringFromB64url(body)) as { sub: string; exp: number }
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null
    return payload.sub
  } catch {
    return null
  }
}
