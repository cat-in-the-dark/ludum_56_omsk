import { Raylib } from "@cat_in_the_dark/raylib-wasm";
import { loadAssets } from "./assets";
import { inputs } from "./lib/inputs";
import { sceneManager } from "./lib/scene-manager";
import { GameScene } from "./scenes/game";
import { TitleScene } from "./scenes/title";

export async function main(rl: Raylib) {
  rl.initWindow(360, 288, "Hello");
  rl.setTargetFPS(60);

  inputs.connect();

  const am = await loadAssets();

  const title = new TitleScene(am);
  const game = new GameScene(am);

  sceneManager.put("title", title);
  sceneManager.put("game", game);

  sceneManager.set("game");

  rl.runLoop(() => {
    const dt = rl.frameTime;
    sceneManager.update(dt);
    if (inputs.isPressed("Escape")) {
      sceneManager.set("title");
    }

    inputs.update(dt);
  });
}
