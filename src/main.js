import Phaser from "phaser";
import Boot from "./scenes/Boot";
import PrePlay from "./scenes/PrePlay";
import Play from "./scenes/Play";
import GameOver from "./scenes/GameOver";
import Start from "./scenes/Start";
import PauseScene from "./scenes/Pause";
import { Highscore, InputPanel } from "./scenes/InputPanel";

const config = {
  type: Phaser.AUTO,
  parent: "app",
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  scene: [Boot, Start, PrePlay, Play, GameOver, InputPanel, Highscore, PauseScene],
};

export default new Phaser.Game(config);
