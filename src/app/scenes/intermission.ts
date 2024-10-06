import { Vector2 } from "@cat_in_the_dark/math";
import { inputs } from "../../lib/inputs";
import { IScene, sceneManager } from "../../lib/scene-manager";
import { am } from "../assets";
import { gameState } from "../state";

const positions = [
  new Vector2(32,32),
  new Vector2(32,32+104),
];

export class IntermissionScene implements IScene {

  constructor(private nextLevel: string) {}

  eggAnim = am.falling.eggAnim();
  drinkAnim = am.falling.drinkAnim();
  poopAnim = am.falling.poopAnim();

  playerTicks = [
    {
      egg: 0,
      drink: 0,
      poop: 0
    },
    {
      egg: 0,
      drink: 0,
      poop: 0
    }
  ];

  counter = 0;
  tickCounter = 0.3;
  sceneEndCounter = 2;

  activate(): void {
    this.tickCounter = 1;
    this.sceneEndCounter = 2;

    this.playerTicks = [
      {
        egg: 0,
        drink: 0,
        poop: 0
      },
      {
        egg: 0,
        drink: 0,
        poop: 0
      }
    ];
  }

  draw(): void {
    if (this.counter < 0.3) {
      return;
    }
    
    gameState.playerStates.forEach( (state, idx) => {
      am.font.drawTextPro({
        text: `PLAYER ${idx+1}           ${gameState.playerStates[idx]?.score.toString().padStart(8, "0")}`,
        position: positions[idx]!,
        fontSize: 10
      });
    }); 

    this.playerTicks.forEach( (ticks, idx) => {
      am.font.drawTextPro({
        text: "BOYARA",
        position: positions[idx]!.clone().add(new Vector2(0,32)),
        fontSize: 10
      });
      for (let i = 0; i < ticks.drink; i++) {
        this.drinkAnim.frame.draw(positions[idx]!.clone().add(new Vector2(106+i*8,32)));
      }


      am.font.drawTextPro({
        text: "GOLDEN EGGS",
        position: positions[idx]!.clone().add(new Vector2(0,32+16)),
        fontSize: 10
      });
      for (let i = 0; i < ticks.egg; i++) {
        this.eggAnim.frame.draw(positions[idx]!.clone().add(new Vector2(106+i*8,32+16)));
      }


      am.font.drawTextPro({
        text: "PIGEON POOP",
        position: positions[idx]!.clone().add(new Vector2(0,32+32)),
        fontSize: 10
      });
      for (let i = 0; i < ticks.poop; i++) {
        this.poopAnim.frame.draw(positions[idx]!.clone().add(new Vector2(106+i*8,32+32)));
      }
      
    });
  }

  exit(): void {
    
  }

  update(dt: number): void {
    this.counter += dt;
    this.tickCounter -= dt;
    this.sceneEndCounter -= dt;

    if (this.sceneEndCounter < 0) {
      sceneManager.set(this.nextLevel);
    }

    if (this.tickCounter < 0) {
      this.tickCounter = 0.1;
      gameState.playerStates.forEach( (state, idx) => {
        const tickState = this.playerTicks[idx];
        if (tickState) {
          if (state.attribution.drink > tickState.drink) {
            tickState.drink += 1;
            am.sfx.beep.play();
            state.score += 1000;
            this.sceneEndCounter = 2;
          }
          if (state.attribution.egg > tickState.egg) {
            tickState.egg += 1;
            am.sfx.beep.play();
            state.score += 250;
            this.sceneEndCounter = 2;
          }
          if (state.attribution.poop > tickState.poop) {
            tickState.poop += 1;
            am.sfx.beep.play();
            this.sceneEndCounter = 2;
          }
        }
      });
    }

    if (inputs.isPressed("Enter")) {
      sceneManager.set(this.nextLevel);
    }
  }
}