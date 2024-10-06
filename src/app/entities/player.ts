import { Vector2 } from "@cat_in_the_dark/math";
import { IDrawable, IUpdateable } from "../../lib/interfaces/updateable";
import { PlayerAssets } from "../assets";
import { Controls } from "../controls";

export class Player implements IUpdateable, IDrawable {
  speed = 100;
  dir = Vector2.right();

  constructor(
    public readonly id: number,
    public readonly pos: Vector2,
    public readonly assets: PlayerAssets,
    public readonly controls: Controls
  ) {}

  draw(): void {
    this.assets.frames[0].drawRec(
      this.assets.footRect.flipped(this.dir),
      this.assets.footRect.moved(this.pos),
      Vector2.zero()
    );

    this.assets.frames[0].drawRec(
      this.assets.headRect.flipped(this.dir),
      this.assets.headRect.moved(this.pos),
      Vector2.zero()
    );
  }

  update(dt: number): void {
    const [dir, dirName] = this.controls.dir();
    if (dirName !== "") {
      // save only changed dir
      this.dir = dir;
    }
    this.pos.x += dir.x * this.speed * dt;
  }
}
