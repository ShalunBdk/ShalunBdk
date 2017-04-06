var pjs = new PointJS('2D', 900, 600, { // 16:9
  backgroundColor : '#FFFFFF' // if need
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
var lm = pjs.memory.local;

pjs.system.setTitle('Happy New Year Game'); // Set Title for Tab or Window

game.newLoopFromConstructor('myGame', function () {
	
	var user = {
		score: 0,
		id : '',
		name : 'none',
		avatar : '',
		loaded : false
	};

	var GAME = 0;
	var MAX_SCORE;
	var MAX_NAME = '';

	var speed = 2;
	var direction = 1;

	var score = 0;
	
	var save = function(){
		VK.api("storage.set", {global : 1, key : 'MAX_SCORE', value : MAX_SCORE}, function(data) {
			console.log('РЕКОРД ОБНОВЛЕН');
		});
		VK.api("storage.set", {user_id: user.id, key : 'MAX_NAME', value : name}, function(data) {
			console.log('NAME РЕКОРД ОБНОВЛЕН');
		});
	}
	
	
  var santa = game.newImageObject({
    file : 'pic/krest_right_down.png',
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
      w : 120, h : 120,
      file : 'pic/naumova1.png'
    }));
  });
  
  this.update = function () {

    // Задействуем фактор дельта-тайм
    var dt = game.getDT(10); // 10 - это делитель дкльты для
    // удобного округления

    game.clear(); // clear screen

	if(GAME == 1){
	
	var back = game.newImageObject({
    file : 'pic/bg_3.jpg',
    h : 600 // Растягивание фона под экран
	});
	
    back.draw(); // Отрисуем фон
	if(direction == 0) santa.setFlip(true, false);
	if(direction == 1) santa.setFlip(false, false);
	santa.draw(); // Отрисуем санту
	
	if(score > MAX_SCORE){
		MAX_SCORE = score;
	}
	
    
	
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
		direction = 0;
    }

    if (key.isDown('RIGHT')) {
      // Двигаем влево
      if (santa.x+santa.w < width)
        santa.x += speed * dt;
		direction = 1;
    }
	
	if (key.isDown('ESC')) {
		save();
		GAME = 0;
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
	
	} else if(GAME == 0 && user.loaded){
		back = game.newImageObject({
		file : 'pic/menu_game.png',
		h : 600,
		w : 900
		});
		back.draw();
		var game_buttom = game.newImageObject({
			file : 'pic/game_buttom.png',
			h : 114,
			w : 305,
			x : 285,
			y : 180
		});
		game_buttom.draw();
		brush.drawText({
		  x : 150, y : 30,
		  text : '' + score,
		  size : 50,
		  color : '#FFFFFF',
		  strokeColor : 'black',
		  strokeWidth : 2,
		  style : 'bold',
		  font : 'Arial'
		});
		brush.drawText({
		  x : 830, y : 30,
		  text : '' + MAX_SCORE,
		  size : 50,
		  color : '#FFFFFF',
		  strokeColor : 'black',
		  strokeWidth : 2,
		  style : 'bold',
		  font : 'Arial'
		});
		brush.drawText({
		  x : 150, y : 500,
		  text : '' + MAX_NAME,
		  size : 50,
		  color : '#FFFFFF',
		  strokeColor : 'black',
		  strokeWidth : 2,
		  style : 'bold',
		  font : 'Arial'
		});
		if (mouse.isPeekObject('LEFT', game_buttom)) {
			GAME = 1;
		}
		if (key.isDown('ENTER')) {
			GAME = 1;
		}
	}else if(GAME == 0 && user.loaded == false){
		
		brush.drawText({
		  x : 150, y : 30,
		  text : 'Загрузка...',
		  size : 50,
		  color : '#FFFFFF',
		  strokeColor : 'black',
		  strokeWidth : 2,
		  style : 'bold',
		  font : 'Arial'
		});
	}

  };

  this.entry = function () { // [optional]
	VK.api("users.get", {}, function(data) {
			user.name = '' + data.response[0].first_name;
			user.id = '' + data.response[0].id;
			user.avatar = '' + data.response[0].photo_50;
			user.loaded = true;
		});
	VK.api("storage.get", {global: 1, keys : 'MAX_NAME, MAX_SCORE'}, function(data) {
			MAX_NAME = data.response[0].MAX_NAME;
			MAX_SCORE = data.response[0].MAX_SCORE;
		});
	GAME = 0;
    OOP.clearArr(podarki);
    score = 0;
  };

});

game.startLoop('myGame');