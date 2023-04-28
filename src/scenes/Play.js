import Phaser from 'phaser'
import Player from '../classes/Player'
import BaseBullet from '../classes/BaseBullet'

class PlayerBullet extends BaseBullet {
  constructor(scene) {
    super(scene, 'bullet')
  }
}

export default class Play extends Phaser.Scene {
  constructor() {
    super({
      key: 'play'
    })
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys()

    this.playerBulletGroup = this.physics.add.group({
      classType: PlayerBullet,
      maxSize: 1,
      runChildUpdate: true
    })

    this.player = new Player(this, 400, 300, 'duck', this.playerBulletGroup)
    this.add.existing(this.player)
  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.angle -= 2
    }
    if (this.cursors.right.isDown) {
      this.player.angle += 2
    }
  }
}