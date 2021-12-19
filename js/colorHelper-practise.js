function shuffle(array) {
  if (!Array.isArray(array) || array.length <= 2) return array;

  for (let i = array.length - 1; i > 1; i--) {
    const j = Math.floor(Math.random() * i);

    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

export const getRandomColorPairs = (count) => {
  const hueList = [
    "red",
    "yellow",
    "green",
    "blue",
    "pink",
    "monochrome",
    "goldenrod",
    "purple",
  ];

  const colorList = [];

  for (let i = 0; i < count; i++) {
    const color = randomColor({
      luminosity: "dark",
      hue: hueList[i % hueList.length],
    });

    colorList.push(color);
  }

  // double current color list
  const fullColorList = [...colorList, ...colorList];

  // shuffe color list
  shuffle(fullColorList);

  return fullColorList;
};

export function getColorElementList() {
  const liElementList = document.querySelectorAll("#colorList > li");
  return liElementList;
}

export function getColorListElement() {
  return document.getElementById("colorList");
}

export function getInActiveColorList() {
  return document.querySelectorAll("#colorList > li:not(.active)");
}

export function showPlayAgainButton() {
  const playAgainButton = document.querySelector(".game .game__button");
  if (playAgainButton) playAgainButton.classList.add("show");
}
export function hidePlayAgainButton() {
  const playAgainButton = document.querySelector(".game .game__button");
  if (playAgainButton) playAgainButton.classList.remove("show");
}
export function setTimerText(text) {
  const timerElement = document.querySelector(".game .game__timer");
  if (timerElement) timerElement.textContent = text;
}

export function createTimer({ seconds, onChange, onFinish }) {
  let interValId = null;

  function start() {
    clear();
    let currentSecond = seconds;

    interValId = setInterval(() => {
      onChange?.(currentSecond);

      currentSecond--;

      if (currentSecond < 0) {
        clear();
        onFinish?.();
      }
    }, 1000);
  }

  function clear() {
    clearInterval(interValId);
  }

  return { start, clear };
}
