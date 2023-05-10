export default class PauseScene extends Phaser.Scene {
  constructor() {
    super({
      key: "pause",
    });
  }

  create() {
    let resumeBtn = this.add.image(400, 300, "resume").setDepth(10);

    resumeBtn.setInteractive();
    resumeBtn.on("pointerdown", function () {
      this.scene.scene.resume("play");
      this.scene.scene.stop("pause");
    });
    resumeBtn.setScale(0.6);
  }
}
