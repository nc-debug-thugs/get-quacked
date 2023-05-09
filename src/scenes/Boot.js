import Phaser from "phaser";
import {getScores} from '../firebase'

export default class Boot extends Phaser.Scene {
  constructor() {
    super({
      key: "boot",
    });
  }

  preload() {

    getScores()

    this.load.spritesheet("duck", "../assets/images/duck.png", {
      frameWidth: 128,
      frameHeight: 125,
      endFrame: 1,
    });
    this.load.image("bullet", "../assets/images/egg.png");
    this.load.spritesheet("hunter", "../assets/images/hunter.png", {
      frameWidth: 128,
      frameHeight: 128,
      endFrame: 1,
    });
    this.load.image("background", "../assets/images/background.png");
    this.load.image("start", "../assets/images/start.png");
    this.load.image("spacebar", "../assets/images/spacebar.png");
    this.load.image("shoot", "../assets/images/shoot.png");
    this.load.image("arrowkey", "../assets/images/arrowkey.png");
    this.load.image("aim", "../assets/images/aim.png");
    this.load.image("moveshield", "../assets/images/moveshield.png");
    this.load.image("shield", "../assets/images/shield.png");
    this.load.audio("quacksound", "../assets/images/quack.wav");
    this.load.audio("explosionsound", "../assets/images/explosion.wav");
    this.load.audio("oof", "../assets/images/oof.wav");
    this.load.audio("clink", "../assets/images/clink.wav");

    this.load.image("block", "../assets/images/block.png");
    this.load.image("rub", "../assets/images/rub.png");
    this.load.image("end", "../assets/images/end.png");

    this.load.bitmapFont(
      "arcade",
      "../assets/images/arcade.png",
      "../assets/images/arcade.xml"
    );

    this.load.spritesheet("health", "../assets/images/health.png", {
      frameWidth: 59,
      frameHeight: 51,
      endFrame: 1,
    });

    this.load.image("hunter_bullet", "../assets/images/hunter_bullet.png");
    this.load.spritesheet("boom", "../assets/images/explosion.png", {
      frameWidth: 64,
      frameHeight: 64,
      endFrame: 23,
    });

    this.load.on("complete", () => {
      this.scene.start("start");
    });
  }
}
