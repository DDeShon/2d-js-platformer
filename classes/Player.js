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
    this.image = new Image();
    this.image.src = './images/player.png';
  }

  draw(c) {
    // Red square debug code
    c.fillStyle = "rgba(255, 0, 0, 0.5)";
    c.fillRect(this.x, this.y, this.width, this.height);

    c.drawImage(this.image, this.x, this.y);
  }

  update(deltaTime, collisionBlocks){
    if (!deltaTime) return;
    this.applyGravity(deltaTime);

    // Update horizontal position and check collisions
    this.updateHorizontalPosition(deltaTime);
    this.checkForHorizontalCollisions(collisionBlocks);

    // Check for any platform collisions
    this.checkPlatformCollisions(platforms, deltaTime);
  }
}
