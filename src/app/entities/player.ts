import { Vector2 } from "@cat_in_the_dark/math";
import { IDrawable, IUpdateable } from "../../lib/interfaces/updateable";
import { PlayerAssets } from "../assets";
import { Controls } from "../controls";

export class Player implements IUpdateable, IDrawable {
  speed = 100;
  dir = Vector2.right();

  isWalking = false;
  isShooting = false; // TODO: actually this is a trigger...

  constructor(
    public readonly id: number,
    public readonly pos: Vector2,
    public readonly assets: PlayerAssets,
    public readonly controls: Controls
  ) {}

  draw(): void {
    this.assets.walkAnim.frame.drawRec(
      this.assets.footRect.flipped(this.dir),
      this.assets.footRect.moved(this.pos),
      Vector2.zero()
    );

    this.assets.shootAnim.frame.drawRec(
      this.assets.headRect.flipped(this.dir),
      this.assets.headRect.moved(this.pos),
      Vector2.zero()
    );
  }

  update(dt: number): void {
    const [dir, dirName] = this.controls.dir();
    if (dirName !== "") {
      this.dir = dir; // save only changed dir
      this.isWalking = true;
    } else {
      this.isWalking = false;
    }
    this.pos.x += dir.x * this.speed * dt;

    if (this.isWalking) {
      // TODO: should end the animation? In this case we need animation state manager, but we don't have one
      this.assets.walkAnim.update(dt);
    }
    if (this.isShooting) {
      this.assets.shootAnim.update(dt);
    }
  }
}
