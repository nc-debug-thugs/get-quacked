import Phaser from 'phaser'
import Hunter from '../classes/Hunter'

export default class EnemyHelper {
  constructor(scene) {
    this.scene = scene
    this.gameWidth = this.scene.scale.gameSize.width;
    this.gameHeight = this.scene.scale.gameSize.height;

    this.circleStartRadius = 300  //radius of inner enemy circle
    this.circleStepRadius = 50    //radius increase of each further enemy circle

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

  setupEnemies(enemyGroup, bulletGroup) {
    //set up enemy circles
    this.circles = []
    for (let i = 0; i < 3; i++) {
      this.circles.push(new Phaser.Geom.Circle(this.gameWidth / 2, this.gameHeight / 2, this.circleStartRadius + this.circleStepRadius * i))
    }

    //place hunters on circles and add them to the enemies group
    this.hunters = []
    let depth = 4 //depth of first row
    for (const circle of this.circles) {
      const huntersSubarry = []
      for(let i = 0; i < 5; i++) {
        const hunter = new Hunter(this.scene, 0, 0, bulletGroup)
        hunter.setDepth(depth) //make sure hunters in front draw on top of those behind
        huntersSubarry.push(hunter)
        Phaser.Actions.PlaceOnCircle(huntersSubarry, circle, 4, 6)
      }
      enemyGroup.addMultiple(huntersSubarry)
      this.hunters.push(huntersSubarry)
      depth -= 1
    }

    //iterate through all hunters, reduce bounding box size
    const hunters = enemyGroup.getChildren()
    for (const hunter of hunters) {
      hunter.body.setSize(450, 450)
    }

    //setup tween for inwards movement
    this.tween = this.scene.tweens.add({
      targets: this.circles,
      duration: 6000,
      radius: 0
    })

    // const g = this.scene.add.graphics()
    // for (const circle of circles) {
    //   g.lineStyle(2, 0xFFFFFF, 1)
    //   g.strokeCircle(circle.x, circle.y, circle.radius)
    // }
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

  moveEnemies(enemyGroup) {
    this.tween.pause()
    if (this.moving) {
      if (this.movePattern === 'clockwise') {
        for (let i = 0; i < this.hunters.length; i++) {
          Phaser.Actions.RotateAroundDistance(this.hunters[i], {x: 400, y: 300 }, 0.005, this.circles[i].radius )
        }
      }
      else if (this.movePattern === 'anti-clockwise') {
        for (let i = 0; i < this.hunters.length; i++) {
          Phaser.Actions.RotateAroundDistance(this.hunters[i], {x: 400, y: 300 }, -0.005, this.circles[i].radius )
        }
      }
      else if (this.movePattern === 'inward') {
        this.tween.resume()
        for (let i = 0; i < this.hunters.length; i++) {
          Phaser.Actions.RotateAroundDistance(this.hunters[i], {x: 400, y: 300 }, 0, this.circles[i].radius )
        }
      }
      else (console.log('no move pattern found'))
    }
  }

}