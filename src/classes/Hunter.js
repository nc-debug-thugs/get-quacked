import Phaser from 'phaser'

export default class Enemy extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, bulletGroup) {
    super(scene, x, y, "hunter");
    this.setScale(1);
    this.setDepth(2)

    this.bulletGroup = bulletGroup;

    scene.add.existing(this)

    scene.anims.create({
      key: 'hunter-idle',
      frames: this.anims.generateFrameNumbers('hunter', {
        start: 0,
        end: 0
      }),
      repeat: 0
    })

    scene.anims.create({
      key: 'hunter-walking-sideways',
      frames: this.anims.generateFrameNumbers('hunter', {
        start: 0,
        end: 1
      }),
      frameRate: 4,
      repeat: -1
    })

    scene.anims.create({
      key: 'hunter-walking-inwards',
      frames: this.anims.generateFrameNumbers('hunter', {
        start: 0,
        end: 1
      }),
      frameRate: 8,
      repeat: -1
    })
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
   
    // if (this.body.velocity.x === 0 && this.body.velocity.y === 0) {
    //   this.play('hunter-idle', true)
    // }

    this.setAngle(
      Phaser.Math.RadToDeg(
        Phaser.Math.Angle.Between(this.x, this.y, 400, 300)
      ) - 90
    )
  }
}