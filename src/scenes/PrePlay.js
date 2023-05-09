import Phaser from "phaser";

export let round;
export let score;
export let currentHealth;

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
      this.scene.start("play");
    });
  }

  create() {
    round = 1;
    score = 102220;
    currentHealth = 3;
  }

  update() {}
}