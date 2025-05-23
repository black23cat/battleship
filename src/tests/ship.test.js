import Ship from '../modules/ship';

describe('Reduce ship health for each hit.', () => {
  let ship;
  beforeEach(() => {
    ship = new Ship('Cruiser', 3);
  });
  test('Should not sunk after first hit', () => {
    ship.hit();
    expect(ship.isSunk()).toBe(false);
  });
  test('Should not sunk after 2 hits', () => {
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(false);
  });
  test('Ship sunk after 3 hits', () => {
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });
});
