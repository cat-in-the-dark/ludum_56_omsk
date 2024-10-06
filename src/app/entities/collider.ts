import { Vector2 } from "@cat_in_the_dark/math";
import { IDrawable, IUpdateable } from "../../lib/interfaces/updateable";

export class Collider implements IUpdateable, IDrawable {
  constructor(public readonly pos: Vector2, public readonly size: Vector2) {}

  update(dt: number): void {
    //
  }
  draw(): void {
    //
  }
}
