import SmallBoard from './SmallBoard'

function SuperBoard({ gameState, onCellClick, isMyTurn, currentPlayer }) {
  return (
    <div className={`super-board ${gameState.currentPlayer.toLowerCase()}-turn`}>
      {gameState.boards.map((board, boardIndex) => (
        <SmallBoard
          key={boardIndex}
          boardIndex={boardIndex}
          board={board}
          isActive={
            !gameState.gameOver &&
            !gameState.wonBoards[boardIndex] &&
            (gameState.activeBoard === null || gameState.activeBoard === boardIndex)
          }
          winner={gameState.wonBoards[boardIndex]}
          onCellClick={onCellClick}
          isMyTurn={isMyTurn}
          currentPlayer={currentPlayer}
        />
      ))}
    </div>
  )
}

export default SuperBoard
