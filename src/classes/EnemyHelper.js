import Phaser from 'phaser'
import Hunter from '../classes/Hunter'
import HunterBullet from './HunterBullet';

export default class EnemyHelper {
  constructor(scene) {
    this.scene = scene
    this.centerPoint = { x: scene.scale.gameSize.width / 2, y: scene.scale.gameSize.height / 2 };

    this.circleStartRadius = 300  //radius of inner enemy circle
    this.circleStepRadius = 50    //radius increase of each further enemy circle

    this.circles = []
    this.hunters = []

    this.moveDelay = 2000 //Delay in ms between enemy moves
    this.moveFor = 500    //Time in ms enemies move for

    this.moving = false
    this.moveInt = 1
    this.movePattern = 'clockwise'

    this._startMoveEveryDelay()
  }

  _startMoveEveryDelay() {
    this.scene.time.addEvent({
      delay: this.moveDelay,
      loop: false,
      callback: () => {
        this.moving = true
        this._startMoveForDelay()
      }
    })
  }

  _startMoveForDelay() {
    this.scene.time.addEvent({
      delay: this.moveFor,
      loop: false,
      callback: () => {
        this.moving = false
        this._updateMovePattern()
        this._startMoveEveryDelay()
      }
    })
  }

  setupEnemies() {
    const enemyGroup = this.scene.physics.add.group({
      runChildUpdate: true
    })
    const bulletGroup = this.scene.physics.add.group({
      classType: HunterBullet,
      maxSize: 30,
      runChildUpdate: true,
    });

    //set up enemy circles
    for (let i = 0; i < 3; i++) {
      this.circles.push(new Phaser.Geom.Circle(this.centerPoint.x, this.centerPoint.y, this.circleStartRadius + this.circleStepRadius * i))
    }

    //place hunters on circles and add them to the enemies group
    let depth = 4 //depth of first row
    for (const circle of this.circles) {
      const hunterSubarray = []
      for(let i = 0; i < 1; i++) {
        const hunter = new Hunter(this.scene, 0, 0, bulletGroup)
        hunter.setDepth(depth) //make sure hunters in front draw on top of those behind
        hunterSubarray.push(hunter)
        Phaser.Actions.PlaceOnCircle(hunterSubarray, circle, 4, 5)
      }
      enemyGroup.addMultiple(hunterSubarray)
      this.hunters.push(hunterSubarray)
      depth -= 1
    }

    //iterate through all enemies, reduce bounding box size
    for (const hunter of enemyGroup.getChildren()) {
      hunter.body.setSize(450, 450)
    }

    //set up tween for inwards movement
    this.tween = this.scene.tweens.add({
      targets: this.circles,
      duration: 6000,
      radius: 0
    })

    return [enemyGroup, bulletGroup]
  }

  _updateMovePattern() {
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

  getRandomEnemy(enemies) {
    return enemies[Math.floor(Math.random() * enemies.length)]
  }

  moveEnemies() {
    this.tween.pause()
    if (this.moving) {
      if (this.movePattern === 'clockwise') {
        for (let i = 0; i < this.hunters.length; i++) {
          Phaser.Actions.RotateAroundDistance(this.hunters[i], this.centerPoint, 0.005, this.circles[i].radius )
        }
      }
      else if (this.movePattern === 'anti-clockwise') {
        for (let i = 0; i < this.hunters.length; i++) {
          Phaser.Actions.RotateAroundDistance(this.hunters[i], this.centerPoint, -0.005, this.circles[i].radius )
        }
      }
      else if (this.movePattern === 'inward') {
        this.tween.resume()
        for (let i = 0; i < this.hunters.length; i++) {
          Phaser.Actions.RotateAroundDistance(this.hunters[i], this.centerPoint, 0, this.circles[i].radius )
        }
      }
      else (console.log('no move pattern found'))
    }
  }
}