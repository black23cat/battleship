export default function Controller() {
  const playersData = [];
  let playerTurn;

  function playRound(row, col) {
    const enemyBoard = getEnemyBoard();
    enemyBoard.receiveAttack(row, col);
    const attackedCell = enemyBoard.getBoardCell(row, col);
    const ship = enemyBoard.getShip(attackedCell.getShipName());
    let attackedShip;
    if (!ship) {
      attackedShip = null;
    } else {
      attackedShip = ship.name;
    }
    const playerRoundResult = {
      hit: attackedCell.hasShip(),
      attackedShip: attackedShip,
      isWinner: enemyBoard.getAllShipsStatus(),
    };
    switchPlayerTurn();
    return playerRoundResult;
  }

  function switchPlayerTurn() {
    return playerTurn === playersData[0]
      ? (playerTurn = playersData[1])
      : (playerTurn = playersData[0]);
  }

  function addPlayers(player) {
    playersData.push(player);
    if (!playerTurn) playerTurn = playersData[0];
  }

  function getEnemyBoard() {
    return playerTurn === playersData[0]
      ? playersData[1].getBoard()
      : playersData[0].getBoard();
  }

  const computerAttackLog = [];
  function computerPlayRound() {
    let randomCoords = randomizedInt();
    while (!isValidAttack(...randomCoords, computerAttackLog)) {
      randomCoords = randomizedInt();
    }
    computerAttackLog.push(randomCoords);
    const roundResult = playRound(...randomCoords);
    roundResult.coords = randomCoords;
    return roundResult;
  }

  function isValidAttack(row, col, attackLog) {
    let visitedNode = true;
    let i = 0;
    while (i !== attackLog.length) {
      const [logY, logX] = attackLog[i];
      if (row === logY && col === logX) {
        visitedNode = false;
        break;
      }
      i++;
    }
    return visitedNode;
  }

  function randomizedInt() {
    return [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
  }

  return { addPlayers, playRound, computerPlayRound };
}
