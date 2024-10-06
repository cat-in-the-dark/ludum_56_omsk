import { Texture } from "@cat_in_the_dark/raylib-wasm";
import { IUpdateable } from "./interfaces/updateable";

export class Anim implements IUpdateable {
  private currentFrameIdx = 0;
  private time = 0;

  constructor(
    public frames: Texture[],
    public animationSpeed: number,
    public looping = true,
    public finished = false
  ) {}

  update(dt: number): void {
    if (this.finished) {
      this.currentFrameIdx = 0;
      return;
    }

    this.time += dt;
    if (this.time >= this.animationSpeed) {
      this.time = 0;
      this.currentFrameIdx = (this.currentFrameIdx + 1) % this.frames.length;
      if (this.currentFrameIdx >= this.frames.length - 1 && !this.looping) {
        this.finished = true;
        
      }
    }
  }

  reset() {
    this.time = 0;
    this.currentFrameIdx = 0;
    this.finished = false;
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
