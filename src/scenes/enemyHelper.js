import Phaser from 'phaser'

// const moveDelay = 2000 //Delay in ms between enemy moves
// const moveFor = 500 //Time in ms enemies move for

// let moving = false
// let movePattern = 'clockwise'
// let moveint = 0

// export function setUpEnemies(scene) {
//   const moveIntervalTimer = scene.time.addEvent({
//     delay: moveDelay,
//     loop: false,
//     callback: updateMovePattern()
//   })
// }

// export function moveEnemies(scene) {
// }

// function updateMovePattern(scene) {
//   moving = true
//   scene.time.addEvent({
//     delay: moveFor,
//     loop: false,
//     callback: () => {
//     }
//   })
// }

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