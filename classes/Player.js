const X_VELOCITY = 200;
const JUMP_POWER = 250;
const GRAVITY = 500;

class Player {
  constructor({ x, y, size, velocity = { x: 0, y: 0 } }) {
    this.x = x;
    this.y = y;
    this.width = size;
    this.height = size;
    this.velocity = velocity;
    this.isOnGround = false;
    this.isImageLoaded = false;
    this.image = new Image();
    this.image.onload = () => {
      this.isImageLoaded = true;
    };
    this.image.src = "./images/player.png";
    this.elapsedTime = 0;
    this.currentFrame = 0;
    this.sprites = {
      idle: {
        x: 0,
        y: 0,
        width: 33,
        height: 32,
        frames: 4,
      },
      run: {
        x: 0,
        y: 32,
        width: 33,
        height: 32,
        frames: 6,
      },
      jump: {
        x: 0,
        y: 32 * 5,
        width: 33,
        height: 32,
        frames: 1,
      },
      fall: {
        x: 33,
        y: 32 * 5,
        width: 33,
        height: 32,
        frames: 1,
      },
    };
    this.currentSprite = this.sprites.idle;
    this.facing = "right";
    this.hitbox = {
      x: 0,
      y: 0,
      width: 20,
      height: 23
    }
  }

  draw(c) {
    // Red square debug code
    c.fillStyle = "rgba(255, 0, 0, 0.5)";
    c.fillRect(this.x, this.y, this.width, this.height);

    // Hitbox debug code
    c.fillStyle = "rgba(0, 0, 255, 0.5)";
    c.fillRect(this.hitbox.x, this.hitbox.y, this.hitbox.width, this.hitbox.height);

    if (this.isImageLoaded === true) {
      let xScale = 1;
      let x = this.x;

      if (this.facing === "left") {
        xScale = -1;
        x = -this.x - this.width;
      }

      c.save();

      c.scale(xScale, 1);

      c.drawImage(
        this.image,
        this.currentSprite.x + this.currentSprite.width * this.currentFrame,
        this.currentSprite.y,
        this.currentSprite.width,
        this.currentSprite.height,
        x,
        this.y,
        this.width,
        this.height
      );

      c.restore();
    }
  }

  update(deltaTime, collisionBlocks) {
    if (!deltaTime) return;

    // Update animation frames
    this.elapsedTime += deltaTime;
    const secondsInterval = 0.1;
    if (this.elapsedTime > secondsInterval) {
      this.currentFrame = (this.currentFrame + 1) % this.currentSprite.frames;
      this.elapsedTime -= secondsInterval;
    }

    // Update hitbox position
    this.hitbox.x = this.x + 4;
    this.hitbox.y = this.y + 9;

    this.applyGravity(deltaTime);

    // Update horizontal position and check collisions
    this.updateHorizontalPosition(deltaTime);
    this.checkForHorizontalCollisions(collisionBlocks);

    // Check for any platform collisions
    this.checkPlatformCollisions(platforms, deltaTime);

    // Update vertical position and check collisions
    this.updateVerticalPosition(deltaTime);
    this.checkForVerticalCollisions(collisionBlocks);

    this.determineDirection();
    this.switchSprites();
  }

  determineDirection() {
    if (this.velocity.x > 0) {
      this.facing = "right";
    } else if (this.velocity.x < 0) {
      this.facing = "left";
    }
  }

  switchSprites() {
    if (
      this.isOnGround &&
      this.velocity.x === 0 &&
      this.currentSprite !== this.sprites.idle
    ) {
      // Idle
      this.currentFrame = 0;
      this.currentSprite = this.sprites.idle;
    } else if (
      this.isOnGround &&
      this.velocity.x !== 0 &&
      this.currentSprite !== this.sprites.run
    ) {
      // Run
      this.currentFrame = 0;
      this.currentSprite = this.sprites.run;
    } else if (
      !this.isOnGround &&
      this.velocity.y < 0 &&
      this.currentSprite !== this.sprites.jump
    ) {
      // Jump
      this.currentFrame = 0;
      this.currentSprite = this.sprites.jump;
    } else if (
      !this.isOnGround &&
      this.velocity.y > 0 &&
      this.currentSprite !== this.sprites.fall
    ) {
      // Fall
      this.currentFrame = 0;
      this.currentSprite = this.sprites.fall;
    }
  }

  jump() {
    this.velocity.y = -JUMP_POWER;
    this.isOnGround = false;
  }

  updateHorizontalPosition(deltaTime) {
    this.x += this.velocity.x * deltaTime;
    this.hitbox.x += this.velocity.x * deltaTime;
  }

  updateverticalPosition(deltaTime) {
    this.y += this.velocity.y * deltaTime;
  }

  applyGravity(deltaTime){
    this.velocity.y += GRAVITY * deltaTime;
  }

  handleInput(keys) {
    this.velocity.x = 0;

    if (keys.d.pressed) {
      this.velocity.x = X_VELOCITY;
    }
  }

  checkForHorizontalCollisions(collisionBlocks) {
    const buffer = 0.0001;
    for (l let i = 0; i < collisionBlocks.length; i++) {
      const collisionBlock = collisionBlocks[i];

      // Check if a collision exists on all axes
      if (
        this.hitbox.x <= collisionBlock.x + collisionBlock.width &&
        this.hitbox.x + this.hitbox.width >= collisionBlock.x &&
        this.hitbox.y + this.hitbox.height >= collisionBlock.y &&
        this.hitbox.y <= collisionBlock.y + collisionBlock.height
      ) {
        // Check collision when player is going left
        if (this.velocity.x < -0) {
          this.hitbox.x = collisionBlock.x + collisionBlock.width + buffer;
          this.x = this.hitbox.x;
          break;
        }

        // Check collision when player is going right
        if (this.velocity > 0) {
          this.hitbox.x = collisionBlock.x - this.width - buffer;
          this.x = this.hitbox.x;
          break;
        }
      }
    }
  }

  checkForVerticalCollisions(collisionBlocks){
    const buffer = 0.0001;
  }
}
