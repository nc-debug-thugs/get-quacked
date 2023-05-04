import Phaser from "phaser";
import Player from "../classes/Player";
import BaseBullet from "../classes/BaseBullet";
import Hunter from "../classes/Hunter";
import Shields from "../classes/Shields";

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

    let shootSign = this.add.image(145, 560, "shoot");

    shootSign.setScale(3);

    let startButton = this.add.image(
      this.cameras.main.width / 2,
      this.cameras.main.height / 4,
      "start"
    );
    startButton.setScale(0.5);
    startButton.setInteractive();
    startButton.on("pointerover", () => {
      this.tweens.add({
        targets: startButton,
        scale: { value: 0.6, duration: 100, yoyo: true, ease: "Power1" },
      });
    });
    startButton.on("pointerdown", () => {
      this.scene.start("play");
    });

    this.cursors = this.input.keyboard.createCursorKeys();

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

    this.player = new Player(this, 400, 300, "duck", this.playerBulletGroup);
    this.playerGroup = this.physics.add.group(this.player);
    this.player.body.setSize(450, 450);
    this.add.existing(this.player);

    this.path = new Phaser.Curves.Path();
    this.path.add(new Phaser.Curves.Ellipse(400, 300, 230));

    this.hunters = this.physics.add.group({});
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

    this.hunters = this.physics.add.group({});
    this.hunter1 = new Hunter(this, this.path, 0, 0);
    this.hunter2 = new Hunter(this, this.path, 0, 0);
    this.hunter3 = new Hunter(this, this.path, 0, 0);

    this.hunters.addMultiple([this.hunter1, this.hunter2, this.hunter3]);

    this.hunterShootTimers = [];

    this.hunters.getChildren().forEach((hunter, i, hunters) => {
      this.add.existing(hunter);
      hunter.body.setSize(450, 450);
      hunter.startFollow(
        {
          duration: 9000,
          repeat: -1,
          rotateToPath: true,
        },
        i * 0.05
      );

      // Random hunter selected to shoot at random time
      const timer = this.time.addEvent({
        delay: Phaser.Math.Between(1000, 10000),
        loop: true,
        callback: () => {
          if (hunter.isAlive) {
            hunter.shoot(this.player, this.hunterBulletGroup);
            timer.delay = Phaser.Math.Between(1000, 5000);
          }
        },
        callbackScope: this,
      });
      this.hunterShootTimers.push(timer);
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
  }

  handleEnemyHit(playerBullet, hunter) {
    playerBullet.destroy();
    this.add.sprite(hunter.x, hunter.y, "boom").play("explode");
    hunter.isAlive = false;
    hunter.destroy();
    this.hunterShootTimers.forEach((timer) => {
      if (timer.args[0] === hunter) {
        timer.destroy();
      }
    });
  }

  handleShieldCollision(bullet, shield) {
    bullet.destroy();
    shield.hit();
  }

  update() {
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
