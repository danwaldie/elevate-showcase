import s from './Welcome.module.css'
import { useStore } from '../state/store'
import { useContent } from '../state/hooks'
import { initials } from '../lib/format'
import Wordmark from '../components/Wordmark'

export default function Welcome() {
  const { event, members } = useContent()
  const viewer = useStore((st) => st.viewer)
  const enter = useStore((st) => st.enter)
  const me = members.find((m) => m.id === viewer)

  return (
    <div className={s.screen}>
      <div className={s.top}>
        <Wordmark width={158} fill="var(--wtext)" />
      </div>

      <div className={s.middle}>
        <h1 className={s.title}>{event.title}</h1>
        <div className={s.date}>{event.dateRange}</div>
        <div className={s.rule} />
        <p className={s.tagline}>{event.tagline}</p>
      </div>

      <div className={s.bottom}>
        {me && (
          <div className={s.signedIn}>
            <span className={s.avatar}>{initials(me.name)}</span>
            <span className={s.signedInText}>
              <span className={s.signedInLabel}>Signed in as</span>
              <span className={s.signedInName}>{me.name}</span>
            </span>
          </div>
        )}
        <button className={s.enter} onClick={enter}>
          Enter the Retreat
        </button>
        <p className={s.disclaimer}>
          Portfolio showcase. All attendees, companies, and locations shown are
          fictional — names are drawn from classic literature — to protect the
          privacy of the real Elevate community.
        </p>
      </div>
    </div>
  )
}
