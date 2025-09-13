const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const dpr = 2;

canvas.width = 1024 * dpr;
canvas.height = 576 * dpr;

const oceanLayerData = {
  l_New_Layer_1: l_New_Layer_1,
};

const brambleLayerData = {
  l_New_Layer_2: l_New_Layer_2,
};

const layersData = {
  l_New_Layer_8: l_New_Layer_8,
  // l_New_Layer_3: l_New_Layer_3,
  l_Decorations: l_Decorations,
  // l_New_Layer_5: l_New_Layer_5,
  // l_New_Layer_6: l_New_Layer_6,
  // l_New_Layer_9: l_New_Layer_9,
  // l_New_Layer_9_1: l_New_Layer_9_1,
};

const tilesets = {
  l_New_Layer_1: { imageUrl: "./images/decorations.png", tileSize: 16 },
  l_New_Layer_2: { imageUrl: "./images/decorations.png", tileSize: 16 },
  l_New_Layer_8: { imageUrl: "./images/tileset.png", tileSize: 16 },
  // l_New_Layer_3: { imageUrl: "./images/tileset.png", tileSize: 16 },
  l_Decorations: { imageUrl: "./images/decorations.png", tileSize: 16 },
  // l_New_Layer_5: { imageUrl: "./images/tileset.png", tileSize: 16 },
  // l_New_Layer_6: { imageUrl: "./images/decorations.png", tileSize: 16 },
  // l_New_Layer_9: { imageUrl: "./images/decorations.png", tileSize: 16 },
  // l_New_Layer_9_1: { imageUrl: "./images/tileset.png", tileSize: 16 },
};

// Tile Setup
const collisionBlocks = [];
const platforms = [];
const blockSize = 16; // Setting each tile as 16x16 pixels

collisionBlocks.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 1) {
      collisionBlocks.push(
        new CollisionBlock({
          x: x * blockSize,
          y: y * blockSize,
          size: blockSize,
        })
      );
    } else if (symbol === 2) {
      platforms.push(
        new Platform({
          x: x * blockSize,
          y: y * blockSize + blockSize,
          width: 16,
          height: 4,
        })
      );
    }
  });
});

const renderLayer = (tilesData, tilesetImage, tileSize, context) => {
  tilesData.forEach((row, y) => {
    row.forEach((symbol, x) => {
      if (symbol !== 0) {
        const srcX =
          ((symbol - 1) % (tilesetImage.width / tileSize)) * tileSize;
        const srcY =
          Math.floor((symbol - 1) / (tilesetImage.width / tileSize)) * tileSize;

        context.drawImage(
          tilesetImage, // source image
          srcX, // source X
          srcY, // source Y
          tileSize, // source width
          tileSize, // source height
          x * 16, // destination X
          y * 16, // destination Y
          16, // destination width
          16 // destination height
        );
      }
    });
  });
};

const renderStaticLayers = async (layersData) => {
  const offscreenCanvas = document.createElement("canvas");
  offscreenCanvas.width = canvas.width;
  offscreenCanvas.height = canvas.height;
  const offscreenContext = offscreenCanvas.getContext("2d");

  for (const [layerName, tilesData] of Object.entries(layersData)) {
    const tilesetInfo = tilesets[layerName];
    if (tilesetInfo) {
      try {
        const tilesetImage = await loadImage(tilesetInfo.imageUrl);
        renderLayer(
          tilesData,
          tilesetImage,
          tilesetInfo.tileSize,
          offscreenContext
        );
      } catch (error) {
        console.error("Failed to load image for layer ${layerName}!", error);
      }
    }
  }

  return offscreenCanvas;
};

// END of Tile Setup

// Change XY coordinates to move player's position
const player = new Player({
  x: 100,
  y: 100,
  size: 32,
  velocity: { x: 0, y: 0 },
});

const opossums = [
  new Opossum({
    x: 650,
    y: 100,
    width: 36,
    height: 32,
  }),
  new Opossum({
    x: 550,
    y: 100,
    width: 36,
    height: 32,
  }),
];

const sprites = [];

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};

let lastTime = performance.now();
const camera = {
  x: 300,
  y: 0,
};

const SCROLL_POST_RIGHT = 500;
const SCROLL_POST_TOP = 100;
const SCROLL_POST_BOTTOM = 200;
let oceanBackgroundCanvas = null;
let brambleBackgroundCanvas = null;

function animate(backgroundCanvas) {
  // Calculate delta time
  const currentTime = performance.now();
  const deltaTime = (currentTime - lastTime) / 1000;
  lastTime = currentTime;

  // Update player position
  player.handleInput(keys);
  player.update(deltaTime, collisionBlocks);

  // Update opossum position
  for (let i = opossums.length - 1; i >= 0; i--) {
    const opossum = opossums[i];
    opossum.update(deltaTime, collisionBlocks);

    // When jumping on enemy
    if (checkCollisions(player, opossum)) {
      player.velocity.y = -200;
      sprites.push(
        new Sprite({
          x: opossum.x,
          y: opossum.y,
          width: 32,
          height: 32,
          imageSrc: "./images/enemy-death.png",
          spriteCropbox: {
            x: 0,
            y: 0,
            width: 40,
            height: 41,
            frames: 6,
          },
        })
      );

      opossums.splice(i, 1);
    }
  }

  for (let i = sprites.length - 1; i >= 0; i--) {
    const sprite = sprites[i];
    sprite.update(deltaTime);

    if (sprite.iteration === 1) {
      sprites.splice(i, 1);
    }
  }

  // Track scroll post distance
  if (player.x > SCROLL_POST_RIGHT) {
    const scrollPostDistance = player.x - SCROLL_POST_RIGHT;
    camera.x = scrollPostDistance;
  }

  if (player.y < SCROLL_POST_TOP && camera.y > 0) {
    const scrollPostDistance = SCROLL_POST_TOP - player.y;
    camera.y = scrollPostDistance;
  }

  if (player.y > SCROLL_POST_BOTTOM) {
    const scrollPostDistance = player.y - SCROLL_POST_BOTTOM;
    camera.y = -scrollPostDistance;
  }

  // Render scene
  c.save();
  c.scale(dpr + 1, dpr + 1);
  c.translate(-camera.x, camera.y);
  c.clearRect(0, 0, canvas.width, canvas.height);
  c.drawImage(oceanBackgroundCanvas, camera.x * 0.32, 0);
  c.drawImage(brambleBackgroundCanvas, camera.x * 0.16, 0);
  c.drawImage(backgroundCanvas, 0, 0);
  player.draw(c);
  for (let i = opossums.length - 1; i >= 0; i--) {
    const opossum = opossums[i];
    opossum.draw(c);
  }

  for (let i = sprites.length - 1; i >= 0; i--) {
    const sprite = sprites[i];
    sprite.draw(c);
  }

  // This block will show scroll posts for debugging purposes
  // c.fillRect(SCROLL_POST_RIGHT, 100, 10, 100);
  // c.fillRect(300, SCROLL_POST_TOP, 100, 10);
  // c.fillRect(300, SCROLL_POST_BOTTOM, 100, 10);
  c.restore();

  requestAnimationFrame(() => animate(backgroundCanvas));
}

const startRendering = async () => {
  try {
    oceanBackgroundCanvas = await renderStaticLayers(oceanLayerData);
    bramblebackgroundCanvas = await renderStaticLayers(brambleLayerData);
    if (!backgroundCanvas) {
      console.error("Failed to create the background canvas");
      return;
    }

    animate(backgroundCanvas);
  } catch (error) {
    console.error("Error during rendering: ", error);
  }
};
