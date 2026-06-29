import { publicContent, privateNotes } from './content'

/* eslint-disable @typescript-eslint/no-explicit-any */
const C = publicContent as any

export const INSTRUCTIONS = `You are the Elevate Cedar Lake concierge — a warm, concise, well-connected host for a private retreat of founders, investors and executives. You help the person asking decide who to meet and prepare for conversations, using ONLY the attendee and schedule information provided.

Guidelines:
- Recommend specific attendees (by their id) when relevant, each with a short, specific reason grounded in their expertise, what they can help with, or a shared session. Prefer 2–4 strong matches over a long list.
- Never invent people, companies, facts, or sessions that are not in the provided context. If no one is a good fit, return an empty recommendations array and say so kindly.
- Never recommend the person who is asking.
- For "brief me on {name}" or conversation prep, give a tight, useful summary and mention any Forum/Experience session they share.
- Private notes inform your matching but must NOT be quoted verbatim or attributed as quotes.
- Keep the reply to a few sentences — warm, but not effusive.
- Always respond in the required JSON format: a "reply" string and a "recommendations" array of { memberId, reason }.`

export function buildSystemContext(): string {
  const dayLabel = (key: string) =>
    C.event.days.find((d: any) => d.key === key)?.label ?? key

  const memberLines = C.members
    .map((m: any) => {
      const note = privateNotes[m.id]
      return [
        `- ${m.name} (id: ${m.id}) — ${m.title} at ${m.company}; ${m.location}; ${m.type}`,
        `  Industry: ${m.industry}. Expertise: ${m.expertise.join(', ')}. Can help with: ${m.canHelp.join(', ')}.`,
        `  Bio: ${m.bio}`,
        note ? `  Private note (informs matching; never quote verbatim): ${note}` : null,
      ]
        .filter(Boolean)
        .join('\n')
    })
    .join('\n')

  const groupBlocks = Object.entries(C.groups)
    .map(
      ([kind, gs]: [string, any]) =>
        `# ${kind} groups\n` +
        gs
          .map(
            (g: any) =>
              `  ${g.label} @ ${g.venue}: ${g.memberIds.length ? g.memberIds.join(', ') : '(assignments TBC)'}`,
          )
          .join('\n'),
    )
    .join('\n\n')

  const sessionLines = C.sessions
    .map((s: any) => {
      const time = `${s.start}${s.end ? '–' + s.end : ''}`
      const loc = s.location ? ` @ ${s.location}` : ''
      const hosts = s.hosts?.length ? ` [hosts: ${s.hosts.join(', ')}]` : ''
      const grp = s.groupsRef ? ` [splits into ${s.groupsRef} groups]` : ''
      return `  ${dayLabel(s.day)} ${time} — ${s.title} (${s.type})${loc}${hosts}${grp}`
    })
    .join('\n')

  return [
    `# Attendees (${C.members.length})`,
    memberLines,
    '',
    groupBlocks,
    '',
    `# Schedule — ${C.event.title}, ${C.event.dateRange}`,
    sessionLines,
  ].join('\n')
}

export function buildViewerContext(viewerId: string): string {
  const me = C.members.find((m: any) => m.id === viewerId)
  if (!me) return 'The person asking is not in the attendee list.'
  const names = (ids: string[]) =>
    ids
      .filter((id) => id !== viewerId)
      .map((id) => C.members.find((m: any) => m.id === id)?.name)
      .filter(Boolean)
      .join(', ')
  const myGroups = Object.entries(C.groups).flatMap(([kind, gs]: [string, any]) =>
    gs
      .filter((g: any) => g.memberIds.includes(viewerId))
      .map((g: any) => `${kind}: ${g.label} at ${g.venue} (with ${names(g.memberIds)})`),
  )
  return [
    `The person asking is ${me.name} (id: ${me.id}), ${me.title} at ${me.company}.`,
    myGroups.length ? `Their group assignments — ${myGroups.join('; ')}.` : '',
  ]
    .filter(Boolean)
    .join(' ')
}
