export default class Shields extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, imageKey) {
    super(scene, 0, 0, "bullet");
    this.setVisible(true);
    this.setActive(true);
    this.setScale(0.4);
    this.hp = 3;
  }
  hit() {
    this.hp -= 1;
    console.log(this.hp);
  }
}
