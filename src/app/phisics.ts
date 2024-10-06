import { Vector2 } from "@cat_in_the_dark/math";
import { canvasHeight, canvasWidth } from "./consts";

export function isInCanvas(pos: Vector2): boolean {
  return pos.x > 0 && pos.x < canvasWidth && pos.y > 0 && pos.y < canvasHeight;
}
