import Phaser from "phaser";
import Player from './Player'
import PlayerBullet from "./PlayerBullet";
import Shields from "./Shields";

export default class PlayerHelper {
  constructor(scene) {
    this.scene = scene
  }

  setupPlayer() {
    const bulletGroup = this.scene.physics.add.group({
      classType: PlayerBullet,
      maxSize: 1,
      runChildUpdate: true,
    });
    const player = new Player(this.scene, 400, 300, 'duck', bulletGroup)
    const playerGroup = this.scene.physics.add.group(player)
    player.body.setSize(450, 450)
    this.scene.add.existing(player)

    const shieldCircle = new Phaser.Geom.Circle(400, 300, 100);
    const shieldGroup = this.scene.physics.add.group()
    const shields = []
    for (let i = 0; i < 5; i++) {
      const shield = new Shields(this.scene)
      shield.setDepth(2)
      this.scene.add.existing(shield)
      shields.push(shield)
    }
    Phaser.Actions.PlaceOnCircle(shields, shieldCircle)
    shieldGroup.addMultiple(shields)

    return [player, playerGroup, bulletGroup, shieldGroup]
  }
}