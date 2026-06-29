import s from './Schedule.module.css'
import { useStore } from '../state/store'
import { useContent, useMemberMap, usePersonalization } from '../state/hooks'
import { firstName } from '../lib/format'
import Chip from '../components/Chip'
import FacePile from '../components/FacePile'
import type { Session } from '../types'

const TYPE_CHIP = {
  plenary: { variant: 'everyone', label: 'EVERYONE' },
  breakout: { variant: 'groups', label: 'GROUPS' },
  experience: { variant: 'choose', label: 'CHOOSE' },
  meal: { variant: 'dining', label: 'DINING' },
  logistics: { variant: 'logistics', label: 'LOGISTICS' },
} as const

export default function Schedule() {
  const { event, members, sessions } = useContent()
  const memberMap = useMemberMap()
  const { groupOf } = usePersonalization()
  const viewer = useStore((st) => st.viewer)
  const day = useStore((st) => st.day)
  const setDay = useStore((st) => st.setDay)
  const openSession = useStore((st) => st.openSession)
  const me = members.find((m) => m.id === viewer)

  const activeDay = day || event.days[0]?.key
  const daySessions = sessions.filter((s) => s.day === activeDay)

  const metaFor = (session: Session): string => {
    const myGroup = session.groupsRef ? groupOf(session, viewer) : null
    switch (session.type) {
      case 'plenary':
        return `${session.location ?? ''}${session.location ? ' · ' : ''}Everyone`
      case 'meal':
      case 'logistics':
        return session.location ?? ''
      case 'breakout':
        return myGroup ? `${myGroup.label} · ${myGroup.venue}` : 'Your group TBC'
      case 'experience':
        return myGroup ? `${myGroup.label} · ${myGroup.venue}` : 'Choose on arrival'
    }
  }

  return (
    <div className={s.screen}>
      <div className={s.head}>
        <div className="overline">Day by Day</div>
        <h1 className={s.title}>Schedule</h1>
        <div className={s.sub}>
          Personalised for {me ? firstName(me.name) : 'you'} · your sessions and who you're with
        </div>
      </div>

      <div className={s.days}>
        {event.days.map((d) => (
          <button
            key={d.key}
            className={`${s.day} ${d.key === activeDay ? s.dayOn : ''}`}
            onClick={() => setDay(d.key)}
          >
            {d.label}
          </button>
        ))}
      </div>

      <div className={s.list}>
        {daySessions.map((session) => {
          const chip = TYPE_CHIP[session.type]
          const myGroup = session.groupsRef ? groupOf(session, viewer) : null
          const mates = myGroup
            ? myGroup.memberIds.filter((id) => id !== viewer).map((id) => memberMap[id])
            : []
          const more = mates.length - Math.min(mates.length, 5)
          return (
            <div key={session.id} className={s.row}>
              <div className={s.time}>{session.start}</div>
              <button className={s.card} onClick={() => openSession(session.id, 'schedule')}>
                <div className={s.cardTop}>
                  <div className={s.chips}>
                    <Chip variant={chip.variant}>{chip.label}</Chip>
                  </div>
                  <span className={s.chev}>›</span>
                </div>
                <div className={s.cardTitle}>{session.title}</div>
                <div className={s.meta}>{metaFor(session)}</div>
                {mates.length > 0 && (
                  <div className={s.pileRow}>
                    <FacePile people={mates} />
                    <span className={s.pileLabel}>
                      {more > 0 ? `+${more} with you` : 'with you'}
                    </span>
                  </div>
                )}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
