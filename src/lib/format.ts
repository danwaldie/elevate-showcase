import type { EventConfig } from '../types'

export function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0] ?? '')
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? name
}

export function dayLabel(event: EventConfig, key: string): string {
  return event.days.find((d) => d.key === key)?.label ?? key
}

export function timeRange(start: string, end?: string): string {
  return end ? `${start} – ${end}` : start
}

/** A contact link is usable only if it's a non-empty, non-placeholder URL. */
export function validLink(url?: string | null): url is string {
  return !!url && url.trim() !== '' && url !== 'about:blank'
}
