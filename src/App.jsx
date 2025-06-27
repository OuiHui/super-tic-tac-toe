import { useState } from 'react'
import StartMenu from './components/StartMenu'
import GameContainer from './components/GameContainer'
import { FirebaseProvider } from './contexts/FirebaseContext'
import './styles/index.css'

function App() {
  const [gameMode, setGameMode] = useState('menu') // 'menu', 'local', 'online'
  const [gameCode, setGameCode] = useState('')

  return (
    <FirebaseProvider>
      <div className="App">
        {gameMode === 'menu' && (
          <StartMenu onGameModeSelect={setGameMode} onGameCodeSet={setGameCode} />
        )}
        {(gameMode === 'local' || gameMode === 'online') && (
          <GameContainer 
            gameMode={gameMode} 
            gameCode={gameCode}
            onBackToMenu={() => setGameMode('menu')}
          />
        )}
      </div>
    </FirebaseProvider>
  )
}

export default App
