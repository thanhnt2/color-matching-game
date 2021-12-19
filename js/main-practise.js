import {
  createTimer,
  getColorElementList,
  getColorListElement,
  getInActiveColorList,
  getRandomColorPairs,
  hidePlayAgainButton,
  setBackgroundColor,
  setTimerText,
  showPlayAgainButton,
} from "./colorHelper-practise.js";

const GAME_STATE = {
  PENDING: "pending",
  PLAYING: "playing",
  BLOCKING: "blocking",
  FINISHED: "finished",
};

let selections = [];
let gameStatus = GAME_STATE.PLAYING;
let timer = createTimer({
  seconds: 30,
  onChange: handleTimerChange,
  onFinish: handleTimerFinish,
});

function handleTimerChange(second) {
  const fullSecond = `0${second}`.slice(-2);
  setTimerText(fullSecond);
}
function handleTimerFinish() {
  gameStatus = GAME_STATE.FINISHED;

  setTimerText("Game Over! 😭");

  showPlayAgainButton();
}

function handleColorClick(liElement) {
  const shouldBlockClick = [GAME_STATE.BLOCKING, GAME_STATE.FINISHED].includes(
    gameStatus
  );

  const isClicked = liElement.classList.contains("active");
  if (!liElement || isClicked || shouldBlockClick) return;

  // show color for clicked cell
  liElement.classList.add("active");

  // save clicked cell to selections
  selections.push(liElement);
  if (selections.length < 2) return;

  // check match
  const firstColor = selections[0].dataset.color;
  const secondColor = selections[1].dataset.color;
  const isMatch = firstColor === secondColor;

  if (isMatch) {
    setBackgroundColor(firstColor);
    // if win
    const isWin = getInActiveColorList().length === 0;
    if (isWin) {
      showPlayAgainButton();
      setTimerText("YOU WIN!");
      timer.clear();

      gameStatus = GAME_STATE.FINISHED;
    }

    selections = [];

    return;
  }

  // remove active class
  gameStatus = GAME_STATE.BLOCKING;

  setTimeout(() => {
    selections[0].classList.remove("active");
    selections[1].classList.remove("active");

    // reset selections for the next selection
    selections = [];
    if (gameStatus !== GAME_STATE.FINISHED) {
      gameStatus = GAME_STATE.PLAYING;
    }
  }, 500);
}

function initColors() {
  // random 8 pairs of colors
  const colorList = getRandomColorPairs(8);

  // bind to li > div.overlay
  const liList = getColorElementList();

  liList.forEach((liElement, index) => {
    const overlayElement = liElement.querySelector(".overlay");
    liElement.dataset.color = colorList[index];

    if (overlayElement) overlayElement.style.backgroundColor = colorList[index];
  });
}

function attachEventForColorList() {
  const ulElement = getColorListElement();
  if (!ulElement) return;

  ulElement.addEventListener("click", (event) => {
    handleColorClick(event.target); //event.target lúc này là thẻ liElement
  });
}

function resetGame() {
  // reset global vars
  gameStatus = GAME_STATE.PLAYING;
  selections = [];

  // reset DOM elements
  // - remove active class from li
  const colorElementList = getColorElementList();
  for (let colorElement of colorElementList) {
    colorElement.classList.remove("active");
  }

  // - hide replay button
  hidePlayAgainButton();

  // - clear timer text (you win)
  setTimerText("");

  // re-generate new colors
  initColors();

  startTimer();
}

function attachEventForPlayAgainButton() {
  const playAgainButton = document.querySelector(".game .game__button");
  if (!playAgainButton) return;

  playAgainButton.addEventListener("click", resetGame);
}

function startTimer() {
  timer.start();
}
// main
(() => {
  initColors();

  attachEventForColorList();
  attachEventForPlayAgainButton();

  startTimer();
})();
