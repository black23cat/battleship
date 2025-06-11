import Controller from './game-controller.js';
import ScreenDisplay from './display.js';
import Event from './event.js';
import Player from './player.js';
import Gameboard from './gameboard.js';
import Ship from './ship.js';

export default function initialize() {
  const gameController = Controller();
  const render = ScreenDisplay();
  const event = Event();
  const p1Board = Gameboard();
  const p1Ships = getShipsLists();
  const p2Board = Gameboard();
  const p2Ships = getShipsLists();
  const buttonListener = event.createEventListener(btnClickHandler);
  const setUpCellHoverListener = event.createSetUpBoardListener(
    setupBoardHoverHandler,
  );
  const setUpCellMouseOutListener = event.createSetUpBoardListener(
    setupBoardMouseOutHandler,
  );
  const setUpCellMouseClickListener = event.createSetUpBoardListener(
    setupBoardClickHandler,
  );
  const enemyCellEventListener = event.createEventListener(cellClickHandler);
  let selectedShip;
  let selectedShipWrapper;
  let shipPos;
  placeRandomComputerShips(p2Ships, p2Board);

  function getShipsLists() {
    return [
      new Ship('carrier', 5),
      new Ship('battleship', 4),
      new Ship('cruiser', 3),
      new Ship('submarine', 3),
      new Ship('destroyer', 2),
    ];
  }

  function btnClickHandler(target) {
    if (target.classList.contains('select-ship-btn')) {
      handleSelectShipBtn(target);
    } else if (target.classList.contains('ship-direction-toggle')) {
      handleToggleDirection(target);
    } else if (target.classList.contains('confirm')) {
      handleConfirmSetup();
    } else if (target.classList.contains('reset')) {
      window.reload();
    }
  }

  function initializeRender() {
    render.initialize(p1Ships, p1Board);
    render.attachEventListener('.select-ship-btn', 'click', buttonListener);
    render.attachEventListener(
      '.ship-direction-toggle',
      'click',
      buttonListener,
    );
    render.attachEventListener(
      '.player-board-cell',
      'mouseover',
      setUpCellHoverListener,
    );
    render.attachEventListener(
      '.player-board-cell',
      'mouseout',
      setUpCellMouseOutListener,
    );
    render.attachEventListener(
      '.player-board-cell',
      'click',
      setUpCellMouseClickListener,
      { once: true },
    );
  }

  function handleSelectShipBtn(target) {
    selectedShip = p1Ships[target.dataset.index];
    if (selectedShipWrapper) {
      render.markSelectedShip(selectedShipWrapper);
    }
    selectedShipWrapper = target.parentNode;
    render.markSelectedShip(selectedShipWrapper);
  }

  function handleToggleDirection(target) {
    const targetIndex = Number(target.dataset.index);
    const ship = p1Ships[targetIndex];
    ship.direction = ship.direction === 'vertical' ? 'horizontal' : 'vertical';

    if (selectedShip === ship) {
      selectedShip.direction = ship.direction;
    }
    render.updateDirectionToggleButton(target.classList.value, targetIndex);
  }

  function setupBoardHoverHandler(target) {
    if (!selectedShip) return;
    const cellData = target;
    shipPos = p1Board.validateShipPosition(
      cellData.row,
      cellData.col,
      selectedShip.shipHp,
      selectedShip.direction,
    );
    if (!shipPos) return;
    render.updateSetupBoardDisplay('mouseover', shipPos);
  }

  function setupBoardMouseOutHandler() {
    if (!selectedShip || !shipPos) return;
    render.updateSetupBoardDisplay('mouseout', shipPos);
  }

  function setupBoardClickHandler() {
    if (!selectedShip || !shipPos) return;
    const validateShipPosition = p1Board.validateShipPosition(
      ...shipPos[0],
      selectedShip.shipHp,
      selectedShip.direction,
    );
    if (!validateShipPosition) return;
    p1Board.placeShip(selectedShip, ...shipPos[0]);
    render.updateSetupBoardDisplay('click', shipPos);
    selectedShipWrapper.classList.add('hide');
    selectedShip = '';
    selectedShipWrapper = '';
    if (p1Board.getShipsCount() === 5) {
      render.renderConfirmBtn();
      render.attachEventListener('.confirm', 'click', buttonListener, {
        once: true,
      });
    }
  }

  function handleConfirmSetup() {
    render.detachSetupEventListener(
      buttonListener,
      setUpCellHoverListener,
      setUpCellMouseOutListener,
      setUpCellMouseClickListener,
    );
    gameController.addPlayers(new Player('P1', p1Board));
    gameController.addPlayers(new Player('com', p2Board));
    render.renderBattleScreen(p1Board);
    render.attachEventListener(
      '.enemy-board-cell',
      'click',
      enemyCellEventListener,
      { once: true },
    );
  }

  function cellClickHandler(target) {
    const targetRow = target.dataset.row;
    const targetCol = target.dataset.col;
    const playerRoundResult = gameController.playRound(targetRow, targetCol);
    const computerRoundResult = gameController.computerPlayRound();
    render.toggleCoverBoard();
    render.updateBoardDisplay(
      playerRoundResult.isWinner,
      playerRoundResult.hit,
      targetRow,
      targetCol,
    );
    if (playerRoundResult.isWinner || computerRoundResult.isWinner) {
      render.detachCellEventListener(enemyCellEventListener);
    }
    if (playerRoundResult.isWinner) {
      render.renderResetGame();
      render.attachEventListener(
        '.reset',
        'click',
        function () {
          window.location.reload();
        },
        {
          once: true,
        },
      );
      return;
    }
    setTimeout(() => {
      render.updateBoardDisplay(
        computerRoundResult.isWinner,
        computerRoundResult.hit,
        ...computerRoundResult.coords,
        'com',
      );
      if (computerRoundResult.isWinner) {
        render.renderResetGame();
        render.attachEventListener('.reset', 'click', btnClickHandler, {
          once: true,
        });
        return;
      }
    }, 500);
  }

  function placeRandomComputerShips(ships, board) {
    ships.forEach(ship => {
      ship.direction = randomizedShipDirection();
      let [row, col] = randomizedInt();
      while (!board.placeShip(ship, row, col)) {
        [row, col] = randomizedInt();
      }
    });
  }

  function randomizedShipDirection() {
    return Math.floor(Math.random() * 4) < 3 ? 'horizontal' : 'vertical';
  }

  function randomizedInt() {
    return [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
  }

  initializeRender();
}
