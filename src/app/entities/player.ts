import { Vector2 } from "@cat_in_the_dark/math";
import { IDrawable, IUpdateable } from "../../lib/interfaces/updateable";
import { PlayerAssets } from "../assets";
import { Controls } from "../controls";

export class Player implements IUpdateable, IDrawable {
  speed = 100;

  constructor(
    public readonly id: number,
    public readonly pos: Vector2,
    public readonly data: PlayerAssets,
    public readonly controls: Controls
  ) {}

  draw(): void {
    this.data.frames[0]?.draw(this.pos);
  }

  update(dt: number): void {
    console.log(dt);
    const [dir, dirName] = this.controls.dir();
    this.pos.x += dir.x * this.speed * dt;
  }
}
