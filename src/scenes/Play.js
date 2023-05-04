import Phaser from "phaser";
import Player from "../classes/Player";
import HunterBullet from "../classes/HunterBullet"
import PlayerBullet from "../classes/PlayerBullet"
import Health from "../classes/Health";
import Shields from "../classes/Shields";

import EnemyHelper from "../classes/EnemyHelper"

export let score = 0;

export default class Play extends Phaser.Scene {
  constructor() {
    super({
      key: "play",
    });
  }

  create() {
    this.health = new Health(this, 3);

    this.cursors = this.input.keyboard.createCursorKeys();


    //enemy setup
    this.enemyHelper = new EnemyHelper(this)
    this.hunters = this.physics.add.group({
      runChildUpdate: true
    })
    this.hunterBulletGroup = this.physics.add.group({
      classType: HunterBullet,
      maxSize: 30,
      runChildUpdate: true,
    });
    this.enemyHelper.setupEnemies(this.hunters, this.hunterBulletGroup)

    //score
    this.scoreText = this.add
      .text(600, 20, `Score: ${score}`, {
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

    this.player = new Player(this, 400, 300, "duck", this.playerBulletGroup);
    this.playerGroup = this.physics.add.group(this.player);
    this.player.body.setSize(450, 450);
    this.add.existing(this.player);

    this.shieldCircle = new Phaser.Geom.Circle(400, 300, 100);

    this.shieldGroup = this.physics.add.group({
      key: "bullet",
      repeat: 5,
      classType: Shields,
    });

    this.shieldGroup.getChildren().forEach((shield) => {
      shield.body.setSize(50, 50);
    });

    Phaser.Actions.PlaceOnCircle(
      this.shieldGroup.getChildren(),
      this.shieldCircle
    );

    this.tweens.add({
      targets: this.shieldCircle,
      radius: 100,
      duration: 5000,
      repeat: -1,
      onUpdate: function () {},
    });

      // Random hunter selected to shoot at random time
      this.time.addEvent({
        delay: Phaser.Math.Between(1000, 2000),
        loop: true,
        callback: () => {
          this.enemyHelper.getRandomEnemy(this.hunters.getChildren()).shoot()
        },
        callbackScope: this,
      });

    // player bullet and hunter interaction
    this.physics.add.overlap(
      this.playerBulletGroup,
      this.hunters,
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
      player.play("explode").setScale(1);
      this.hunters.getChildren().forEach((hunter) => {
        hunter.destroy();
      });
      this.time.delayedCall(2000, () => this.scene.start("gameover"));
    }
  }

  handleEnemyHit(playerBullet, hunter) {
    score += 100;
    this.scoreText.setText(`Score: ${score}`);
    playerBullet.destroy();
    this.add.sprite(hunter.x, hunter.y, "boom").play("explode");
    hunter.isAlive = false;
    hunter.destroy();
  }

  handleShieldCollision(bullet, shield) {
    bullet.destroy();
    shield.hit();
  }


  update() {
    this.enemyHelper.moveEnemies()

    if (this.cursors.left.isDown) {
      this.player.angle -= 2;
    }

    if (this.cursors.right.isDown) {
      this.player.angle += 2;
    }

    if (this.cursors.space.isDown) {
      this.player.shoot();
    }

    if (this.cursors.up.isDown) {
      Phaser.Actions.RotateAroundDistance(
        this.shieldGroup.getChildren(),
        { x: 400, y: 300 },
        -0.015,
        100
      );
    }

    if (this.cursors.down.isDown) {
      Phaser.Actions.RotateAroundDistance(
        this.shieldGroup.getChildren(),
        { x: 400, y: 300 },
        +0.015,
        100
      );
    }
  }
}
