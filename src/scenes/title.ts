import { Vector2 } from "@cat_in_the_dark/math";
import { AssetsManager } from "../assets";
import { Cooldown } from "../lib/coroutines/cooldown";
import { IScene, sceneManager } from "../lib/scene-manager";
import { ctx } from "@cat_in_the_dark/raylib-wasm";
import { inputs } from "../lib/inputs";

const zero = Vector2.zero();

export class TitleScene implements IScene {
  constructor(private am: AssetsManager, private timer = new Cooldown(2)) {}

  activate(): void {
    this.timer.reset();
  }

  update(dt: number): void {
    const rl = ctx.rl;

    rl.drawing(() => {
      rl.clearBackground(rl.PINK);
      this.am.logo.draw(zero, 0, 4);
    });

    if (inputs.anyPressed() || this.timer.invoke()) {
      sceneManager.set("game");
    }

    this.timer.update(dt);
  }

  exit(): void {
    // nothing to do
  }
}
