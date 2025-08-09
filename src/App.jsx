import { useState, Suspense, lazy } from 'react'
const StartMenu = lazy(() => import('./components/StartMenu'))
const GameContainer = lazy(() => import('./components/GameContainer'))
import { FirebaseProvider } from './contexts/FirebaseContext'
import './styles/index.css'

function App() {
  const [gameMode, setGameMode] = useState('menu') // 'menu', 'local', 'online'
  const [gameCode, setGameCode] = useState('')
  const [appClass, setAppClass] = useState('')

  const navigateTo = (targetMode) => {
    // fade out current screen
    setAppClass('fade-out')
    window.setTimeout(() => {
      // switch view
      setGameMode(targetMode)
      // fade in new screen
      setAppClass('fade-in')
      window.setTimeout(() => setAppClass(''), 260)
    }, 260)
  }

  return (
    <FirebaseProvider>
      <div className={`App ${appClass}`}>
        <Suspense fallback={null}>
          {gameMode === 'menu' && (
            <StartMenu onGameModeSelect={navigateTo} onGameCodeSet={setGameCode} />
          )}
          {(gameMode === 'local' || gameMode === 'online') && (
            <GameContainer 
              gameMode={gameMode} 
              gameCode={gameCode}
              onBackToMenu={() => navigateTo('menu')}
            />
          )}
        </Suspense>
      </div>
    </FirebaseProvider>
  )
}

export default App
