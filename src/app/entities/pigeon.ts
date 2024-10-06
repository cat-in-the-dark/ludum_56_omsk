import { Vector2 } from "@cat_in_the_dark/math";
import { Anim } from "../../lib/anim";
import { IDrawable, IUpdateable } from "../../lib/interfaces/updateable";
import { am } from "../assets";
import { GameScene } from "../scenes/game";
import { Falling } from "./falling";

export class Pigeon implements IUpdateable, IDrawable {
  private animIdle: Anim;
  private animDamaged: Anim;
  private currentAnim: Anim;
  private offset: Vector2;

  private nextSpawnCooldown = this.generatePoopCooldown();

  constructor(public pos: Vector2, public dir: Vector2, public game: GameScene) {
    this.animIdle = am.pigeonIdleAnim();
    this.animDamaged = am.pigeonDamagedAnim();
    this.offset = new Vector2(
      this.animIdle.frame.width / 2,
      this.animIdle.frame.height
    );

    this.currentAnim = this.animIdle;
  }

  update(dt: number): void {
    this.currentAnim.update(dt);
    this.nextSpawnCooldown -= dt;

    if (this.nextSpawnCooldown < 0) {
      console.log('spawn');
      this.nextSpawnCooldown = this.generatePoopCooldown();
      if (Math.random() < 0.3) {
        this.game.falling.push(new Falling("egg", this.pos.clone(), new Vector2(0, 5)));
      } else {
        this.game.falling.push(new Falling("poop", this.pos.clone(), new Vector2(0, 5)));
      }
    }
  }

  generatePoopCooldown() {
    return Math.random()*4+1;
  }

  draw(): void {
    this.currentAnim.frame.draw(this.pos.minus(this.offset));
    am.font.drawTextPro({
      text: this.nextSpawnCooldown.toString(),
      position: this.pos,
      fontSize: 8,
    });
  }

  shouldDestroy(): boolean {
    return false;
  }
}
