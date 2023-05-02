import Phaser from "phaser";

export default class Hunter extends Phaser.GameObjects.PathFollower {
  constructor(scene, path, x, y, hunterBulletGroup, player) {
    super(scene, path, x, y, "hunter");
    this.setScale(0.1);

    this.hunterBulletGroup = hunterBulletGroup;
    this.player = player;
  }

  shoot() {
    let bullet = this.hunterBulletGroup.get();
    if (bullet) {
      bullet.fire(this.x, this.y, this.angle, 0, 90, 600);
    }
  }

  handleCollision(bullet, player) {
    player.destroy();
    console.log("touching");
    bullet.destroy();
  }
}
