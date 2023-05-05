export default class Player extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, imageKey, bulletGroup) {
    super(scene, 0, 0, imageKey);
    this.setX(x);
    this.setY(y);
    this.setActive(true);
    this.setVisible(true);
    this.setDepth(2);
    this.setScale(.7);

    this.bulletGroup = bulletGroup;
    this.isVulnerable = true;

    scene.anims.create({
      key: 'player-invulnerable',
      frames: this.anims.generateFrameNumbers('duck', {
        start: 0,
        end: 1
      }),
      frameRate: 24,
      repeat: -1
    })

    scene.anims.create({
      key: 'player-vulnerable',
      frames: this.anims.generateFrameNumbers('duck', {
        start: 0,
        end: 0
      }),
      frameRate: 24,
      repeat: 0
    })
  }

  shoot() {
    const bullet = this.bulletGroup.get();
    if (bullet) {
      bullet.fire(this.x, this.y, this.angle, 0, 90, 600);
    }
  }

  hit(health) {
    if (this.isVulnerable) {
      this.isVulnerable = false;
      this.play('player-invulnerable')
      this.scene.time.addEvent({
        delay: 3000,
        loop: false,
        callback: () => {
          this.isVulnerable = true;
          this.play('player-vulnerable')
        },
      });
      return health.decreaseHealth();
    }
  }
}
