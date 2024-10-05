export const canvasWidth = 360;
export const canvasHeight = 288;
export const canvasRect = {
  x: 0,
  y: 0,
  width: canvasWidth,
  height: -canvasHeight, // LOOK OUT. THIS MINUS MUST BE HERE
};
export const canvasOrig = { x: 0, y: 0 };

const scale = 4;
export const windowWidth = canvasWidth * scale;
export const windowHeight = canvasHeight * scale;

export const windowTVRect = { x: 0, y: 0, width: 800, height: 300 };
