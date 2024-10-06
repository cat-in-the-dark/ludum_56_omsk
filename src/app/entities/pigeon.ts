import { Vector2 } from "@cat_in_the_dark/math";
import { Anim } from "../../lib/anim";
import { IDrawable, IUpdateable } from "../../lib/interfaces/updateable";
import { am } from "../assets";
import { GameScene } from "../scenes/game";
import { Collider } from "./collider";
import { Falling } from "./falling";
import { Rock } from "./rock";

export type PigeonStates = "idle" | "damaged";

export class Pigeon implements IUpdateable, IDrawable {
  private nextSpawnCooldown = Math.random()*60*4+60;
  private anim: {
    idle: Anim;
    damaged: Anim;
  };
  private offset: Vector2;
  public state: PigeonStates = "idle";
  public radius: number;
  public hp = 6;
  public playerID: number | undefined = undefined;

  constructor(
    public pos: Vector2,
    public dir: Vector2,
    public game: GameScene,
    public speed: {
      idle: number;
      damaged: number;
    }
  ) {
    this.anim = {
      idle: am.pigeonIdleAnim(),
      damaged: am.pigeonDamagedAnim(),
    };

    this.offset = new Vector2(
      this.anim.idle.frame.width / 2,
      this.anim.idle.frame.height
    );

    this.radius = this.anim.idle.frame.width / 1.2;
  }

  update(dt: number): void {
    this.nextSpawnCooldown -= dt;

    if (this.nextSpawnCooldown < 0) {
      this.game.falling.push(new Falling("egg", this.pos.clone(), new Vector2(0, -10)));
    }

    const dir = this.dir.scaledTo(dt * this.speed[this.state]);
    this.pos.x += dir.x;
    this.pos.y += dir.y;

    this.anim[this.state].update(dt);
  }

  draw(): void {
    this.anim[this.state].frame.draw(this.pos.minus(this.offset));
  }

  shouldDestroy(): boolean {
    return this.hp <= 0;
  }

  hitRock(rock: Rock) {
    console.log("BUM", rock);
    this.playerID = rock.playerID;
    this.state = "damaged";
    this.hp -= 1;

    // scores[playerID] += pigeonScore;

    this.dir = this.pos.minus(rock.pos).normalized;
  }

  hitWall(wall: Collider) {
    this.hp -= 1;
    this.dir.x *= -1;
    this.dir.y *= -1;
  }
}
