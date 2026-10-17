import { StrictMode, useEffect, useState, type ComponentType } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import { COMMUNITY } from './config'
import Board from './pages/Board'
import Challenge from './pages/Challenge'
import Home from './pages/Home'
import Poll from './pages/Poll'
import Quiz from './pages/Quiz'
import Screen from './pages/Screen'
import Typing from './pages/Typing'

const ROUTES: Record<string, ComponentType> = {
  '': Home,
  meydan: Challenge,
  refleks: Typing,
  anket: Poll,
  test: Quiz,
  ekran: Screen,
}

const currentPath = () => location.hash.replace(/^#\/?/, '')

function App() {
  const [path, setPath] = useState(currentPath)
  useEffect(() => {
    const onHash = () => {
      setPath(currentPath())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  const Page = ROUTES[path] ?? Home
  return (
    <>
      {path !== 'ekran' && (
        <nav className="nav">
          <a href="#/">
            <img className="logo" src="/logo-mark.svg" alt="" />
            {COMMUNITY}
          </a>
        </nav>
      )}
      <Page key={path} />
    </>
  )
}

// Aynı kod iki sitede yayında: VITE_SITE=board olan Vercel projesi sonuç sitesini, diğeri oyunları açar.
createRoot(document.getElementById('root')!).render(
  <StrictMode>{import.meta.env.VITE_SITE === 'board' ? <Board /> : <App />}</StrictMode>,
)
