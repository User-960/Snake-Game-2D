let gameInner = document.querySelector(".game__inner");
let field = document.createElement("div");
gameInner.after(field);
field.classList.add("field");

let sizeField = 200;

for (let i = 1; i < sizeField + 1; i++) {
    let excel = document.createElement("div");
    field.appendChild(excel);
    excel.classList.add("excel");
  }
