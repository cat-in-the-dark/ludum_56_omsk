import { Vector2 } from "@cat_in_the_dark/math";
import { ctx } from "@cat_in_the_dark/raylib-wasm";
import { AssetsManager } from "../assets";
import { Cooldown } from "../lib/coroutines/cooldown";
import { inputs } from "../lib/inputs";
import { IScene, sceneManager } from "../lib/scene-manager";

const zero = Vector2.zero();

export class TitleScene implements IScene {
  constructor(private am: AssetsManager, private timer = new Cooldown(2)) {}
  draw(): void {
    const { rl } = ctx;

    rl.clearBackground(rl.PINK);
    this.am.logo.draw(zero, 0, 4);
  }

  activate(): void {
    this.timer.reset();
  }

  update(dt: number): void {
    if (inputs.anyPressed() || this.timer.invoke()) {
      sceneManager.set("game");
    }

    this.timer.update(dt);
  }

  exit(): void {
    // nothing to do
  }
}
