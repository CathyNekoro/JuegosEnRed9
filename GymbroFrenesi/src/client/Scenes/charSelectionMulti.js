import titleButton from "../UI/titleButton.js";
import charSelectButton from "../UI/charSelectButton.js";
import {
  CHARACTER_CONFIG,
  registerAnimations,
} from "../Utils/AnimatorManager.js";
import { SocketClient } from "../services/SocketClient.js";

const OFFSET_X = 200;

export default class charSelectionMulti extends Phaser.Scene {
  constructor() {
    super({ key: "charSelectionMulti" });
  }

  init(data) {
    console.log("[charSelectionMulti] init data recibida:", data);
    this.roomId = data.roomId;
    this.yourId = data.yourId; // 'player1' | 'player2'
    this.players = data.players; // { player1: {nickName}, player2: {nickName} }
    this.currentTurn = data.currentTurn; // 'player1' | 'player2'
    this.myNickName = this.players[this.yourId].nickName;
    this.opponentId = this.yourId === "player1" ? "player2" : "player1";
    this.opponentNickName = this.players[this.opponentId].nickName;
    this.selected = { player1: null, player2: null };
  }

  preload() {
    this.load.spritesheet(
      "pierna",
      "../Assets/Img/personajes/legDaySelec.png",
      { frameWidth: 444, frameHeight: 1140 },
    );
    this.load.spritesheet("brazo", "../Assets/Img/personajes/armDaySelec.png", {
      frameWidth: 444,
      frameHeight: 1140,
    });
    this.load.spritesheet("core", "../Assets/Img/personajes/coreDaySelec.png", {
      frameWidth: 444,
      frameHeight: 1140,
    });
    this.load.spritesheet(
      "mewing",
      "../Assets/Img/personajes/mewingDaySelec.png",
      { frameWidth: 444, frameHeight: 1140 },
    );
    document.fonts.load('1em "Bubble"');
  }

  create() {
    this.add
      .rectangle(
        0,
        0,
        this.cameras.main.width,
        this.cameras.main.width,
        0x000000,
      )
      .setOrigin(0, 0);

    const buttonSize = 100;
    const buttonMargin = 20;

    // Texto de turno (lo rellena updateTurnUI)
    this.turnText = this.add.text(200, 110, "", {
      fontFamily: "Bubble",
      fontSize: "70px",
    });

    // Botón salir: emite leaveRoom y vuelve al menú
    this.exitButton = new titleButton(
      this,
      buttonSize / 2 + buttonMargin,
      buttonSize / 2 + buttonMargin,
      "<",
      () => {
        SocketClient.emit("leaveRoom");
        this.scene.start("accountRegScene");
      },
      buttonSize,
      buttonSize,
    );

    // Botones de personaje
    this.buttons = [];
    this.buttons.push(this.createCharButton(325 + OFFSET_X, 805, "legDay"));
    this.buttons.push(this.createCharButton(815 + OFFSET_X, 805, "armDay"));
    this.buttons.push(this.createCharButton(1292 + OFFSET_X, 805, "coreDay"));
    this.buttons.push(this.createCharButton(1781 + OFFSET_X, 805, "mewingDay"));

    // Animaciones de preview
    const charKeys = ["legDay", "armDay", "coreDay", "mewingDay"];
    this.selectionAnimKeys = {};
    charKeys.forEach((key) => {
      this.selectionAnimKeys[key] = registerAnimations(
        this,
        key,
        "selectionAnims",
      );
    });

    // Preview sprites (mismas coords que el original)
    this.previewSprite1 = this.add.sprite(325 + OFFSET_X, 805, "pierna");
    this.buttons[0].on("pointerover", () => {
      this.previewSprite1.setVisible(true);
      this.previewSprite1.play(this.selectionAnimKeys["legDay"].preview);
    });

    this.previewSprite2 = this.add.sprite(815 + OFFSET_X, 805, "brazo");
    this.buttons[1].on("pointerover", () => {
      this.previewSprite2.setVisible(true);
      this.previewSprite2.play(this.selectionAnimKeys["armDay"].preview);
    });

    this.previewSprite3 = this.add.sprite(1292 + OFFSET_X, 805, "core");
    this.buttons[2].on("pointerover", () => {
      this.previewSprite3.setVisible(true);
      this.previewSprite3.play(this.selectionAnimKeys["coreDay"].preview);
    });

    this.previewSprite4 = this.add.sprite(1781 + OFFSET_X, 805, "mewing");
    this.buttons[3].on("pointerover", () => {
      this.previewSprite4.setVisible(true);
      this.previewSprite4.play(this.selectionAnimKeys["mewingDay"].preview);
    });

    // Mapa char: previewSprite para poder tintarlo cuando se bloquea
    this.previewByChar = {
      legDay: this.previewSprite1,
      armDay: this.previewSprite2,
      coreDay: this.previewSprite3,
      mewingDay: this.previewSprite4,
    };

    // Estado inicial de UI según turno
    this.updateTurnUI();

    // Listeners de socket
    this.handleSelectionUpdated = (data) => {
      console.log("[charSelectionMulti] selectionUpdated:", data);
      this.selected = data.selections;
      this.currentTurn = data.currentTurn;
      this.lockChosenButtons();
      this.updateTurnUI();
    };

    this.handleGameStart = (data) => {
      console.log("[charSelectionMulti] gameStart:", data);
      this.scene.start("level1SceneMulti", {
        player1: data.players.player1.character,
        player2: data.players.player2.character,
        player1Nick: data.players.player1.nickName,   
        player2Nick: data.players.player2.nickName,
        roomId: data.roomId,
        yourId: data.yourId,
      });
    };

    this.handleSelectionRejected = (data) => {
      console.warn("[charSelectionMulti] selectionRejected:", data.reason);
    };

    this.handleOpponentLeft = (data) => {
      console.log("[charSelectionMulti] opponentLeft:", data);
      this.showOpponentLeftMessage();
    };

    SocketClient.on("selectionUpdated", this.handleSelectionUpdated);
    SocketClient.on("gameStart", this.handleGameStart);
    SocketClient.on("selectionRejected", this.handleSelectionRejected);
    SocketClient.on("opponentLeft", this.handleOpponentLeft);

    this.events.on("shutdown", () => {
      SocketClient.off("selectionUpdated", this.handleSelectionUpdated);
      SocketClient.off("gameStart", this.handleGameStart);
      SocketClient.off("selectionRejected", this.handleSelectionRejected);
      SocketClient.off("opponentLeft", this.handleOpponentLeft);
      this.buttons = null;
      this.previewByChar = null;
      this.selected = { player1: null, player2: null };
      this.sound.stopByKey("selecMusic");
    });
  }

  createCharButton(x, y, charKey) {
    const btn = new charSelectButton(this, x, y, "", () => {
      this.onCharClicked(btn);
    });
    btn.charKey = charKey;
    btn.locked = false;
    return btn;
  }

  onCharClicked(btn) {
    if (btn.locked) {
      console.log("[client] botón locked, return");
      return;
    }
    if (this.currentTurn !== this.yourId) {
      console.log("[client] no es tu turno, return");
      return;
    } // no es tu turno
    console.log("[client] emitiendo selectCharacter:", btn.charKey);
    // Sólo emitimos al server. El estado local se actualiza con selectionUpdated/gameStart.
    SocketClient.emit("selectCharacter", { character: btn.charKey });
  }

  updateTurnUI() {
    const isMyTurn = this.currentTurn === this.yourId;
    console.log(
      "[charSelectionMulti] this.players:",
      JSON.stringify(this.players),
    );
    console.log("[charSelectionMulti] this.currentTurn:", this.currentTurn);
    console.log("[charSelectionMulti] this.yourId:", this.yourId);
    const currentNick = this.players[this.currentTurn].nickName;

    if (isMyTurn) {
      this.turnText.setText("Tu turno: elige personaje");
    } else {
      this.turnText.setText(`Esperando a ${currentNick}...`);
    }

    // Habilitar/deshabilitar interactividad
    this.buttons.forEach((btn) => {
      if (btn.locked) return;
      if (isMyTurn) btn.setInteractive();
      else btn.disableInteractive();
    });
  }

  lockChosenButtons() {
    const chosenChars = [this.selected.player1, this.selected.player2].filter(
      (c) => c !== null,
    );
    this.buttons.forEach((btn) => {
      if (chosenChars.includes(btn.charKey) && !btn.locked) {
        btn.locked = true;
        btn.disableInteractive();
        const preview = this.previewByChar[btn.charKey];
        if (preview) preview.setTint(0x6e6e6e);
      }
    });
  }

  showOpponentLeftMessage() {
    const cx = this.cameras.main.width / 2;
    const cy = this.cameras.main.height / 2;
    this.add
      .rectangle(
        0,
        0,
        this.cameras.main.width,
        this.cameras.main.height,
        0x000000,
        0.85,
      )
      .setOrigin(0, 0);
    this.add
      .text(cx, cy - 50, "Tu rival ha abandonado la partida", {
        fontFamily: "Bubble",
        fontSize: "70px",
        color: "#ffffff",
      })
      .setOrigin(0.5);
    this.add
      .text(cx, cy + 50, "Volviendo al menú...", {
        fontFamily: "Bubble",
        fontSize: "50px",
        color: "#cccccc",
      })
      .setOrigin(0.5);

    this.time.delayedCall(3000, () => {
      this.scene.start("accountRegScene");
    });
  }
}
