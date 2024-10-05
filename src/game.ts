import { Raylib } from "@cat_in_the_dark/raylib-wasm";
import { loadAssets } from "./assets";
import {
  windowWidth,
  windowHeight,
  canvasHeight,
  canvasWidth,
  canvasRect,
  canvasOrig,
  windowTVRect,
} from "./consts";
import { inputs } from "./lib/inputs";
import { sceneManager } from "./lib/scene-manager";
import { GameScene } from "./scenes/game";
import { TitleScene } from "./scenes/title";

export async function main(rl: Raylib) {
  rl.initWindow(windowWidth, windowHeight, "Любовь, Виталя и Голуби");
  rl.setTargetFPS(60);

  inputs.connect();

  const am = await loadAssets();

  const canvas = rl.loadRenderTexture(canvasWidth, canvasHeight);
  canvas.textureFilter = 0;

  const title = new TitleScene(am);
  const game = new GameScene(am);

  sceneManager.put("title", title);
  sceneManager.put("game", game);

  sceneManager.set("game");

  let tvMode = false;

  rl.runLoop(() => {
    const dt = rl.frameTime;
    inputs.update(dt);

    if (inputs.isPressed("Escape")) {
      sceneManager.set("title");
    }
    if (inputs.isPressed("KeyF")) {
      tvMode = !tvMode;
    }

    sceneManager.update(dt);

    canvas.drawing(() => {
      rl.clearBackground(rl.BLACK);
      sceneManager.draw();
    });

    const windowRect = tvMode
      ? windowTVRect
      : rl.mod.GetPixelPerferLayout(canvasWidth, canvasHeight);

    rl.drawing(() => {
      canvas.texture.drawRec(canvasRect, windowRect, canvasOrig, 0, rl.WHITE);
    });
  });
}
