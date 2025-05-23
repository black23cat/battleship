function Cell() {
  let marker = false;
  let ship = false;
  let shipName = '';

  const hitMarker = () => {
    return marker;
  };
  const getShipName = () => {
    return shipName;
  };

  const markHitCell = () => {
    marker = true;
  };

  const hasShip = () => {
    return ship;
  };

  const markShipPos = name => {
    shipName = name;
    ship = true;
  };

  return { hitMarker, getShipName, markHitCell, markShipPos, hasShip };
}

function Gameboard(size = 10) {
  const placeShip = (ship, row, col) => {
    // Check if board is available to place the ship
    const selectedCell = getBoardCell(row, col);
    if (!selectedCell || selectedCell.hasShip()) {
      return false;
    }
    // Get all possible cell to place ship
    const shipLength = ship.shipHp;
    const shipDirection = ship.direction;
    const shipPosition = validateShipPosition(
      row,
      col,
      shipLength,
      shipDirection,
    );
    if (!shipPosition) return false;
    // If board is available for ship, place the ship on the board
    shipPosition.forEach(position => {
      const cell = getBoardCell(...position);
      cell.markShipPos(ship.name);
    });

    ships[ship.name] = ship;
    ships[ship.name].position = shipPosition;
    shipsCount++;
    return true;
  };

  const validateShipPosition = (row, col, length, direction) => {
    const selectedCell = getBoardCell(row, col);
    if (!selectedCell || selectedCell.hasShip()) return false;
    const shipPosition = [];
    if (row + length > 10 && direction === 'vertical') {
      row = 10 - length;
    } else if (col + length > 10 && direction === 'horizontal') {
      col = 10 - length;
    }

    for (let i = 0; i < length; i++) {
      if (direction === 'vertical') {
        shipPosition.push([row + i, col]);
      } else {
        shipPosition.push([row, col + i]);
      }
      const currentCell = getBoardCell(...shipPosition[i]);
      if (!currentCell || currentCell.hasShip()) return false;
    }

    return shipPosition;
  };

  const receiveAttack = (row, col) => {
    // if cell is already marked, disable cell.
    const cell = getBoardCell(row, col);
    if (!cell.hasShip()) {
      markMissedHit(row, col);
      return false;
    }
    // If cell is not marked, mark the cell and check if current cell contain a ship or not
    markSuccessHit(row, col);
    cell.markHitCell();
    const ship = ships[cell.getShipName()];
    ship.hit();
    return true;
  };

  const getAllShipsStatus = () => {
    const shipsStatus = [];
    for (const ship in ships) {
      shipsStatus.push(ships[ship].isSunk());
    }
    return shipsStatus.every(e => e === true);
  };

  const getBoardCell = (row, col) => {
    if (row < 0 || row > 9 || col < 0 || col > 9) {
      return false;
    }

    return gameboard[row][col];
  };

  const markMissedHit = (row, col) => {
    missedHitLog.push([row, col]);
  };

  const markSuccessHit = (row, col) => {
    shipHitLog.push([row, col]);
  };

  const generateBoard = size => {
    const board = [];
    for (let i = 0; i < size; i++) {
      board.push([]);
      for (let j = 0; j < size; j++) {
        board[i].push(Cell());
      }
    }
    return board;
  };

  const getShip = shipName => {
    return ships[shipName];
  };
  const getShipsCount = () => {
    return shipsCount;
  };

  const gameboard = generateBoard(size);
  const shipHitLog = [];
  const missedHitLog = [];
  const ships = {};
  let shipsCount = 0;

  return {
    placeShip,
    validateShipPosition,
    receiveAttack,
    getBoardCell,
    getShip,
    getShipsCount,
    getAllShipsStatus,
  };
}

export default Gameboard;
