function findBestMove(board, player) {
  const opponent = player === 'x' ? '0' : 'x';

  // Helper to clone board and test a move
  const tryMove = (r, c, p) => {
    const copy = board.map(row => row.slice());
    copy[r][c] = p;
    return copy;
  };

  // Helper to check win
  const isWin = (b, p) => {
    const lines = [
      [[0,0],[0,1],[0,2]], [[1,0],[1,1],[1,2]], [[2,0],[2,1],[2,2]], // rows
      [[0,0],[1,0],[2,0]], [[0,1],[1,1],[2,1]], [[0,2],[1,2],[2,2]], // cols
      [[0,0],[1,1],[2,2]], [[0,2],[1,1],[2,0]] // diagonals
    ];
    return lines.some(line =>
      line.every(([r, c]) => b[r][c] === p)
    );
  };

  // Step 1: Win if possible
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 3; c++)
      if (board[r][c] === null && isWin(tryMove(r, c, player), player))
        return { r, c };

  // Step 2: Block opponent win
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 3; c++)
      if (board[r][c] === null && isWin(tryMove(r, c, opponent), opponent))
        return { r, c };

  // Step 3: Take center
  if (board[1][1] === null) return { r: 1, c: 1 };

  // Step 4: Take opposite corner
  const corners = [[0,0], [0,2], [2,0], [2,2]];
  for (const [r, c] of corners) {
    const [or, oc] = [2 - r, 2 - c];
    if (board[r][c] === opponent && board[or][oc] === null)
      return { r: or, c: oc };
  }

  // Step 5: Take any corner
  for (const [r, c] of corners)
    if (board[r][c] === null)
      return { r, c };

  // Step 6: Take any side
  const sides = [[0,1], [1,0], [1,2], [2,1]];
  for (const [r, c] of sides)
    if (board[r][c] === null)
      return { r, c };

  return null; // Shouldn't happen unless board is full
}

module.exports = { findBestMove };