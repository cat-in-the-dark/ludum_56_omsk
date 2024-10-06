import { Raylib } from "@cat_in_the_dark/raylib-wasm";
import { main } from "./app";

const canvas = document.getElementById("game") as HTMLCanvasElement;

Raylib.init({ canvas })
  .then(main)
  .catch((err) => console.error(err));
