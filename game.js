var pjs = new PointJS('2D', 900, 600, { // 16:9
  backgroundColor : '#53769A' // if need
});

var log    = pjs.system.log;     // log = console.log;
var game   = pjs.game;           // Game Manager
var point  = pjs.vector.point;   // Constructor for Point
var camera = pjs.camera;         // Camera Manager
var brush  = pjs.brush;          // Brush, used for simple drawing
var OOP    = pjs.OOP;            // Object's manager
var math   = pjs.math;           // More Math-methods
var levels = pjs.levels;         // Levels manager

var key   = pjs.keyControl.initKeyControl();
var mouse = pjs.mouseControl.initMouseControl();

var width  = 900; // width of scene viewport
var height = 600; // height of scene viewport
// Получим резолюцию экрана
var r = game.getResolution();


pjs.system.setTitle('Happy New Year Game'); // Set Title for Tab or Window

game.newLoopFromConstructor('myGame', function () {

	var GAME = 0;

  // Объявим переменную скорости
  var speed = 0;

  // Объявим переменну счета
  var score = 0;

  // Первым делом создадим фон

  var back = game.newImageObject({
    file : 'pic/bg_3.jpg',
    h : 600 // Растягивание фона под экран
  });

  // Теперь создадим деда мороза (ну или санту)
  var santa = game.newImageObject({
    file : 'pic/krest_left_down.png',
    h : 150, // Оптимальный размер санты
    onload : function () {
      // отпозиционируем его по высоте
      this.y = -this.h + height; // Отлично
    }
  });

  // Объявим массив с подарками
  var podarki = [];

  // Создадим таймер, который будет добавлять подарки
  var timer = OOP.newTimer(1000, function () {
    podarki.push(game.newImageObject({
      x : math.random(0, width - 200), // 50*r - ширина объекта
      y : -math.random(50, 500), // уберем минус, так как он уже есть
      w : 150, h : 150,
      file : 'pic/naumova1.png'
    }));
  });

  this.update = function () {

    // Задействуем фактор дельта-тайм
    var dt = game.getDT(10); // 10 - это делитель дкльты для
    // удобного округления

    game.clear(); // clear screen
	

    back.draw(); // Отрисуем фон
	if(speed == 0){
		brush.drawText({
		  x : 200, y : 50,
		  text : 'Для старта нажмите мышкой',
		  size : 25,
		  color : '#FFFFFF',
		  strokeColor : 'black',
		  strokeWidth : 2,
		  style : 'bold',
		  font : 'Arial'
		});
		if (mouse.isDown('LEFT')) {
		  speed = 2;
		}
		
		
	}
    santa.draw(); // Отрисуем санту

    // Алгоритм добавления подарков по таймеру
    // новый подарок каждую секунду

    // Для того, чтобы подарки добавлялись каждую секунду
    timer.restart();

    OOP.forArr(podarki, function (el, i) { // i - идентификатор
      el.draw(); // Рисуем подарок

      el.move(point(0, speed*dt)); // Двигаем вниз

      // Проверка на столкновение подарка с сантой

      if (el.isIntersect(santa)) {
        podarki.splice(i, 1); // i - идентификатор, 1 - количество
        score++; // Увеличиваем счет
        speed+= 0.01; // увеличиваем скорость
      }

    });

    // Заставим двигатьcz санту
    // Учтем ограничения движения

    if (key.isDown('LEFT')) {
      // Двигаем влево
      if (santa.x >= 0)
        santa.x -= speed * dt;
    }

    if (key.isDown('RIGHT')) {
      // Двигаем влево
      if (santa.x+santa.w < width)
        santa.x += speed * dt;
    }
	

    // Отрисуем счет
    brush.drawText({
      x : 10, y : 10,
      text : 'Счет: ' + score,
      size : 50 * r,
      color : '#FFFFFF',
      strokeColor : 'black',
      strokeWidth : 2,
      style : 'bold',
      font : 'Arial'
    });

  };

  this.entry = function () { // [optional]
    // При входе в игру будем очищать подарки и удалять счет
	GAME = 0;
    OOP.clearArr(podarki);
    score = 0;
  };

});

game.startLoop('myGame');