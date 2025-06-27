import { useState } from 'react'
import { useFirebase } from '../contexts/FirebaseContext'

function StartMenu({ onGameModeSelect, onGameCodeSet }) {
  const [showOnlineOptions, setShowOnlineOptions] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [joinError, setJoinError] = useState('')
  const [createdGameCode, setCreatedGameCode] = useState('')
  const { database, ref, set, get } = useFirebase()

  const handleLocalGame = () => {
    onGameModeSelect('local')
  }

  const handleOnlineMultiplayer = () => {
    setShowOnlineOptions(true)
  }

  const handleCreateGame = async () => {
    if (!database) return
    
    const code = Math.random().toString(36).substr(2, 6).toUpperCase()
    const gameRef = ref(database, 'games/' + code + '/state')
    
    try {
      await set(gameRef, {
        boards: Array(9).fill(null).map(() => Array(9).fill('')),
        currentPlayer: 'X',
        activeBoard: null,
        wonBoards: Array(9).fill(''),
        gameWinner: '',
        gameOver: false,
        playerXTime: 500,
        playerOTime: 500
      })
      
      setCreatedGameCode(code)
      onGameCodeSet(code)
      onGameModeSelect('online')
    } catch (error) {
      console.error('Error creating game:', error)
    }
  }

  const handleJoinGame = async () => {
    if (!database || !joinCode.trim()) return
    
    const code = joinCode.trim().toUpperCase()
    const gameRef = ref(database, 'games/' + code + '/state')
    
    try {
      const snapshot = await get(gameRef)
      if (snapshot.exists()) {
        onGameCodeSet(code)
        onGameModeSelect('online')
      } else {
        setJoinError('Game not found!')
      }
    } catch (error) {
      console.error('Error joining game:', error)
      setJoinError('Error joining game')
    }
  }

  return (
    <div className="start-menu">
      <h2>Welcome to Super Tic-Tac-Toe!</h2>
      <button onClick={handleLocalGame}>Local Single Player</button>
      <button onClick={handleOnlineMultiplayer}>Online Multiplayer</button>
      
      {showOnlineOptions && (
        <div className="online-options">
          <input
            type="text"
            className="display-name-input"
            placeholder="Enter your display name"
            maxLength="20"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <button onClick={handleCreateGame}>Create Game</button>
          <div style={{ margin: '0.5em 0' }}>or</div>
          <input
            type="text"
            className="join-code-input"
            placeholder="Enter Game Code"
            maxLength="8"
            value={joinCode}
            onChange={(e) => {
              setJoinCode(e.target.value)
              setJoinError('')
            }}
          />
          <button onClick={handleJoinGame}>Join Game</button>
          {joinError && <div className="join-error">{joinError}</div>}
          {createdGameCode && (
            <div className="game-code-box">
              Game Code: {createdGameCode}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default StartMenu
