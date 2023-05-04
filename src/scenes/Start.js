import Phaser from "phaser";

export default class Start extends Phaser.Scene {
  constructor() {
    super({
      key: "start",
    });
  }

  create() {
    let bgImage = this.add.image(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      "background"
    );
    bgImage.setScale(1).setScrollFactor(0);

    let startButton = this.add.image(
      this.cameras.main.width / 2,
      this.cameras.main.height / 1.3,
      "start"
    );
    startButton.setScale(0.5);
    startButton.setInteractive();
    startButton.on("pointerover", () => {
      this.tweens.add({
        targets: startButton,
        scale: { value: 0.6, duration: 100, yoyo: true, ease: "Power1" },
      });
    });
    startButton.on("pointerdown", () => {
      this.scene.start("play");
    });
  }
}
