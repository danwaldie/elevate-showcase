// Convert the organizers' filled-in CSV (see content/authoring-template.csv) into
// content/members.json + content/member-notes.private.json.
//
// Usage:  node scripts/import-from-template.mjs <input.csv> [outDir=content]
//
// CSV columns: id,name,title,company,location,type,bio,industry,expertise,canHelp,
//              linkedin,whatsapp,photo,companyLogo,privateNote
//   - expertise & canHelp are ';'-separated lists
//   - photo/companyLogo are filenames (e.g. "aaron-archer.jpg"); blank -> null avatar/tile
//   - id blank -> derived from name (kebab-case)
//   - privateNote is server-only (goes to member-notes.private.json, never to the client)
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

function parseCSV(text) {
  const rows = []
  let row = []
  let field = ''
  let inQ = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQ) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i++
        } else inQ = false
      } else field += c
    } else if (c === '"') inQ = true
    else if (c === ',') {
      row.push(field)
      field = ''
    } else if (c === '\r') {
      /* skip */
    } else if (c === '\n') {
      row.push(field)
      rows.push(row)
      row = []
      field = ''
    } else field += c
  }
  if (field.length || row.length) {
    row.push(field)
    rows.push(row)
  }
  return rows
}

const kebab = (s) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
const list = (v) =>
  (v || '')
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean)
const assetPath = (v, dir) => {
  const f = (v || '').trim()
  if (!f) return null
  return f.startsWith('/') ? f : `/${dir}/${f}`
}

const input = process.argv[2]
const outDir = process.argv[3] || 'content'
if (!input) {
  console.error('Usage: node scripts/import-from-template.mjs <input.csv> [outDir=content]')
  process.exit(1)
}

const rows = parseCSV(readFileSync(input, 'utf8')).filter((r) => r.some((c) => c.trim() !== ''))
const header = rows.shift().map((h) => h.trim())
const idx = Object.fromEntries(header.map((h, i) => [h, i]))
const get = (r, k) => (idx[k] != null ? (r[idx[k]] ?? '').trim() : '')

const members = []
const notes = {}
for (const r of rows) {
  const name = get(r, 'name')
  if (!name) continue
  const id = get(r, 'id') || kebab(name)
  members.push({
    id,
    name,
    title: get(r, 'title'),
    company: get(r, 'company'),
    location: get(r, 'location'),
    type: get(r, 'type'),
    bio: get(r, 'bio'),
    photo: assetPath(get(r, 'photo'), 'photos'),
    companyLogo: assetPath(get(r, 'companyLogo'), 'logos'),
    industry: get(r, 'industry'),
    expertise: list(get(r, 'expertise')),
    canHelp: list(get(r, 'canHelp')),
    links: { linkedin: get(r, 'linkedin') || null, whatsapp: get(r, 'whatsapp') || null },
  })
  const note = get(r, 'privateNote')
  if (note) notes[id] = note
}

writeFileSync(join(outDir, 'members.json'), JSON.stringify(members, null, 2) + '\n')
writeFileSync(join(outDir, 'member-notes.private.json'), JSON.stringify(notes, null, 2) + '\n')
console.log(
  `Wrote ${members.length} members -> ${join(outDir, 'members.json')}`,
  `\nWrote ${Object.keys(notes).length} private notes -> ${join(outDir, 'member-notes.private.json')}`,
)
