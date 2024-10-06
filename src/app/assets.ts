/* eslint-disable max-lines-per-function */
import { Vector2 } from "@cat_in_the_dark/math";
import { ctx } from "@cat_in_the_dark/raylib-wasm";
import { Anim } from "../lib/anim";
import { Rect } from "../lib/rect";
import { maxPlayer, playerWalkAnimSpeed } from "./consts";

export type AssetsManager = Awaited<ReturnType<typeof loadAssets>>;

export type PlayerAssets = AssetsManager["player"][number];

// первые 8 пикселеь хоть ба

export async function loadAssets() {
  const { rl } = ctx;

  const font = await rl.loadFont("assets/nes.ttf");

  const logo = await rl.loadTexture("logo.png");

  // const titleMusic = await rl.loadSound("assets/audio/music/title.mp3");
  // const gameMusic = await rl.loadSound("assets/audio/music/pigeon-jazz.mp3");

  const player1Frames = [
    await rl.loadTexture("assets/player1/1.png"),
    await rl.loadTexture("assets/player1/2.png"),
    await rl.loadTexture("assets/player1/3.png"),
    await rl.loadTexture("assets/player1/4.png"),
  ] as const;

  const walkAnim1 = new Anim(
    [player1Frames[0], player1Frames[1], player1Frames[2], player1Frames[3]],
    playerWalkAnimSpeed
  );

  const player2Frames = [
    await rl.loadTexture("assets/player2/1.png"),
    await rl.loadTexture("assets/player2/2.png"),
    await rl.loadTexture("assets/player2/3.png"),
    await rl.loadTexture("assets/player2/4.png"),
  ] as const;

  const walkAnim2 = new Anim(
    [player2Frames[0], player2Frames[1], player2Frames[2], player2Frames[3]],
    playerWalkAnimSpeed
  );

  const player = [
    {
      frames: player1Frames,
      walkAnim: walkAnim1,
      footRect: new Rect(new Vector2(0, 16), new Vector2(24, 8)),
      headRect: new Rect(new Vector2(0, 0), new Vector2(24, 16)),
    },
    {
      frames: player2Frames,
      walkAnim: walkAnim2,
      footRect: new Rect(new Vector2(0, 16), new Vector2(24, 8)),
      headRect: new Rect(new Vector2(0, 0), new Vector2(24, 16)),
    },
  ] as const;
  if (player.length !== maxPlayer) {
    throw new Error(
      `Expected assets for ${maxPlayer} players, got: ${player.length}`
    );
  }

  return {
    font,
    logo,
    player,
  } as const;
}
