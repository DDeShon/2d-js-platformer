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
  }

  draw(c) {
    // Red square debug code
    c.fillStyle = "rgba(255, 0, 0, 0.5)";
    c.fillRect(this.x, this.y, this.width, this.height);

    if (this.isImageLoaded === true) {
      const cropbox = {
        x: 0,
        y: 0,
        width: 33,
        height: 32,
      };
      c.drawImage(
        this.image,
        cropbox.x + cropbox.width * this.currentFrame,
        cropbox.y,
        cropbox.width,
        cropbox.height,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
  }

  update(deltaTime, collisionBlocks) {
    if (!deltaTime) return;

    // Update animation frames
    this.elapsedTime += deltaTime;
    const secondsInterval = 0.1;
    if (this.elapsedTime > secondsInterval) {
      this.currentFrame = (this.currentFrame + 1) % 4;
      this.elapsedTime -= secondsInterval;
    }

    this.applyGravity(deltaTime);

    // Update horizontal position and check collisions
    this.updateHorizontalPosition(deltaTime);
    this.checkForHorizontalCollisions(collisionBlocks);

    // Check for any platform collisions
    this.checkPlatformCollisions(platforms, deltaTime);
  }
}
