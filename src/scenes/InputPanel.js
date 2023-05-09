import Phaser from "phaser";
import { score } from "./PrePlay";
import { highscores, addScore } from '../firebase';

const tint = [0xff8200, 0xff8200, 0xffff00, 0xffff00, 0x00ff00, 0x00bfff]
const rank = ['1ST', '2ND', '3RD', '4TH', '5TH', '6TH', 'OFF']

export class InputPanel extends Phaser.Scene {
  constructor() {
    super({ key: "InputPanel", active: false });

    this.chars = [
      ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
      ["K", "L", "M", "N", "O", "P", "Q", "R", "S", "T"],
      ["U", "V", "W", "X", "Y", "Z", ".", "-", "<", ">"],
    ];

    this.cursor = new Phaser.Math.Vector2();

    this.text;
    this.block;

    this.initials = "";
    this.charLimit = 3;
  }

  create() {

    let text = this.add.bitmapText(
      130,
      50,
      "arcade",
      "ABCDEFGHIJ\n\nKLMNOPQRST\n\nUVWXYZ.-"
    );

    text.setLetterSpacing(20);
    text.setInteractive();

    this.add.image(text.x + 430, text.y + 148, "rub");
    this.add.image(text.x + 482, text.y + 148, "end");

    this.block = this.add.image(text.x - 10, text.y - 2, "block").setOrigin(0);

    this.text = text;

    this.input.keyboard.on("keyup_LEFT", this.moveLeft, this);
    this.input.keyboard.on("keyup_RIGHT", this.moveRight, this);
    this.input.keyboard.on("keyup_UP", this.moveUp, this);
    this.input.keyboard.on("keyup_DOWN", this.moveDown, this);
    this.input.keyboard.on("keyup_ENTER", this.pressKey, this);
    this.input.keyboard.on("keyup_SPACE", this.pressKey, this);
    this.input.keyboard.on("keyup", this.anyKey, this);

    text.on("pointermove", this.moveBlock, this);
    text.on("pointerup", this.pressKey, this);

    this.tweens.add({
      targets: this.block,
      alpha: 0.2,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
      duration: 350,
    });
  }

  moveBlock(pointer, x, y) {
    let cx = Phaser.Math.Snap.Floor(x, 52, 0, true);
    let cy = Phaser.Math.Snap.Floor(y, 64, 0, true);
    let char = this.chars[cy][cx];

    this.cursor.set(cx, cy);

    this.block.x = this.text.x - 10 + cx * 52;
    this.block.y = this.text.y - 2 + cy * 64;
  }

  moveLeft() {
    if (this.cursor.x > 0) {
      this.cursor.x--;
      this.block.x -= 52;
    } else {
      this.cursor.x = 9;
      this.block.x += 52 * 9;
    }
  }

  moveRight() {
    if (this.cursor.x < 9) {
      this.cursor.x++;
      this.block.x += 52;
    } else {
      this.cursor.x = 0;
      this.block.x -= 52 * 9;
    }
  }

  moveUp() {
    if (this.cursor.y > 0) {
      this.cursor.y--;
      this.block.y -= 64;
    } else {
      this.cursor.y = 2;
      this.block.y += 64 * 2;
    }
  }

  moveDown() {
    if (this.cursor.y < 2) {
      this.cursor.y++;
      this.block.y += 64;
    } else {
      this.cursor.y = 0;
      this.block.y -= 64 * 2;
    }
  }

  anyKey(event) {
    //  Only allow A-Z . and -

    let code = event.keyCode;

    if (code === Phaser.Input.Keyboard.KeyCodes.PERIOD) {
      this.cursor.set(6, 2);
      this.pressKey();
    } else if (code === Phaser.Input.Keyboard.KeyCodes.MINUS) {
      this.cursor.set(7, 2);
      this.pressKey();
    } else if (
      code === Phaser.Input.Keyboard.KeyCodes.BACKSPACE ||
      code === Phaser.Input.Keyboard.KeyCodes.DELETE
    ) {
      this.cursor.set(8, 2);
      this.pressKey();
    } else if (code === Phaser.Input.Keyboard.KeyCodes.ENTER) {
      this.cursor.set(9, 2);
      this.pressKey();
    } else if (
      code >= Phaser.Input.Keyboard.KeyCodes.A &&
      code <= Phaser.Input.Keyboard.KeyCodes.Z
    ) {
      code -= 65;

      let y = Math.floor(code / 10);
      let x = code - y * 10;

      this.cursor.set(x, y);
      this.pressKey();
    }
  }

  pressKey() {
    let x = this.cursor.x;
    let y = this.cursor.y;
    let nameLength = this.initials.length;

    this.block.x = this.text.x - 10 + x * 52;
    this.block.y = this.text.y - 2 + y * 64;

    if (x === 9 && y === 2 && nameLength > 0) {
      //  Submit
      this.events.emit("submitName", this.initials);
    } else if (x === 8 && y === 2 && nameLength > 0) {
      //  Rub
      this.initials = this.initials.substr(0, nameLength - 1);
      this.events.emit("updateName", this.initials);
    } else if (this.initials.length < this.charLimit) {
      //  Add
      this.initials = this.initials.concat(this.chars[y][x]);
      this.events.emit("updateName", this.initials);
    }
  }
}

export class Highscore extends Phaser.Scene {
  constructor() {
    super({ key: "Highscore", active: false });

    this.playerText;
  }

  preload() {
    // this.load.image("block", "../assets/images/block.png");
    // this.load.image("rub", "../assets/images/rub.png");
    // this.load.image("end", "../assets/images/end.png");

    // this.load.bitmapFont(
    //   "arcade",
    //   "../assets/images/arcade.png",
    //   "../assets/images/arcade.xml"
    // );
  }

  create() {
    this.newHighscores = [...highscores]
    this.playerInd = highscores.findIndex((s) => {return s.score < score})
    if (this.playerInd === -1) this.playerInd = 6
    this.add
      .bitmapText(100, 260, "arcade", "RANK  SCORE   NAME")
      .setTint(0xff00ff);
    this.add.bitmapText(100, 310, "arcade", `${rank[this.playerInd]}   ${score}`).setTint(0xff0000);

    this.playerText = this.add
      .bitmapText(580, 310, "arcade", "")
      .setTint(0xff0000);

    //  Do this, otherwise this Scene will steal all keyboard input
    this.input.keyboard.enabled = false;

    this.scene.launch("InputPanel");

    let panel = this.scene.get("InputPanel");

    //  Listen to events from the Input Panel scene
    panel.events.on("updateName", this.updateName, this);
    panel.events.on("submitName", this.submitName, this);
  }

  submitName() {
    this.scene.stop("InputPanel");

    addScore(score, this.playerName)

    let loop = false
    let i = 0
    let j = 0
    if (this.newHighscores.length > 0) loop = true
    while (loop) {
      if (this.playerInd !== i) {
        const score = this.newHighscores[i]
        this.add.bitmapText(
          100,
          360 + j * 50,
          'arcade',
          `${rank[i]}   ${score.score}`
        ).setTint(tint[j])
        this.add.bitmapText(
          580,
          360 + j * 50,
          'arcade',
          `${score.name}`
        ).setTint(tint[j])
        j += 1
      }
      i += 1
      if (i >= this.newHighscores.length) loop = false
    }

    this.time.delayedCall(5000, () => {
      this.scene.start('start')
    })

    // this.newHighscores.forEach((score, i) => {
    //   // if (this.playerInd !== i) {
    //     this.add.bitmapText(
    //       100,
    //       360 + i * 50,
    //       'arcade',
    //       `${rank[i]}   ${score.score}`
    //     ).setTint(tint[i])
    //     this.add.bitmapText(
    //       580,
    //       360 + i * 50,
    //       'arcade',
    //       `${score.name}`
    //     ).setTint(tint[i])
    //   // }
    // })

  //   this.add
  //     .bitmapText(
  //       100,
  //       360,
  //       "arcade",
  //       `1ST   ${highScores.place1.score}    ${highScores.place1.initials}`
  //     )
  //     .setTint(0xff8200);
  //   this.add
  //     .bitmapText(
  //       100,
  //       410,
  //       "arcade",
  //       `2ND   ${highScores.place2.score}    ${highScores.place2.initials}`
  //     )
  //     .setTint(0xffff00);
  //   this.add
  //     .bitmapText(
  //       100,
  //       460,
  //       "arcade",
  //       `3RD   ${highScores.place3.score}    ${highScores.place3.initials}`
  //     )
  //     .setTint(0x00ff00);
  //   this.add
  //     .bitmapText(
  //       100,
  //       510,
  //       "arcade",
  //       `4TH   ${highScores.place3.score}    ${highScores.place3.initials}`
  //     )
  //     .setTint(0x00bfff);
  // 
}

  updateName(name) {
    this.playerText.setText(name);
    this.playerName = name
  }
}
