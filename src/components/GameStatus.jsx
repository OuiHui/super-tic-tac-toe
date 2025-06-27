function GameStatus({ gameState, myPlayer }) {
  return (
    <div className="game-status">
      <div className="current-player">
        Current Player: 
        <span 
          className={gameState.currentPlayer.toLowerCase()}
          style={{ 
            color: gameState.currentPlayer === 'X' ? '#2196F3' : '#f44336',
            marginLeft: '8px'
          }}
        >
          {gameState.currentPlayer}
        </span>
        {myPlayer && (
          <span style={{ marginLeft: '16px', fontSize: '0.9em', color: '#666' }}>
            (You are {myPlayer})
          </span>
        )}
      </div>
      
      <div className="game-instruction">
        {gameState.gameOver 
          ? 'Game Over!' 
          : gameState.activeBoard === null 
            ? 'Play anywhere!' 
            : `Play in board ${gameState.activeBoard + 1}`}
      </div>
    </div>
  )
}

export default GameStatus
