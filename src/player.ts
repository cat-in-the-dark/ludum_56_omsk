import { Vector2 } from "@cat_in_the_dark/math";
import { IUpdateable } from "./lib/interfaces/updateable";

class Player implements IUpdateable {
  constructor(public pos: Vector2) {}

  update(dt: number): void {}
}
