import React, { useMemo } from 'react'
import SmallBoard from './SmallBoard'

function SuperBoard({ gameState, onCellClick, isMyTurn, currentPlayer }) {
  const getSuperBoardClass = () => {
    if (gameState.gameOver) {
      if (gameState.gameWinner === 'tie') {
        return 'super-board tie-winner'
      } else {
        return `super-board ${gameState.gameWinner.toLowerCase()}-winner`
      }
    }
    return `super-board ${gameState.currentPlayer.toLowerCase()}-turn`
  }

  const containerClass = useMemo(
    () => getSuperBoardClass(),
    [gameState.gameOver, gameState.gameWinner, gameState.currentPlayer]
  )

  return (
    <div className={containerClass}>
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

export default React.memo(SuperBoard)
