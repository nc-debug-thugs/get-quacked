import Phaser from "phaser";
import Player from "../classes/Player";
import BaseBullet from "../classes/BaseBullet";
import Hunter from "../classes/Hunter";

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

    this.hunters = this.add.group({});
    this.hunter1 = new Hunter(this, this.path, 0, 0);
    this.hunter2 = new Hunter(this, this.path, 0, 0);
    this.hunter3 = new Hunter(this, this.path, 0, 0);

    this.hunters.addMultiple([this.hunter1, this.hunter2, this.hunter3]);

    console.log(this.hunters);

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

    // this.hunter = new Hunter(this, this.path, 0, 0);
    // this.add.existing(this.hunter);
    // this.hunters.startFollow({
    //   duration: 9000,
    //   repeat: -1,
    //   rotateToPath: true,
    // });
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
  }
}
