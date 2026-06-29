import s from './Sidebar.module.css'
import { useStore, type TabScreen } from '../state/store'
import { useContent } from '../state/hooks'
import { initials } from '../lib/format'
import Wordmark from './Wordmark'

const TABS: { key: TabScreen; label: string }[] = [
  { key: 'directory', label: 'Members' },
  { key: 'schedule', label: 'Schedule' },
  { key: 'map', label: 'Map' },
  { key: 'assistant', label: 'Concierge' },
]

export default function Sidebar() {
  const { members, event } = useContent()
  const tab = useStore((st) => st.tab)
  const go = useStore((st) => st.go)
  const home = useStore((st) => st.home)
  const viewer = useStore((st) => st.viewer)
  const me = members.find((m) => m.id === viewer)

  return (
    <aside className={s.sidebar}>
      <div className={s.brand}>
        <button className={s.brandBtn} onClick={home} aria-label="Back to welcome">
          <Wordmark width={116} fill="var(--ink)" />
        </button>
        <div className={s.brandSub}>{event.title}</div>
      </div>

      <nav className={s.nav}>
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`${s.item} ${tab === t.key ? s.itemOn : ''}`}
            onClick={() => go(t.key)}
            aria-current={tab === t.key}
          >
            <span className={s.itemDot} />
            {t.label}
          </button>
        ))}
      </nav>

      {me && (
        <div className={s.signed}>
          <span className={s.avatar}>
            {me.photo && (
              <img
                className={s.avatarImg}
                src={me.photo}
                alt=""
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            )}
            {initials(me.name)}
          </span>
          <span className={s.signedText}>
            <span className={s.signedLabel}>Signed in</span>
            <span className={s.signedName}>{me.name}</span>
          </span>
        </div>
      )}
    </aside>
  )
}
