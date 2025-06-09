export default function Event() {
  function createEventListener(btnClickHandler) {
    return function (event) {
      const target = event.target;
      btnClickHandler(target);
    };
  }

  function createSetUpBoardListener(setupBoardHandler) {
    return function (event) {
      const target = event.target;
      const boardCellData = {
        row: Number(target.dataset.row),
        col: Number(target.dataset.col),
      };
      setupBoardHandler(boardCellData);
    };
  }

  return {
    createEventListener,
    createSetUpBoardListener,
  };
}
