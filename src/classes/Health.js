import Phaser from "phaser";

export default class Health {
  constructor(scene) {
    this.healthSprites = [];
    this.playerHealth = this.healthSprites

    for (let i = 1; i < 4; i++) {
      this.healthSprites.push(
        scene.add
          .sprite(30 * i, 30, "health", 1)
          .setDepth(1)
          .setScale(0.6)
      );
    }
  }

  changeHealth() {
    for (const sprite of this.healthSprites) {
      sprite.setFrame(0);
    }
  }
}
