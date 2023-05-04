import Phaser from 'phaser'

export default class EnemyHelper {
  constructor(scene) {
    this.scene = scene
    this.moveDelay = 2000 //Delay in ms between enemy moves
    this.moveFor = 500    //Time in ms enemies move for

    this.moving = false
    this.moveInt = 1
    this.movePattern = 'clockwise'

    this.startMoveEveryDelay()
  }

  startMoveEveryDelay() {
    this.scene.time.addEvent({
      delay: this.moveDelay,
      loop: false,
      callback: () => {
        this.moving = true
        this.startMoveForDelay()
      }
    })
  }

  startMoveForDelay() {
    this.scene.time.addEvent({
      delay: this.moveFor,
      loop: false,
      callback: () => {
        this.moving = false
        this.updateMovePattern()
        this.startMoveEveryDelay()
      }
    })
  }

  setup() {
  }

  updateMovePattern() {
    if (this.moveInt < 6) {
      this.movePattern = 'clockwise'
    }
    if (this.moveInt > 6) {
      this.movePattern = 'anti-clockwise'
    }
    if (this.moveInt % 6 === 0) {
      this.movePattern = 'inward'
    }
    this.moveInt += 1
    if (this.moveInt > 12) this.moveInt = 1
  }

  moveEnemies() {
    console.log(this.movePattern)
  }

}