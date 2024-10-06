import { Raylib } from "@cat_in_the_dark/raylib-wasm";
import { inputs } from "../lib/inputs";
import { ITiledLevel } from "../lib/interfaces/tiled-level";
import { sceneManager } from "../lib/scene-manager";
import { am, loadAssetsAndSave } from "./assets";
import {
  windowWidth,
  windowHeight,
  canvasHeight,
  canvasWidth,
  canvasRect,
  canvasOrig,
  windowTVRect,
} from "./consts";
import { GameScene } from "./scenes/game";
import { TitleScene } from "./scenes/title";

export async function main(rl: Raylib) {
  rl.initWindow(windowWidth, windowHeight, "Любовь, Виталя и Голуби");
  rl.setTargetFPS(60);

  inputs.connect();

  await loadAssetsAndSave();

  const canvas = rl.loadRenderTexture(canvasWidth, canvasHeight);
  canvas.textureFilter = 0;

  const title = new TitleScene();
  const game1 = new GameScene(am.levels[0], "title");
  // const game2 = new GameScene(am.levels[1], "game3");
  // const game3 = new GameScene(am.levels[2], "game3");
  // const game4 = new GameScene(am.levels[3], "title"); // todo gamewin

  sceneManager.put("title", title);
  sceneManager.put("game1", game1);
  // sceneManager.put("game2", game2);
  // sceneManager.put("game3", game3);
  // sceneManager.put("game4", game4);

  sceneManager.set("game1");

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
      rl.drawFPS(8, 8);
    });

    const windowRect = tvMode
      ? windowTVRect
      : rl.mod.GetPixelPerferLayout(canvasWidth, canvasHeight);

    rl.drawing(() => {
      canvas.texture.drawRec(canvasRect, windowRect, canvasOrig, 0, rl.WHITE);
    });
  });
}
