/* eslint-disable max-lines-per-function */
import { Vector2 } from "@cat_in_the_dark/math";
import { ctx } from "@cat_in_the_dark/raylib-wasm";
import { Howl } from "howler";
import { Anim } from "../lib/anim";
import { ITiledLevel } from "../lib/interfaces/tiled-level";
import { Rect } from "../lib/rect";
import {
  baseVolume,
  eggAnimSpeed,
  maxPlayer,
  pigeonDamagedAnimSpeed,
  pigeonIdleAnimSpeed,
  playerShootAnimSpeed,
  playerWalkAnimSpeed,
  rockAnimSpeed,
} from "./consts";

export type AssetsManager = Awaited<ReturnType<typeof loadAssets>>;
export let am: AssetsManager; // global variable for easy access

export type PlayerAssets = AssetsManager["player"][number];
export type LevelAsset = AssetsManager["levels"][number];

// первые 8 пикселеь хоть ба

export async function loadAssetsAndSave() {
  if (am) {
    throw new Error("AssetsManager already initialyzed");
  }
  am = await loadAssets();
  return am;
}

export async function loadAssets() {
  const { rl } = ctx;

  const font = await rl.loadFont("assets/nes.ttf");

  const logo = await rl.loadTexture("logo.png");

  // const titleMusic = await rl.loadSound("assets/audio/music/title.mp3");
  // const gameMusic = await rl.loadSound("assets/audio/music/pigeon-jazz.mp3");

  const levels = [
    {
      background: await rl.loadTexture("assets/level-backgrounds/level-1.png"),
      map: (await (
        await fetch("/data/levels/level-1.json")
      ).json()) as ITiledLevel,
    },
    {
      background: await rl.loadTexture("assets/level-backgrounds/level-2.png"),
      map: (await (
        await fetch("/data/levels/level-2.json")
      ).json()) as ITiledLevel,
    },
    {
      background: await rl.loadTexture("assets/level-backgrounds/level-3.png"),
      map: (await (
        await fetch("/data/levels/level-3.json")
      ).json()) as ITiledLevel,
    },
    {
      background: await rl.loadTexture("assets/level-backgrounds/level-4.png"),
      map: (await (
        await fetch("/data/levels/level-4.json")
      ).json()) as ITiledLevel,
    },
  ] as const;

  const idlePigeonFrames = [
    await rl.loadTexture("assets/pigeon/1.png"),
    await rl.loadTexture("assets/pigeon/2.png"),
  ];
  const pigeonIdleAnim = () => new Anim(idlePigeonFrames, pigeonIdleAnimSpeed);

  const damagedPigeonFrames = [
    await rl.loadTexture("assets/pigeon-damage/1.png"),
    await rl.loadTexture("assets/pigeon-damage/2.png"),
    await rl.loadTexture("assets/pigeon-damage/3.png"),
    await rl.loadTexture("assets/pigeon-damage/4.png"),
  ];
  const pigeonDamagedAnim = () =>
    new Anim(damagedPigeonFrames, pigeonDamagedAnimSpeed);

  const rockFrames = [
    await rl.loadTexture("assets/rock/1.png"),
    await rl.loadTexture("assets/rock/2.png"),
    await rl.loadTexture("assets/rock/3.png"),
    await rl.loadTexture("assets/rock/4.png"),
  ];
  const rockAnim = () => new Anim(rockFrames, rockAnimSpeed);

  const player1Frames = [
    await rl.loadTexture("assets/player1/1.png"),
    await rl.loadTexture("assets/player1/2.png"),
    await rl.loadTexture("assets/player1/3.png"),
    await rl.loadTexture("assets/player1/4.png"),
    await rl.loadTexture("assets/player1/4.png"),
  ] as const;

  const walkAnim1 = new Anim(
    [player1Frames[0], player1Frames[1], player1Frames[2], player1Frames[3]],
    playerWalkAnimSpeed
  );
  const shootAnim1 = new Anim(
    [player1Frames[0], player1Frames[1], player1Frames[2], player1Frames[3]],
    playerShootAnimSpeed,
    false,
    true
  );

  const player2Frames = [
    await rl.loadTexture("assets/player2/1.png"),
    await rl.loadTexture("assets/player2/2.png"),
    await rl.loadTexture("assets/player2/3.png"),
    await rl.loadTexture("assets/player2/4.png"),
    await rl.loadTexture("assets/player2/4.png"),
  ] as const;

  const walkAnim2 = new Anim(
    [player2Frames[0], player2Frames[1], player2Frames[2], player2Frames[3]],
    playerWalkAnimSpeed
  );
  const shootAnim2 = new Anim(
    [player2Frames[0], player2Frames[1], player2Frames[2], player2Frames[3]],
    playerShootAnimSpeed,
    false,
    true
  );

  const player = [
    {
      frames: player1Frames,
      walkAnim: walkAnim1,
      shootAnim: shootAnim1,
      footRect: new Rect(new Vector2(0, 16), new Vector2(24, 8)),
      headRect: new Rect(new Vector2(0, 0), new Vector2(24, 16)),
    },
    {
      frames: player2Frames,
      walkAnim: walkAnim2,
      shootAnim: shootAnim2,
      footRect: new Rect(new Vector2(0, 16), new Vector2(24, 8)),
      headRect: new Rect(new Vector2(0, 0), new Vector2(24, 16)),
    },
  ] as const;
  if (player.length !== maxPlayer) {
    throw new Error(
      `Expected assets for ${maxPlayer} players, got: ${player.length}`
    );
  }

  const eggFrames = [
    await rl.loadTexture("assets/egg/1.png"),
    await rl.loadTexture("assets/egg/2.png"),
    await rl.loadTexture("assets/egg/3.png"),
    await rl.loadTexture("assets/egg/4.png"),
  ];

  const drinkFrames = [await rl.loadTexture("assets/bonus/1.png")];

  const poopFrames = [
    await rl.loadTexture("assets/poop/1.png"),
    await rl.loadTexture("assets/poop/2.png"),
  ];

  const falling = {
    eggAnim: () => new Anim(eggFrames, eggAnimSpeed, true, false),
    drinkAnim: () => new Anim(drinkFrames, 0, false, true),
    poopAnim: () => new Anim(poopFrames, 0.5, true, false),
  };

  const sfx = {
    titleMusic: new Howl({
      src: "assets/audio/music/title.mp3",
      loop: true,
      volume: baseVolume,
    }),
    gameMusic: new Howl({
      src: "assets/audio/music/pigeon-jazz.mp3",
      loop: true,
      volume: baseVolume,
    }),
    jingle: new Howl({
      src: "assets/audio/sfx/round-start.wav",
      volume: baseVolume,
    }),
    throw: new Howl({
      src: "assets/audio/sfx/throw.wav",
      volume: baseVolume,
    }),
    bonus: new Howl({
      src: "assets/audio/sfx/bonus.wav",
      volume: baseVolume,
    }),
    bumper: new Howl({
      src: "assets/audio/sfx/bumper.wav",
      volume: baseVolume,
    }),
    die: new Howl({
      src: "assets/audio/sfx/die.wav",
      volume: baseVolume,
    }),
    die2: new Howl({
      src: "assets/audio/sfx/die2.wav",
      volume: baseVolume,
    }),
    arp: new Howl({
      src: "assets/audio/sfx/generic-arp.wav",
      volume: baseVolume,
    }),
    beep: new Howl({
      src: "assets/audio/sfx/generic-beep.wav",
      volume: baseVolume,
    }),
    pigeonCollision: new Howl({
      src: "assets/audio/sfx/pigeon-collision.wav",
      volume: baseVolume,
    }),
    pigeonDead: new Howl({
      src: "assets/audio/sfx/pigeon-dead.wav",
      volume: baseVolume,
    }),
    spawn: new Howl({
      src: "assets/audio/sfx/spawn.wav",
      volume: baseVolume + 0.5,
    }),
  };

  const balloon = await rl.loadTexture("assets/balloon/1.png");

  return {
    sfx,
    font,
    logo,
    player,
    balloon,
    falling,
    rockAnim,
    pigeonIdleAnim,
    pigeonDamagedAnim,
    levels,
  } as const;
}
