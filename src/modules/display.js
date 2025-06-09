export default function ScreenDisplay() {
  const content = document.querySelector('.content');

  function initialize(playerShips, playerBoard) {
    renderGameSetup(playerShips, playerBoard);
  }

  function renderGameSetup(ships, board) {
    clearContentChild();
    const setupMenuWrapper = document.createElement('div');
    const playerShipDataWrapper = document.createElement('div');
    const setUpBoardWrapper = document.createElement('div');
    const setupBoard = renderPlayerBoard(board);
    setupMenuWrapper.classList.add('setup-menu');
    playerShipDataWrapper.classList.add('ship-data-wrapper');
    setUpBoardWrapper.classList.add('setup-board-wrapper');
    setupBoard.classList.add('setup-board');
    for (let i = 0; i < ships.length; i++) {
      const shipName = ships[i].name;
      const shipLength = ships[i].shipHp;
      const shipDirection = ships[i].direction;
      const shipDiv = document.createElement('div');
      const shipText = document.createElement('h3');
      const shipHp = document.createElement('p');
      const shipDirectionToggle = document.createElement('button');
      const selectShipBtn = document.createElement('button');
      shipDiv.classList.add('ship-data');
      shipText.textContent =
        shipName.slice(0, 1).toUpperCase() + shipName.slice(1, shipName.length);
      shipHp.textContent = `HP : ${shipLength}`;
      shipDirectionToggle.classList.add('ship-direction-toggle');
      shipDirectionToggle.setAttribute('data-index', i);
      shipDirectionToggle.textContent = `Direction : ${shipDirection}`;
      selectShipBtn.textContent = 'Select Ship';
      selectShipBtn.classList.add('select-ship-btn');
      selectShipBtn.setAttribute('data-index', i);
      selectShipBtn.setAttribute('data-ship-name', `${shipName}`);
      selectShipBtn.setAttribute('data-ship-length', `${shipLength}`);
      selectShipBtn.setAttribute('data-ship-direction', `${shipDirection}`);

      shipDiv.append(shipText, shipHp, shipDirectionToggle, selectShipBtn);
      playerShipDataWrapper.appendChild(shipDiv);
    }
    setUpBoardWrapper.appendChild(setupBoard);
    setupMenuWrapper.append(playerShipDataWrapper, setUpBoardWrapper);
    content.appendChild(setupMenuWrapper);
  }

  function attachEventListener(selector, event, callback, options = {}) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      element.addEventListener(event, callback, options);
    });
  }

  function updateDirectionToggleButton(selector, index) {
    const btn = document.querySelector(`.${selector}[data-index='${index}']`);
    btn.textContent =
      btn.textContent === 'Direction : vertical'
        ? 'Direction : horizontal'
        : 'Direction : vertical';
  }

  function updateSetupBoardDisplay(type, shipPositions) {
    shipPositions.forEach(pos => {
      const currentDiv = document.querySelector(
        `[data-row='${pos[0]}'][data-col='${pos[1]}']`,
      );
      if (type === 'mouseover') {
        currentDiv.classList.add('setup-hover');
      } else if (type === 'mouseout') {
        currentDiv.classList.remove('setup-hover');
      } else if (type === 'click') {
        currentDiv.style.backgroundColor = 'green';
      }
    });
  }

  function renderConfirmBtn() {
    const confirmBtn = document.createElement('button');
    confirmBtn.classList.add('confirm');
    confirmBtn.textContent = 'Confirm';
    document.querySelector('.ship-data-wrapper').append(confirmBtn);
  }

  function renderPlayerBoard(playerBoard) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('player-board-wrapper');
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const currentCellData = playerBoard.getBoardCell(i, j);
        const cell = document.createElement('div');
        cell.classList.add('player-board-cell');
        cell.setAttribute('id', `player-${i}-${j}`);
        cell.setAttribute('data-row', i);
        cell.setAttribute('data-col', j);
        if (currentCellData.hasShip()) {
          cell.classList.add('player-ship');
        }
        wrapper.appendChild(cell);
      }
    }
    return wrapper;
  }

  function renderEnemyBoard(board) {
    const wrapper = document.createElement('div');
    const boardCover = document.createElement('div');
    const loading = document.createElement('div');
    loading.classList.add('loading');
    wrapper.classList.add('enemy-board-wrapper');
    boardCover.setAttribute('class', 'cover enemy');
    boardCover.appendChild(loading);
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const currentCellData = board.getBoardCell(i, j);
        const cell = document.createElement('div');
        cell.classList.add('enemy-board-cell');
        cell.setAttribute('id', `${i}-${j}`);
        cell.setAttribute('data-row', i);
        cell.setAttribute('data-col', j);
        if (currentCellData.hasShip()) {
          cell.classList.add('enemy-ship');
        }
        wrapper.appendChild(cell);
      }
    }
    wrapper.appendChild(boardCover);
    return wrapper;
  }

  function detachSetupEventListener(
    btnListener,
    cellHoverListener,
    cellMouseOutListener,
    cellClickListener,
  ) {
    removeEventListener('.ship-direction-toggle', 'click', btnListener);
    removeEventListener('.select-ship-btn', 'click', btnListener);
    removeEventListener('.player-board-cell', 'mouseover', cellHoverListener);
    removeEventListener('.player-board-cell', 'mouseout', cellMouseOutListener);
    removeEventListener('.player-board-cell', 'click', cellClickListener, {
      once: true,
    });
  }

  function removeEventListener(selector, type, callback, options = {}) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      element.removeEventListener(type, callback, options);
    });
  }

  function renderBattleScreen(board1, board2) {
    clearContentChild();
    const battlefieldWrapper = document.createElement('div');
    const turnMessagesWrapper = document.createElement('div');
    const messages = document.createElement('h4');
    turnMessagesWrapper.classList.add('turn-messages');
    messages.classList.add('messages');
    messages.textContent = `Player One's turn.`;
    battlefieldWrapper.classList.add('battlefield-wrapper');
    turnMessagesWrapper.appendChild(messages);
    battlefieldWrapper.append(
      turnMessagesWrapper,
      renderPlayerBoard(board1),
      renderEnemyBoard(board2),
    );
    content.appendChild(battlefieldWrapper);
  }

  function clearContentChild() {
    content.replaceChildren();
  }

  // TODO: REFACTOR TO HAVE SPLIT FUNCTION TO UPDATE PLAYER BOARD AND COMPUTER BOARD SEPARATELY
  function updateBoardDisplay(
    isWinner,
    hitStatus,
    row,
    col,
    player = 'player',
  ) {
    let target;
    updateTurnMessages(isWinner);
    if (player === 'com') {
      target = document.getElementById(`player-${row}-${col}`);
    } else {
      target = document.getElementById(`${row}-${col}`);
    }
    if (hitStatus) {
      target.classList.add('hit');
    } else {
      target.classList.add('miss');
    }
  }

  function toggleCoverBoard() {
    const el = document.querySelector(`.cover`);
    el.style.display = 'flex';
    setTimeout(() => {
      el.style.display = 'none';
    }, 900);
  }

  function markSelectedShip(element) {
    element.classList.toggle('selected');
  }

  function updateTurnMessages(isWinner) {
    const messages = document.querySelector('.messages');
    const text = messages.textContent;
    if (isWinner && text.includes('Player')) {
      messages.textContent = "Player one's Win the game.";
    } else if (isWinner && text.includes('Computer')) {
      messages.textContent = "Computer's Win the game.";
    } else if (text.includes('Player')) {
      messages.textContent = "Computer's Turn.";
    } else {
      messages.textContent = "Player One's turn.";
    }
  }

  function renderResetGame() {
    const turnMessagesDiv = document.querySelector('.turn-messages');
    const resetBtn = document.createElement('button');
    resetBtn.classList.add('reset');
    resetBtn.textContent = 'Play Again';
    turnMessagesDiv.appendChild(resetBtn);
  }

  return {
    initialize,
    attachEventListener,
    detachSetupEventListener,
    updateDirectionToggleButton,
    updateSetupBoardDisplay,
    renderConfirmBtn,
    renderBattleScreen,
    updateBoardDisplay,
    toggleCoverBoard,
    markSelectedShip,
    renderResetGame,
  };
}
