// Mint personal links for every member (for testing the auth flow, and for the
// organizers to distribute). Usage:
//   SERVER_SECRET=... node scripts/make-links.mjs [baseUrl]
// The HMAC here must match functions/_shared/crypto.ts (HMAC-SHA256, base64url, "code:<id>").
import { createHmac } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const members = JSON.parse(readFileSync(join(here, '..', 'content', 'members.json'), 'utf8'))

const secret = process.env.SERVER_SECRET
if (!secret) {
  console.error('Set SERVER_SECRET in the environment.')
  process.exit(1)
}
const base = process.argv[2] || 'http://localhost:8788'

for (const m of members) {
  const sig = createHmac('sha256', secret).update(`code:${m.id}`).digest('base64url')
  console.log(`${m.name}\t${base}/?c=${m.id}.${sig}`)
}
