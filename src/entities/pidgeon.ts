import { IUpdateable } from "../lib/interfaces/updateable";

class Pidgeon implements IUpdateable {
  update(dt: number): void {
    throw new Error("Method not implemented.");
  }
}
