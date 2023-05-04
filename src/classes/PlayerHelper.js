import Phaser from "phaser";
import Player from './Player'

export default class PlayerHelper {
  constructor(scene) {
    this.scene = scene
  }

  setupPlayer(playerGroup, bulletGroup) {
    const player = new Player(this.scene, 400, 300, 'duck', bulletGroup)
    playerGroup.add(player)
    player.body.setSize(450, 450)
    this.scene.add.existing(player)

    return player
  }
}