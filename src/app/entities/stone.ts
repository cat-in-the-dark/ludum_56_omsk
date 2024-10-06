import { IUpdateable } from "../../lib/interfaces/updateable";

class Stone implements IUpdateable {
  update(dt: number): void {
    throw new Error("Method not implemented.");
  }
}
