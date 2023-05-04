import Phaser from "phaser";
import Health from "../classes/Health";
import EnemyHelper from "../classes/EnemyHelper"
import PlayerHelper from "../classes/PlayerHelper"

export let score = 0;

export default class Play extends Phaser.Scene {
  constructor() {
    super({
      key: "play",
    });
  }

  create() {
    //health bar setup
    this.health = new Health(this, 3);

    //enemy setup
    this.enemyHelper = new EnemyHelper(this)
    let [enemyGroup, hunterBulletGroup] = this.enemyHelper.setupEnemies()
    this.hunters = enemyGroup
    this.hunterBulletGroup = hunterBulletGroup

    //player setup
    this.playerHelper = new PlayerHelper(this)
    let [playerGroup, playerBulletGroup, shieldGroup] = this.playerHelper.setupPlayer()
    this.playerGroup = playerGroup
    this.playerBulletGroup = playerBulletGroup
    this.shieldGroup = shieldGroup

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
    this.playerHelper.movePlayer()
  }
}
