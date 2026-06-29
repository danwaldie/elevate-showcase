import { useEffect } from 'react'
import { useStore, type TabScreen } from './state/store'
import { useMediaQuery } from './lib/useMediaQuery'
import s from './App.module.css'
import Welcome from './screens/Welcome'
import Directory from './screens/Directory'
import Profile from './screens/Profile'
import Schedule from './screens/Schedule'
import SessionDetail from './screens/SessionDetail'
import MapScreen from './screens/MapScreen'
import Concierge from './screens/Concierge'
import BottomNav from './components/BottomNav'
import Sidebar from './components/Sidebar'
import MobileHeader from './components/MobileHeader'

function renderTab(tab: TabScreen) {
  switch (tab) {
    case 'directory':
      return <Directory />
    case 'schedule':
      return <Schedule />
    case 'map':
      return <MapScreen />
    case 'assistant':
      return <Concierge />
  }
}

export default function App() {
  const status = useStore((st) => st.status)
  const screen = useStore((st) => st.screen)
  const tab = useStore((st) => st.tab)
  const init = useStore((st) => st.init)
  const isDesktop = useMediaQuery('(min-width: 900px)')

  useEffect(() => {
    void init()
  }, [init])

  if (status !== 'ready') {
    return (
      <div className={s.boot}>
        {status === 'loading' && <span className={s.loader} aria-label="Loading" />}
        {status === 'needAuth' && <p>Open your personal link to enter the retreat.</p>}
        {status === 'error' && <p>Something went wrong loading the directory.</p>}
      </div>
    )
  }

  if (screen === 'welcome') return <Welcome />

  const detail =
    screen === 'profile' ? <Profile /> : screen === 'session' ? <SessionDetail /> : null

  // ---- Desktop: sidebar + master–detail ----
  if (isDesktop) {
    return (
      <div className={s.desktop}>
        <Sidebar />
        <div className={s.mainCol}>
          <main className={`${s.listPane} scroll`}>{renderTab(tab)}</main>
          {detail && <aside className={`${s.detailPane} scroll`}>{detail}</aside>}
        </div>
      </div>
    )
  }

  // ---- Mobile: full-screen screens + bottom tab bar ----
  const showNav =
    screen === 'directory' ||
    screen === 'schedule' ||
    screen === 'map' ||
    screen === 'assistant'
  return (
    <div className={s.app}>
      {showNav && <MobileHeader />}
      {screen === 'assistant' ? (
        <Concierge />
      ) : (
        <main className={`${s.content} scroll`}>
          {screen === 'directory' && <Directory />}
          {screen === 'profile' && <Profile />}
          {screen === 'schedule' && <Schedule />}
          {screen === 'session' && <SessionDetail />}
          {screen === 'map' && <MapScreen />}
        </main>
      )}
      {showNav && <BottomNav />}
    </div>
  )
}
