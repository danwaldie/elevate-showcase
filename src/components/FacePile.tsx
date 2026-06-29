import Avatar from './Avatar'
import s from './FacePile.module.css'

export interface FaceProps {
  id: string
  name: string
  photo: string | null
}

export default function FacePile({
  people,
  size = 26,
  max = 5,
}: {
  people: FaceProps[]
  size?: number
  max?: number
}) {
  const shown = people.slice(0, max)
  return (
    <div className={s.pile}>
      {shown.map((p) => (
        <span key={p.id} className={s.item}>
          <Avatar name={p.name} src={p.photo} size={size} fontSize={Math.round(size * 0.35)} />
        </span>
      ))}
    </div>
  )
}
