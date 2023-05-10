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

    let pKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    pKey.on("down", () => {
      this.scene.resume("play");
      this.scene.stop("pause");
    });

    this.input.keyboard.enabled = true;
  }
}
