import Player from "../Players/Player.js";
import {
  CHARACTER_CONFIG,
  registerAnimations,
} from "../Utils/AnimatorManager.js";
import HUD from "../UI/HUD.js";
import titleButton from "../UI/titleButton.js";
import { SocketClient } from "../services/SocketClient.js";
import { CommandProcessor } from "../commands/CommandProcessor.js";
import { MoveCommand } from "../commands/MoveCommand.js";
import { AbilityCommand } from "../commands/AbilityCommand.js";
import { TurnCommand } from "../commands/TurnCommand.js";

const tileSize = 150;

export default class level1SceneMulti extends Phaser.Scene {
  constructor() {
    super({ key: "level1SceneMulti" });
  }

  init(data) {
    this.player1Key = data.player1;
    this.player2Key = data.player2;
    this.roomId = data.roomId;
    this.yourId = data.yourId; // 'player1' | 'player2'
    this.myNickName = data.myNickName;
    this.opponentNickName = data.opponentNickName;
    console.log(
      `[level1Multi] init: soy ${this.yourId} (${this.myNickName}) vs ${this.opponentNickName}`,
    );
  }

  preload() {
    // === Idéntico al level1Scene ===
    this.load.image("level_1", "Assets/Img/escenarios/encimera.png");
    this.load.image("Encimeratx", "Assets/Img/escenarios/encimeratx2.png");
    this.load.image("Encimeratx1", "Assets/Img/escenarios/encimeratx3.png");
    this.load.image("void", "Assets/Img/escenarios/void.png");
    this.load.tilemapTiledJSON("tilemap", "Assets/maps/mapTile2.json");
    this.load.image("flash", "Assets/Img/flash.png");

    this.load.spritesheet(
      "PiernaWalk",
      "Assets/Img/personajes/Pierna/WalkRojo.png",
      { frameWidth: 500, frameHeight: 500 },
    );
    this.load.spritesheet(
      "PiernaHab",
      "Assets/Img/personajes/Pierna/abilityRed.png",
      { frameWidth: 500, frameHeight: 500 },
    );
    this.load.spritesheet(
      "PiernaRIP",
      "Assets/Img/personajes/Pierna/RojoFall.png",
      { frameWidth: 500, frameHeight: 500 },
    );
    this.load.spritesheet(
      "BrazoWalk",
      "Assets/Img/personajes/Brazo/WalkAzul.png",
      { frameWidth: 500, frameHeight: 500 },
    );
    this.load.spritesheet(
      "BrazoHab",
      "Assets/Img/personajes/Brazo/abilityBlue.png",
      { frameWidth: 500, frameHeight: 500 },
    );
    this.load.spritesheet(
      "BrazoRIP",
      "Assets/Img/personajes/Brazo/AzulFall.png",
      { frameWidth: 500, frameHeight: 500 },
    );
    this.load.spritesheet(
      "MewingWalk",
      "Assets/Img/personajes/Mewing/walkAmarillo.png",
      { frameWidth: 500, frameHeight: 500 },
    );
    this.load.spritesheet(
      "MewingHab",
      "Assets/Img/personajes/Mewing/abilityYellow.png",
      { frameWidth: 500, frameHeight: 500 },
    );
    this.load.spritesheet(
      "MewingRIP",
      "Assets/Img/personajes/Mewing/fallAmarillo.png",
      { frameWidth: 500, frameHeight: 500 },
    );
    this.load.spritesheet(
      "CoreWalk",
      "Assets/Img/personajes/Core/walkGreen.png",
      { frameWidth: 500, frameHeight: 500 },
    );
    this.load.spritesheet(
      "CoreHab",
      "Assets/Img/personajes/Core/abilityGreen.png",
      { frameWidth: 500, frameHeight: 500 },
    );
    this.load.spritesheet(
      "CoreRIP",
      "Assets/Img/personajes/Core/fallGreen.png",
      { frameWidth: 500, frameHeight: 500 },
    );

    this.load.image("VidasMarco", "Assets/Img/vidasMarco.png");
    this.load.audio("fallSound", "Assets/sounds/goofy-yell.mp3");
    this.load.audio(
      "ingameSound",
      "Assets/sounds/mondamusic-retro-arcade-game-music-512837.mp3",
    );
    this.load.audio("sfx_coreDay", "Assets/sounds/goku-teleport-sound.mp3");
    this.load.audio("sfx_legDay", "Assets/sounds/maro-jump-sound-effect_1.mp3");
    this.load.audio("sfx_mewingDay", "Assets/sounds/lobotomy-sound-effect.mp3");
    this.load.audio("sfx_armDay", "Assets/sounds/villager.mp3");
  }

  create() {
    this.elapsed = 0;
    this.add.image(0, 0, "level_1").setOrigin(0, 0);
    this.music = this.sound.add("ingameSound", { loop: true, volume: 0.4 });
    this.music.play();

    // === UI (igual que el original) ===
    const baseColor = CHARACTER_CONFIG[this.player1Key].color;
    const colorObj = Phaser.Display.Color.ValueToColor(baseColor);
    this.add
      .rectangle(0, 0, 950, 300, colorObj.darken(25).color)
      .setOrigin(0, 0);
    const baseColor2 = CHARACTER_CONFIG[this.player2Key].color;
    const colorObj2 = Phaser.Display.Color.ValueToColor(baseColor2);
    this.add
      .rectangle(1600, 0, 950, 300, colorObj2.darken(25).color)
      .setOrigin(0, 0);

    this.livesOne = this.add.text(30, 80, "3x", {
      fontFamily: "Bubble",
      fontSize: "120px",
      strokeThickness: 10,
      color: CHARACTER_CONFIG[this.player1Key].colorHex,
    });
    this.add.rectangle(185, 30, 95, 240, baseColor).setOrigin(0, 0);
    this.add.image(170, 10, "VidasMarco").setScale(0.56).setOrigin(0, 0);

    this.livesTwo = this.add.text(2400, 80, "x3", {
      fontFamily: "Bubble",
      fontSize: "120px",
      strokeThickness: 10,
      color: CHARACTER_CONFIG[this.player2Key].colorHex,
    });
    this.add.rectangle(2275, 30, 95, 240, baseColor2).setOrigin(0, 0);
    this.add.image(2260, 10, "VidasMarco").setScale(0.56).setOrigin(0, 0);

    this.hud = new HUD(this, this.player1Key, this.player2Key);

    this.timer = this.add.text(1080, 50, "120", {
      fontSize: "200px",
      strokeThickness: 20,
      color: "#000000",
    });

    // Botón pausa: en multi no pausamos (afectaría sólo a un cliente). Lo dejamos como "salir".
    const buttonSize = 200;
    const buttonH = 40;
    this.exitButton = new titleButton(
      this,
      buttonSize / 2 + buttonH,
      this.cameras.main.height - 150,
      "X",
      () => {
        this.music.stop();
        SocketClient.emit("leaveRoom");
        this.scene.start("accountRegScene");
      },
      buttonSize,
      buttonSize,
    );

    // === Tilemap (igual al original) ===
    this.map = this.make.tilemap({
      key: "tilemap",
      tileHeight: tileSize,
      tileWidth: tileSize,
    });
    const tilesetVoid = this.map.addTilesetImage("void", "void");
    this.map.createLayer("void", tilesetVoid, 0, 0);

    const gidToTexture = { 2: "Encimeratx", 3: "Encimeratx1" };
    this.fallingPlatforms = this.physics.add.staticGroup();
    const platformsObjects = this.map.getObjectLayer("topEncimera").objects;
    platformsObjects.forEach((obj) => {
      const textureKey = gidToTexture[obj.gid] || "Encimeratx";
      const x = obj.x + obj.width / 2;
      const y = obj.y - obj.height / 2;
      const platform = this.fallingPlatforms.create(x, y, textureKey);
      platform.body.setSize(obj.width, obj.height);
      platform.body.setOffset(0, 0);
      const fallenProp = obj.properties?.find((p) => p.name === "fallen");
      platform.fallen = fallenProp ? fallenProp.value : false;
      platform.isFalling = false;
      platform.fallDelay = 400;
      platform.dropDistance = 200;
    });

    const initialFallen = this.fallingPlatforms
      .getChildren()
      .map((p) => p.fallen);
    SocketClient.emit("gameSessionReady", { initialFallen });
    this.awaitingDamage = false;

    const posSpawnP1 = platformsObjects.find((obj) => obj.id === 10);
    const posSpawnP2 = platformsObjects.find((obj) => obj.id === 26);
    let tileSpawn1X = Math.floor(posSpawnP1.x / tileSize + 1);
    let tileSpawn1Y = Math.floor(posSpawnP1.y / tileSize);
    let tileSpawn2X = Math.floor(posSpawnP2.x / tileSize + 1);
    let tileSpawn2Y = Math.floor(posSpawnP2.y / tileSize);

    const p1AnimKeys = registerAnimations(this, this.player1Key);
    var config1 = {
      texture_key: CHARACTER_CONFIG[this.player1Key].texture,
      tileSize: tileSize,
      map: this.fallingPlatforms,
      lives: 3,
      animationKeys: p1AnimKeys,
    };
    this.player1 = new Player(
      this,
      "player1",
      this.player1Key,
      tileSpawn1X,
      tileSpawn1Y,
      config1,
    );

    const p2AnimKeys = registerAnimations(this, this.player2Key);
    var config2 = {
      texture_key: CHARACTER_CONFIG[this.player2Key].texture,
      tileSize: tileSize,
      map: this.fallingPlatforms,
      lives: 3,
      animationKeys: p2AnimKeys,
    };
    this.player2 = new Player(
      this,
      "player2",
      this.player2Key,
      tileSpawn2X,
      tileSpawn2Y,
      config2,
    );

    this.players = new Map();
    this.players.set("player1", this.player1);
    this.players.set("player2", this.player2);

    this.scoreLivesOne();
    this.scoreLivesTwo();

    // === Command Processor ===
    this.commandProcessor = new CommandProcessor();
    this.commandProcessor.setPlayers(this.players);
    this.commandProcessor.setGameScene(this);
    // === CAMBIO IMPORTANTE: input local ===
    // El usuario local SIEMPRE usa WASD+F+G, independientemente de si es player1 o player2.
    // Las flechas del original (player2) ya no se usan aquí — el rival se mueve por sockets.
    this.localKeys = {
      up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      quickAbility: this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.F,
      ),
      slowAbility: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G),
    };

    // === Socket listeners ===
    this.handleApplyCommand = ({ playerId, command }) => {
      console.log("[level1Multi] applyCommand:", playerId, command);
      this.commandProcessor.processRemote(playerId, command);
    };

    this.handleOpponentLeft = (data) => {
      console.log("[level1Multi] opponentLeft:", data);
      this.music.stop();
      this.showOpponentLeftMessage();
    };

    this.handleTileFalling = ({ tileIndex }) => {
      console.log(`[level1Multi] tileFalling: ${tileIndex}`);
      this.animateTileFall(tileIndex);
    };

    this.handlePlayerDamaged = ({ playerId, safeTileIndex }) => {
      console.log(
        `[level1Multi] playerDamaged: ${playerId} → tile ${safeTileIndex}`,
      );
      const player = this.players.get(playerId);
      if (!player) return;
      const safeTile = this.fallingPlatforms.getChildren()[safeTileIndex];
      if (!safeTile) return;
      player.receiveDamage(safeTile.x, safeTile.y);

      // Si el dañado soy yo, desbloquear el envío
      if (playerId === this.yourId) this.awaitingDamage = false;

      // Actualizar vidas en UI
      if (playerId === "player1") this.scoreLivesOne();
      if (playerId === "player2") this.scoreLivesTwo();
    };

    this.handleGameOver = (data) => {
      console.log("[level1Multi] gameOver:", data);
      this.music.stop();

      this.scene.start("endScene", {
        winner: data.winner, // 'player1' | 'player2' | 'tie'
        elapsedSecs: Math.floor(data.elapsedMs / 1000),
        player1Char: this.player1Key,
        player2Char: this.player2Key,
        player1Nick: this.players.get("player1")?.nickName || this.myNickName,
        player2Nick:
          this.players.get("player2")?.nickName || this.opponentNickName,
        isMultiplayer: true,
        yourId: this.yourId,
      });
    };
    this.handleGameSessionStarted = (data) => {
      console.log("[level1Multi] gameSessionStarted:", data);
      this.gameStartedAt = Date.now();
      this.gameDuration = data.duration;
    };

    SocketClient.on("gameSessionStarted", this.handleGameSessionStarted);

    SocketClient.on("gameOver", this.handleGameOver);

    SocketClient.on("tileFalling", this.handleTileFalling);
    SocketClient.on("playerDamaged", this.handlePlayerDamaged);

    SocketClient.on("applyCommand", this.handleApplyCommand);
    SocketClient.on("opponentLeft", this.handleOpponentLeft);

    this.events.on("shutdown", () => {
      SocketClient.off("applyCommand", this.handleApplyCommand);
      SocketClient.off("opponentLeft", this.handleOpponentLeft);
      SocketClient.off("tileFalling", this.handleTileFalling);
      SocketClient.off("playerDamaged", this.handlePlayerDamaged);
      SocketClient.off("gameSessionStarted", this.handleGameSessionStarted);
      SocketClient.off("gameOver", this.handleGameOver);

      // Limpiar referencias a players para que el GC pueda recogerlos
      if (this.players) this.players.clear();
      this.player1 = null;
      this.player2 = null;
      this.commandProcessor = null;
      this.pendingDestroys = null;

      // Resetear estado de juego
      this.gameStartedAt = null;
      this.gameDuration = null;
      this.awaitingDamage = false;

      // Limpieza de input
      if (this.input?.keyboard) {
        this.input.keyboard.removeAllKeys();
        this.input.keyboard.clearCaptures();
        this.input.keyboard.removeAllListeners();
        this.input.keyboard.resetKeys();
      }
    });
  }

  animateTileFall(tileIndex) {
    const platform = this.fallingPlatforms.getChildren()[tileIndex];
    if (!platform || platform.fallen || platform.isFalling) return;

    platform.isFalling = true;
    const originalX = platform.x;

    this.tweens.add({
      targets: platform,
      x: originalX + 4,
      duration: 50,
      yoyo: true,
      repeat: 14,
      onComplete: () => {
        platform.x = originalX;
        this.tweens.add({
          targets: platform,
          y: platform.y + 150,
          alpha: 0,
          duration: 300,
          y: platform.y,
          onComplete: () => {
            platform.isFalling = false;
            platform.fallen = true;
            platform.setVisible(false);
            platform.body.checkCollision.none = true;
          },
        });
      },
    });
  }

  scoreLivesOne() {
    const playerOne = this.players.get("player1");
    this.livesOne.setText(playerOne.lives.toString() + "x");
  }

  scoreLivesTwo() {
    const playerTwo = this.players.get("player2");
    this.livesTwo.setText("x" + playerTwo.lives.toString());
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

  update(time, delta) {
    // === Mantener this.elapsed actualizado en tiempo real ===
    // Lo usan los cooldowns de habilidades (Abilities.js) y pendingDestroys.
    if (this.gameStartedAt) {
      this.elapsed = Date.now() - this.gameStartedAt;
    } else {
      this.elapsed = 0;
    }

    // === Timer en pantalla (basado en tiempo real, no en delta) ===
    if (this.gameStartedAt) {
      const remainingMs = Math.max(0, this.gameDuration - this.elapsed);
      this.timer.setText(
        `${Math.ceil(remainingMs / 1000)
          .toString()
          .padStart(3, "0")}`,
      );
      this.hud.update(this.player1, this.player2, this.elapsed);
    } else {
      // Aún no llegó gameSessionStarted del server
      this.timer.setText("120");
    }

    // === Limpieza de sprites pendientes (RIP, flash de mewing, etc.) ===
    if (this.pendingDestroys) {
      this.pendingDestroys = this.pendingDestroys.filter((sprite) => {
        if (this.elapsed >= sprite.destroyAt) {
          sprite.destroy();
          return false;
        }
        return true;
      });
    }

    // === Input local + detección de tile mala (sólo el jugador local) ===
    const myPlayer = this.players.get(this.yourId);
    if (!myPlayer || !myPlayer.isAlive) return;

    const up = Phaser.Input.Keyboard.JustDown(this.localKeys.up);
    const down = Phaser.Input.Keyboard.JustDown(this.localKeys.down);
    const left = Phaser.Input.Keyboard.JustDown(this.localKeys.left);
    const right = Phaser.Input.Keyboard.JustDown(this.localKeys.right);
    const qab = Phaser.Input.Keyboard.JustDown(this.localKeys.quickAbility);
    const sab = Phaser.Input.Keyboard.JustDown(this.localKeys.slowAbility);

    const dir = up
      ? "up"
      : down
        ? "down"
        : left
          ? "left"
          : right
            ? "right"
            : null;

    if (dir) {
      const MOVE_COOLDOWN = 110;
      const enough =
        !this.lastMoveTime || Date.now() - this.lastMoveTime >= MOVE_COOLDOWN;

      if (enough) {
        this.lastMoveTime = Date.now();
        this.commandProcessor.process(new MoveCommand(myPlayer, dir, this));
      } else if (myPlayer.direction !== dir) {
        this.commandProcessor.process(new TurnCommand(myPlayer, dir));
      }
    }

    // Comprobar si el local está en una tile caída
    if (myPlayer.isAlive && !this.awaitingDamage) {
      const children = this.fallingPlatforms.getChildren();
      const badTileIndex = children.findIndex(
        (tile) =>
          tile.fallen &&
          Phaser.Math.Within(myPlayer.x, tile.x, myPlayer.tileSize / 2) &&
          Phaser.Math.Within(myPlayer.y, tile.y, myPlayer.tileSize / 2),
      );

      if (badTileIndex !== -1) {
        this.awaitingDamage = true;
        SocketClient.emit("playerHitByTile", { tileIndex: badTileIndex });
      }
    }

    // Habilidades (después del movimiento, pasando scene)
    if (qab)
      this.commandProcessor.process(
        new AbilityCommand(myPlayer, "quick", this),
      );
    if (sab)
      this.commandProcessor.process(new AbilityCommand(myPlayer, "slow", this));
  }
}
