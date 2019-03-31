/// <reference path="../phaser.d.ts"/>

import "phaser";
import { MainScene } from "./scenes/mainScene";

const config: GameConfig = {
  type: Phaser.AUTO,
  pixelArt: true,
  parent: "game",
  scene: [
    new MainScene("MainScene", "assets/boilerplate/super_doge_1.json", "DogeScene"),
    new MainScene("DogeScene", "assets/boilerplate/super_mario.json")
  ],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 1200 },
      debug: false
    }
  }
};

// game class
export class Game extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config);
  }
}

// when the page is loaded, create our game instance
window.onload = () => {
  var game = new Game(config);
};
