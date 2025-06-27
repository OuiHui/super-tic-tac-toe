function GameStatus({ gameState, myPlayer }) {
  return (
    <div className="game-status">
      <div className={`current-player ${gameState.currentPlayer.toLowerCase()}-player`}>
        <span className="current-player-label">Current Player:</span>
        <span 
          className={`player-symbol ${gameState.currentPlayer.toLowerCase()}`}
          style={{ 
            color: gameState.currentPlayer === 'X' ? '#ff3250' : '#00c8ff',
            marginLeft: '8px',
            fontWeight: 'bold'
          }}
        >
          {gameState.currentPlayer}
        </span>
        {myPlayer && (
          <span style={{ marginLeft: '16px', fontSize: '0.9em', color: '#aaa' }}>
            (You are {myPlayer})
          </span>
        )}
      </div>
      
      <div className={`game-instruction ${gameState.currentPlayer.toLowerCase()}-theme`}>
        {gameState.gameOver 
          ? 'Game Complete!' 
          : gameState.activeBoard === null 
            ? 'Play anywhere' 
            : `Target grid ${gameState.activeBoard + 1}`}
      </div>
    </div>
  )
}

export default GameStatus
