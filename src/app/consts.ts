export const maxPlayer = 2;
export const canvasWidth = 360;
export const canvasHeight = 288;
export const canvasRect = {
  x: 0,
  y: 0,
  width: canvasWidth,
  height: -canvasHeight, // LOOK OUT. THIS MINUS MUST BE HERE
};
export const canvasOrig = { x: 0, y: 0 };

const scale = 2;
export const windowWidth = canvasWidth * scale;
export const windowHeight = canvasHeight * scale;

export const windowTVRect = { x: 0, y: 0, width: 800, height: 300 };

export const playerWalkAnimSpeed = 0.02;
export const playerShootAnimSpeed = 0.04;
export const rockAnimSpeed = 0.02;
export const pigeonIdleAnimSpeed = 0.15;
export const pigeonDamagedAnimSpeed = 0.1;

export const defaultPlayerSpeed = 150;
export const defaultRockSpeed = 400;
