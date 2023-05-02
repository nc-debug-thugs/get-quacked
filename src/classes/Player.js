export default class Player extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, imageKey, bulletGroup) {
    super(scene, 0, 0, imageKey);
    this.setX(x);
    this.setY(y);
    this.setActive(true);
    this.setVisible(true);
    this.setDepth(2);
    this.setScale(0.06);

    this.bulletGroup = bulletGroup;
  }

  shoot() {
    const bullet = this.bulletGroup.get();
    if (bullet) {
      bullet.fire(this.x, this.y, this.angle, 0, 90, 600);
    }
  }
}
