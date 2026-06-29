import { create } from 'zustand'
import type { Content } from '../types'
import { loadContent } from '../data/content'

export type Screen =
  | 'welcome'
  | 'directory'
  | 'profile'
  | 'schedule'
  | 'session'
  | 'map'
  | 'assistant'
export type TabScreen = 'directory' | 'schedule' | 'map' | 'assistant'
export type SortMode = 'az' | 'mine'

export interface Recommendation {
  memberId: string
  reason: string
}
export interface ChatMsg {
  role: 'user' | 'assistant'
  text: string
  recommendations?: Recommendation[]
}

const DEV_DEFAULT_VIEWER = 'elizabeth-bennet'
const TOKEN_KEY = 'elevate.token'
const VIEWER_KEY = 'elevate.viewer'

interface AppState {
  content: Content | null
  status: 'loading' | 'ready' | 'error' | 'needAuth'
  error?: string
  viewer: string
  token: string | null

  screen: Screen
  tab: TabScreen
  selMember: string | null
  profileFrom: Screen
  selSession: string | null
  sessionFrom: Screen
  selLoc: string | null

  query: string
  loc: string
  sort: SortMode

  day: string

  chat: ChatMsg[]
  input: string
  typing: boolean

  init: () => Promise<void>
  setViewer: (id: string) => void
  go: (screen: TabScreen) => void
  enter: () => void
  home: () => void
  openMember: (id: string, from: Screen) => void
  openSession: (id: string, from: Screen) => void
  backProfile: () => void
  backSession: () => void
  openMap: (locKey: string | null) => void
  setSelLoc: (locKey: string | null) => void
  setQuery: (q: string) => void
  setLoc: (loc: string) => void
  setSort: (s: SortMode) => void
  setDay: (day: string) => void
  setInput: (v: string) => void
  ask: (text: string) => void
  send: () => void
}

export const useStore = create<AppState>((set, get) => {
  // Concierge send (Claude proxy wired fully in Phase 4).
  const doSend = async (text: string) => {
    const t = (text || '').trim()
    if (!t) return
    const { viewer, token } = get()
    set((s) => ({ chat: [...s.chat, { role: 'user', text: t }], input: '', typing: true }))
    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          ...(token ? { authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ message: t, viewer }),
      })
      if (!res.ok) throw new Error(String(res.status))
      const data = (await res.json()) as {
        reply: string
        recommendations?: Recommendation[]
      }
      set((s) => ({
        chat: [
          ...s.chat,
          { role: 'assistant', text: data.reply, recommendations: data.recommendations },
        ],
        typing: false,
      }))
    } catch {
      set((s) => ({
        chat: [
          ...s.chat,
          {
            role: 'assistant',
            text: "I can't reach the concierge right now — it needs a connection. Please try again in a moment.",
          },
        ],
        typing: false,
      }))
    }
  }

  return {
    content: null,
    status: 'loading',
    viewer: DEV_DEFAULT_VIEWER,
    token: null,

    screen: 'welcome',
    tab: 'directory',
    selMember: null,
    profileFrom: 'directory',
    selSession: null,
    sessionFrom: 'schedule',
    selLoc: null,

    query: '',
    loc: 'All',
    sort: 'az',

    day: '',

    chat: [],
    input: '',
    typing: false,

    init: async () => {
      try {
        let token: string | null = null

        if (!import.meta.env.DEV) {
          // Production: resolve a session token, redeeming a personal link (?c=) if present.
          token = localStorage.getItem(TOKEN_KEY)
          if (!token) {
            // Redeem a personal link (?c=) when present; otherwise open as a
            // demo attendee so anyone with the public showcase link can explore.
            const url = new URL(window.location.href)
            const code = url.searchParams.get('c')
            const res = await fetch('/api/auth', {
              method: 'POST',
              headers: { 'content-type': 'application/json' },
              body: JSON.stringify(code ? { code } : { demo: true }),
            })
            if (res.ok) {
              const { token: t, memberId } = (await res.json()) as {
                token: string
                memberId: string
              }
              token = t
              localStorage.setItem(TOKEN_KEY, t)
              localStorage.setItem(VIEWER_KEY, memberId)
              if (code) {
                url.searchParams.delete('c')
                window.history.replaceState({}, '', url.toString())
              }
            }
          }
          if (!token) {
            set({ status: 'needAuth' })
            return
          }
        }

        const content = await loadContent(token)
        const storedViewer = localStorage.getItem(VIEWER_KEY)
        const viewer =
          storedViewer && content.members.some((m) => m.id === storedViewer)
            ? storedViewer
            : import.meta.env.DEV
              ? DEV_DEFAULT_VIEWER
              : (content.members[0]?.id ?? DEV_DEFAULT_VIEWER)
        set({
          content,
          status: 'ready',
          viewer,
          token,
          day: content.event.days[0]?.key ?? '',
        })
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'failed to load'
        set({ status: msg === 'unauthorized' ? 'needAuth' : 'error', error: msg })
      }
    },

    setViewer: (id) => {
      localStorage.setItem(VIEWER_KEY, id)
      set({ viewer: id })
    },

    go: (screen) => set({ screen, tab: screen, selMember: null, selSession: null }),
    enter: () => set({ screen: 'directory', tab: 'directory' }),
    home: () => set({ screen: 'welcome' }),

    openMember: (id, from) => set({ selMember: id, profileFrom: from, screen: 'profile' }),
    openSession: (id, from) => set({ selSession: id, sessionFrom: from, screen: 'session' }),
    backProfile: () => set((s) => ({ screen: s.profileFrom, selMember: null })),
    backSession: () => set((s) => ({ screen: s.sessionFrom, selSession: null })),
    openMap: (locKey) =>
      set({ screen: 'map', tab: 'map', selLoc: locKey, selMember: null, selSession: null }),
    setSelLoc: (locKey) => set({ selLoc: locKey }),

    setQuery: (query) => set({ query }),
    setLoc: (loc) => set({ loc }),
    setSort: (sort) => set({ sort }),
    setDay: (day) => set({ day }),

    setInput: (input) => set({ input }),
    ask: (text) => void doSend(text),
    send: () => void doSend(get().input),
  }
})

// Dev-only: expose the store for manual testing / screenshots.
if (import.meta.env.DEV) {
  ;(window as unknown as { __store?: typeof useStore }).__store = useStore
}
