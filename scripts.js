// 1. Объявим все переменные, которые будем использовать. Config - настройки игры

// очки
let scoreBlock = document.querySelector('.game-score .score-count');
let bestScoreBlock = document.querySelector('.best-game-score .best-score-count')
let score = 0;
let scoreDesk = [];
let bestScore;


// интервал для проигрования кадров
let interval;


// кнопка перезапуска игры
let btnRestart = document.getElementById('btnRestart');


// создаем поле для игры. Добавляем в документ и присваиваем класс.
let game = document.getElementById('game');
let gameHead = document.querySelector('.game-header')
let field = document.createElement('div');
gameHead.after(field);
field.classList.add('field');


// переменные для управления змейкой
let direction = 'right';
let steps = false;


// форма для ввода значений для поля
let gameForm = document.querySelector('.game-form');
let controlPhone = document.querySelector('.control-phone');
let inputWidth;
let inputHeight;

let sizeField;

let snakeBody = [];
let apple = null;


document.getElementById('btn-input').onclick = function () {
  inputWidth = +(document.getElementById('input-width').value);
  inputHeight = +(document.getElementById('input-height').value);

  // записываем размеры поля на основе полученых данных из формы
  if (inputWidth > 3 && inputHeight > 3 && inputWidth < 100 && inputHeight < 100) {
    gameForm.style.display = 'none';
    field.style.display = 'flex';
    controlPhone.style.display = 'flex';
    
    sizeField = inputWidth * inputHeight;
    field.style.width = `${inputWidth * 16}px`;
    field.style.height = `${inputHeight * 16}px`;
  } else {
    alert('Ошибка! Введите число в диапозоне от 3 до 100.')
    return
  }

  // разбили поле на ячейки. Запустили цикл где создали и добавили ячейку в документ определённое колличество раз
  // И присволи им класс
  for (let i = 1; i < sizeField + 1; i++) {
    let excel = document.createElement('div');
    field.appendChild(excel);
    excel.classList.add('excel');
  }


  // 2. Присвоили координаты каждой ячейки добавив им атрибуты через цикл.
  excel = document.getElementsByClassName('excel');
  let x = 1;
  let y = inputHeight;

  for (let i = 0; i < excel.length; i++) {
    if (x > inputWidth) {
      x = 1;
      y--;
    }
    excel[i].setAttribute('posX', x);
    excel[i].setAttribute('posY', y);
    x++;
  }


  // 3. Создаём змейку и генерируем случайные координаты для змейки.
  function createSnake() {
    function generateSnake() {
      let posX = Math.round(Math.random() * (inputWidth - 3) + 3);
      let posY = Math.round(Math.random() * (inputHeight - 1) + 1);
      return [posX, posY];
    }

    // змейка это массив из 3х соседних эелементов
    let coordinatesSnake = generateSnake(); // возвразает массив с координатами

    snakeBody = [document.querySelector('[posX = "' + coordinatesSnake[0] + '"][posY = "' + coordinatesSnake[1] + '"]'), document.querySelector('[posX = "' + (coordinatesSnake[0] - 1) + '"][posY = "' + coordinatesSnake[1] + '"]'), document.querySelector('[posX = "' + (coordinatesSnake[0] - 2) + '"][posY = "' + coordinatesSnake[1] + '"]')];

    // отрисовка змейки
    for (let i = 0; i < snakeBody.length; i++) {
      snakeBody[i].classList.add('snakeBody');
    }

    snakeBody[0].classList.add('snakeHead');

  }

  createSnake();
  
  
  // 4. Создаём яблоко и генерируем случайные координаты для яблока. В отличии от змейки, то здесь добавляем цикл что координаты генирации не совпадали и заного генерировала координаты.
  function createApple() {
    function generateApple() {
      let posX = Math.round(Math.random() * (inputWidth - 1) + 1);
      let posY = Math.round(Math.random() * (inputHeight - 1) + 1);
      return [posX, posY];
    }

    let coordinatesApple = generateApple(); // возвразает массив с координатами
    apple = document.querySelector('[posX = "' + coordinatesApple[0] + '"][posY = "' + coordinatesApple[1] + '"]');

    // если координаты яблока и змейки совпали, то заного генерируем яблоко
    while (apple.classList.contains('snakeBody')) {
      let coordinatesApple = generateApple();
      apple = document.querySelector('[posX = "' + coordinatesApple[0] + '"][posY = "' + coordinatesApple[1] + '"]');
    }

    apple.classList.add('apple');
  }

  createApple();


  // 5. Пишим функции с набором очков
  function incScore() {
    score++;
    drawScore()
  };


  // функция отрисовки
  function drawScore() {
    scoreBlock.innerHTML = score;
  };


  // функция с лучшем рекордом
  function incBestScore() {
    scoreDesk.push(score);
    scoreDesk.sort((a, b) => b - a);
    bestScore = scoreDesk[0];
    localStorage.setItem('bestScore', bestScore); // запись луччшего рекорда в localStorage
    drawBestScore()
  };


  // функция отрисовки лучшего рекорда
  function drawBestScore() {
    bestScoreBlock.innerHTML = `Record: ${localStorage.getItem('bestScore')}`;
  };


  // функция чтобы начать игру заного
  function refreshGame() {

    if (snakeBody[0].classList.contains('stop')) {

      for (let i = 0; i < snakeBody.length; i++) {
        snakeBody[i].classList.remove('snakeBody');
      }
      snakeBody[0].classList.remove('snakeHead');
      snakeBody[0].classList.remove('stop');
      apple.classList.remove('apple');

      direction = 'right'; // эта переменная служит для того чтобы после рестарта у земейки было изначальное напрвление куда двигаться. Если его нет, то змейка сама в себя ударяется потому что стоит на месте и респавниться по всему полю
      
      createSnake();
      createApple();
      
      score = 0;
      drawScore();

    }

    interval = setInterval(move, 100);
  };


  function move() {
    let snakeCoordinates = [snakeBody[0].getAttribute('posX'), snakeBody[0].getAttribute('posY')];
    snakeBody[0].classList.remove('snakeHead'); // удаляем класс первго элемента массива
    snakeBody[snakeBody.length - 1].classList.remove('snakeBody');
    snakeBody.pop(); // удаляем последний элемент массива и его класс


    // пишим движение змейки по по полю используя координаты, а так же прописываем сценарий по пересичению границ
    if (direction == 'right') {
      if (snakeCoordinates[0] < inputWidth) {
        snakeBody.unshift(document.querySelector('[posX = "' + (+snakeCoordinates[0] + 1) + '"][posY = "' + snakeCoordinates[1] + '"]'));
      } else {
        snakeBody.unshift(document.querySelector('[posX = "1"][posY = "' + snakeCoordinates[1] + '"]'));
      }
    } else if (direction == 'left') {
      if (snakeCoordinates[0] > 1) {
        snakeBody.unshift(document.querySelector('[posX = "' + (+snakeCoordinates[0] - 1) + '"][posY = "' + snakeCoordinates[1] + '"]'));
      } else {
        snakeBody.unshift(document.querySelector(`[posX = "${inputWidth}"][posY = "` + snakeCoordinates[1] + `"]`));
      }
    } else if (direction == 'up') {
      if (snakeCoordinates[1] < inputHeight) {
        snakeBody.unshift(document.querySelector('[posX = "' + snakeCoordinates[0] + '"][posY = "' + (+snakeCoordinates[1] + 1) + '"]'));
      } else {
        snakeBody.unshift(document.querySelector('[posX = "' + snakeCoordinates[0] + '"][posY = "1"]'));
      }
    } else if (direction == 'down') {
      if (snakeCoordinates[1] > 1) {
        snakeBody.unshift(document.querySelector('[posX = "' + snakeCoordinates[0] + '"][posY = "' + (+snakeCoordinates[1] - 1) + '"]'));
      } else {
        snakeBody.unshift(document.querySelector(`[posX = "` + snakeCoordinates[0] + `"][posY = "${inputHeight}"]`));
      }
    }

    // условие окончания игры
    if (snakeBody[0].classList.contains('snakeBody')) {

      snakeBody[0].classList.add('stop');

      clearInterval(interval); // остановка змейки

      incBestScore();

      // начать игру заного
      refreshGame();

    }


    snakeBody[0].classList.add('snakeHead'); // добавили элемент в массив и присвоили класс snakeHead. unshift добавляет новый эелемент в массив snakeBody с новыми координатами
    for (let i = 0; i < snakeBody.length; i++) {
      snakeBody[i].classList.add('snakeBody');
    }


    // условие если координаты змейки и яблока совпадут
    if (snakeBody[0].getAttribute('posX') == apple.getAttribute('posX') && snakeBody[0].getAttribute('posY') == apple.getAttribute('posY')) {

      // убираем класс яблоко
      apple.classList.remove('apple');

      // увеличиваем змейку на одну клетку
      let plusBodyX = snakeBody[snakeBody.length - 1].getAttribute('posX');
      let plusBodyY = snakeBody[snakeBody.length - 1].getAttribute('posY');
      snakeBody.push(document.querySelector('[posX = "' + plusBodyX + '"][posY = "' + plusBodyY + '"]')); //push добавдяет elem в конец
      
      // набор очков
      incScore()

      // отрисовываем новое яблоко
      createApple();
    }

    steps = true; 
  }
  
  btnRestart.addEventListener('click', function() {
  clearInterval(interval);
  
  snakeBody[0].classList.add('stop');

  refreshGame();
  })
}

 




window.addEventListener('keydown', function (e) {
  // реагировать на нажатие стрелок можно только если steps == true. Пока не сделан следующий ход, то другие стрелки работать не будут. Это связанно со счтением кода. Функция move должна быть выполнена полностью и steps == true. Иначе будет баг с быстрым переключением стрелок сработает. Змейка может уткнуться в себя
  if (steps == true) {
    if (e.code == 'KeyW' && direction != 'down') {
      direction = 'up';
      steps = false;
    }
    else if (e.code == 'KeyA' && direction != 'right') {
      direction = 'left';
      steps = false;
    }
    else if (e.code == 'KeyS' && direction != 'up') {
      direction = 'down';
      steps = false;
    }
    else if (e.code == 'KeyD' && direction != 'left') {
      direction = 'right';
      steps = false;
    }
  }
})



// управление для телефона
let btnUp = document.querySelector('.up');
let btnDown = document.querySelector('.down');
let btnLeft = document.querySelector('.left');
let btnRight = document.querySelector('.right');


btnUp.addEventListener('click', () => {
  if (direction != 'down') {
    direction = 'up';
    steps = false;
  }
});

btnDown.addEventListener('click', () => {
  if (direction != 'up') {
    direction = 'down';
    steps = false;
  }
});

btnLeft.addEventListener('click', () => {
  if (direction != 'right') {
    direction = 'left';
    steps = false;
  }
});

btnRight.addEventListener('click', () => {
  if (direction != 'left') {
    direction = 'right';
    steps = false;
  }
});

