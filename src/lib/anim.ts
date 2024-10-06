import { Texture } from "@cat_in_the_dark/raylib-wasm";
import { IUpdateable } from "./interfaces/updateable";

export class Anim implements IUpdateable {
  private currentFrameIdx = 0;
  private time = 0;

  constructor(public frames: Texture[], public animationSpeed: number) {}

  update(dt: number): void {
    this.time += dt;
    if (this.time >= this.animationSpeed) {
      this.time = 0;
      this.currentFrameIdx = (this.currentFrameIdx + 1) % this.frames.length;
    }
  }

  reset() {
    this.time = 0;
    this.currentFrameIdx = 0;
  }

  get frame(): Texture {
    const frame = this.frames[this.currentFrameIdx];
    if (!frame) {
      throw new Error(
        `Animation index out of bound: ${this.currentFrameIdx} not inside [0, ${this.frames.length})`
      );
    }
    return frame;
  }
}
