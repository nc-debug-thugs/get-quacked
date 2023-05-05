import Phaser from "phaser";

export let round = 1;
export let score = 0;

export function updateScore(amount) {
  score += amount;
  return score;
}

export function updateRound() {
  round += 1
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

  create() {}

  update() {}
}
