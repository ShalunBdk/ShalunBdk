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
		loaded : true
	};
	
	
	
	var GAME = 0;
	var MAX_SCORE = 0;
	var MAX_NAME = 'Админ';
	var MAX_AVATAR = '';
	
	var speed = 3;
	var speedG = 2;
	var direction = 1;
	
	var dev = false;
	
	var score = 0;
	
	var health = 3;
	
	var save = function(){
		VK.api("storage.set", {global : 1, key : 'MAX_SCOR', value : MAX_SCORE}, function(data) {
			console.log('РЕКОРД ОБНОВЛЕН');
		});
		VK.api("storage.set", {global: 1, key : 'MAX_NAME', value : MAX_NAME}, function(data) {
			console.log('NAME РЕКОРД ОБНОВЛЕН');
		});
		VK.api("storage.set", {user_id: user.id, key : 'scor', value : user.score}, function(data) {
			console.log('NAME РЕКОРД ОБНОВЛЕН');
		});
		VK.api("storage.set", {global : 1, key : 'MAX_AVATAR', value : MAX_AVATAR}, function(data) {
			console.log('AVATAR РЕКОРД ОБНОВЛЕН');
		});
	}
	
	
  var pl = game.newImageObject({
    file : 'pic/krest_right_down.png',
    h : 150, // Оптимальный размер санты
    onload : function () {
      // отпозиционируем его по высоте
      this.y = -this.h + height; // Отлично
    }
  });
  var santa = game.newAnimationObject({
	  animation : pjs.tiles.newAnimation('pic/krest_anim.png', 225, 439, 2),
	  h: 150,
	  w : 100,
	  delay : 10,
	  y : -150 + height
	});

  var photo1 = game.newImageObject({
    file : MAX_AVATAR,
	x : 50,
	y : 200
  });
  
  var heal = game.newImageObject({
    file : 'pic/health.png',
	x : 800,
	y : 100,
	w : 50,
	h : 50
  });
  
  // Объявим массив с подарками
  var podarki = [];

  // Создадим таймер, который будет добавлять подарки
  var timer = OOP.newTimer(1000, function () {
    podarki.push(game.newImageObject({
      x : math.random(0, width - 200), // 50*r - ширина объекта
      y : -math.random(200, 600), // уберем минус, так как он уже есть
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
	//santa.draw(); // Отрисуем санту
	
	if(score > MAX_SCORE){		
		MAX_SCORE = score;
		MAX_NAME = user.name;
		MAX_AVATAR = user.avatar;
		
	}
	
	if(score > user.score){
		user.score = score;
	}
	
    if(health == 0){
		GAME = 2;
		save();
		score = 0;
		health = 3;
		OOP.clearArr(podarki);
	}
	
	if(health == 1) {
		heal.simpleDraw( point(850, 10) );
	}else if(health == 2){
		heal.simpleDraw( point(850, 10) );
		heal.simpleDraw( point(800, 10) );
	}else if(health == 3){
		heal.simpleDraw( point(850, 10) );
		heal.simpleDraw( point(800, 10) );
		heal.simpleDraw( point(750, 10) );
	}else if(health == 4){
		heal.simpleDraw( point(850, 10) );
		heal.simpleDraw( point(800, 10) );
		heal.simpleDraw( point(750, 10) );
		heal.simpleDraw( point(700, 10) );
	}else if(health == 5){
		heal.simpleDraw( point(850, 10) );
		heal.simpleDraw( point(800, 10) );
		heal.simpleDraw( point(750, 10) );
		heal.simpleDraw( point(700, 10) );
		heal.simpleDraw( point(650, 10) );
	}
	
    timer.restart();

    OOP.forArr(podarki, function (el, i) { // i - идентификатор
      el.draw(); // Рисуем подарок
      el.move(point(0, speedG*dt)); // Двигаем вниз
		
		if(el.y > height){
			el.y = -math.random(200, 600);
			health -= 1;
			podarki.splice(i, 1);
		}
      // Проверка на столкновение подарка с сантой

      if (el.isIntersect(santa)) {
        podarki.splice(i, 1); // i - идентификатор, 1 - количество
        score++; // Увеличиваем счет
      }

    });
	

    if (key.isDown('LEFT')) {
      // Двигаем влево
      if (santa.x >= 0)
        santa.x -= speed * dt;
		santa.draw();
		direction = 0;
    }else if (key.isDown('RIGHT')) {
      // Двигаем влево
      if (santa.x+santa.w < width)
        santa.x += speed * dt;
		santa.draw();
		direction = 1;
    }else if (key.isDown('ESC')) {
		save();
		GAME = 0;
    }else {
		santa.drawFrame(santa.frame);
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
	
		if(dev == true){
			brush.drawText({
			  x : 10, y : 110,
			  text : 'hp: ' + health,
			  size : 30,
			  color : '#FFFFFF',
			  strokeColor : 'black',
			  strokeWidth : 2,
			  style : 'bold',
			  font : 'Arial'
			});
			brush.drawText({
			  x : 10, y : 210,
			  text : 'naum massive: ' + podarki.length,
			  size : 30,
			  color : '#FFFFFF',
			  strokeColor : 'black',
			  strokeWidth : 2,
			  style : 'bold',
			  font : 'Arial'
			});
			santa.drawDynamicBox();
			OOP.forArr(podarki, function (el, i) {
				el.drawDynamicBox();
			});
		}
	
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
		  x : 810, y : 30,
		  text : '' + user.score,
		  size : 50,
		  color : '#FFFFFF',
		  strokeColor : 'black',
		  strokeWidth : 2,
		  style : 'bold',
		  font : 'Arial'
		});
		
		
		brush.drawText({
		  x : 10, y : 150,
		  text : 'ТОП 1 по счету: ',
		  size : 30,
		  color : '#FFFFFF',
		  strokeColor : 'black',
		  strokeWidth : 2,
		  style : 'bold',
		  font : 'Arial'
		});
		brush.drawText({
		  x : 20, y : 255,
		  text : MAX_NAME + '(' + MAX_SCORE + ')',
		  size : 25,
		  color : '#FFFFFF',
		  strokeColor : 'black',
		  strokeWidth : 2,
		  style : 'bold',
		  font : 'Arial'
		});
		
		photo1.draw();
		if(dev == true){
			brush.drawText({
			  x : 750, y : 130,
			  text : 'dev true',
			  size : 30,
			  color : '#FFFFFF',
			  strokeColor : 'black',
			  strokeWidth : 2,
			  style : 'bold',
			  font : 'Arial'
			});
		}
		if (mouse.isPeekObject('LEFT', game_buttom)) {
			GAME = 1;
		}
		if (key.isDown('ENTER')) {
			GAME = 1;
		}
		if (key.isDown('D')) {
			dev = true;
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
	}else if(GAME == 2){
		brush.drawText({
		  x : 150, y : 30,
		  text : 'будет экран проигрыша | Для продолжения нажмите ENTER',
		  size : 25,
		  color : '#FFFFFF',
		  strokeColor : 'black',
		  strokeWidth : 2,
		  style : 'bold',
		  font : 'Arial'
		});
		if (key.isDown('ENTER')) {
			GAME = 0;
		}
	}

  };

  this.entry = function () { // [optional]
	VK.api("users.get", {'fields':'photo_50'}, function(data) {
			user.name = '' + data.response[0].first_name;
			user.id = '' + data.response[0].id;
			user.avatar = '' + data.response[0].photo_50;
			console.log(user);
			user.loaded = true;
		});
	VK.api("storage.get", {global: 1, key : 'MAX_NAME'}, function(data) {
			MAX_NAME = '' + data.response;
			console.log(data.response);
		});
	VK.api("storage.get", {global: 1, key : 'MAX_SCOR'}, function(data) {
			MAX_SCORE = data.response;
			console.log(data.response);
		});
	VK.api("storage.get", {user_id: user.id, key : 'scor'}, function(data) {
			user.score = data.response;
			console.log(data.response);
		});
	VK.api("storage.get", {global: 1, key : 'MAX_AVATAR'}, function(data) {
			MAX_AVATAR = data.response;
			console.log(data.response);
			photo1.setImage(MAX_AVATAR);
		});
	
    OOP.clearArr(podarki);
    score = 0;
	if(pjs.resources.isLoaded() == true)GAME = 0;
  };
	this.exit = function () {
		save();
	}
});

game.startLoop('myGame');