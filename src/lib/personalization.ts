import type { Content, Group, Session } from '../types'

export interface SharedSession {
  session: Session
  group: Group
}

export interface SessionAt {
  session: Session
  group?: Group
  isMine: boolean
}

/**
 * Pure, derived personalization over members <-> groups <-> sessions.
 * Mirrors the prototype's groupOf / forumOf / sharedSessions / sessionsAt / myLocKeys.
 */
export function createPersonalization(content: Content) {
  const { groups, sessions } = content

  const groupsFor = (session: Session): Group[] =>
    session.groupsRef ? (groups[session.groupsRef] ?? []) : []

  const groupOf = (session: Session, memberId: string): Group | null =>
    groupsFor(session).find((g) => g.memberIds.includes(memberId)) ?? null

  const forumOf = (memberId: string): Group | null =>
    (groups.forum ?? []).find((g) => g.memberIds.includes(memberId)) ?? null

  /** Sessions where viewer & member share a breakout/experience group (deduped by group). */
  const sharedSessions = (viewerId: string, memberId: string): SharedSession[] => {
    const out: SharedSession[] = []
    const seen = new Set<string>()
    for (const session of sessions) {
      if (!session.groupsRef) continue
      const a = groupOf(session, viewerId)
      const b = groupOf(session, memberId)
      if (a && b && a.label === b.label && a.venue === b.venue) {
        const key = a.label + '|' + a.venue
        if (!seen.has(key)) {
          seen.add(key)
          out.push({ session, group: a })
        }
      }
    }
    return out
  }

  /** All sessions taking place at a location, flagged with whether the viewer is in them. */
  const sessionsAt = (locKey: string, viewerId: string): SessionAt[] => {
    const out: SessionAt[] = []
    for (const session of sessions) {
      if (session.groupsRef) {
        const mine = groupOf(session, viewerId)
        for (const g of groupsFor(session)) {
          if (g.locKey === locKey) {
            out.push({ session, group: g, isMine: !!(mine && mine.label === g.label) })
          }
        }
      } else if (session.locKey === locKey) {
        out.push({ session, isMine: false })
      }
    }
    return out
  }

  /** Location keys where the viewer personally has a session (their group venue or a plenary). */
  const myLocKeys = (viewerId: string): Set<string> => {
    const keys = new Set<string>()
    for (const session of sessions) {
      if (session.groupsRef) {
        const g = groupOf(session, viewerId)
        if (g?.locKey) keys.add(g.locKey)
      } else if (session.locKey) {
        keys.add(session.locKey)
      }
    }
    return keys
  }

  return { groupsFor, groupOf, forumOf, sharedSessions, sessionsAt, myLocKeys }
}

export type Personalization = ReturnType<typeof createPersonalization>
