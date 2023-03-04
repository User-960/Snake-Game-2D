import iconLogo from "../images/logo.png";

// create a instance of Image and write the path to the image. Then insert into the document
const gameForm = document.querySelector(".game__form");
const imgLogo = new Image();
imgLogo.classList.add("game__logo");
imgLogo.src = iconLogo;
imgLogo.alt = "logo";
gameForm.insertAdjacentElement("afterbegin", imgLogo);

// create a field for the game and add to the document and assign a class.
let gameInner = document.querySelector(".game__inner");
let field = document.createElement("div");
gameInner.after(field);
field.classList.add("field");

// form for entering data for fields
let inputWidth;
let inputHeight;
let sizeField;

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
};
