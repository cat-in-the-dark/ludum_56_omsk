import { Vector2 } from "@cat_in_the_dark/math";

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

export const Vector2Zero = new Vector2(0, 0);

// export const windowWidth = canvasWidth * scale;
// export const windowHeight = canvasHeight * scale;

export const windowWidth = window.innerWidth;
export const windowHeight = window.innerHeight;

export const windowTVRect = {
  x: 0,
  y: 0,
  width: window.innerWidth,
  height: window.innerHeight,
};

export const playerWalkAnimSpeed = 0.02;
export const playerShootAnimSpeed = 0.04;
export const rockAnimSpeed = 0.02;
export const pigeonIdleAnimSpeed = 0.15;
export const pigeonDamagedAnimSpeed = 0.1;

export const eggAnimSpeed = 0.02;

export const defaultPlayerSpeed = 150;
export const defaultRockSpeed = 400;

export const baseVolume = 0.5;
export const allowedPlayerNumber = 2;

export const pigeonIdleSpeed = 50;
export const pigeonDamagedSpeed = 100;

export const pigeonGravity = 100;
