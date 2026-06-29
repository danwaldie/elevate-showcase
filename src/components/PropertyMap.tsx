import type { CSSProperties } from 'react'
import s from './PropertyMap.module.css'

export interface MapPin {
  key: string
  label: string
  x: number
  y: number
  kind: 'mine' | 'venue' | 'building'
  showLabel?: boolean
  selected?: boolean
  onClick?: () => void
}

function Pin({ p }: { p: MapPin }) {
  const style: CSSProperties = { left: `${p.x}%`, top: `${p.y}%` }
  const pinCls = `${s.pin} ${p.selected ? s.pinSelected : ''}`
  const inner = (
    <>
      <span className={`${s.dot} ${s[p.kind]} ${p.selected ? s.dotSelected : ''}`} />
      {p.showLabel && (
        <span
          className={`${s.label} ${p.kind === 'building' ? s.labelBuilding : ''} ${p.selected ? s.labelSelected : ''}`}
        >
          {p.label}
        </span>
      )}
    </>
  )
  if (p.onClick) {
    return (
      <button
        className={pinCls}
        style={style}
        onClick={(e) => {
          e.stopPropagation()
          p.onClick?.()
        }}
        aria-label={p.label}
      >
        {inner}
      </button>
    )
  }
  return (
    <span className={pinCls} style={style}>
      {inner}
    </span>
  )
}

export default function PropertyMap({
  variant = 'full',
  pins,
  roadLabels = false,
  onMapClick,
  ariaLabel,
}: {
  variant?: 'full' | 'mini'
  pins: MapPin[]
  roadLabels?: boolean
  onMapClick?: () => void
  ariaLabel?: string
}) {
  const cls = `${s.map} ${variant === 'mini' ? s.mini : s.full}`
  const body = (
    <>
      <svg className={s.svg} viewBox="0 0 100 100" preserveAspectRatio="none">
        <rect x="0" y="78" width="100" height="22" style={{ fill: 'var(--water)' }} />
        <path
          d="M-2,79 Q26,75 52,79 T102,78"
          style={{ fill: 'none', stroke: 'var(--shore)' }}
          strokeWidth="1"
        />
        <path
          d="M2,13 Q30,6 54,11 Q74,15 99,11"
          style={{ fill: 'none', stroke: 'var(--road)' }}
          strokeWidth={variant === 'mini' ? 2.4 : 2.6}
          strokeLinecap="round"
        />
        {variant === 'full' && (
          <path
            d="M25,12 L25,16 M40,11 L40,31 M64,13 L64,43 M88,11 L88,41"
            style={{ fill: 'none', stroke: 'var(--road)' }}
            strokeWidth="1.3"
          />
        )}
        <path
          d={
            variant === 'mini'
              ? 'M14,56 L40,54 L66,56 L87,56 M40,54 L40,72 M66,56 L66,72 M87,56 L87,72'
              : 'M14,56 L40,54 L66,56 L87,56 M40,54 L40,72 M14,56 L14,72 M66,56 L66,72 M87,56 L87,72 M40,42 L40,54 M64,44 L66,56'
          }
          style={{ fill: 'none', stroke: 'var(--shore)' }}
          strokeWidth="0.7"
          strokeDasharray="1.4 2"
          opacity={variant === 'mini' ? 0.7 : 0.75}
        />
      </svg>
      {roadLabels && (
        <>
          <div className={s.roadLabel}>Birch Point Rd</div>
          <div className={s.lakeLabel}>Cedar Lake</div>
        </>
      )}
      {pins.map((p) => (
        <Pin key={p.key} p={p} />
      ))}
      {onMapClick && <span className={s.openMap}>Open map ›</span>}
    </>
  )
  if (onMapClick) {
    return (
      <button className={cls} onClick={onMapClick} aria-label={ariaLabel}>
        {body}
      </button>
    )
  }
  return <div className={cls}>{body}</div>
}
