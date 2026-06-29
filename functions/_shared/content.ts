// Server-side content. Bundled into the Function by esbuild.
// The private notes are imported here ONLY so the Concierge proxy can use them;
// they are never returned by /api/content.
import event from '../../content/event.json'
import members from '../../content/members.json'
import groups from '../../content/groups.json'
import sessions from '../../content/sessions.json'
import locations from '../../content/locations.json'
import notes from '../../content/member-notes.private.json'

export const publicContent = { event, members, groups, sessions, locations }
export const privateNotes = notes as Record<string, string>
