const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 576;
const gravity = 0.37;
const groundLevel = canvas.height - 96;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./assets/background.png",
});
const shop = new Sprite({
  position: {
    x: 600,
    y: 128,
  },
  imageSrc: "./assets/shop.png",
  scale: 2.75,
  framesMax: 6,
});

const input = new InputHandler();
const inputEnemy = new InputHandler();

const player = new Fighter({
  damage: 20,
  position: {
    x: 100,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  imageSrc: "/assets/samuraiMack/idle.png",
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 180,
  },
  sprites: {
    idle: {
      imageSrc: "/assets/samuraiMack/Idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "assets/samuraiMack/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "assets/samuraiMack/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "assets/samuraiMack/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "assets/samuraiMack/Attack1.png",
      framesMax: 6,
    },
    takeHit: {
      imageSrc: "assets/samuraiMack/Take Hit - white silhouette.png",
      framesMax: 4,
    },
    death: {
      imageSrc: "assets/samuraiMack/Death.png",
      framesMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: 100,
      y: 25,
    },
    width: 160,
    height: 50,
  },
});

const enemy = new Fighter({
  damage: 10,
  position: {x: 700, y: 0},
  velocity: {x: 0, y: 0},
  imageSrc: "/assets/kenji/idle.png",
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 195,
  },
  sprites: {
    idle: {
      imageSrc: "/assets/kenji/Idle.png",
      framesMax: 4,
    },
    run: {
      imageSrc: "assets/kenji/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "assets/kenji/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "assets/kenji/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "assets/kenji/Attack1.png",
      framesMax: 4,
    },
    takeHit: {
      imageSrc: "assets/kenji/Take hit.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "assets/kenji/Death.png",
      framesMax: 7,
    },
  },
  attackBox: {
    offset: {
      x: -173,
      y: 25,
    },
    width: 150,
    height: 50,
  },
});

decreaseTimer();

function animate() {
  c.clearRect(0, 0, canvas.width, canvas.height);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  background.update();
  shop.update();

  c.fillStyle = "red";
  // c.fillRect(200, groundLevel, 10, 1)
  player.update();
  enemy.update();

  // Reset kecepatan horizontal setiap frame
  player.velocity.x = 0;
  enemy.velocity.x = 0;


if(!player.dead){
  // Pergerakan player
  if (input.isKeyPressed("KeyA")) {
    player.switchSprite("run");
    player.velocity.x = -5;
  } else if (input.isKeyPressed("KeyD")) {
    // console.log(player.sprites)
    player.switchSprite("run");
    player.velocity.x = 5;
  } else {
    player.switchSprite("idle");
  }

  if (input.isKeyPressed("Space")) {
    console.log(input.keys)
    player.attack();
  }
  // Lompat player & musuh
  if (
    input.isKeyPressed("KeyW") &&
    player.position.y + player.height >= groundLevel
  ) {
    player.velocity.y = -15;
  }
}
  
  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  if(!enemy.dead){
    // Pergerakan musuh
    if (inputEnemy.isKeyPressed("ArrowLeft")) {
      enemy.velocity.x = -5;
      enemy.switchSprite("run");
    } else if (inputEnemy.isKeyPressed("ArrowRight")) {
      enemy.switchSprite("run");
      enemy.velocity.x = 5;
    } else {
      enemy.switchSprite("idle");
    }

    if (inputEnemy.isKeyPressed("ArrowDown")) {
      enemy.attack();
    }

    if (
      inputEnemy.isKeyPressed("ArrowUp") &&
      enemy.position.y + enemy.height >= groundLevel
    ) {
      enemy.velocity.y = -15;
    }
  }

  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }

 

  

  // Deteksi serangan player ke enemy
  if (
    rectangularCollision({rectangle1: player, rectangle2: enemy}) &&
    player.isAttacking &&
    player.framesCurrent == 4
  ) {
    player.isAttacking = false;
    console.log('hit')
    let enemyStatus = enemy.takeHit(player.damage);
    if(enemyStatus.dead){
      inputEnemy.clearKeys()
      enemy.isAttacking = false
    }
    updateHealthBars();
  }

  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false;
  }

  // Deteksi serangan enemy ke player
  if (
    rectangularCollision({rectangle1: enemy, rectangle2: player}) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 2
  ) {
    enemy.isAttacking = false;
    let playerStatus = player.takeHit(enemy.damage);
    if (playerStatus.dead) {
      input.clearKeys();
      player.isAttacking = false;
    }
    updateHealthBars();
  }
  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false;
  }

  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({player, enemy, timerId});
  }

  requestAnimationFrame(animate);
}

animate();
