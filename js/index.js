const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const dpr = window.devicePixelRatio || 1;

canvas.width = 1024 * dpr;
canvas.height = 576 * dpr;

const layersData = {
  l_New_Layer_1: l_New_Layer_1,
  l_New_Layer_2: l_New_Layer_2,
  l_New_Layer_8: l_New_Layer_8,
  l_New_Layer_3: l_New_Layer_3,
  l_Decorations: l_Decorations,
  l_New_Layer_5: l_New_Layer_5,
  l_New_Layer_6: l_New_Layer_6,
  l_New_Layer_9: l_New_Layer_9,
  l_New_Layer_9_1: l_New_Layer_9_1,
};

const tilesets = {
  l_New_Layer_1: { imageUrl: "./images/decorations.png", tileSize: 16 },
  l_New_Layer_2: { imageUrl: "./images/decorations.png", tileSize: 16 },
  l_New_Layer_8: { imageUrl: "./images/tileset.png", tileSize: 16 },
  l_New_Layer_3: { imageUrl: "./images/tileset.png", tileSize: 16 },
  l_Decorations: { imageUrl: "./images/decorations.png", tileSize: 16 },
  l_New_Layer_5: { imageUrl: "./images/tileset.png", tileSize: 16 },
  l_New_Layer_6: { imageUrl: "./images/decorations.png", tileSize: 16 },
  l_New_Layer_9: { imageUrl: "./images/decorations.png", tileSize: 16 },
  l_New_Layer_9_1: { imageUrl: "./images/tileset.png", tileSize: 16 },
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
          size: blockSize
        }),
      );
    }
    else if (symbol === 2) {
      platforms.push(
        new Platform({
          x: x * blockSize,
          y: y * blockSize + blockSize,
          width: 16,
          height: 4,
        })
      )
    }
  });
});

const renderLayer = (tilesData, tilesetImage, tileSize, context) => {
  tilesData.forEach((row, y) => {
    row.forEach((symbol, x) => {
      if (symbol !== 0) {
        const srcX = ((symbol - 1) % (tilesetImage.width / tileSize)) * tileSize;
        const srcY = Math.floor((symbol - 1) / (tilesetImage.width / tileSize)) * tileSize;

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
        )
      }
    });
  });
};

const renderStaticLayers = async() => {
  const offScreenCanvas = document.createElement('canvas');
  offScreenCanvas.width = canvas.width;
  offScreenCanvas.height = canvas.height;
  const offscreenContext = offScreenCanvas.getContext('2d');

  for (const [layerName, tilesData] of Object.entries(layersData)){
    const tilesetInfo = tilesets[layerName];
  }
}
