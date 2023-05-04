import Phaser from "phaser";
import Boot from "./scenes/Boot";
import PrePlay from "./scenes/PrePlay";
import Play from "./scenes/Play";
import GameOver from "./scenes/GameOver";

const config = {
  type: Phaser.AUTO,
  parent: "app",
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
  scene: [Boot, PrePlay, Play, GameOver],
};

export default new Phaser.Game(config);
