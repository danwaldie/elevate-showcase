import s from './SessionDetail.module.css'
import { useStore, type Screen } from '../state/store'
import { useContent, useMemberMap, usePersonalization } from '../state/hooks'
import { firstName, dayLabel, timeRange } from '../lib/format'
import Avatar from '../components/Avatar'
import Chip from '../components/Chip'
import PropertyMap, { type MapPin } from '../components/PropertyMap'

const FROM_LABEL: Partial<Record<Screen, string>> = {
  profile: 'Profile',
  map: 'Map',
  schedule: 'Schedule',
}

export default function SessionDetail() {
  const { event, members, sessions, locations } = useContent()
  const memberMap = useMemberMap()
  const { groupsFor, groupOf } = usePersonalization()
  const viewer = useStore((st) => st.viewer)
  const selSession = useStore((st) => st.selSession)
  const sessionFrom = useStore((st) => st.sessionFrom)
  const back = useStore((st) => st.backSession)
  const openMember = useStore((st) => st.openMember)
  const openMap = useStore((st) => st.openMap)

  const session = sessions.find((x) => x.id === selSession)
  if (!session) return null

  const myGroup = session.groupsRef ? groupOf(session, viewer) : null
  const groups = session.groupsRef
    ? groupsFor(session).map((g) => ({ g, isMine: !!(myGroup && myGroup.label === g.label) }))
    : []
  const isPlenaryLike = session.type === 'plenary' || session.type === 'meal'
  const everyone = isPlenaryLike ? members : []
  const hosts = (session.hosts ?? []).map((id) => memberMap[id]).filter(Boolean)

  const focusKey = session.groupsRef
    ? (myGroup?.locKey ?? groups[0]?.g.locKey)
    : session.locKey
  const focusLabel = focusKey ? locations[focusKey]?.label : undefined

  const venueEntries = session.groupsRef
    ? groups.map(({ g, isMine }) => ({ key: g.locKey, isMine })).filter((v) => !!locations[v.key])
    : session.locKey && locations[session.locKey]
      ? [{ key: session.locKey, isMine: true }]
      : []
  const venueKeys = new Set(venueEntries.map((v) => v.key))
  const miniPins: MapPin[] = [
    ...Object.keys(locations)
      .filter((k) => !venueKeys.has(k))
      .map((k) => ({
        key: k,
        label: locations[k].label,
        x: locations[k].x,
        y: locations[k].y,
        kind: 'building' as const,
        showLabel: false,
      })),
    ...venueEntries.map((v) => ({
      key: v.key,
      label: locations[v.key].label,
      x: locations[v.key].x,
      y: locations[v.key].y,
      kind: v.isMine ? ('mine' as const) : ('venue' as const),
      showLabel: true,
    })),
  ]

  const typeChip =
    session.type === 'plenary'
      ? { variant: 'everyone' as const, label: 'EVERYONE' }
      : session.type === 'breakout'
        ? { variant: 'groups' as const, label: 'GROUPS' }
        : session.type === 'experience'
          ? { variant: 'choose' as const, label: 'CHOOSE YOUR OWN' }
          : null

  return (
    <div className={s.screen}>
      <button className={s.back} onClick={back}>
        ‹ {FROM_LABEL[sessionFrom] ?? 'Schedule'}
      </button>

      <div className={s.pad}>
        {typeChip && <Chip variant={typeChip.variant}>{typeChip.label}</Chip>}
        <h1 className={s.title}>{session.title}</h1>
        <div className={s.when}>
          {dayLabel(event, session.day)} · {timeRange(session.start, session.end)}
        </div>
        {session.location && <div className={s.loc}>{session.location}</div>}
        {session.desc && <p className={s.desc}>{session.desc}</p>}

        {focusKey && (
          <>
            <div className={s.sectionLabel}>Where</div>
            <PropertyMap
              variant="mini"
              pins={miniPins}
              onMapClick={() => openMap(focusKey)}
              ariaLabel={focusLabel ? `Open map: ${focusLabel}` : 'Open map'}
            />
          </>
        )}

        {hosts.length > 0 && (
          <>
            <div className={s.sectionLabel}>Hosted by</div>
            <div className={s.hosts}>
              {hosts.map((h) => (
                <button
                  key={h.id}
                  className={s.hostRow}
                  onClick={() => openMember(h.id, 'session')}
                >
                  <Avatar name={h.name} src={h.photo} size={40} />
                  <span className={s.hostText}>
                    <span className={s.hostName}>{h.name}</span>
                    <span className={s.hostRole}>
                      {h.title} · {h.company}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        {groups.length > 0 && (
          <>
            <div className={s.sectionLabel}>
              {session.groupsTitle ??
                (session.type === 'experience' ? 'The experiences' : 'The groups')}
            </div>
            <div className={s.groups}>
              {groups.map(({ g, isMine }) => (
                <div key={g.label} className={`${s.groupCard} ${isMine ? s.groupMine : ''}`}>
                  <div className={s.groupHead}>
                    <span className={s.groupLabelWrap}>
                      <span className={`${s.groupLabel} ${isMine ? s.groupLabelMine : ''}`}>
                        {g.label}
                      </span>
                      {isMine && <Chip variant="yourGroup">YOUR GROUP</Chip>}
                    </span>
                    <span className={`${s.groupVenue} ${isMine ? s.groupVenueMine : ''}`}>
                      {g.venue}
                    </span>
                  </div>
                  <div className={s.roster}>
                    {g.memberIds.map((id) => {
                      const p = memberMap[id]
                      if (!p) return null
                      return (
                        <button
                          key={id}
                          className={s.person}
                          onClick={() => openMember(id, 'session')}
                        >
                          <Avatar name={p.name} src={p.photo} size={46} tone={isMine ? 'green' : 'default'} />
                          <span className={s.personName}>{firstName(p.name)}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {everyone.length > 0 && (
          <>
            <div className={s.sectionLabel}>Everyone's here · {everyone.length} attending</div>
            <div className={s.everyone}>
              {everyone.map((p) => (
                <button key={p.id} className={s.person} onClick={() => openMember(p.id, 'session')}>
                  <Avatar name={p.name} src={p.photo} size={48} />
                  <span className={s.personName}>{firstName(p.name)}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
