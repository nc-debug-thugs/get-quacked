import Phaser from "phaser";
import Player from "./Player";
import PlayerBullet from "./PlayerBullet";
import Shields from "./Shields";

export default class PlayerHelper {
  constructor(scene) {
    this.scene = scene;
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.keyboard = scene.input.keyboard;
  }

  setupPlayer() {
    //bulletGroup
    const bulletGroup = this.scene.physics.add.group({
      classType: PlayerBullet,
      maxSize: 1,
      runChildUpdate: true,
    });

    //player setup
    this.player = new Player(this.scene, 400, 300, "duck", bulletGroup);

    const playerGroup = this.scene.physics.add.group(this.player);
    this.player.body.setSize(45, 45);
    this.scene.add.existing(this.player);

    //Shields
    const shieldGroup = this.scene.physics.add.group();
    const shieldCircle = new Phaser.Geom.Circle(400, 300, 100);
    this.shields = [];
    for (let i = 0; i < 5; i++) {
      const shield = new Shields(this.scene);
      shield.setDepth(2);
      this.scene.add.existing(shield);
      this.shields.push(shield);
    }
    Phaser.Actions.PlaceOnCircle(this.shields, shieldCircle);
    shieldGroup.addMultiple(this.shields);

    return [playerGroup, bulletGroup, shieldGroup];
  }

  killPlayer() {
    this.player.die()
  }

  movePlayer() {
    if (this.cursors.left.isDown) {
      this.player.angle -= 1;
    }

    if (this.cursors.right.isDown) {
      this.player.angle += 1;
    }

    if (this.cursors.space.isDown) {
      this.player.shoot();
    }
    if (this.keyboard.checkDown(this.keyboard.addKey("A"))) {
      Phaser.Actions.RotateAroundDistance(
        this.shields,
        { x: 400, y: 300 },
        -0.015,
        100
      );
    }
    if (this.keyboard.checkDown(this.keyboard.addKey("D"))) {
      Phaser.Actions.RotateAroundDistance(
        this.shields,
        { x: 400, y: 300 },
        +0.015,
        100
      );
    }
  }
}
