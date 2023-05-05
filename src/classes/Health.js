import Phaser from "phaser";

export default class Health {
  constructor(scene, maxHealth) {
    this.healthSprites = [];
    this.playerHealth = this.healthSprites;
    this.maxHealth = maxHealth;
    this.currentHealth = maxHealth;

    for (let i = 1; i <= maxHealth; i++) {
      this.healthSprites.push(
        scene.add
          .sprite(30 * i, 30, "health", 0)
          .setDepth(10)
          .setScale(0.6)
      );
    }
  }

  changeHealth() {
    for (const sprite of this.healthSprites) {
      sprite.setFrame(0);
    }
  }

  decreaseHealth() {
    this.currentHealth -= 1;
    for (let i = 0; i < this.maxHealth; i++) {
      if (i < this.currentHealth) {
        this.healthSprites[i].setFrame(0);
      } else this.healthSprites[i].setFrame(1);
    }

    if (this.currentHealth === 0) {
      return true;
    }
    return false;
  }
}
