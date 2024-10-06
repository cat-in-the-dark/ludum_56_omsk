import { Vector2 } from "@cat_in_the_dark/math";
import { IDrawable, IUpdateable } from "../../lib/interfaces/updateable";
import { am } from "../assets";


const offset = new Vector2(0,12);
export class BoyaraBalloon implements IUpdateable, IDrawable {
  
  reuseDrink = am.falling.drinkAnim();
  popped = false;

  radius = 8;

  constructor (public pos: Vector2) {}

  draw(): void {
    am.balloon.draw(this.pos);
    this.reuseDrink.frame.draw(this.pos.add(offset));
  }

  update(dt: number): void {
    //???
  }

  shouldDestroy() {
    return this.popped;
  }
}