import Phaser from "phaser";
import Boot from "./scenes/Boot";
import Play from "./scenes/Play";

const config = {
  type: Phaser.AUTO,
  parent: "app",
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
      fps: 60
    },
  },
  scene: [Boot, Play],
};

export default new Phaser.Game(config);
