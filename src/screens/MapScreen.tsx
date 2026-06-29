import s from './MapScreen.module.css'
import PropertyMap, { type MapPin } from '../components/PropertyMap'
import { useStore } from '../state/store'
import { useContent, usePersonalization } from '../state/hooks'
import { dayLabel } from '../lib/format'
import Chip from '../components/Chip'

export default function MapScreen() {
  const { event, locations } = useContent()
  const { sessionsAt, myLocKeys } = usePersonalization()
  const viewer = useStore((st) => st.viewer)
  const selLoc = useStore((st) => st.selLoc)
  const setSelLoc = useStore((st) => st.setSelLoc)
  const openSession = useStore((st) => st.openSession)

  const my = myLocKeys(viewer)
  const buildingPins: MapPin[] = []
  const venuePins: MapPin[] = []
  for (const [key, L] of Object.entries(locations)) {
    const at = sessionsAt(key, viewer)
    if (at.length > 0) {
      venuePins.push({
        key,
        label: L.label,
        x: L.x,
        y: L.y,
        kind: my.has(key) ? 'mine' : 'venue',
        showLabel: true,
        selected: key === selLoc,
        onClick: () => setSelLoc(key),
      })
    } else {
      buildingPins.push({ key, label: L.label, x: L.x, y: L.y, kind: 'building', showLabel: true })
    }
  }
  const pins = [...buildingPins, ...venuePins]

  const sel = selLoc ? locations[selLoc] : null
  const mineHere = !!selLoc && my.has(selLoc)
  const selSessions = selLoc ? sessionsAt(selLoc, viewer) : []

  return (
    <div className={s.screen}>
      <div className={s.head}>
        <div className="overline">The Property</div>
        <h1 className={s.title}>Map</h1>
        <div className={s.sub}>{event.venue}</div>
      </div>

      <div className={s.mapWrap}>
        <PropertyMap variant="full" pins={pins} roadLabels />
      </div>

      <div className={s.legend}>
        <span className={s.legItem}>
          <span className={`${s.lg} ${s.lgMine}`} />
          Your sessions
        </span>
        <span className={s.legItem}>
          <span className={`${s.lg} ${s.lgVenue}`} />
          Other sessions
        </span>
        <span className={s.legItem}>
          <span className={`${s.lg} ${s.lgBuilding}`} />
          Other buildings
        </span>
      </div>

      {!sel && <p className={s.hint}>Tap a marker to see what's happening there.</p>}

      {sel && (
        <div className={s.card}>
          <div className={s.cardHead}>
            <div>
              <div className={s.cardTitle}>{sel.label}</div>
              {mineHere && <div className={s.cardMine}>You have a session here</div>}
            </div>
            <button className={s.close} onClick={() => setSelLoc(null)} aria-label="Close">
              ×
            </button>
          </div>
          {selSessions.length > 0 ? (
            <div className={s.sessions}>
              {selSessions.map(({ session, group, isMine }, i) => (
                <button
                  key={`${session.id}-${i}`}
                  className={s.sessRow}
                  onClick={() => openSession(session.id, 'map')}
                >
                  <span className={s.sessCol}>
                    <span className={s.sessTitleRow}>
                      <span className={s.sessTitle}>{session.title}</span>
                      {isMine && <Chip variant="youSmall">YOU</Chip>}
                    </span>
                    <span className={s.sessSub}>
                      {group
                        ? `${group.label} · ${dayLabel(event, session.day)} · ${session.start}`
                        : `${dayLabel(event, session.day)} · ${session.start}`}
                    </span>
                  </span>
                  <span className={s.chev}>›</span>
                </button>
              ))}
            </div>
          ) : (
            <div className={s.none}>
              No scheduled sessions here — a spot to explore on your own.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
