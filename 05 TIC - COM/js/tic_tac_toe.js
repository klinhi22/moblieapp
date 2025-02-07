"use strict";
let flag = "pen-flag"; 
let counter = 9;
let gameOverFlg = 0; 
let isComputing = false; 

const squares = document.querySelectorAll(".square"); 
const message = document.getElementById("mgstext"); 
const newgamebtnDisplay = document.getElementById("newgame-btn"); 
const newgamebtn = document.getElementById("btn90"); 

const msgPenTurn = `<p class="image"><img src="img/penguins.jpg" width="61px"></p><p class="animate__animated animate__fadeIn">Penguins Attack! (your turn)</p>`;
const msgBearTurn = `<p class="image"><img src="img/whitebear.jpg" width="61px"></p><p class="animate__animated animate__fadeIn">WhiteBear Attack! (computer turn)</p>`;
const msgDraw = `<div class="image"><img src="img/penguins.jpg" width="61px"><img src="img/whitebear.jpg" width="61px"></div><p class="animate__animated animate__rotateIn">It's a Draw!</p>`;
const msgPenWin = `<p class="image"><img src="img/penguins.jpg" width="61px"></p><p class="animate__animated animate__heartBeat">Penguins Win!</p>`;
const msgBearWin = `<p class="image"><img src="img/whitebear.jpg" width="61px"></p><p class="animate__animated animate__heartBeat">WhiteBear Win!</p>`;
const gameSound = [
  "sound/click_sound1.mp3", //Penguins
  "sound/click_sound2.mp3", //Bear
  "sound/penwin_sound.mp3", //Penguins Win
  "sound/bearwin_sound.mp3", //Bear Win
  "sound/draw_sound.mp3", // Draw
];

const winPatterns = [
  ["a_1", "a_2", "a_3"],
  ["b_1", "b_2", "b_3"],
  ["c_1", "c_2", "c_3"],
  ["a_1", "b_1", "c_1"],
  ["a_2", "b_2", "c_2"],
  ["a_3", "b_3", "c_3"],
  ["a_1", "b_2", "c_3"],
  ["a_3", "b_2", "c_1"],
];
window.addEventListener("DOMContentLoaded", () => {
  setMessage("pen-turn"); 
  squares.forEach((square) => {
    square.classList.add("js-clickable"); 
    square.addEventListener("click", () => {
      if (gameOverFlg === 0 && !isComputing) isSelect(square); 
    });
  });
});

function isSelect(selectSquare) {
  if (selectSquare.classList.contains("js-unclickable")) return; 
  playClickSound(); 
  selectSquare.classList.add(flag === "pen-flag" ? "js-pen-checked" : "js-bear-checked");
  selectSquare.classList.add("js-unclickable");
  selectSquare.classList.remove("js-clickable");

  if (checkWinner(flag === "pen-flag" ? "js-pen-checked" : "js-bear-checked")) {
    highlightWinningLine(flag === "pen-flag" ? "js-pen_highlight" : "js-bear_highlight");
    gameOver(flag === "pen-flag" ? "penguins" : "bear");
    return;
  }

  flag = flag === "pen-flag" ? "bear-flag" : "pen-flag"; 
  counter--;

  if (counter === 0) {
    gameOver("draw"); 
    return;
  }

  if (flag === "bear-flag") {
    setMessage("bear-turn");
    isComputing = true; 
    setTimeout(() => {
      bearTurn(); 
      isComputing = false; 
    }, 2000);
  } else {
    setMessage("pen-turn"); 
  }
}

function bearTurn() {
  if (gameOverFlg === 1) return; 
  const winMove = findBestMove("js-bear-checked");
  if (winMove) {
    isSelect(winMove);
    return;
  }
  const blockMove = findBestMove("js-pen-checked");
  if (blockMove) {
    isSelect(blockMove);
    return;
  }
  const bearSquares = Array.from(squares).filter((square) =>
    square.classList.contains("js-clickable")
  );

  if (bearSquares.length > 0) {
    let n = Math.floor(Math.random() * bearSquares.length); 
    isSelect(bearSquares[n]); 
    let bearTurnEnd = "1"; 
    console.log("Bear selected:", bearSquares[n].id); 
  }
}

function findBestMove(className) {
  return winPatterns
    .map((pattern) => {
      const checked = pattern.filter((id) =>
        document.getElementById(id).classList.contains(className)
      );
      const empty = pattern.filter((id) =>
        document.getElementById(id).classList.contains("js-clickable")
      );

      if (checked.length === 2 && empty.length === 1) {
        return document.getElementById(empty[0]); 
      }
      return null;
    })
    .find((move) => move !== null); 
}

function setMessage(id) {
  message.innerHTML =
    id === "pen-turn"
      ? msgPenTurn
      : id === "bear-turn"
      ? msgBearTurn
      : id === "pen-win"
      ? msgPenWin
      : id === "bear-win"
      ? msgBearWin
      : msgDraw;
}

function checkWinner(className) {
  return winPatterns.some((pattern) =>
    pattern.every((id) =>
      document.getElementById(id).classList.contains(className)
    )
  );
}

function highlightWinningLine(highlightClass) {
  winPatterns.forEach((pattern) => {
    if (
      pattern.every((id) =>
        document.getElementById(id).classList.contains(flag === "pen-flag" ? "js-pen-checked" : "js-bear-checked")
      )
    ) {
      pattern.forEach((id) =>
        document.getElementById(id).classList.add(highlightClass)
      );
    }
  });
}
function startSnowEffect(color) {
  $(document).snowfall("clear"); 
  $(document).snowfall({
    flakeColor: color, 
    maxSpeed: 3, 
    minSpeed: 1, 
    maxSize: 20, 
    minSize: 10, 
    round: true, 
  });
}

function gameOver(winner) {
  gameOverFlg = 1; 
  playWinSound(winner); 

  newgamebtnDisplay.classList.remove("js-hidden"); 
  setMessage(
    winner === "penguins"
      ? "pen-win"
      : winner === "bear"
      ? "bear-win"
      : "draw"
  );
  if (winner === "penguins") {
    startSnowEffect("rgb(255, 240, 245"); 
  } else if (winner === "bear") {
    startSnowEffect("rgb(175, 238, 238)"); 
  }
 
  squares.forEach((square) => square.classList.add("js-unclickable"));
}

function playClickSound() {
  const sound = new Audio(gameSound[flag === "pen-flag" ? 0 : 1]);
  sound.currentTime = 0;
  sound.play();
}

function playWinSound(winner) {
  const sound = new Audio(
    gameSound[winner === "penguins" ? 2 : winner === "bear" ? 3 : 4]
  );
  sound.currentTime = 0;
  sound.play();
}


newgamebtn.addEventListener("click", () => {
  flag = "pen-flag";
  counter = 9;
  gameOverFlg = 0;
  isComputing = false;

  squares.forEach((square) => {
    square.classList.remove(
      "js-pen-checked",
      "js-bear-checked",
      "js-unclickable",
      "js-pen_highlight",
      "js-bear_highlight"
    );
    square.classList.add("js-clickable");
  });

  setMessage("pen-turn");
  newgamebtnDisplay.classList.add("js-hidden");
  $(document).snowfall("clear"); 
});
