import Phaser from 'phaser'
import Hunter from '../classes/Hunter'
import HunterBullet from './HunterBullet';

export default class EnemyHelper {
  constructor(scene, round = 0) {
    this.scene = scene
    this.centerPoint = { x: scene.scale.gameSize.width / 2, y: scene.scale.gameSize.height / 2 };

    this.round = round

    this.circleStartRadius = 320  //radius of inner enemy circle
    this.circleStepRadius = 50    //radius increase of each further enemy circle

    this.circles = []
    this.hunterGroups = []

    this.moveDelay = 2400 - round * 200 //Delay in ms between enemy moves
    this.moveFor = 500                  //Time in ms enemies move for
    this.bulletSpeed = 120 + round * 20 //speed of enemy bullets

    this.moving = false
    this.moveIndex = 0
    this.stepInt = 1
    this.currentMove = ''
    this.movePattern = [{move: 'inward', steps: 1}, {move: 'clockwise', steps: 6}, {move: 'inward', steps: 1}, {move: 'anti-clockwise', steps: 4}]

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

  _chooseRandom(array) {
    return array[Math.floor(Math.random() * array.length)]
  }

  setupEnemies() {
    //set up bulletGroup
    this.bulletGroup = this.scene.physics.add.group({
      classType: HunterBullet,
      maxSize: 30,
      runChildUpdate: true,
    });

    const standard = [{move: 'inward', steps: 1}, {move: 'clockwise', steps: 6}, {move: 'inward', steps: 1}, {move: 'anti-clockwise', steps: 4}]
    const standardReverse = [{move: 'inward', steps: 1}, {move: 'clockwise', steps: 4}, {move: 'inward', steps: 1}, {move: 'anti-clockwise', steps: 6}]
    const justClockwise = [{move: 'inward', steps: 1}, {move: 'clockwise', steps: 5}]
    const justAntiClockwise = [{move: 'inward', steps: 1}, {move: 'anti-clockwise', steps: 5}]
    const justInwards = [{move: 'inward', steps: 1}]
    const noStepInwards = [{move: 'clockwise', steps: 5}, {move: 'anti-clockwise', steps: 3}]
    
    const movePatterns = [standard, standardReverse, justClockwise, justAntiClockwise]
    const enemyConfigurations = [this._oneTightGroup, this._twoEquidistantGroups, this._threeEquidistantGroups]

    if (this.round === 0) {
      this.movePattern = noStepInwards
      this._chooseRandom(enemyConfigurations).call(this)
    }
    else {
      this.movePattern = this._chooseRandom(movePatterns)
      this._chooseRandom(enemyConfigurations).call(this)
    }
    
    //set up tween for inwards movement
    this.tween = this.scene.tweens.add({
      targets: this.circles,
      duration: 6000,
      radius: 0
    })

    return [this.hunterGroups, this.bulletGroup]
  }

  _oneTightGroup() {
     //set up enemy circles
     for (let i = 0; i < 2; i++) {
      this.circles.push(new Phaser.Geom.Circle(this.centerPoint.x, this.centerPoint.y, this.circleStartRadius + this.circleStepRadius * i))
    }

    //place hunters on circles and add them to the enemies group
    let depth = 4 //depth of first row
    for (const circle of this.circles) {
      const enemySubGroup = this.scene.physics.add.group({
        runChildUpdate: true
      })
      for(let i = 0; i < 6; i++) {
        const hunter = new Hunter(this.scene, 0, 0, this.bulletGroup, this.bulletSpeed, this.centerPoint)
        enemySubGroup.add(hunter)
        hunter.setDepth(depth) //make sure hunters in front draw on top of those behind
        hunter.body.setSize(45, 45)
        Phaser.Actions.PlaceOnCircle(enemySubGroup.getChildren(), circle, 4, 5.5)
      }
      this.hunterGroups.push(enemySubGroup)
      depth -= 1
    }
  }

  _twoEquidistantGroups() {
    //set up enemy circles
    for (let i = 0; i < 2; i++) {
     this.circles.push(new Phaser.Geom.Circle(this.centerPoint.x, this.centerPoint.y, this.circleStartRadius))
   }

   //place hunters on circles and add them to the enemies group
   let depth = 4 //depth of first row
   let c = 0
   for (const circle of this.circles) {
     const enemySubGroup = this.scene.physics.add.group({
       runChildUpdate: true
     })
     for(let i = 0; i < 6; i++) {
       const hunter = new Hunter(this.scene, 0, 0, this.bulletGroup, this.bulletSpeed, this.centerPoint)
       enemySubGroup.add(hunter)
       hunter.setDepth(depth) //make sure hunters in front draw on top of those behind
       hunter.body.setSize(45, 45)
       Phaser.Actions.PlaceOnCircle(enemySubGroup.getChildren(), circle, 4 + c, 2 + c)
     }
     this.hunterGroups.push(enemySubGroup)
     depth -= 1
     c += 3
   }
 }

 _threeEquidistantGroups() {
      //set up enemy circles
      for (let i = 0; i < 3; i++) {
        this.circles.push(new Phaser.Geom.Circle(this.centerPoint.x, this.centerPoint.y, this.circleStartRadius))
      }
   
      //place hunters on circles and add them to the enemies group
      let depth = 4 //depth of first row
      let c = 0
      for (const circle of this.circles) {
        const enemySubGroup = this.scene.physics.add.group({
          runChildUpdate: true
        })
        for(let i = 0; i < 4; i++) {
          const hunter = new Hunter(this.scene, 0, 0, this.bulletGroup, this.bulletSpeed, this.centerPoint)
          enemySubGroup.add(hunter)
          hunter.setDepth(depth) //make sure hunters in front draw on top of those behind
          hunter.body.setSize(45, 45)
          Phaser.Actions.PlaceOnCircle(enemySubGroup.getChildren(), circle, 0 + c, 1 + c)
        }
        this.hunterGroups.push(enemySubGroup)
        depth -= 1
        c += 2
      }
  }



  _updateMovePattern() {
    this.currentMove = this.movePattern[this.moveIndex].move
    this.stepInt += 1
    if (this.stepInt > this.movePattern[this.moveIndex].steps) {
      this.moveIndex += 1
      this.stepInt = 1
      if (this.moveIndex >= this.movePattern.length) this.moveIndex = 0
    }
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
      if (this.currentMove === 'clockwise') {
        for (let i = 0; i < this.circles.length; i++) {
          Phaser.Actions.RotateAroundDistance(this.hunterGroups[i].getChildren(), this.centerPoint, 0.005, this.circles[i].radius )
          this.hunterGroups[i].getChildren().forEach(hunter => hunter.play('hunter-walking-sideways', true));
        }
      }
      else if (this.currentMove === 'anti-clockwise') {
        for (let i = 0; i < this.circles.length; i++) {
          Phaser.Actions.RotateAroundDistance(this.hunterGroups[i].getChildren(), this.centerPoint, -0.005, this.circles[i].radius )
          this.hunterGroups[i].getChildren().forEach(hunter => hunter.play('hunter-walking-sideways', true));
        }
      }
      else if (this.currentMove === 'inward') {
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