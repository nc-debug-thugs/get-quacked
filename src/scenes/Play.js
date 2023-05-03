import Phaser from "phaser";
import Player from "../classes/Player";
import BaseBullet from "../classes/BaseBullet";
import Hunter from "../classes/Hunter";
import Health from "../classes/Health";
import Shields from "../classes/Shields";

import Enemy from '../classes/Enemy'

class PlayerBullet extends BaseBullet {
  constructor(scene) {
    super(scene, "bullet");
    this.setScale(0.2);
  }
}

class HunterBullet extends BaseBullet {
  constructor(scene) {
    super(scene, "hunter_bullet");
    this.setScale(0.03);
  }
}

export default class Play extends Phaser.Scene {
  constructor() {
    super({
      key: "play",
    });
  }

  updateEnemyMoves() {
    this.moving = true
    this.time.addEvent({
      delay: 500,
      loop: false,
      callbackScope: this,
      callback: () => {
        this.moving = false
      }
      
    })
    this.moveint += 1
    const steps = this.movesteps + 1
    if (this.moveint > steps) {
       this.movedir = 'anti-clockwise'
    }
    if (this.moveint % steps === 0) {
      this.movedir = 'in'
    }
    if (this.moveint > steps * 2) {
      this.moveint = 1
      this.movedir = 'clockwise'
    }
  }

  moveEnemies() {
    this.enemyTween.pause()
    if (this.moving) {
      // console.log(this.movedir)
      if (this.movedir === 'anti-clockwise') {
        Phaser.Actions.RotateAroundDistance(
          this.enemies1,
          { x: 400, y: 300 },
          -0.005,
          this.enemyCircle.radius
        )
        Phaser.Actions.RotateAroundDistance(
          this.enemies2,
          { x: 400, y: 300 },
          -0.005,
          this.enemyCircle2.radius
        )
      }
      if (this.movedir === 'clockwise') {
        Phaser.Actions.RotateAroundDistance(
          this.enemies1,
          { x: 400, y: 300 },
          0.005,
          this.enemyCircle.radius
        )
        Phaser.Actions.RotateAroundDistance(
          this.enemies2,
          { x: 400, y: 300 },
          0.005,
          this.enemyCircle2.radius
        )
      }
      if (this.movedir === 'in') {
        // this.enemies.getChildren().forEach((enemy) => {
        // })
        this.enemyTween.resume()
        Phaser.Actions.RotateAroundDistance(
          this.enemies1,
          {x: 400, y: 300},
          0,
          this.enemyCircle.radius
        )
        Phaser.Actions.RotateAroundDistance(
          this.enemies2,
          {x: 400, y: 300},
          0,
          this.enemyCircle2.radius
        )
      }
    }
  }

  create() {
    const scene = this
    this.health = new Health(this, 3);

    this.cursors = this.input.keyboard.createCursorKeys();

    //intervals
    this.moving = false
    this.moveint = 1
    this.movedir = 'clockwise'
    this.movesteps = 5
    this.enemyMoveInterval = this.time.addEvent({
      delay: 2000,
      loop: true,
      callbackScope: this,
      callback: this.updateEnemyMoves
    })

    this.time.addEvent({
      delay: 1000,
      loop: true,
      callbackScope: this,
      callback: () => {
        if (this.enemies.getChildren().length !== 0) {
          const rnd = Math.floor(Math.random() * this.enemies.getChildren().length)
          console.log(rnd)
          this.enemies.getChildren()[rnd].shoot()
        }
      }
    })

    //score
    this.score = 0;
    this.scoreText = this.add
      .text(600, 20, `Score: ${this.score}`, {
        fontSize: 24,
      })
      .setDepth(1);

    let bgImage = this.add.image(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      "background"
    );
    bgImage.setScale(1).setScrollFactor(0);

    this.playerBulletGroup = this.physics.add.group({
      classType: PlayerBullet,
      maxSize: 1,
      runChildUpdate: true,
    });

    this.hunterBulletGroup = this.physics.add.group({
      classType: HunterBullet,
      maxSize: 5,
      runChildUpdate: true,
    });


    //player
    this.player = new Player(this, 400, 300, "duck", this.playerBulletGroup);
    this.playerGroup = this.physics.add.group(this.player);
    this.player.body.setSize(450, 450)
    this.add.existing(this.player);

    //Shields
    this.shieldCircle = new Phaser.Geom.Circle(400, 300, 100);
    this.shieldGroup = this.physics.add.group({
      key: "bullet",
      repeat: 5,
      classType: Shields,
    });
    this.shieldGroup.getChildren().forEach((shield) => {
      shield.body.setSize(50, 50)
    })
    Phaser.Actions.PlaceOnCircle(
      this.shieldGroup.getChildren(),
      this.shieldCircle
    );
    this.tweens.add({
      targets: this.shieldCircle,
      radius: 100,
      duration: 5000,
      repeat: -1,
    });

    //new enemies
    // this.enemies = this.physics.add.group({
    //   key: 'enemy', 
    //   classType: Enemy, 
    //   repeat: 9, 
    //   runChildUpdate: true
    // })

    this.enemies = this.physics.add.group()
    for (let i = 0; i < 10; i++) {
      this.enemies.add(new Enemy(this, 0,0,this.hunterBulletGroup))
    }
    this.enemies.runChildUpdate = true

    this.enemyCircle = new Phaser.Geom.Circle(400, 300, 300)
    this.enemyCircle2 = new Phaser.Geom.Circle(400, 300, 350)
    this.enemies1 = this.enemies.getChildren().slice(0, Math.floor(this.enemies.getChildren().length / 2))
    this.enemies2 = this.enemies.getChildren().slice(Math.ceil(this.enemies.getChildren().length / 2), this.enemies.getChildren().length)
    this.enemies1.forEach((enemy) => {
      enemy.setDepth(4)
      enemy.body.setSize(450, 450)
    }) 
    this.enemies2.forEach((enemy) => {
      enemy.setDepth(3)
      enemy.body.setSize(450, 450)
    })
    Phaser.Actions.PlaceOnCircle(this.enemies1, this.enemyCircle, 4, 5)
    Phaser.Actions.PlaceOnCircle(this.enemies2, this.enemyCircle2, 4, 5)
    this.enemyTween = this.tweens.add({
      targets: [this.enemyCircle, this.enemyCircle2],
      duration: 6000,
      radius: 0,
    })

    // console.log(this.enemies)

    // //hunters
    // this.path = new Phaser.Curves.Path();
    // this.path.add(new Phaser.Curves.Ellipse(400, 300, 265));
    // this.hunters = this.physics.add.group({});
    // this.hunter1 = new Hunter(this, this.path, 0, 0);
    // this.hunter2 = new Hunter(this, this.path, 0, 0);
    // this.hunter3 = new Hunter(this, this.path, 0, 0);

    // this.hunters.addMultiple([this.hunter1, this.hunter2, this.hunter3]);

    // this.hunters.getChildren().forEach((hunter, i, hunters) => {
    //   this.add.existing(hunter);
    //   hunter.body.setSize(450, 450)
    //   hunter.startFollow(
    //     {
    //       duration: 9000,
    //       repeat: -1,
    //       rotateToPath: true,
    //     },
    //     i * 0.05
    //   );
    // });

    // player bullet and hunter interaction
    this.physics.add.overlap(
      this.playerBulletGroup,
      this.enemies,
      this.handleEnemyHit,
      null,
      this
    );

    // hunter bullet collide with player interaction
    this.physics.add.overlap(
      this.playerGroup,
      this.hunterBulletGroup,
      this.handlePlayerHit,
      null,
      this
    );

    // explosion animation
    const explosion = {
      key: "explode",
      frames: "boom",
      hideOnComplete: true,
    };
    this.anims.create(explosion);

    // player bullet and shield interaction
    this.physics.add.overlap(
      this.playerBulletGroup,
      this.shieldGroup,
      this.handleShieldCollision,
      null,
      this
    );

    //hunter bullet and shield interaction
    this.physics.add.overlap(
      this.hunterBulletGroup,
      this.shieldGroup,
      this.handleShieldCollision,
      null,
      this
    );
  }

  handlePlayerHit(player, hunterBullet) {
    hunterBullet.destroy();
    if (this.health.decreaseHealth()) {
      // console.log('game over man!')
    }
  }

  handleEnemyHit(playerBullet, hunter) {
    this.score += 100;
    this.scoreText.setText(`Score: ${this.score}`);
    playerBullet.destroy();
    this.add.sprite(hunter.x, hunter.y, "boom").play("explode");
    hunter.destroy();
  }

  update() {
    this.moveEnemies()
    if (this.cursors.left.isDown) {
      this.player.angle -= 2;
    }
    if (this.cursors.right.isDown) {
      this.player.angle += 2;
    }
    if (this.cursors.space.isDown) {
      this.player.shoot();
    }

    //shield rotation
    if (this.cursors.up.isDown) {
      Phaser.Actions.RotateAroundDistance(
        this.shieldGroup.getChildren(),
        { x: 400, y: 300 },
        -0.005,
        100
      );
    }
    if (this.cursors.down.isDown) {
      Phaser.Actions.RotateAroundDistance(
        this.shieldGroup.getChildren(),
        { x: 400, y: 300 },
        +0.005,
        100
      );
    }
  }
  handleShieldCollision(bullet, shield) {
    bullet.destroy();
    shield.hit();
  }
}
