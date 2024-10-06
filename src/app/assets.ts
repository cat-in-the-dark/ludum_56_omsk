import { ctx } from "@cat_in_the_dark/raylib-wasm";

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
  ];

  const player2Frames = [
    await rl.loadTexture("assets/player2/1.png"),
    await rl.loadTexture("assets/player2/2.png"),
    await rl.loadTexture("assets/player2/3.png"),
    await rl.loadTexture("assets/player2/4.png"),
  ];

  return {
    font,
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
