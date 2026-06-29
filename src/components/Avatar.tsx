import { useState } from 'react'
import s from './Avatar.module.css'
import { initials } from '../lib/format'

type Tone = 'default' | 'green' | 'plain'

export default function Avatar({
  name,
  src,
  size = 48,
  tone = 'default',
  fontSize,
  ring,
}: {
  name: string
  src?: string | null
  size?: number
  tone?: Tone
  fontSize?: number
  ring?: boolean
}) {
  // Remember which src failed so a broken/missing image falls back to initials.
  // Keyed by src, so it resets automatically when the avatar is reused for a new person.
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const showImg = src && failedSrc !== src
  return (
    <span
      className={`${s.av} ${s[tone]} ${ring ? s.ring : ''}`}
      style={{ width: size, height: size, fontSize: fontSize ?? Math.round(size * 0.32) }}
    >
      {showImg ? (
        <img
          className={s.img}
          src={src}
          alt={name}
          loading="lazy"
          onError={() => setFailedSrc(src)}
        />
      ) : (
        <span className={s.init}>{initials(name)}</span>
      )}
    </span>
  )
}
