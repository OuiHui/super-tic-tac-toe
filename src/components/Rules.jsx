function Rules() {
  return (
    <div className="rules">
      <h3>How to Play:</h3>
      <ul>
        <li>Win small boards by getting 3 in a row within each 3×3 grid</li>
        <li>Your move determines which board your opponent must play in next</li>
        <li>If the target board is full or already won, opponent can play anywhere</li>
        <li>Win the game by getting 3 small boards in a row!</li>
        <li>Green highlight shows where you can currently play</li>
      </ul>
    </div>
  )
}

export default Rules
