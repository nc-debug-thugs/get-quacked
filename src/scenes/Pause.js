export default class Pause extends Phaser.Scene {
  constructor() {
    super({
      key: "pause",
    });
  }

  create() {
    let resumeBtn = this.add.text(500, 200, "Resume", {
      fontSize: "32px",
      color: black,
    });
    resumeBtn.setInteractive();

    resumeBtn.on(
      "pointerdown",
      function () {
        this.scene.resume("play");
        this.scene.stop("pause");
      },
      this
    );
  }
}
