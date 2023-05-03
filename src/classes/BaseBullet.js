import Phaser from "phaser";

export default class BaseBullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, imageKey) {
    super(scene, 0, 0, imageKey);
    this.gameWidth = this.scene.scale.gameSize.width;
    this.gameHeight = this.scene.scale.gameSize.height;
  }

  fire(originX, originY, angle, angleOffset, drawAngleOffset, speed) {
    this.setPosition(originX, originY);
    const vector = this.scene.physics.velocityFromAngle(
      angle + angleOffset,
      speed
    );
    this.setVelocity(vector.x, vector.y);
    this.setAngle(angle + drawAngleOffset);
    this.body.setSize(50, 50)
    this.setActive(true);
    this.setVisible(true);
  }

  update() {
    if (
      this.x < 0 ||
      this.x > this.gameWidth ||
      this.y < 0 ||
      this.y > this.gameHeight
    ) {
      this.destroy();
    }
  }
}
