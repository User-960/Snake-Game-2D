import iconLogo from "../images/logo.png";

// create a instance of Image and write the path to the image. Then insert into the document
const gameForm = document.querySelector(".game__form");
const imgLogo = new Image();
imgLogo.classList.add("game__logo");
imgLogo.src = iconLogo;
imgLogo.alt = "logo";
gameForm.insertAdjacentElement("afterbegin", imgLogo);

// snake control variables
let interval; // interval for playing frames
let direction = "right"; // this variable is used to ensure that after the restart the snake had the initial direction where to move
// let steps = false;

// create a field for the game and add to the document and assign a class.
let gameInner = document.querySelector(".game__inner");
let field = document.createElement("div");
gameInner.after(field);
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

    // функция чтобы начать игру заного
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

      // draw a new apple
      createApple();
    }

    // steps = true;
  }
};
