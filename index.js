const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 576;
const gravity = 0.37;
const groundLevel = canvas.height - 96;

const background = new Sprite({
  position:{
    x:0,
    y:0
  },
  imageSrc: './assets/background.png'
})
const shop = new Sprite({
  position:{
    x: 600,
    y: 128
  },
  imageSrc: './assets/shop.png',
  scale:2.75,
  framesMax: 6
})


const input = new InputHandler();
const inputEnemy = new InputHandler();

const player = new Fighter({
  position: { x: 100, y: 0 },
  velocity: { x: 0, y: 0 },
  imageSrc: '/assets/samuraiMack/idle.png',
  framesMax:8,
  scale:2.5,
  offset:{
    x:215,
    y:180
  },
  sprites:{
    idle:{
      imageSrc:'/assets/samuraiMack/Idle.png',
      framesMax:8
    },
    run:{
      imageSrc:'assets/samuraiMack/Run.png',
      framesMax:8
    },
    jump:{
      imageSrc:'assets/samuraiMack/Jump.png',
      framesMax:2
    },
    fall:{
      imageSrc:'assets/samuraiMack/Fall.png',
      framesMax:2
    },
    attack1:{
      imageSrc:'assets/samuraiMack/Attack1.png',
      framesMax:6
    }
  }
});

const enemy = new Fighter({
  position: { x: 700, y: 0 },
  velocity: { x: 0, y: 0 },
  imageSrc: '/assets/kenji/idle.png',
  framesMax:4,
  scale:2.5,
  offset:{
    x:215,
    y:195
  },
  sprites:{
    idle:{
      imageSrc:'/assets/kenji/Idle.png',
      framesMax:4
    },
    run:{
      imageSrc:'assets/kenji/Run.png',
      framesMax:8
    },
    jump:{
      imageSrc:'assets/kenji/Jump.png',
      framesMax:2
    },
    fall:{
      imageSrc:'assets/kenji/Fall.png',
      framesMax:2
    },
    attack1:{
      imageSrc:'assets/kenji/Attack1.png',
      framesMax:4
    }
  }
  
});



decreaseTimer()

function animate() {
  c.clearRect(0, 0, canvas.width, canvas.height);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  
  background.update()
  shop.update()
  
  c.fillStyle = "red";
  // c.fillRect(200, groundLevel, 10, 1)
  player.update();
  enemy.update();

  // Reset kecepatan horizontal setiap frame
  player.velocity.x = 0;
  enemy.velocity.x = 0;
  

  // Pergerakan player
  if (input.isKeyPressed("KeyA")) {
    player.switchSprite('run')
    player.velocity.x = -5;
  } else if (input.isKeyPressed("KeyD")) {
    // console.log(player.sprites)
    player.switchSprite('run')
    player.velocity.x = 5;
  }else{
    player.switchSprite('idle')
  }

  if (input.isKeyPressed("Space")) {
    player.attack();
  }

  if(player.velocity.y < 0){
    player.switchSprite('jump')
  }else if(player.velocity.y > 0){
    player.switchSprite('fall')
  }

  

  // Pergerakan musuh
  if (inputEnemy.isKeyPressed("ArrowLeft")) {
    enemy.velocity.x = -5;
    enemy.switchSprite('run')
  } else if (inputEnemy.isKeyPressed("ArrowRight")) {
    enemy.switchSprite('run')
    enemy.velocity.x = 5;
  }else{
    enemy.switchSprite('idle')
  }

  if (inputEnemy.isKeyPressed("ArrowDown")) {
    enemy.attack();
  }

  if(enemy.velocity.y < 0){
    enemy.switchSprite('jump')
  }else if(enemy.velocity.y > 0){
    enemy.switchSprite('fall')
  }

  // Lompat player & musuh
  if (input.isKeyPressed("KeyW") && player.position.y + player.height >= groundLevel) {
    player.velocity.y = -15;
  }
  if (inputEnemy.isKeyPressed("ArrowUp") && enemy.position.y + enemy.height >= groundLevel) {
    enemy.velocity.y = -15;
  }

  // Deteksi serangan player ke enemy
  if (rectangularCollision({ rectangle1: player, rectangle2: enemy }) && player.isAttacking) {
    player.isAttacking = false;
    enemy.health -= 20;
    updateHealthBars();
  }

  // Deteksi serangan enemy ke player
  if (rectangularCollision({ rectangle1: enemy, rectangle2: player }) && enemy.isAttacking) {
    enemy.isAttacking = false;
    player.health -= 20;
    updateHealthBars();
  }

  if(enemy.health <= 0 || player.health <= 0){
    determineWinner({player, enemy, timerId})
  }



  requestAnimationFrame(animate);
}

animate();
