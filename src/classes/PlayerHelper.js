import Phaser from "phaser";
import Player from './Player'
import PlayerBullet from "./PlayerBullet";

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

    return [player, playerGroup, bulletGroup]
  }
}