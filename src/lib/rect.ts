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

  moved(dir: Vector2): Rect {
    return new Rect(this.pos.add(dir), this.size.clone());
  }

  flipped(dir: Vector2): Rect {
    const pos = this.pos.clone();
    const size = this.size.clone();
    if (dir.x < 0) {
      size.x *= -1;
    }
    return new Rect(pos, size);
  }
}
