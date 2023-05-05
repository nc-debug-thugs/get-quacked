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
    //set up bulletGroup
    const bulletGroup = this.scene.physics.add.group({
      classType: HunterBullet,
      maxSize: 30,
      runChildUpdate: true,
    });
    
    let roundType = this.round
    while (roundType > 3) { roundType -= 3 }
    console.log(roundType)
    switch (roundType) {
      case 0:
        this._oneTightGroup(bulletGroup)
        console.log('0')
        break;
      case 1:
        this._oneTightGroup(bulletGroup)
        console.log('1')
        break;
      case 2:
        this._twoEquidistantGroups(bulletGroup)
        console.log('2')
        break;
      case 3:
        this._threeEquidistantGroups(bulletGroup)
        console.log('3')
        break;
      default:
        console.log('something went wrong!')
        break;
    }
    
    //set up tween for inwards movement
    this.tween = this.scene.tweens.add({
      targets: this.circles,
      duration: 6000,
      radius: 0
    })

    return [this.hunterGroups, bulletGroup]
  }

  _oneTightGroup(bulletGroup) {
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
        const hunter = new Hunter(this.scene, 0, 0, bulletGroup, this.bulletSpeed, this.centerPoint)
        enemySubGroup.add(hunter)
        hunter.setDepth(depth) //make sure hunters in front draw on top of those behind
        hunter.body.setSize(45, 45)
        Phaser.Actions.PlaceOnCircle(enemySubGroup.getChildren(), circle, 4, 5.5)
      }
      this.hunterGroups.push(enemySubGroup)
      depth -= 1
    }
  }

  _twoEquidistantGroups(bulletGroup) {
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
       const hunter = new Hunter(this.scene, 0, 0, bulletGroup, this.bulletSpeed, this.centerPoint)
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

 _threeEquidistantGroups(bulletGroup) {
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
          const hunter = new Hunter(this.scene, 0, 0, bulletGroup, this.bulletSpeed, this.centerPoint)
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