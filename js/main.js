(() => {
  // stub
  console.log('game stuff ready!');

  // set up variables here
  const theCanvas = document.querySelector('canvas'),
        ctx = theCanvas.getContext('2d'),
        playerImg = document.querySelector('.ship'),
        mouseTracker = { x : theCanvas.width /2 },
        playerLives = [1, 2, 3],

        // grab the enemy images
        enemy1 = document.querySelector('.enemyOne'),
        enemy2 = document.querySelector('.enemyTwo'),
        enemy3 = document.querySelector('.enemyThree'),

        player = { x: 275, y: 550, width: 50, height: 50, speed : 15, lives : 3 },

        playButton = document.querySelector('.play'),
        pauseButton = document.querySelector('.pause'),
        resetButton = document.querySelector('.reset'),

        // grab the reset screen
        resetScreen = document.querySelector('.level-up');

  var playState = true,
      score = 0,
      mousePos = 0,
      bullets = [],
      squares = [
        { x : randomX(), y : 30, x2 : 30, y2 : 30, image : enemy1, xspeed : 3, yspeed : 4, points : 10 },
        { x : randomX(), y : 30, x2 : 40, y2 : 40, image : enemy2, xspeed : 7, yspeed : 7, points : 5 },
        { x : randomX(), y : 30, x2 : 35, y2 : 35, image : enemy3, xspeed : 5, yspeed : 3, points : 10 }
      ];

  function draw() {
      ctx.clearRect(0, 0, theCanvas.width, theCanvas.height);

      // draw the score first
      ctx.fillStyle = 'rgb(255, 255, 255)';
      ctx.font = '18px sans-serif';
      ctx.fillText(`Score : ${score}`, 500, 20);

      // draw life icons
      playerLives.forEach((life, index) => {
        ctx.drawImage(playerImg, 10 + (index * 26), 10, 20, 20);
      });

      // draw the mouse tracker
      ctx.beginPath();
      ctx.moveTo(mouseTracker.x, theCanvas.height - 10);
      ctx.lineTo(mouseTracker.x - 5, theCanvas.height);
      ctx.lineTo(mouseTracker.x + 5, theCanvas.height);
      ctx.fillStyle = 'rgb(255, 255, 255)';
      ctx.fill();

      // make the ship chase the triangle
      dx = mousePos - player.x;
      player.x += (dx / 10);

      ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

      bullets.forEach((bullet, index) => {
        ctx.fillStyle = 'rgb(255, 0, 0)';
        ctx.fillRect(bullet.x, bullet.y, bullet.x2, bullet.y2);

        let bulletIndex = index;

        squares.forEach((square, index) => {
          // check for collision (bullet and box) => check all coord and dimensions to see if a bullet is touching a box
          if (bullet.y <= (square.y + square.y2) && bullet.y > square.y && bullet.x > square.x && bullet.x < (square.x + square.x2)) {
            squares.splice(index, 1);
            bullets.splice(bulletIndex, 1);

            // increment the score based on enemy points
            score += square.points;
            console.log(`Score = ${score}`);

            // are there any enemies left?
            if (squares.length == 0) {  // 0 means no
              // show the level up screen
              console.log('level up!');
              showResetScreen();
            }

            // create and play explosion sound
            
          }
        });

        bullet.y -= bullet.speed;

        // bullet is out of the playing area
        if (bullet.y < 0) {
          bullets.splice(index, 1);
        }
      });

      squares.forEach(square => {
        ctx.drawImage(square.image, square.x, square.y, square.x2, square.y2);
        // keep the enemies in the playing area (left - right)
        if (square.x + square.x2 > theCanvas.width) {
          square.xspeed *= -1;
        } else if (square.x < 0) {
          square.xspeed *= -1;
        }
        // keep the enemies in the playing area (top - bottom)
        if (square.y + square.y2 > theCanvas.height - 100) {
          square.yspeed *= -1;
        } else if (square.y < 0) {
          square.yspeed *= -1;
        }

        square.x += square.xspeed;
        square.y += square.yspeed;
      });

      if (playState === false) {
        window.cancelAnimationFrame(draw);
        return;
      }

      window.requestAnimationFrame(draw);
  }

  
  function createBullet() {
    // create / draw a bullet and push it into the bullet array
    let newBullet = {
      x : player.x + player.width / 2 - 2.5,
      y : theCanvas.height - player.height - 10,
      x2 : 5,
      y2 : 10,
      speed : 12
    };

    bullets.push(newBullet);

    // create and play cheesy laser sound
    
  }

  function movePlayer(e) {
    mousePos = (e.clientX - theCanvas.offsetLeft) - player.width / 2;

    mouseTracker.x = e.clientX - theCanvas.offsetLeft;
  }

  function resumeGame() {
    playState = true;
    window.requestAnimationFrame(draw);
  }

  function pauseGame() {
    playState = false;
  }

  function showResetScreen() {
    resetScreen.classList.add('show-level-up');
    playState = false;
  }

  function levelUpGame() {
    // increase the difficulty - manually for now, this can be dynamic later (use a multiplier and generate random values)
    bullets = [];

    squares = [
      { x : randomX(), y : 30, x2 : 30, y2 : 30, image : enemy1, xspeed : -3, yspeed : 5, points : 10 },
      { x : randomX(), y : 30, x2 : 40, y2 : 40, image : enemy2, xspeed : 7, yspeed : 7, points : 5 },
      { x : randomX(), y : 30, x2 : 35, y2 : 35, image : enemy3, xspeed : -5, yspeed : 3, points : 10 },
      { x : randomX(), y : 30, x2 : 30, y2 : 30, image : enemy1, xspeed : 2, yspeed : 6, points : 10 },
      { x : randomX(), y : 30, x2 : 40, y2 : 40, image : enemy2, xspeed : -7, yspeed : 7, points : 5 },
      { x : randomX(), y : 30, x2 : 35, y2 : 35, image : enemy3, xspeed : 6, yspeed : 3, points : 10 }
    ];
    //
    // restart the game, reset the player to the middle
    player.x = theCanvas.width / 2;
    mousePos = theCanvas.width / 2;
    //
    // get rid of the reset screen
    resetScreen.classList.remove('show-level-up');
    // restart the animation
    playState = true;

    window.requestAnimationFrame(draw);
  }

  function randomX() {
    return Math.floor(Math.random() * (theCanvas.width - 100));
  }

  window.requestAnimationFrame(draw);


  // move the player with the mouse
  theCanvas.addEventListener('mousemove', movePlayer);
  theCanvas.addEventListener('click', createBullet);

  playButton.addEventListener('click', resumeGame);
  pauseButton.addEventListener('click', pauseGame);
  resetButton.addEventListener('click', levelUpGame);
})();
