import { useMemo } from 'react'
import { useStore } from './store'
import { createPersonalization, type Personalization } from '../lib/personalization'
import type { Content, Member } from '../types'

export function useContent(): Content {
  const content = useStore((s) => s.content)
  if (!content) throw new Error('content not ready')
  return content
}

export function useMemberMap(): Record<string, Member> {
  const { members } = useContent()
  return useMemo(() => Object.fromEntries(members.map((m) => [m.id, m])), [members])
}

export function usePersonalization(): Personalization {
  const content = useContent()
  return useMemo(() => createPersonalization(content), [content])
}
