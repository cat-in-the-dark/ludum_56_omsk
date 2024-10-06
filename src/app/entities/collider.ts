import { Vector2 } from "@cat_in_the_dark/math";
import { IDrawable } from "../../lib/interfaces/updateable";

export class Collider implements IDrawable {
  constructor(public pos: Vector2, public size: Vector2) {}

  draw(): void {
    // ctx.rl.drawRectangle(this.pos, this.size, ctx.rl.GREEN);
  }
}
