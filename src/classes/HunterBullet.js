import BaseBullet from "./BaseBullet";

export default class HunterBullet extends BaseBullet {
  constructor(scene) {
    super(scene, "hunter_bullet");
    this.setScale(0.03);
  }
}