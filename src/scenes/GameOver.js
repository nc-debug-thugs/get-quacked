import Phaser from "phaser";
import { score } from "./PrePlay";

export default class GameOver extends Phaser.Scene {
  constructor() {
    super({
      key: "gameover",
    });
  }

  create() {
    const screenCenterX =
      this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY =
      this.cameras.main.worldView.y + this.cameras.main.height / 2;

    console.log(score);

    this.gameOverText = this.add
      .text(screenCenterX, screenCenterY - 20, "GAME OVER", { fontSize: 48 })
      .setDepth(1)
      .setOrigin(0.5);

    this.scoreText = this.add
      .text(screenCenterX, screenCenterY + 40, `Your score is ${score}`, {
        fontSize: 24,
      })
      .setDepth(1)
      .setOrigin(0.5);
  }

  update() {}
}
