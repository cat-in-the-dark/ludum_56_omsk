import { Vector2 } from "@cat_in_the_dark/math";
import { inputs } from "../../lib/inputs";
import { IDrawable, IUpdateable } from "../../lib/interfaces/updateable";
import { PlayerAssets } from "../assets";

export class Player implements IUpdateable, IDrawable {
  constructor(
    public readonly id: number,
    public readonly pos: Vector2,
    public readonly data: PlayerAssets
  ) {}

  draw(): void {
    this.data.frames[0]?.draw(this.pos);
  }

  update(dt: number): void {
    if (inputs.isPressed("")) {
    }
  }
}
