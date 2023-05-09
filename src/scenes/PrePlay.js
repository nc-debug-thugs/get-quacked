import Phaser from "phaser";

export let round = 1;
export let score = 10000;
export let currentHealth = 3

export function updateScore(amount) {
  score += amount;
  return score;
}

export function incrementRound() {
  round += 1
}

export function setHealth(newHealth) {
  currentHealth = newHealth
}

export default class PrePlay extends Phaser.Scene {
  constructor() {
    super({
      key: "preplay",
    });
  }

  preload() {
    this.load.on("complete", () => {
      this.scene.start("Highscore");
    });
  }

  create() {}

  update() {}
}
