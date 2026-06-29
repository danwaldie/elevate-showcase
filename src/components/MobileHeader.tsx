import s from './MobileHeader.module.css'
import { useStore } from '../state/store'
import Wordmark from './Wordmark'

export default function MobileHeader() {
  const home = useStore((st) => st.home)
  return (
    <header className={s.bar}>
      <button className={s.logo} onClick={home} aria-label="Back to welcome">
        <Wordmark width={82} fill="var(--ink)" />
      </button>
    </header>
  )
}
