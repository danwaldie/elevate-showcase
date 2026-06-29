import type { ReactNode } from 'react'
import s from './Chip.module.css'

export type ChipVariant =
  | 'you'
  | 'withYou'
  | 'everyone'
  | 'groups'
  | 'choose'
  | 'dining'
  | 'logistics'
  | 'yourGroup'
  | 'youSmall'

export default function Chip({
  variant,
  children,
}: {
  variant: ChipVariant
  children: ReactNode
}) {
  return <span className={`${s.chip} ${s[variant]}`}>{children}</span>
}
