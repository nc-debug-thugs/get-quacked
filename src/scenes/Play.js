import Phaser from "phaser";

import Health from "../classes/Health";
import EnemyHelper from "../classes/EnemyHelper";
import PlayerHelper from "../classes/PlayerHelper";

import { score, round, updateScore, incrementRound } from "./PrePlay";

export default class Play extends Phaser.Scene {
  constructor() {
    super({
      key: "play",
    });
  }

  create() {
    //is scene active
    this.isActive = true

    //health bar setup
    this.health = new Health(this);

    //enemy setup
    this.enemyHelper = new EnemyHelper(this);
    let [enemyGroup, hunterBulletGroup] = this.enemyHelper.setupEnemies();
    this.hunters = enemyGroup;
    this.hunterBulletGroup = hunterBulletGroup;

    //player setup
    this.playerHelper = new PlayerHelper(this);
    let [playerGroup, playerBulletGroup, shieldGroup] =
      this.playerHelper.setupPlayer();
    this.playerGroup = playerGroup;
    this.playerBulletGroup = playerBulletGroup;
    this.shieldGroup = shieldGroup;

    //round
    this.roundText = this.add
      .text(600, 520, `Round ${round}`, {
        fontSize: 24,
      })
      .setDepth(10);

    //score
    this.scoreText = this.add
      .text(600, 20, `Score: ${score}`, {
        fontSize: 24,
      })
      .setDepth(10);

    //background
    let bgImage = this.add.image(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      "background"
    );
    bgImage.setScale(1).setScrollFactor(0);

    // Random hunter selected to shoot at random time
    this.time.addEvent({
      delay: Phaser.Math.Between(1000, 2000),
      loop: true,
      callback: () => {
        if (this.isActive) {
          if (this.hunters.getChildren().length > 0) {
            this.enemyHelper.getRandomEnemy(this.hunters.getChildren()).shoot();
          }
        }
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

    //hunter and shield interaction
    this.physics.add.overlap(
      this.hunters,
      this.shieldGroup,
      (hunter, shield) => {
        this.health.setToZero()
        this.playerHelper.killPlayer()
        this.isActive = false
        // this.time.delayedCall(2000, () => this.scene.start("gameover"))
      },
      null,
      this
    )

    // this.time.delayedCall(3000, () => this.playerHelper.killPlayer())
  }

  handlePlayerHit(player, hunterBullet) {
    hunterBullet.destroy();

    if (player.hit(this.health)) {
      this.time.delayedCall(2000, () => this.scene.start("gameover"));
    }
  }

  handleEnemyHit(playerBullet, hunter) {
    const newScore = updateScore(100);
    this.scoreText.setText(`Score: ${newScore}`);
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
    if (this.isActive) {
      this.enemyHelper.moveEnemies();
      this.playerHelper.movePlayer();
    }

    if (this.hunters.getChildren().length === 0) {
      this.time.addEvent({
        delay: 1000,
        loop: false,
        callback: () => {
          incrementRound()
          this.scene.restart()
        }
      })
    }
  }
}
