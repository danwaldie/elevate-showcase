import { useMemo, useState } from 'react'
import s from './Directory.module.css'
import { useStore } from '../state/store'
import { useContent, usePersonalization } from '../state/hooks'
import Avatar from '../components/Avatar'
import Chip from '../components/Chip'

const LOC_BUCKETS = ['London', 'Toronto', 'New York']

// Company logo with graceful fallback to the company initial if the image is missing.
function CompanyBadge({ company, src }: { company: string; src?: string | null }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  if (src && failedSrc !== src)
    return <img src={src} alt={company} onError={() => setFailedSrc(src)} />
  return <>{(company.trim()[0] ?? '').toUpperCase()}</>
}

export default function Directory() {
  const { members } = useContent()
  const { forumOf } = usePersonalization()
  const viewer = useStore((st) => st.viewer)
  const query = useStore((st) => st.query)
  const loc = useStore((st) => st.loc)
  const sort = useStore((st) => st.sort)
  const setQuery = useStore((st) => st.setQuery)
  const setLoc = useStore((st) => st.setLoc)
  const setSort = useStore((st) => st.setSort)
  const openMember = useStore((st) => st.openMember)

  const myForum = forumOf(viewer)
  const withYou = (id: string) =>
    !!myForum && id !== viewer && myForum.memberIds.includes(id)

  const chips = useMemo(() => {
    const present = LOC_BUCKETS.filter((b) =>
      members.some((m) => m.location.toLowerCase().includes(b.toLowerCase())),
    )
    const hasGlobal = members.some((m) => /global/i.test(m.location))
    return ['All', ...present, ...(hasGlobal ? ['Global'] : [])]
  }, [members])

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = members.filter((m) => {
      if (loc !== 'All') {
        if (loc === 'Global') {
          if (!/global/i.test(m.location)) return false
        } else if (!m.location.toLowerCase().includes(loc.toLowerCase())) return false
      }
      if (q) {
        const hay = (
          m.name +
          ' ' +
          m.company +
          ' ' +
          m.title +
          ' ' +
          m.expertise.join(' ') +
          ' ' +
          m.industry
        ).toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
    const rank = (id: string) => (id === viewer ? 2 : withYou(id) ? 1 : 0)
    return [...filtered].sort((a, b) =>
      sort === 'mine'
        ? rank(b.id) - rank(a.id) || a.name.localeCompare(b.name)
        : a.name.localeCompare(b.name),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [members, query, loc, sort, viewer, myForum])

  return (
    <div className={s.screen}>
      <header className={s.header}>
        <div>
          <div className="overline">The Members</div>
          <h1 className={s.title}>Directory</h1>
        </div>
        <div className={s.count}>{members.length} attending</div>
      </header>

      <div className={s.search}>
        <span className={s.searchGlyph} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, company, expertise"
          aria-label="Search members"
        />
      </div>

      <div className={`${s.chips} scroll`}>
        {chips.map((c) => (
          <button
            key={c}
            className={`${s.chip} ${loc === c ? s.chipOn : ''}`}
            onClick={() => setLoc(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className={s.sortRow}>
        <button
          className={`${s.sort} ${sort === 'az' ? s.sortOn : ''}`}
          onClick={() => setSort('az')}
        >
          A–Z
        </button>
        <button
          className={`${s.sort} ${sort === 'mine' ? s.sortOn : ''}`}
          onClick={() => setSort('mine')}
        >
          Your people first
        </button>
      </div>

      <div className={s.list}>
        {list.map((m) => (
          <button key={m.id} className={s.card} onClick={() => openMember(m.id, 'directory')}>
            <span className={s.avatarWrap}>
              <Avatar name={m.name} src={m.photo} size={56} />
              <span className={s.companyBadge} title={m.company}>
                <CompanyBadge company={m.company} src={m.companyLogo} />
              </span>
            </span>
            <span className={s.body}>
              <span className={s.nameRow}>
                <span className={s.name}>{m.name}</span>
                {m.id === viewer && <Chip variant="you">YOU</Chip>}
                {withYou(m.id) && <Chip variant="withYou">YOUR FORUM</Chip>}
              </span>
              <span className={s.line}>
                {m.title} · {m.company}
              </span>
              <span className={s.location}>{m.location}</span>
            </span>
            <span className={s.chevron}>›</span>
          </button>
        ))}
        {list.length === 0 && <p className={s.empty}>No members match that search.</p>}
      </div>
    </div>
  )
}
