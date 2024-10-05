import { IUpdateable } from "../lib/interfaces/updateable";

class Wall implements IUpdateable {
  update(dt: number): void {
    throw new Error("Method not implemented.");
  }
}
