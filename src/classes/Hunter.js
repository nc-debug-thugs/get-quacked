import Phaser from "phaser";

export default class Hunter extends Phaser.GameObjects.PathFollower {
  constructor(scene, path, x, y) {
    super(scene, path, x, y, "hunter");
    this.setScale(0.1);
  }
}
