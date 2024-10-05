import { ctx } from "@cat_in_the_dark/raylib-wasm";
import { IScene } from "../lib/scene-manager";

export class GameScene implements IScene {
  activate(): void {
    // ?
  }
  update(dt: number): void {
    const rl = ctx.rl;

    rl.drawing(() => {
      rl.clearBackground(rl.GOLD);
    });
  }
  exit(): void {
    // ?
  }
}
