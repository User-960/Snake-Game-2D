import iconLogo from "../images/logo.png";

const gameForm = document.querySelector(".game__form");
const CONTROL_PHONE = document.querySelector(".control-phone");

// create a instance of Image and write the path to the image. Then insert into the document
const imgLogo = new Image();
imgLogo.classList.add("game__logo");
imgLogo.src = iconLogo;
imgLogo.alt = "logo";
gameForm.insertAdjacentElement("afterbegin", imgLogo);

// score and best score
const SCORE_BLOCK = document.querySelector(".game__score .game__score-count");
const BEST_SCORE_BLOCK = document.querySelector(".game__best-game-score .game__best-score-count");
let score = 0;
let scoreDesk = [];
let bestScore;

// кнопка перезапуска игры
const BTN_RESTART = document.querySelector(".game__btn-restart");

// snake control variables
let interval; // interval for playing frames
let direction = "right"; // this variable is used to ensure that after the restart the snake had the initial direction where to move
let steps = false;

// create a field for the game and add to the document and assign a class.
const GAME_INNER = document.querySelector(".game__inner");
let field = document.createElement("div");
GAME_INNER.after(field);
field.classList.add("field");

// form for entering data for fields
let inputWidth;
let inputHeight;
let sizeField;

let snakeBody = [];
let apple = null;

document.querySelector(".game__btn-input").onclick = () => {
  inputWidth = +(document.querySelector(".input-width").value);
  inputHeight = +(document.querySelector(".input-height").value);

  // write the field sizes based on the data received from the form
  if (inputWidth > 3 && inputHeight > 3 && inputWidth < 100 && inputHeight < 100) {
    gameForm.style.display = "none";
    field.style.display = "flex";

    if (window.innerWidth < 1080) {
      CONTROL_PHONE.style.display = "flex";
    }

    sizeField = inputWidth * inputHeight;
    field.style.width = `${inputWidth * 16}px`;
    field.style.height = `${inputHeight * 16}px`;
  } else {
    alert("Error! Write a number between 3 and 100.");
    return;
  }

  for (let i = 1; i < sizeField + 1; i++) {
    let cellItem = document.createElement("div");
    field.appendChild(cellItem);
    cellItem.classList.add("cell");
  }

  // Assign coordinates to each cell
  let cell = document.getElementsByClassName("cell");
  let x = 1;
  let y = inputHeight;

  for (let i = 0; i < cell.length; i++) {
    if (x > inputWidth) {
      x = 1;
      y--;
    }
    cell[i].setAttribute("posX", x);
    cell[i].setAttribute("posY", y);
    x++;
  }

  // Create a snake and generate random coordinates for the snake
  function createSnake() {
    // generate random coordinates for the snake
    function generateSnake() {
      let posX = Math.round(Math.random() * (inputWidth - 3) + 3);
      let posY = Math.round(Math.random() * (inputHeight - 1) + 1);
      return [posX, posY];
    }

    let coordinatesSnake = generateSnake();

    snakeBody = [
      document.querySelector("[posX = \"" + coordinatesSnake[0] + "\"][posY = \"" + coordinatesSnake[1] + "\"]"),
      document.querySelector("[posX = \"" + (coordinatesSnake[0] - 1) + "\"][posY = \"" + coordinatesSnake[1] + "\"]"),
      document.querySelector("[posX = \"" + (coordinatesSnake[0] - 2) + "\"][posY = \"" + coordinatesSnake[1] + "\"]")
    ];

    // drawing a snake
    for (let i = 0; i < snakeBody.length; i++) {
      snakeBody[i].classList.add("snake__body");
    }

    snakeBody[0].classList.add("snake__head");
  }

  createSnake();

  // Create an apple and generate random coordinates for the apple, which are different from the coordinates of the snake
  function createApple() {
    function generateApple() {
      let posX = Math.round(Math.random() * (inputWidth - 1) + 1);
      let posY = Math.round(Math.random() * (inputHeight - 1) + 1);
      return [posX, posY];
    }

    let coordinatesApple = generateApple();
    apple = document.querySelector("[posX = \"" + coordinatesApple[0] + "\"][posY = \"" + coordinatesApple[1] + "\"]");

    // if the coordinates of the apple and the snake are the same, then we generate the apple again
    while (apple.classList.contains("snake__body")) {
      coordinatesApple = generateApple();
      apple = document.querySelector("[posX = \"" + coordinatesApple[0] + "\"][posY = \"" + coordinatesApple[1] + "\"]");
    }

    apple.classList.add("apple");
  }

  createApple();

  // draw score
  function drawScore() {
    SCORE_BLOCK.innerHTML = score;
  }

  // draw best score
  function drawBestScore() {
    BEST_SCORE_BLOCK.innerHTML = `Record: ${localStorage.getItem("bestScore")}`;
  }

  // scoring
  function incScore() {
    score++;
    drawScore();
  }

  // best scoring
  function incBestScore() {
    scoreDesk.push(score);
    scoreDesk.sort((a, b) => b - a);
    bestScore = scoreDesk[0];
    localStorage.setItem("bestScore", bestScore);
    drawBestScore();
  }

  // function to restart the game
  function refreshGame() {
    if (snakeBody[0].classList.contains("stop")) {
      for (let i = 0; i < snakeBody.length; i++) {
        snakeBody[i].classList.remove("snake__body");
      }
      snakeBody[0].classList.remove("snake__head");
      snakeBody[0].classList.remove("stop");
      apple.classList.remove("apple");

      direction = "right";
      createSnake();
      createApple();

      score = 0;
      drawScore();
    }

    interval = setInterval(move, 100);
  }

  function move() {
    let snakeCoordinates = [snakeBody[0].getAttribute("posX"), snakeBody[0].getAttribute("posY")];
    snakeBody[0].classList.remove("snake__head");
    snakeBody[snakeBody.length - 1].classList.remove("snake__body");
    snakeBody.pop();

    // write the movement of the snake across the field using the coordinates, and also write the script for crossing the borders
    if (direction == "right") {
      if (snakeCoordinates[0] < inputWidth) {
        snakeBody.unshift(document.querySelector("[posX = \"" + (+snakeCoordinates[0] + 1) + "\"][posY = \"" + snakeCoordinates[1] + "\"]"));
      } else {
        snakeBody.unshift(document.querySelector("[posX = \"1\"][posY = \"" + snakeCoordinates[1] + "\"]"));
      }
    } else if (direction == "left") {
      if (snakeCoordinates[0] > 1) {
        snakeBody.unshift(document.querySelector("[posX = \"" + (+snakeCoordinates[0] - 1) + "\"][posY = \"" + snakeCoordinates[1] + "\"]"));
      } else {
        snakeBody.unshift(document.querySelector(`[posX = "${inputWidth}"][posY = "` + snakeCoordinates[1] + "\"]"));
      }
    } else if (direction == "up") {
      if (snakeCoordinates[1] < inputHeight) {
        snakeBody.unshift(document.querySelector("[posX = \"" + snakeCoordinates[0] + "\"][posY = \"" + (+snakeCoordinates[1] + 1) + "\"]"));
      } else {
        snakeBody.unshift(document.querySelector("[posX = \"" + snakeCoordinates[0] + "\"][posY = \"1\"]"));
      }
    } else if (direction == "down") {
      if (snakeCoordinates[1] > 1) {
        snakeBody.unshift(document.querySelector("[posX = \"" + snakeCoordinates[0] + "\"][posY = \"" + (+snakeCoordinates[1] - 1) + "\"]"));
      } else {
        snakeBody.unshift(document.querySelector("[posX = \"" + snakeCoordinates[0] + `"][posY = "${inputHeight}"]`));
      }
    }

    // end game condition
    if (snakeBody[0].classList.contains("snake__body")) {
      snakeBody[0].classList.add("stop");

      // snake stop
      clearInterval(interval);

      incBestScore();

      // restart the game
      refreshGame();
    }

    snakeBody[0].classList.add("snake__head");
    for (let i = 0; i < snakeBody.length; i++) {
      snakeBody[i].classList.add("snake__body");
    }

    // condition if the coordinates of the snake and the apple are the same
    if (snakeBody[0].getAttribute("posX") == apple.getAttribute("posX") && snakeBody[0].getAttribute("posY") == apple.getAttribute("posY")) {
      apple.classList.remove("apple");

      // increase the snake by one cell
      let plusBodyX = snakeBody[snakeBody.length - 1].getAttribute("posX");
      let plusBodyY = snakeBody[snakeBody.length - 1].getAttribute("posY");
      snakeBody.push(document.querySelector("[posX = \"" + plusBodyX + "\"][posY = \"" + plusBodyY + "\"]"));

      incScore();

      // draw a new apple
      createApple();
    }

    steps = true;
  }

  BTN_RESTART.addEventListener("click", () => {
  clearInterval(interval);

  snakeBody[0].classList.add("stop");

  refreshGame();
  });
};

window.addEventListener("keydown", (e) => {
  // react to arrow clicks only if steps == true. Until the next move is made, the other arrows will not work. It has to do with code reading. The move function must complete and steps == true. Otherwise there will be a bug with fast switching of arrows. The snake can bury itself
  if (steps == true) {
    if (e.code == "KeyW" && direction != "down") {
      direction = "up";
      steps = false;
    } else if (e.code == "KeyA" && direction != "right") {
      direction = "left";
      steps = false;
    } else if (e.code == "KeyS" && direction != "up") {
      direction = "down";
      steps = false;
    } else if (e.code == "KeyD" && direction != "left") {
      direction = "right";
      steps = false;
    }
  }
});

// phone control
const BTN_UP = document.querySelector(".up");
const BTN_DOWN = document.querySelector(".down");
const BTN_LEFT = document.querySelector(".left");
const BTN_RIGHT = document.querySelector(".right");

BTN_UP.addEventListener("click", () => {
  if (direction != "down") {
    direction = "up";
    steps = false;
  }
});

BTN_DOWN.addEventListener("click", () => {
  if (direction != "up") {
    direction = "down";
    steps = false;
  }
});

BTN_LEFT.addEventListener("click", () => {
  if (direction != "right") {
    direction = "left";
    steps = false;
  }
});

BTN_RIGHT.addEventListener("click", () => {
  if (direction != "left") {
    direction = "right";
    steps = false;
  }
});
