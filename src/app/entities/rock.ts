import { Vector2 } from "@cat_in_the_dark/math";
import { Anim } from "../../lib/anim";
import { IDrawable, IUpdateable } from "../../lib/interfaces/updateable";
import { am } from "../assets";
import { isInCanvas } from "../phisics";

export class Rock implements IUpdateable, IDrawable {
  private anim: Anim;
  private offset: Vector2;
  private hp = 1;
  public radius: number;

  constructor(
    public readonly playerID: number,
    public readonly pos: Vector2,
    public readonly dir: Vector2,
    public readonly speed: number
  ) {
    this.anim = am.rockAnim();
    this.offset = new Vector2(this.anim.frame.width / 2, 0);
    this.radius = this.anim.frame.width / 1.2;
  }

  draw(): void {
    this.anim.frame.draw(this.pos.minus(this.offset));
  }

  update(dt: number): void {
    const deltaPos = this.dir.scale(this.speed * dt);

    this.pos.x += deltaPos.x;
    this.pos.y += deltaPos.y;

    this.anim.update(dt);
  }

  shouldDestroy(): boolean {
    return this.hp <= 0 || !isInCanvas(this.pos);
  }

  hit() {
    this.hp -= 1;
  }
}
