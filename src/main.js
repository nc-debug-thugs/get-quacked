import Phaser from "phaser";
import Boot from "./scenes/Boot";
import Play from "./scenes/Play";
import GameOver from "./scenes/GameOver";
import { Highscore } from "./scenes/GameOver";

const config = {
  type: Phaser.AUTO,
  parent: "app",
  width: 800,
  height: 600,
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
  scene: [Boot, Play, Highscore, GameOver],
};

export default new Phaser.Game(config);
