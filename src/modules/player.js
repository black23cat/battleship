export default class Player {
  constructor(playerName, playerBoard) {
    this.playerName = playerName;
    this.board = playerBoard;
  }
  getBoard() {
    return this.board;
  }
}
