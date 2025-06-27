import SmallBoard from './SmallBoard'

function SuperBoard({ gameState, onCellClick, isMyTurn }) {
  return (
    <div className="super-board">
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
        />
      ))}
    </div>
  )
}

export default SuperBoard
