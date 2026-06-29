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
  return (
    <span
      className={`${s.av} ${s[tone]} ${ring ? s.ring : ''}`}
      style={{ width: size, height: size, fontSize: fontSize ?? Math.round(size * 0.32) }}
    >
      {src ? (
        <img className={s.img} src={src} alt={name} loading="lazy" />
      ) : (
        <span className={s.init}>{initials(name)}</span>
      )}
    </span>
  )
}
