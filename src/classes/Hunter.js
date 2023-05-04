import Phaser from 'phaser'

export default class Enemy extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, bulletGroup) {
    super(scene, x, y, "hunter");
    this.setScale(0.08);
    this.setDepth(2)

    this.bulletGroup = bulletGroup;

    scene.add.existing(this)
  }

  shoot() {
    let bullet = this.bulletGroup.get();
    if (bullet) {
      bullet.fire(
        this.x,
        this.y,
        Phaser.Math.RadToDeg(
          Phaser.Math.Angle.Between(this.x, this.y, 400, 300)
        ),
        0,
        10,
        200
      );
    }
  }

  update() {
    this.setAngle(
      Phaser.Math.RadToDeg(
        Phaser.Math.Angle.Between(this.x, this.y, 400, 300)
      ) - 90
    )
  }
}