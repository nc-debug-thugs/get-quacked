import Phaser from 'phaser'

export default class Enemy extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, bulletGroup) {
    super(scene, x, y, "hunter");
    this.setScale(1);
    this.setDepth(2)

    this.bulletGroup = bulletGroup;

    this.createAnimations()
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

  createAnimations() {
    if (!this.scene.anims.exists('hunter-idle')) {
      this.scene.anims.create({
        key: 'hunter-idle',
        frames: this.anims.generateFrameNumbers('hunter', {
          start: 0,
          end: 0
        }),
        repeat: 0
      })
    }

    if (!this.scene.anims.exists('hunter-walking-sideways')) {
      this.scene.anims.create({
        key: 'hunter-walking-sideways',
        frames: this.anims.generateFrameNumbers('hunter', {
          start: 0,
          end: 1
        }),
        frameRate: 4,
        repeat: -1
      })
    }

    if (!this.scene.anims.exists('hunter-walking-inwards')) {
      this.scene.anims.create({
        key: 'hunter-walking-inwards',
        frames: this.anims.generateFrameNumbers('hunter', {
          start: 0,
          end: 1
        }),
        frameRate: 8,
        repeat: -1
      })
    }
  }
}