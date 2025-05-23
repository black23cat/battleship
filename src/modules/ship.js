class Ship {
  constructor(name, length, direction = 'vertical') {
    this.name = name;
    this.shipHp = length;
    this.direction = direction;
  }

  hit() {
    this.shipHp -= 1;
  }

  isSunk() {
    if (this.shipHp === 0) {
      return true;
    } else {
      return false;
    }
  }
}

export default Ship;
