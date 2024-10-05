import { ctx, Texture } from "@cat_in_the_dark/raylib-wasm";

export type AssetsManager = {
  logo: Texture;
  player: {
    frames: Texture[];
  }[];
};

export type PlayerAssets = AssetsManager["player"][number];

// первые 8 пикселеь хоть ба

export async function loadAssets(): Promise<AssetsManager> {
  const { rl } = ctx;

  const logo = await rl.loadTexture("logo.png");

  const player1Frames = [
    await rl.loadTexture("assets/player1/1.png"),
    await rl.loadTexture("assets/player1/2.png"),
    await rl.loadTexture("assets/player1/3.png"),
    await rl.loadTexture("assets/player1/4.png"),
  ];

  const player2Frames = [
    await rl.loadTexture("assets/player2/1.png"),
    await rl.loadTexture("assets/player2/2.png"),
    await rl.loadTexture("assets/player2/3.png"),
    await rl.loadTexture("assets/player2/4.png"),
  ];

  return {
    logo,
    player: [
      {
        frames: player1Frames,
      },
      {
        frames: player2Frames,
      },
    ],
  };
}
