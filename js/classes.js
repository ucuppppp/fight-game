


class Sprite {
  constructor({
    position,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 }
  }) {
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
      this.image.height * this.scale
    )
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
    damage,
    position,
    velocity,
    color = "red",
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    sprites,
    attackBox = {offset:{}, width:undefined, height:undefined}
  }) {
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      offset
    })
    this.damage = damage
    this.sprites = sprites
    this.velocity = velocity;
    this.width = 50;
    this.height = 120;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height,
    };
    this.color = color;
    this.isAttacking = false;
    this.health = 100;
    this.canAttack = true; // Mencegah spam attack
    this.framesCurrent = 0
    this.framesElapsed = 0
    this.framesHold = 10
    this.dead = false

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image()
      sprites[sprite].image.src = sprites[sprite].imageSrc
    }
  }

  update() {
    this.draw();
    if(!this.dead)
    this.animateFrame()
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    this.attackBox.position.x = this.position.x + this.attackBox.offset.x
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y


    // c.fillRect(
    //   this.attackBox.position.x,
    //   this.attackBox.position.y,
    //   this.attackBox.width,
    //   this.attackBox.height
    // );

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
      this.canAttack = true;
    }, 500); // Delay serangan 500ms
  }

  takeHit(damage){
    this.health -= damage
    if(this.health <= 0){
      this.switchSprite('death')
      return {dead:true}
    }else{
      this.switchSprite('takeHit')
      return {dead:false}
    }
  }

  switchSprite(sprite) {
    // overriding sprite
    if (this.image === this.sprites.death.image) {
      if(this.framesCurrent === this.sprites.death.framesMax - 1)
        this.dead =true
      return}
    if (this.image === this.sprites.attack1.image && this.framesCurrent < this.sprites.attack1.framesMax - 1) return

    if (this.image === this.sprites.takeHit.image && this.framesCurrent < this.sprites.takeHit.framesMax - 1) return

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
      case 'takeHit':
        if (this.image !== this.sprites.takeHit.image) {
          this.image = this.sprites.takeHit.image
          this.framesMax = this.sprites.takeHit.framesMax
          this.framesCurrent = 0
        }
        break
      case 'death':
        if (this.image !== this.sprites.death.image) {
          this.image = this.sprites.death.image
          this.framesMax = this.sprites.death.framesMax
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
      [
        "KeyA",
        "KeyD",
        "KeyW",
        "ArrowRight",
        "ArrowLeft",
        "ArrowUp",
        "Space",
      ].includes(e.code)
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

  // Fungsi untuk membersihkan semua input (dipanggil saat player mati)
  clearKeys() {
    this.keys = {}; // Hapus semua input yang sedang aktif
    this.lastKey = null; // Reset lastKey agar tidak ada input yang tertinggal
  }
}
