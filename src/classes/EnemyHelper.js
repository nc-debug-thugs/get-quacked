import Phaser from 'phaser'
import Hunter from '../classes/Hunter'
import HunterBullet from './HunterBullet';

export default class EnemyHelper {
  constructor(scene) {
    this.scene = scene
    this.centerPoint = { x: scene.scale.gameSize.width / 2, y: scene.scale.gameSize.height / 2 };

    this.circleStartRadius = 320  //radius of inner enemy circle
    this.circleStepRadius = 50    //radius increase of each further enemy circle

    this.circles = []
    this.hunterGroups = []

    this.moveDelay = 2000 //Delay in ms between enemy moves
    this.moveFor = 500    //Time in ms enemies move for

    this.moving = false
    this.moveInt = 1
    this.movePattern = 'inward'

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
      const enemySubGroup = this.scene.physics.add.group({
        runChildUpdate: true
      })
      for(let i = 0; i < 5; i++) {
        const hunter = new Hunter(this.scene, 0, 0, bulletGroup)
        enemySubGroup.add(hunter)
        hunter.setDepth(depth) //make sure hunters in front draw on top of those behind
        hunter.body.setSize(45, 45)
        Phaser.Actions.PlaceOnCircle(enemySubGroup.getChildren(), circle, 4, 5)
      }
      this.hunterGroups.push(enemySubGroup)
      depth -= 1
    }

    //set up tween for inwards movement
    this.tween = this.scene.tweens.add({
      targets: this.circles,
      duration: 6000,
      radius: 0
    })

    return [this.hunterGroups, bulletGroup]
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

  getRandomEnemy() {
    const hunters = []
    for (const hunterGroup of this.hunterGroups) {
      hunters.push(...hunterGroup.getChildren())
    }
    return hunters[Math.floor(Math.random() * hunters.length)]
  }

  getEnemiesLeft() {
    let enemiesLeft = 0
    for (const hunterGroup of this.hunterGroups) {
      enemiesLeft += hunterGroup.getChildren().length
    }
    return enemiesLeft
  }

  moveEnemies() {
    this.tween.pause()
    if (!this.moving) {
      for (const hunterGroup of this.hunterGroups) {
        for (const hunter of hunterGroup.getChildren()) {
          hunter.play('hunter-idle')
        }
      }
    }
    if (this.moving) {
      if (this.movePattern === 'clockwise') {
        for (let i = 0; i < this.circles.length; i++) {
          Phaser.Actions.RotateAroundDistance(this.hunterGroups[i].getChildren(), this.centerPoint, 0.005, this.circles[i].radius )
          this.hunterGroups[i].getChildren().forEach(hunter => hunter.play('hunter-walking-sideways', true));
        }
      }
      else if (this.movePattern === 'anti-clockwise') {
        for (let i = 0; i < this.circles.length; i++) {
          Phaser.Actions.RotateAroundDistance(this.hunterGroups[i].getChildren(), this.centerPoint, -0.005, this.circles[i].radius )
          this.hunterGroups[i].getChildren().forEach(hunter => hunter.play('hunter-walking-sideways', true));
        }
      }
      else if (this.movePattern === 'inward') {
        this.tween.resume()
        for (let i = 0; i < this.circles.length; i++) {
          Phaser.Actions.RotateAroundDistance(this.hunterGroups[i].getChildren(), this.centerPoint, 0, this.circles[i].radius )
          this.hunterGroups[i].getChildren().forEach(hunter => hunter.play('hunter-walking-inwards', true));
        }
      }
      else (console.log('no move pattern found'))
    }
  }
}