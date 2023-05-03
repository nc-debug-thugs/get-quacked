import Phaser from "phaser";
import Player from "../classes/Player";
import BaseBullet from "../classes/BaseBullet";
import Hunter from "../classes/Hunter";
import Health from "../classes/Health";
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

export default class Play extends Phaser.Scene {
  constructor() {
    super({
      key: "play",
    });
  }

  create() {
    this.health = new Health(this, 3);

    this.cursors = this.input.keyboard.createCursorKeys();

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

    this.player = new Player(this, 400, 300, "duck", this.playerBulletGroup);
    this.add.existing(this.player);
    this.playerGroup = this.physics.add.group(this.player);

    this.path = new Phaser.Curves.Path();
    this.path.add(new Phaser.Curves.Ellipse(400, 300, 265));

    this.hunters = this.physics.add.group({});
    this.shieldCircle = new Phaser.Geom.Circle(400, 300, 100);

    this.shieldGroup = this.physics.add.group({
      key: "bullet",
      repeat: 5,
      classType: Shields,
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

    this.hunters.getChildren().forEach((hunter, i, hunters) => {
      this.add.existing(hunter);
      hunter.startFollow(
        {
          duration: 9000,
          repeat: -1,
          rotateToPath: true,
        },
        i * 0.05
      );
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
    this.score += 100;
    this.scoreText.setText(`Score: ${this.score}`);
    playerBullet.destroy();
    this.add.sprite(hunter.x, hunter.y, "boom").play("explode");
    hunter.destroy();
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

    //if disctance between player and enemy less than 300, hunter fire bullet towards the player
    this.hunters.getChildren().forEach((hunter) => {
      if (
        Phaser.Math.Distance.Between(
          hunter.x,
          hunter.y,
          this.player.x,
          this.player.y
        ) < 300
      ) {
        hunter.shoot(this.player, this.hunterBulletGroup);
      }
    });
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
