import Phaser from "phaser";
import { currentHealth, decrementHealth } from '../scenes/PrePlay'

export default class Health {
  constructor(scene) {
    this.healthSprites = [];
    this.playerHealth = this.healthSprites;
    this.maxHealth = 3;

    for (let i = 1; i <= this.maxHealth; i++) {
      this.healthSprites.push(
        scene.add
          .sprite(30 * i, 30, "health", 0)
          .setDepth(10)
          .setScale(0.6)
      );
    }
    this.updateHealth()
  }

  updateHealth() {
    for (const sprite of this.healthSprites) {
      for (let i = 0; i < this.maxHealth; i++) {
        if (i < currentHealth) {
          this.healthSprites[i].setFrame(0)
        }
        else this.healthSprites[i].setFrame(1)
      }
    }
  }

  decreaseHealth() {
    decrementHealth()
    this.updateHealth()
    if (currentHealth === 0) {
      return true;
    }
    return false;
  }
}
