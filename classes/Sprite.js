class Sprite {
  constructor({ x, y, width, height }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.isImageLoaded = false;
    this.image = new Image();
    this.image.onload = () => {
      this.isImageLoaded = true;
    };
    this.image.src = "./images/opossum.png";
    this.elapsedTime = 0;
    this.currentFrame = 0;
    this.sprites = {
      run: {
        x: 0,
        y: 0,
        width: 36,
        height: 28,
        frames: 6,
      },
    };
    this.currentSprite = this.sprites.run;
    this.facing = "right";
  }

  draw(c) {
    // Red square debug code
    // c.fillStyle = "rgba(255, 0, 0, 0.5)";
    // c.fillRect(this.x, this.y, this.width, this.height);

    if (this.isImageLoaded === true) {
      let xScale = 1;
      let x = this.x;

      if (this.facing === "right") {
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

    this.determineDirection();
  }

  determineDirection() {
    if (this.velocity.x > 0) {
      this.facing = "right";
    } else if (this.velocity.x < 0) {
      this.facing = "left";
    }
  }
}
