const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 600;
const gravity = 0.5;

class Sprite {
  constructor({position, velocity}) {
    this.position = position;
    this.velocity = velocity;
    this.width = 50;
    this.height = 120;
  }

  draw() {
    c.fillStyle = "red";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // Jika sprite menyentuh "ground", hentikan pergerakan jatuh
    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
      this.position.y = canvas.height - this.height; // pastikan tidak melewati ground
    } else {
      this.velocity.y += gravity;
    }
  }
}

class InputHandler {
  constructor() {
    this.keys = {};
    this.lastKey = null;
    window.addEventListener("keydown", (e) => this.keyDownHandler(e));
    window.addEventListener("keyup", (e) => this.keyUpHandler(e));
  }

  keyDownHandler(e) {
    this.keys[e.code] = true;
    console.log(e.code);
    if (
      ["KeyA", "KeyD", "KeyW", "ArrowRight", "ArrowLeft", "ArrowUp"].includes(
        e.code
      )
    ) {
      this.lastKey = e.code;
    }
  }

  keyUpHandler(e) {
    this.keys[e.code] = false;
  }

  isKeyPressed(code) {
    return !!this.keys[code];
  }
}

const input = new InputHandler();
const inputEnemy = new InputHandler();

const player = new Sprite({
  position: {x: 0, y: 0},
  velocity: {x: 0, y: 0},
});

const enemy = new Sprite({
  position: {x: 400, y: 0},
  velocity: {x: 0, y: 0},
});

function animate() {
  c.clearRect(0, 0, canvas.width, canvas.height);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  // Reset kecepatan horizontal player setiap frame
  player.velocity.x = 0;
  enemy.velocity.x = 0;

  if (input.isKeyPressed("KeyA") && input.isKeyPressed("KeyD")) {
    if (input.lastKey === "KeyA") {
      player.velocity.x = -1;
    } else if (input.lastKey === "KeyD") {
      player.velocity.x = 1;
    }
  } else if (input.isKeyPressed("KeyA")) {
    player.velocity.x = -1;
  } else if (input.isKeyPressed("KeyD")) {
    player.velocity.x = 1;
  }

  if (
    inputEnemy.isKeyPressed("ArrowRight") &&
    inputEnemy.isKeyPressed("ArrowLeft")
  ) {
    if (inputEnemy.lastKey === "ArrowLeft") {
      enemy.velocity.x = -1;
    } else if (inputEnemy.lastKey === "ArrowRight") {
      enemy.velocity.x = 1;
    }
  } else if (input.isKeyPressed("ArrowLeft")) {
    enemy.velocity.x = -1;
  } else if (input.isKeyPressed("ArrowRight")) {
    enemy.velocity.x = 1;
  }

  if (
    input.isKeyPressed("KeyW") &&
    player.position.y + player.height >= canvas.height
  ) {
    player.velocity.y = -15;
  }
  if (
    inputEnemy.isKeyPressed("ArrowUp") &&
    enemy.position.y + enemy.height >= canvas.height
  ) {
    enemy.velocity.y = -15;
  }

  player.update();
  enemy.update();

  requestAnimationFrame(animate);
}

animate();
