import { Vector2 } from "@cat_in_the_dark/math";
import { canvasHeight, canvasWidth } from "./consts";

export function isInCanvas(pos: Vector2): boolean {
  return pos.x > 0 && pos.x < canvasWidth && pos.y > 0 && pos.y < canvasHeight;
}

interface Circle {
  pos: Vector2;
  radius: number;
}

interface Rect {
  pos: Vector2;
  size: Vector2;
}

export function isCircleCollides(a: Circle, b: Circle): boolean {
  return a.pos.distanceTo(b.pos) < a.radius + b.radius;
}

export function circleRect(c: Circle, r: Rect): boolean {
  const cx = c.pos.x;
  const cy = c.pos.y;
  const { radius } = c;
  const rx = r.pos.x;
  const ry = r.pos.y;
  const rw = r.size.x;
  const rh = r.size.y;

  // temporary variables to set edges for testing
  let testX = cx;
  let testY = cy;

  // which edge is closest?
  if (cx < rx) {
    testX = rx;
  } else if (cx > rx + rw) {
    // test left edge
    testX = rx + rw;
  }
  if (cy < ry) {
    // right edge
    testY = ry;
  } else if (cy > ry + rh) {
    // top edge
    testY = ry + rh;
  } // bottom edge

  // get distance from closest edges
  const distX = cx - testX;
  const distY = cy - testY;
  const distance = Math.sqrt(distX * distX + distY * distY);

  // if the distance is less than the radius, collision!
  if (distance <= radius) {
    return true;
  }
  return false;
}
