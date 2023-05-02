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

export default class Play extends Phaser.Scene {
  constructor() {
    super({
      key: "play",
    });
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();

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
    this.add.existing(this.player);

    this.path = new Phaser.Curves.Path();
    this.path.add(new Phaser.Curves.Ellipse(400, 300, 265));

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

    this.hunters = this.add.group({});
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

    this.physics.add.overlap(
      this.playerBulletGroup,
      this.shieldGroup,
      this.handleShieldCollision,
      null,
      this
    );
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
