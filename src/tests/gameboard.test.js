import Gameboard from '../modules/gameboard';
import Ship from '../modules/ship';

describe('Board behaviour.', () => {
  let board;

  beforeEach(() => {
    board = Gameboard();
  });

  test('Should place ship on empty board', () => {
    const ship = new Ship('carrier', 5, 'horizontal');
    board.placeShip(ship, 0, 1);
    expect(board.getBoardCell(0, 1).hasShip()).toBe(true);
    expect(board.getBoardCell(0, 2).hasShip()).toBe(true);
    expect(board.getBoardCell(0, 3).hasShip()).toBe(true);
  });

  test('Should place ship on edge of the board', () => {
    const ship = new Ship('submarine', 3, 'horizontal');
    board.placeShip(ship, 0, 9);
    expect(board.getBoardCell(0, 9).hasShip()).toBe(true);
    expect(board.getBoardCell(0, 8).hasShip()).toBe(true);
    expect(board.getBoardCell(0, 7).hasShip()).toBe(true);
  });

  test('Should not place ship on top of other ship.', () => {
    const cruiser = new Ship('cruiser', 3, 'vertical');
    const submarine = new Ship('submarine', 3, 'horizontal');
    board.placeShip(cruiser, 0, 5);
    expect(board.placeShip(submarine, 1, 4)).toBe(false);
  });

  test('Should mark cell when selected board is attacked.', () => {
    const ship = new Ship('cruiser', 3);
    board.placeShip(ship, 0, 0);
    board.receiveAttack(0, 0);

    const cell = board.getBoardCell(0, 0);
    expect(cell.hitMarker()).toBe(true);
  });
});
