import { Raylib } from "@cat_in_the_dark/raylib-wasm";
import { inputs } from "../lib/inputs";
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
import { IntermissionScene } from "./scenes/intermission";
import { TitleScene } from "./scenes/title";

// eslint-disable-next-line max-lines-per-function
export async function main(rl: Raylib) {
  rl.initWindow(windowWidth, windowHeight, "Любовь, Виталя и Голуби");
  rl.setTargetFPS(60);

  inputs.connect();

  await loadAssetsAndSave();

  const canvas = rl.loadRenderTexture(canvasWidth, canvasHeight);
  canvas.textureFilter = 0;

  const title = new TitleScene();
  const game1 = new GameScene(am.levels[0], "i1");
  const i1 = new IntermissionScene("game2");
  const game2 = new GameScene(am.levels[1], "i2");
  const i2 = new IntermissionScene("game3");
  const game3 = new GameScene(am.levels[2], "i3");
  const i3 = new IntermissionScene("game4");
  const game4 = new GameScene(am.levels[3], "i4"); // todo gamewin
  const i4 = new IntermissionScene("game1");

  sceneManager.put("title", title);
  sceneManager.put("game1", game1);
  sceneManager.put("game2", game2);
  sceneManager.put("game3", game3);
  sceneManager.put("game4", game4);
  sceneManager.put("i1", i1);
  sceneManager.put("i2", i2);
  sceneManager.put("i3", i3);
  sceneManager.put("i4", i4);

  sceneManager.set("title");

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
      // rl.drawFPS(140, 19);
    });

    const windowRect = tvMode
      ? windowTVRect
      : rl.mod.GetPixelPerferLayout(canvasWidth, canvasHeight);

    rl.drawing(() => {
      canvas.texture.drawRec(canvasRect, windowRect, canvasOrig, 0, rl.WHITE);
    });
  });
}
