import { Vector2 } from "@cat_in_the_dark/math";
import { Anim } from "../../lib/anim";
import { IDrawable, IUpdateable } from "../../lib/interfaces/updateable";
import { am } from "../assets";
import { canvasHeight } from "../consts";
import { isCircleCollides } from "../phisics";
import { PlayerAttribution } from "../state";

export class Falling implements IUpdateable, IDrawable {
  currentAnim: Anim;
  collected = false;

  radius = 8;

  constructor(
    public type: keyof PlayerAttribution,
    public pos: Vector2,
    public vel: Vector2
  ) {
    switch (this.type) {
      case "egg": {
        this.currentAnim = am.falling.eggAnim();
        break;
      }
      case "poop": {
        this.currentAnim = am.falling.poopAnim();
        break;
      }
      case "drink":
      default: {
        this.currentAnim = am.falling.drinkAnim();
        break;
      }
    }
  }

  draw(): void {
    this.currentAnim.frame.draw(this.pos);
  }

  update(dt: number): void {
    this.currentAnim.update(dt);
    this.pos = this.pos.add(this.vel);
  }

  shouldDestroy(): boolean {
    return this.pos.y > canvasHeight - 40 || this.collected;
  }
}
