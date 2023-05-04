import Phaser from 'phaser'

export default class EnemyHelper {
  constructor(scene) {
    this.scene = scene
    this.moveDelay = 2000 //Delay in ms between enemy moves
    this.moveFor = 500    //Time in ms enemies move for

    this.moving = false
    this.moveInt = 1

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
        this.startMoveEveryDelay()
      }
    })
  }

  setup() {
  }

  moveEnemies() {
    console.log(this.moving)
  }

}