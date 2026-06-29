import type { Content } from '../types'

/**
 * Dev: load the repo fixtures directly (guarded by import.meta.env.DEV so the
 * member data is tree-shaken out of the production client bundle).
 * Prod: fetch the token-gated /api/content endpoint.
 */
export async function loadContent(token?: string | null): Promise<Content> {
  if (import.meta.env.DEV) {
    const [members, groups, sessions, locations, event] = await Promise.all([
      import('../../content/members.json'),
      import('../../content/groups.json'),
      import('../../content/sessions.json'),
      import('../../content/locations.json'),
      import('../../content/event.json'),
    ])
    return {
      event: event.default as unknown as Content['event'],
      members: members.default as unknown as Content['members'],
      groups: groups.default as unknown as Content['groups'],
      sessions: sessions.default as unknown as Content['sessions'],
      locations: locations.default as unknown as Content['locations'],
    }
  }
  const res = await fetch('/api/content', {
    headers: token ? { authorization: `Bearer ${token}` } : {},
  })
  if (res.status === 401) throw new Error('unauthorized')
  if (!res.ok) throw new Error(`content ${res.status}`)
  return (await res.json()) as Content
}
