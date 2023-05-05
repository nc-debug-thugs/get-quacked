import Phaser from "phaser";
import EnemyHelper from "../classes/EnemyHelper";
import PlayerHelper from "../classes/PlayerHelper";

export default class Start extends Phaser.Scene {
  constructor() {
    super({
      key: "start",
    });
  }

  create() {
    let bgImage = this.add.image(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      "background"
    );
    bgImage.setScale(1).setScrollFactor(0);

    let shootSpaceBar = this.add.image(125, 550, "spacebar");

    shootSpaceBar.setScale(3);
    this.tweens.add({
      targets: shootSpaceBar,
      y: shootSpaceBar.y + 10,
      duration: 500,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1,
    });

    let shootSign = this.add.image(145, 570, "shoot");
    shootSign.setScale(3);

    let arrowKeys = this.add.image(700, 550, "arrowkey");

    arrowKeys.setScale(2.3);
    this.tweens.add({
      targets: arrowKeys,
      y: arrowKeys.y + 10,
      duration: 500,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1,
    });

    let aimSign = this.add.image(700, 570, "aim");
    aimSign.setScale(3);

    let startButton = this.add.image(
      this.cameras.main.width / 2,
      this.cameras.main.height / 4,
      "start"
    );
    startButton.setScale(0.4);
    startButton.setInteractive();
    startButton.on("pointerover", () => {
      this.tweens.add({
        targets: startButton,
        scale: { value: 0.6, duration: 100, yoyo: true, ease: "Power1" },
      });
    });
    startButton.on("pointerdown", () => {
      this.scene.start("preplay");
    });

    this.cursors = this.input.keyboard.createCursorKeys();

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

    // Random hunter selected to shoot at random time
    this.time.addEvent({
      delay: Phaser.Math.Between(1000, 2000),
      loop: true,
      callback: () => {
        this.enemyHelper.getRandomEnemy(this.hunters.getChildren()).shoot();
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

  handleEnemyHit(playerBullet, hunter) {
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
    this.enemyHelper.moveEnemies();
    this.playerHelper.movePlayer();
  }
}
