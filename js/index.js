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
      collisionBlocks.push();
    }
  });
});
