import { useEffect, useRef, type KeyboardEvent } from 'react'
import s from './Concierge.module.css'
import { useStore } from '../state/store'
import { useContent, useMemberMap } from '../state/hooks'
import { firstName } from '../lib/format'
import Avatar from '../components/Avatar'

const SUGGESTIONS = [
  'Who should I talk to about fundraising?',
  "Where's my Forum group?",
  'Anyone working on climate?',
  'Brief me on Aaron Archer',
]

export default function Concierge() {
  const { members } = useContent()
  const memberMap = useMemberMap()
  const viewer = useStore((st) => st.viewer)
  const chat = useStore((st) => st.chat)
  const input = useStore((st) => st.input)
  const typing = useStore((st) => st.typing)
  const setInput = useStore((st) => st.setInput)
  const send = useStore((st) => st.send)
  const ask = useStore((st) => st.ask)
  const openMember = useStore((st) => st.openMember)

  const me = members.find((m) => m.id === viewer)
  const intro = `Hi ${me ? firstName(me.name) : 'there'} — I'm your Cedar Lake concierge. Ask me who to meet, or I'll prep you for a conversation.`

  const scrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [chat, typing])

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className={s.screen}>
      <div className={s.header}>
        <div className="overline">Ask Anything</div>
        <h1 className={s.title}>Concierge</h1>
      </div>

      <div className={`${s.messages} scroll`} ref={scrollRef}>
        <div className={s.botBubble}>{intro}</div>

        {chat.map((m, i) => (
          <div className={s.group} key={i}>
            <div className={m.role === 'user' ? s.userBubble : s.botBubble}>{m.text}</div>
            {m.role === 'assistant' && m.recommendations && m.recommendations.length > 0 && (
              <div className={s.cards}>
                {m.recommendations.map((r, j) => {
                  const p = memberMap[r.memberId]
                  if (!p) return null
                  return (
                    <button
                      key={j}
                      className={s.card}
                      onClick={() => openMember(p.id, 'assistant')}
                    >
                      <Avatar name={p.name} src={p.photo} size={42} />
                      <span className={s.cardBody}>
                        <span className={s.cardName}>{p.name}</span>
                        <span className={s.cardLine}>
                          {p.title} · {p.company}
                        </span>
                        <span className={s.cardReason}>{r.reason}</span>
                      </span>
                      <span className={s.cardChev}>›</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        ))}

        {typing && (
          <div className={s.typing}>
            <span />
            <span />
            <span />
          </div>
        )}
      </div>

      <div className={s.inputBar}>
        {chat.length === 0 && (
          <div className={`${s.suggestions} scroll`}>
            {SUGGESTIONS.map((q) => (
              <button key={q} className={s.suggestion} onClick={() => ask(q)}>
                {q}
              </button>
            ))}
          </div>
        )}
        <div className={s.inputRow}>
          <input
            className={s.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            placeholder="Ask who to meet…"
            aria-label="Ask the concierge"
          />
          <button className={s.sendBtn} onClick={() => send()} aria-label="Send">
            ↑
          </button>
        </div>
      </div>
    </div>
  )
}
