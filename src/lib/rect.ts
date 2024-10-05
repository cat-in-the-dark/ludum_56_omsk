import { Vector2 } from "@cat_in_the_dark/math";

export class Rect {
  constructor(public pos: Vector2, public size: Vector2) {}

  get width() {
    return this.size.x;
  }

  get height() {
    return this.size.y;
  }

  get x() {
    return this.pos.x;
  }

  get y() {
    return this.pos.y;
  }
}
