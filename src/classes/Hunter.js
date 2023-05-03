import Phaser from "phaser";

export default class Hunter extends Phaser.GameObjects.PathFollower {
  constructor(scene, path, x, y, hunterBulletGroup) {
    super(scene, path, x, y, "hunter");
    this.setScale(0.1);
    this.isAlive = true;
    this.hunterBulletGroup = hunterBulletGroup;
  }

  shoot(player, hunterBulletGroup) {
    let bullet = hunterBulletGroup.get();
    if (bullet) {
      bullet.fire(
        this.x,
        this.y,
        (180 / 3.14) *
          Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y),
        0,
        10,
        200
      );
    }
  }
}
