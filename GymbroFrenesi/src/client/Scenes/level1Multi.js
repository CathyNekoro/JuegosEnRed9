import Player from "../Players/Player.js"
import { CHARACTER_CONFIG, registerAnimations } from "../Utils/AnimatorManager.js";
import HUD from "../UI/HUD.js";
import titleButton from "../UI/titleButton.js";
import { SocketClient } from "../services/SocketClient.js";
import { CommandProcessor } from "../commands/CommandProcessor.js";
import { MoveCommand } from "../commands/MoveCommand.js";
import { AbilityCommand } from "../commands/AbilityCommand.js";

const tileSize = 150;

export default class level1SceneMulti extends Phaser.Scene 
{
    constructor()
    {
        super({key: "level1SceneMulti"})    
    }

    init(data) {
        this.player1Key = data.player1;
        this.player2Key = data.player2;
        this.roomId = data.roomId;
        this.yourId = data.yourId;                  // 'player1' | 'player2'
        this.myNickName = data.myNickName;
        this.opponentNickName = data.opponentNickName;
        console.log(`[level1Multi] init: soy ${this.yourId} (${this.myNickName}) vs ${this.opponentNickName}`);
    }

    preload()
    {
        // === Idéntico al level1Scene ===
        this.load.image("level_1", "Assets/Img/escenarios/encimera.png");
        this.load.image("Encimeratx", "Assets/Img/escenarios/encimeratx2.png");
        this.load.image("Encimeratx1", "Assets/Img/escenarios/encimeratx3.png");
        this.load.image("void", "Assets/Img/escenarios/void.png")
        this.load.tilemapTiledJSON("tilemap", "Assets/maps/mapTile2.json");
        this.load.image("flash", "Assets/Img/flash.png");

        this.load.spritesheet('PiernaWalk', 'Assets/Img/personajes/Pierna/WalkRojo.png', {frameWidth: 500, frameHeight: 500});
        this.load.spritesheet('PiernaHab', 'Assets/Img/personajes/Pierna/abilityRed.png', {frameWidth: 500, frameHeight: 500});
        this.load.spritesheet('PiernaRIP', 'Assets/Img/personajes/Pierna/RojoFall.png', {frameWidth: 500, frameHeight: 500});
        this.load.spritesheet('BrazoWalk', 'Assets/Img/personajes/Brazo/WalkAzul.png', {frameWidth: 500, frameHeight: 500});
        this.load.spritesheet('BrazoHab', 'Assets/Img/personajes/Brazo/abilityBlue.png', {frameWidth: 500, frameHeight: 500});
        this.load.spritesheet('BrazoRIP', 'Assets/Img/personajes/Brazo/AzulFall.png', {frameWidth: 500, frameHeight: 500});
        this.load.spritesheet('MewingWalk', 'Assets/Img/personajes/Mewing/walkAmarillo.png', {frameWidth: 500, frameHeight: 500});
        this.load.spritesheet('MewingHab', 'Assets/Img/personajes/Mewing/abilityYellow.png', {frameWidth: 500, frameHeight: 500});
        this.load.spritesheet('MewingRIP', 'Assets/Img/personajes/Mewing/fallAmarillo.png', {frameWidth: 500, frameHeight: 500});
        this.load.spritesheet('CoreWalk', 'Assets/Img/personajes/Core/walkGreen.png', {frameWidth: 500, frameHeight: 500});
        this.load.spritesheet('CoreHab', 'Assets/Img/personajes/Core/abilityGreen.png', {frameWidth: 500, frameHeight: 500});
        this.load.spritesheet('CoreRIP', 'Assets/Img/personajes/Core/fallGreen.png', {frameWidth: 500, frameHeight: 500});

        this.load.image('VidasMarco', 'Assets/Img/vidasMarco.png');
        this.load.audio('fallSound', 'Assets/sounds/goofy-yell.mp3');
        this.load.audio('ingameSound', 'Assets/sounds/mondamusic-retro-arcade-game-music-512837.mp3');
        this.load.audio('sfx_coreDay', 'Assets/sounds/goku-teleport-sound.mp3')
        this.load.audio('sfx_legDay', 'Assets/sounds/maro-jump-sound-effect_1.mp3')
        this.load.audio('sfx_mewingDay', 'Assets/sounds/lobotomy-sound-effect.mp3')
        this.load.audio('sfx_armDay', 'Assets/sounds/villager.mp3')
    }

    create()
    {  
        this.elapsed = 0;  
        this.add.image(0, 0, "level_1").setOrigin(0, 0);
        this.music = this.sound.add('ingameSound', { loop: true, volume: 0.4 });
        this.music.play();

        // === UI (igual que el original) ===
        const baseColor = CHARACTER_CONFIG[this.player1Key].color;
        const colorObj = Phaser.Display.Color.ValueToColor(baseColor);
        this.add.rectangle(0, 0, 950, 300, colorObj.darken(25).color).setOrigin(0,0);
        const baseColor2 = CHARACTER_CONFIG[this.player2Key].color;
        const colorObj2 = Phaser.Display.Color.ValueToColor(baseColor2);
        this.add.rectangle(1600, 0, 950, 300, colorObj2.darken(25).color).setOrigin(0,0)

        this.livesOne = this.add.text(30, 80, '3x', {
            fontFamily: "Bubble", fontSize: '120px', strokeThickness: 10,
            color: CHARACTER_CONFIG[this.player1Key].colorHex
        });
        this.add.rectangle(185, 30, 95, 240, baseColor).setOrigin(0,0)
        this.add.image(170, 10, 'VidasMarco').setScale(0.56).setOrigin(0,0)

        this.livesTwo = this.add.text(2400, 80, 'x3', {
            fontFamily: "Bubble", fontSize: '120px', strokeThickness: 10,
            color: CHARACTER_CONFIG[this.player2Key].colorHex
        });
        this.add.rectangle(2275, 30, 95, 240, baseColor2).setOrigin(0,0)
        this.add.image(2260, 10, 'VidasMarco').setScale(0.56).setOrigin(0,0);

        this.hud = new HUD(this, this.player1Key, this.player2Key);

        this.timer = this.add.text(1080, 50, '120', {
            fontSize: '200px', strokeThickness: 20, color: '#000000'
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
                SocketClient.emit('leaveRoom');
                this.scene.start("accountRegScene");
            },
            buttonSize, buttonSize
        )

        // === Tilemap (igual al original) ===
        this.map = this.make.tilemap({ key: "tilemap", tileHeight: tileSize, tileWidth: tileSize });
        const tilesetVoid = this.map.addTilesetImage('void', 'void');
        this.map.createLayer('void', tilesetVoid, 0, 0);

        const gidToTexture = { 2: 'Encimeratx', 3: 'Encimeratx1' };
        this.fallingPlatforms = this.physics.add.staticGroup();
        const platformsObjects = this.map.getObjectLayer('topEncimera').objects;

        platformsObjects.forEach(obj => {
            const textureKey = gidToTexture[obj.gid] || 'Encimeratx';
            const x = obj.x + obj.width / 2;
            const y = obj.y - obj.height / 2;
            const platform = this.fallingPlatforms.create(x, y, textureKey);
            platform.body.setSize(obj.width, obj.height);
            platform.body.setOffset(0, 0);
            const fallenProp = obj.properties?.find(p => p.name === 'fallen');
            platform.fallen = fallenProp ? fallenProp.value : false;
            platform.isFalling = false;
            platform.fallDelay = 400;
            platform.dropDistance = 200;
        });

        const posSpawnP1 = platformsObjects.find(obj => obj.id === 10);
        const posSpawnP2 = platformsObjects.find(obj => obj.id === 26);
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
            animationKeys: p1AnimKeys
        }
        this.player1 = new Player(this, 'player1', this.player1Key, tileSpawn1X, tileSpawn1Y, config1);

        const p2AnimKeys = registerAnimations(this, this.player2Key);
        var config2 = {
            texture_key: CHARACTER_CONFIG[this.player2Key].texture,
            tileSize: tileSize,
            map: this.fallingPlatforms,
            lives: 3,
            animationKeys: p2AnimKeys
        }
        this.player2 = new Player(this, 'player2', this.player2Key, tileSpawn2X, tileSpawn2Y, config2);

        this.players = new Map();
        this.players.set('player1', this.player1);
        this.players.set('player2', this.player2);

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
            up:    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            down:  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            left:  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            quickAbility: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F),
            slowAbility:  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G),
        };

        // === Caída de tiles: DESACTIVADA en iteración 3.1 ===
        // En 3.2 lo controlará el server. Por ahora no caen y nadie muere.
        // this.time.addEvent({ delay: 2000, loop: true, callback: () => this.dropRandomTile() });

        // === Socket listeners ===
        this.handleApplyCommand = ({ playerId, command }) => {
            console.log("[level1Multi] applyCommand:", playerId, command);
            this.commandProcessor.processRemote(playerId, command);
        };

        this.handleOpponentLeft = (data) => {
            console.log("[level1Multi] opponentLeft:", data);
            this.music.stop();
            // Para iteración 3.4 lo haremos bonito. Por ahora volver al menú.
            this.scene.start("accountRegScene");
        };

        SocketClient.on('applyCommand', this.handleApplyCommand);
        SocketClient.on('opponentLeft', this.handleOpponentLeft);

        this.events.on('shutdown', () => {
            SocketClient.off('applyCommand', this.handleApplyCommand);
            SocketClient.off('opponentLeft', this.handleOpponentLeft);
            if (this.input?.keyboard) {
                this.input.keyboard.removeAllKeys();
                this.input.keyboard.clearCaptures();
                this.input.keyboard.removeAllListeners();
                this.input.keyboard.resetKeys();
            }
        });
    }
    
    scoreLivesOne() {
        const playerOne = this.players.get('player1');
        this.livesOne.setText(playerOne.lives.toString() + 'x');
    }

    scoreLivesTwo() {
        const playerTwo = this.players.get('player2');
        this.livesTwo.setText('x' + playerTwo.lives.toString());
    }

    update(time, delta)
    {
        this.elapsed += delta;
        const totalTime = 120000;
        const remaining = totalTime - this.elapsed;
        this.hud.update(this.player1, this.player2, this.elapsed);

        if (remaining <= 0) {
            // En iteración 3.3 esto lo decide el server. Por ahora local.
            this.music.stop();
            this.scene.start("accountRegScene");
            this.scene.stop();
            return;
        }
        this.timer.setText(`${Math.ceil(remaining/1000).toString().padStart(3, '0')}`);

        // === SÓLO leemos input del jugador local ===
        const myPlayer = this.players.get(this.yourId);
        if (!myPlayer || !myPlayer.isAlive) return;

        const up    = Phaser.Input.Keyboard.JustDown(this.localKeys.up);
        const down  = Phaser.Input.Keyboard.JustDown(this.localKeys.down);
        const left  = Phaser.Input.Keyboard.JustDown(this.localKeys.left);
        const right = Phaser.Input.Keyboard.JustDown(this.localKeys.right);
        const qab   = Phaser.Input.Keyboard.JustDown(this.localKeys.quickAbility);
        const sab   = Phaser.Input.Keyboard.JustDown(this.localKeys.slowAbility);

        let moveCmd = null;
        if (up)         moveCmd = new MoveCommand(myPlayer, 'up', this);
        else if (down)  moveCmd = new MoveCommand(myPlayer, 'down', this);
        else if (left)  moveCmd = new MoveCommand(myPlayer, 'left', this);
        else if (right) moveCmd = new MoveCommand(myPlayer, 'right', this);
        if (moveCmd) this.commandProcessor.process(moveCmd);

        if (qab) this.commandProcessor.process(new AbilityCommand(myPlayer, 'quick'));
        if (sab) this.commandProcessor.process(new AbilityCommand(myPlayer, 'slow'));
    }
}