import Phaser from "phaser";
import { score } from "./Play";

export default class GameOver extends Phaser.Scene {
  constructor() {
    super({
      key: "gameover",
    });
  }

  create() {
    this.gameOverText = this.add
      .text(200, 200, "GAME OVER", { fontSize: 48 })
      .setDepth(1);
    this.scoreText = this.add
      .text(200, 260, `Your score is ${score}`, {
        fontSize: 24,
      })
      .setDepth(1);
  }

  update() {}
}
