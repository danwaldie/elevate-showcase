import { useStore, type TabScreen } from '../state/store'
import s from './BottomNav.module.css'

const TABS: { key: TabScreen; label: string }[] = [
  { key: 'directory', label: 'Members' },
  { key: 'schedule', label: 'Schedule' },
  { key: 'map', label: 'Map' },
  { key: 'assistant', label: 'Concierge' },
]

export default function BottomNav() {
  const screen = useStore((st) => st.screen)
  const go = useStore((st) => st.go)
  return (
    <nav className={s.nav}>
      {TABS.map((t) => {
        const active = screen === t.key
        return (
          <button key={t.key} className={s.tab} onClick={() => go(t.key)} aria-current={active}>
            <span className={`${s.dot} ${active ? s.dotOn : ''}`} />
            <span className={`${s.label} ${active ? s.labelOn : ''}`}>{t.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
