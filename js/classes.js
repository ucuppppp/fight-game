


class Sprite {
  constructor({ position, imageSrc, scale = 1, framesMax = 1, offset = { x: 0, y: 0 } }) {
    this.position = position;
    this.width = 50;
    this.height = 150;
    this.image = new Image()
    this.image.src = imageSrc
    this.scale = scale
    this.framesMax = framesMax
    this.framesCurrent = 0
    this.framesElapsed = 0
    this.framesHold = 10
    this.offset = offset
  }

  draw() {
    c.drawImage(
      this.image,
      this.framesCurrent * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale)
  }

  animateFrame() {
    this.framesElapsed++
    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++
      } else {
        this.framesCurrent = 0
      }
    }
  }

  update() {
    this.draw();
    this.animateFrame()
  }


}
class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    color = "red",
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    sprites
  }) {
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      offset
    })
    this.sprites = sprites
    this.velocity = velocity;
    this.width = 50;
    this.height = 120;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset,
      width: 100,
      height: 50,
    };
    this.color = color;
    this.isAttacking = false;
    this.health = 100;
    this.canAttack = true; // Mencegah spam attack
    this.framesCurrent = 0
    this.framesElapsed = 0
    this.framesHold = 10

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image()
      sprites[sprite].image.src = sprites[sprite].imageSrc
    }
  }

  update() {
    this.draw();
    this.animateFrame()
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // Jika sprite menyentuh "ground", hentikan pergerakan jatuh
    if (this.position.y + this.height + this.velocity.y >= groundLevel) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += gravity;
    }
  }

  attack() {
    this.switchSprite('attack1')
    if (!this.canAttack) return; // Mencegah spam attack
    this.isAttacking = true;
    this.canAttack = false;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
    setTimeout(() => {
      this.canAttack = true;
    }, 500); // Delay serangan 500ms
  }

  switchSprite(sprite) {
    if (this.image === this.sprites.attack1.image && this.framesCurrent < this.sprites.attack1.framesMax - 1) return
    switch (sprite) {
      case 'idle':
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image
          this.framesMax = this.sprites.idle.framesMax
          this.framesCurrent = 0
        }
        break
      case 'run':
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image
          console.log(this.image);
          this.framesMax = this.sprites.run.framesMax
          this.framesCurrent = 0
        }
        break
      case 'jump':
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image
          this.framesMax = this.sprites.jump.framesMax
          this.framesCurrent = 0
        }
        break
      case 'fall':
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image
          this.framesMax = this.sprites.fall.framesMax
          this.framesCurrent = 0
        }
        break
      case 'attack1':
        if (this.image !== this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image
          this.framesMax = this.sprites.attack1.framesMax
          this.framesCurrent = 0
        }
        break
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
    if (
      ["KeyA", "KeyD", "KeyW", "ArrowRight", "ArrowLeft", "ArrowUp", "Space"].includes(
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