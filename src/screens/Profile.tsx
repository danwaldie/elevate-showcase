import { useState } from 'react'
import s from './Profile.module.css'
import { useStore, type Screen } from '../state/store'
import { useContent, usePersonalization } from '../state/hooks'
import { initials, firstName, dayLabel, validLink } from '../lib/format'

const FROM_LABEL: Record<Screen, string> = {
  welcome: 'Back',
  directory: 'Directory',
  profile: 'Back',
  schedule: 'Schedule',
  session: 'Session',
  map: 'Map',
  assistant: 'Concierge',
}

export default function Profile() {
  const { event, members } = useContent()
  const { forumOf, sharedSessions } = usePersonalization()
  const viewer = useStore((st) => st.viewer)
  const selMember = useStore((st) => st.selMember)
  const profileFrom = useStore((st) => st.profileFrom)
  const back = useStore((st) => st.backProfile)
  const openSession = useStore((st) => st.openSession)

  // Fall back to the placeholder tiles if a photo/logo is missing or fails to load.
  // Tracked by src so it resets when navigating to another member.
  const [failedPhoto, setFailedPhoto] = useState<string | null>(null)
  const [failedLogo, setFailedLogo] = useState<string | null>(null)

  const m = members.find((x) => x.id === selMember)
  if (!m) return null

  const showPhoto = !!m.photo && failedPhoto !== m.photo
  const showLogo = !!m.companyLogo && failedLogo !== m.companyLogo

  const myForum = forumOf(viewer)
  const sameForum = !!myForum && m.id !== viewer && myForum.memberIds.includes(m.id)
  const shared = sharedSessions(viewer, m.id)
  const hasLi = validLink(m.links.linkedin)
  const hasWa = validLink(m.links.whatsapp)

  return (
    <div className={s.screen}>
      <button className={s.back} onClick={back}>
        ‹ {FROM_LABEL[profileFrom]}
      </button>

      <div className={s.pad}>
        <div className={s.photo}>
          {showPhoto ? (
            <img
              className={s.photoImg}
              src={m.photo!}
              alt={m.name}
              onError={() => setFailedPhoto(m.photo!)}
            />
          ) : (
            <>
              <div className={s.hatch} />
              <span className={s.photoInit}>{initials(m.name)}</span>
              <span className={s.photoCap}>member photo</span>
            </>
          )}
        </div>

        <div className={s.name}>{m.name}</div>
        <div className={s.title}>{m.title}</div>
        <div className={s.meta}>
          {m.location} · {m.type}
        </div>

        <div className={s.companyRow}>
          <span className={s.logoTile}>
            {showLogo ? (
              <img
                className={s.logoImg}
                src={m.companyLogo!}
                alt={m.company}
                onError={() => setFailedLogo(m.companyLogo!)}
              />
            ) : (
              <>
                <span className={s.hatch} />
                <span className={s.logoInit}>{initials(m.company)}</span>
              </>
            )}
          </span>
          <span className={s.companyText}>
            {!showLogo && <span className={s.companyCap}>Company logo</span>}
            <span className={s.companyName}>{m.company}</span>
          </span>
        </div>

        {sameForum && myForum && (
          <div className={s.forumBanner}>
            <span className={s.forumDot} />
            <span className={s.forumText}>
              You're both in Forum <b>{myForum.label}</b>
            </span>
          </div>
        )}

        <div className={s.contacts}>
          {hasLi && (
            <a className={s.btnLi} href={m.links.linkedin!} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          )}
          {hasWa ? (
            <a className={s.btnWa} href={m.links.whatsapp!} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          ) : (
            <div className={s.btnWaOff}>WhatsApp not shared</div>
          )}
        </div>

        <p className={s.bio}>{m.bio}</p>

        <div className={s.divider} />
        <div className={s.sectionLabel}>Industry</div>
        <span className={s.tagGold}>{m.industry}</span>

        {m.expertise.length > 0 && (
          <>
            <div className={`${s.sectionLabel} ${s.sectionLabelGap}`}>Expertise</div>
            <div className={s.tagsWrap}>
              {m.expertise.map((t) => (
                <span key={t} className={s.tagNeutral}>
                  {t}
                </span>
              ))}
            </div>
          </>
        )}

        {m.canHelp.length > 0 && (
          <>
            <div className={`${s.sectionLabel} ${s.sectionLabelGap}`}>Can help with</div>
            <div className={s.tagsWrap}>
              {m.canHelp.map((t) => (
                <span key={t} className={s.tagGreen}>
                  {t}
                </span>
              ))}
            </div>
          </>
        )}

        {shared.length > 0 && (
          <>
            <div className={s.divider} />
            <div className={s.sectionLabel}>Sessions you share</div>
            <div className={s.shared}>
              {shared.map(({ session, group }) => (
                <button
                  key={session.id}
                  className={s.sharedRow}
                  onClick={() => openSession(session.id, 'profile')}
                >
                  <span className={s.sharedCol}>
                    <span className={s.sharedTitle}>{session.title}</span>
                    <span className={s.sharedDetail}>
                      {group.label} · {group.venue} · {dayLabel(event, session.day)}
                    </span>
                  </span>
                  <span className={s.btnRowChevron}>›</span>
                </button>
              ))}
            </div>
            <p className={s.plenaryNote}>
              Plus every welcome, meal and party — you'll see {firstName(m.name)} all weekend.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
