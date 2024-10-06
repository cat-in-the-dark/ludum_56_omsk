import { Texture } from "@cat_in_the_dark/raylib-wasm";
import { IUpdateable } from "./interfaces/updateable";

export class Anim implements IUpdateable {
  currentFrame = 0;
  time = 0;

  constructor(public frames: Texture[], public animationSpeed: number) {}

  update(dt: number): void {
    this.time += dt;
    if (this.time >= this.animationSpeed) {
      this.time = 0;
      this.currentFrame = (this.currentFrame + 1) % this.frames.length;
    }
  }
}
