import Player from "../Players/Player.js"
import { CHARACTER_CONFIG, registerAnimations } from "../Utils/AnimatorManager.js";
import HUD from "../UI/HUD.js";
import titleButton from "../UI/titleButton.js";

const tileSize = 150;
   

export default class level_1 extends Phaser.Scene 
{
    constructor()
    {
        super({key: "level1Scene"})    
    }

    

    init(data) {
        this.player1Key = data.player1;
        this.player2Key = data.player2; 
    }

    preload()
    {
        this.load.image("level_1", "Assets/Img/escenarios/encimera.png");

        // Cargar tileset
        this.load.image("Encimeratx", "Assets/Img/escenarios/encimeratx2.png");
        this.load.image("Encimeratx1", "Assets/Img/escenarios/encimeratx3.png");
        this.load.image("void", "Assets/Img/escenarios/void.png")

        // Cargar mapa JSON
        this.load.tilemapTiledJSON("tilemap", "Assets/maps/mapTile2.json");

        // Cargar habilidades
        this.load.image("flash", "Assets/Img/flash.png");

        // Cargar spritesheets
        this.load.spritesheet('PiernaWalk', 'Assets/Img/personajes/Pierna/WalkRojo.png', {
            frameWidth: 500,
            frameHeight: 500
        });
        this.load.spritesheet('PiernaHab', 'Assets/Img/personajes/Pierna/abilityRed.png', {
            frameWidth: 500,
            frameHeight: 500
        });
        this.load.spritesheet('PiernaRIP', 'Assets/Img/personajes/Pierna/RojoFall.png', {
            frameWidth: 500,
            frameHeight: 500
        });
        this.load.spritesheet('BrazoWalk', 'Assets/Img/personajes/Brazo/WalkAzul.png', {
            frameWidth: 500,
            frameHeight: 500
        });
        this.load.spritesheet('BrazoHab', 'Assets/Img/personajes/Brazo/abilityBlue.png', {
            frameWidth: 500,
            frameHeight: 500
        });
        this.load.spritesheet('BrazoRIP', 'Assets/Img/personajes/Brazo/AzulFall.png', {
            frameWidth: 500,
            frameHeight: 500
        });
        this.load.spritesheet('MewingWalk', 'Assets/Img/personajes/Mewing/walkAmarillo.png', {
            frameWidth: 500,
            frameHeight: 500
        });
        this.load.spritesheet('MewingHab', 'Assets/Img/personajes/Mewing/abilityYellow.png', {
            frameWidth: 500,
            frameHeight: 500
        });
        this.load.spritesheet('MewingRIP', 'Assets/Img/personajes/Mewing/fallAmarillo.png', {
            frameWidth: 500,
            frameHeight: 500
        });
        this.load.spritesheet('CoreWalk', 'Assets/Img/personajes/Core/walkGreen.png', {
            frameWidth: 500,
            frameHeight: 500
        });
        this.load.spritesheet('CoreHab', 'Assets/Img/personajes/Core/abilityGreen.png', {
            frameWidth: 500,
            frameHeight: 500
        });
        this.load.spritesheet('CoreRIP', 'Assets/Img/personajes/Core/fallGreen.png', {
            frameWidth: 500,
            frameHeight: 500
        });

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

        // fondo provisional
        this.add.image(0, 0, "level_1").setOrigin(0, 0);

        this.music = this.sound.add('ingameSound', { loop: true, volume: 0.4 });
        this.music.play();

    //UI mirar a ver si se puede desplazar////
        //colores cambiados para el fondo
        const baseColor = CHARACTER_CONFIG[this.player1Key].color;
        const colorObj = Phaser.Display.Color.ValueToColor(baseColor);
        this.add.rectangle(0, 0, 950,300, colorObj.darken(25).color).setOrigin(0,0);
        
        const baseColor2 = CHARACTER_CONFIG[this.player2Key].color;
        const colorObj2 = Phaser.Display.Color.ValueToColor(baseColor2);
        this.add.rectangle(1600, 0, 950,300, colorObj2.darken(25).color).setOrigin(0,0)


        this.livesOne = this.add.text(30, 80, '3x', {
            fontFamily: "Bubble",
            fontSize: '120px',
            strokeThickness: 10, 
            color: CHARACTER_CONFIG[this.player1Key].colorHex
        });
        this.add.rectangle(185, 30, 95,240, baseColor).setOrigin(0,0)
        this.add.image(170, 10,'VidasMarco').setScale(0.56).setOrigin(0,0)


        this.livesTwo = this.add.text(2400, 80, 'x3', {
            fontFamily: "Bubble",
            fontSize: '120px',
            strokeThickness: 10, 
            color: CHARACTER_CONFIG[this.player2Key].colorHex
        });
        this.add.rectangle(2275, 30, 95,240, baseColor2).setOrigin(0,0)
        this.add.image(2260, 10,'VidasMarco').setScale(0.56).setOrigin(0,0);

        this.hud = new HUD(this, this.player1Key, this.player2Key);
       
        
        this.timer = this.add.text(1080, 50, '120', {
            fontSize: '200px',     
            strokeThickness: 20,            
            color: '#000000'
        });
        
        //botón de pausa
        const buttonSize = 200;
        const buttonH = 40;
        this.exitButton = new titleButton(
            this,
            buttonSize / 2 + buttonH,
            this.cameras.main.height-150,
            "||",
            () => {
                
                this.sound.pauseAll();
                this.scene.launch("pauseScene");
                this.scene.pause();
            },
            buttonSize,
            buttonSize
        )
    //Fin UI////
    
        // tilemap
        const tileSize = 150;
        this.map = this.make.tilemap({ key: "tilemap", tileHeight: tileSize, tileWidth: tileSize });
        const tilesetVoid = this.map.addTilesetImage('void', 'void'); // nombre en Tiled, key de imagen en preload
        this.map.createLayer('void', tilesetVoid, 0, 0);

        
         const gidToTexture = {
            2: 'Encimeratx',  
            3: 'Encimeratx1',
        };
      

        this.fallingPlatforms = this.physics.add.staticGroup();

        const platformsObjects = this.map.getObjectLayer('topEncimera').objects;

        platformsObjects.forEach(obj => {
            const textureKey = gidToTexture[obj.gid] || 'Encimeratx';

            // OJO: en Tiled, y es la parte de ABAJO del objeto
            const x = obj.x + obj.width / 2;
            const y = obj.y - obj.height / 2;

            const platform = this.fallingPlatforms.create(x, y, textureKey);

            // Aseguramos tamaño del body
            platform.body.setSize(obj.width, obj.height);
            platform.body.setOffset(0, 0);

            // Propiedad fallen del objeto Tiled
            const fallenProp = obj.properties?.find(p => p.name === 'fallen');
            platform.fallen = fallenProp ? fallenProp.value : false;

            // Cosas extra que pueden venirte bien
            platform.isFalling = false;
            platform.fallDelay = 400;   // ms antes de empezar a caer
            platform.dropDistance = 200; // cuanto cae visualmente
        });
        
        //Obtener posiciones directamente del id del tilemap.js
        const posSpawnP1 = platformsObjects.find(obj => obj.id === 10);
        const posSpawnP2= platformsObjects.find(obj => obj.id === 26);

        let tileSpawn1X =  Math.floor(posSpawnP1.x / tileSize +1);
        let tileSpawn1Y =  Math.floor(posSpawnP1.y / tileSize);
        let tileSpawn2X =  Math.floor(posSpawnP2.x / tileSize+1);
        let tileSpawn2Y =  Math.floor(posSpawnP2.y / tileSize);
        
        const p1AnimKeys = registerAnimations(this, this.player1Key);
        // console.log('Anim keys:', p1AnimKeys);
        // console.log('Jump existe:', this.anims.exists(p1AnimKeys.jump));
        // console.log('Textura cargada:', this.textures.exists('PiernaSalto'));
        // console.log('Frames:', this.textures.get('PiernaSalto').getFrameNames());

       

        // definicion y creacion del jugador uno
        var config = {
            texture_key: CHARACTER_CONFIG[this.player1Key].texture,
            tileSize: tileSize,
            map: this.fallingPlatforms,
            lives: 3,
            animationKeys: p1AnimKeys
        }
        this.p1Keys = {
            up:    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            down:  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            left:  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            quickAbility: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F),
            slowAbility: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G),
        };
        this.player1= new Player(this, 'player1', this.player1Key, tileSpawn1X, tileSpawn1Y, config);
        
         
        const p2AnimKeys = registerAnimations(this, this.player2Key);

        // definicion y creacion del jugador dos
        var config = {
            texture_key: CHARACTER_CONFIG[this.player2Key].texture,
            tileSize: tileSize,
            map: this.fallingPlatforms,
            lives: 3,
            animationKeys: p2AnimKeys
        }
        
        this.player2= new Player(this, 'player2', this.player2Key, tileSpawn2X, tileSpawn2Y, config);
        
        // mapa de jugadores
        this.players = new Map();
        this.players.set('player1', this.player1);
        this.players.set('player2', this.player2);
        
        // inicializacion de vidas
        this.scoreLivesOne();
        this.scoreLivesTwo();
        
        // configuracion de controles
        const InputConfig = [
            {
                playerId: 'player1',
                upKey: 'W',
                leftKey: 'A',
                downKey: 'S',
                rightKey: 'D',
                quickAbilityKey: 'F',
                slowAbilityKey: 'G', 
            },
            {
                playerId: 'player2',
                upKey: 'UP',
                leftKey: 'LEFT',
                downKey: 'DOWN',
                rightKey: 'RIGHT',
                quickAbilityKey: 'COMMA',
                slowAbilityKey: 'PERIOD',
            }
        ]
           
        this.inputMappings = InputConfig.map(config => {
            return {
                playerId : config.playerId,
                upKeyObj : this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.upKey]),
                leftKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.leftKey]),
                downKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.downKey]),
                rightKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.rightKey]),
                quickAbilityKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.quickAbilityKey]),
                slowAbilityKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.slowAbilityKey]),
            }
        });

        //contador
        this.time.addEvent({
            delay: 2000,          // 2000 ms = 2 segundos
            loop: true,
            callback: () => {
                this.dropRandomTile();
            }
        });
    }

   getPlatformAt(gridX, gridY) {
        // Busca en el grupo la plataforma en ese tile
        return this.fallingPlatforms.getChildren().find(p =>
            p.gridX === gridX && p.gridY === gridY
        ) || null;
    }

    isTileFallen(gridX, gridY) {
        const platform = this.getPlatformAt(gridX, gridY);
        // Si no hay plataforma o está marcada como caída, es "mala"
        return !platform || platform.fallen;
    }

    getRandomSafePlatform() {
        const candidates = this.fallingPlatforms.getChildren().filter(p => !p.fallen);
        if (candidates.length === 0) return null;
        return Phaser.Utils.Array.GetRandom(candidates);
    }

    dropRandomTile() {
       const candidates = this.fallingPlatforms.getChildren()
        .filter(p => !p.fallen && !p.isFalling);
    if (candidates.length === 0) return;

    const chosen = Phaser.Utils.Array.GetRandom(candidates);
    chosen.isFalling = true;  // para que no la elija otra vez

    // Paso 1: temblar durante 1.5 segundos
    const originalX = chosen.x;
    this.tweens.add({
        targets: chosen,
        x: originalX + 4,     // se mueve 4px a la derecha
        duration: 50,          // muy rápido
        yoyo: true,            // vuelve a la posición original
        repeat: 14,            // 15 sacudidas ≈ 1.5 segundos
        onComplete: () => {
            chosen.x = originalX;  // por si queda desplazada

            // Paso 2: caer con fade-out
            this.tweens.add({
                targets: chosen,
                y: chosen.y + 150,
                alpha: 0,
                duration: 300,
                y: chosen.y,
                onComplete: () => {
                    chosen.isFalling=false; 
                    chosen.fallen = true;
                    
                    chosen.setVisible(false);
                    chosen.body.checkCollision.none = true;
                }
            });
        }
    });
    }

    // actualizacion de vidas en pantalla
    scoreLivesOne() {
        const playerOne = this.players.get('player1');
        this.livesOne.setText(playerOne.lives.toString()+'x');
    }

    scoreLivesTwo() {
        const playerTwo = this.players.get('player2');
        this.livesTwo.setText('x'+ playerTwo.lives.toString());
    }

    

    //deteccion de movimiento sin importar el jugador
    update(time,delta)
    {   
        
        this.elapsed += delta; // delta viene en milisegundos
        const totalTime = 120000; // 2 minutos en ms
        const remaining = totalTime - this.elapsed;
        this.hud.update(this.player1, this.player2, this.elapsed);
        
        if (remaining <= 0) {
            this.music.stop();
            if(this.player1.lives > this.player2.lives) {
                this.scene.start('endScene', 
                { winner: '             Player 1'}); // cambiar a pantalla de victoria
            } else if(this.player1.lives < this.player2.lives) {
                this.scene.start('endScene', 
                { winner: '             Player 2'}); // cambiar a pantalla de victoria
            } else {
                this.scene.start('endScene', 
                { winner: 'Empate. \n A la proxima \n jugad mejor (o peor)', loser: this.player2Key }); // cambiar a pantalla de victoria
            } 

            this.scene.stop();

        } else {
            // calcular el tiempo restante
            const remaining = Math.ceil((totalTime - this.elapsed) / 1000);
            this.timer.setText(`${remaining.toString().padStart(3, '0')}`);
        }

        
            // Array de sprites del grupo
            const children = this.fallingPlatforms.getChildren();
           let unavailableTiles = children.filter(p => p.fallen); // array de tiles ya no válidas
            let availableTiles= children.filter(p => !p.fallen)     //arr de tiles válidas
        this.inputMappings.forEach(mapping => {
            var playerNum = this.players.get(mapping.playerId);

            const up    = Phaser.Input.Keyboard.JustDown(mapping.upKeyObj);
            const down  = Phaser.Input.Keyboard.JustDown(mapping.downKeyObj);
            const left  = Phaser.Input.Keyboard.JustDown(mapping.leftKeyObj);
            const right = Phaser.Input.Keyboard.JustDown(mapping.rightKeyObj);
            const quickAbility = Phaser.Input.Keyboard.JustDown(mapping.quickAbilityKeyObj);
            const slowAbility = Phaser.Input.Keyboard.JustDown(mapping.slowAbilityKeyObj);

            var newX = playerNum.x;
            var newY = playerNum.y;

            let direction = playerNum.direction;

            if(playerNum.direction == null){
                playerNum.direction = 'right';
            }

            if (up) {
                newY -= playerNum.tileSize; // tamaño del movimiento
                direction = 'up';
                playerNum.setAngle(180);
            }    
            else if (down) {
                newY += playerNum.tileSize;
                direction = 'down';
                playerNum.setAngle(0);
            }
            else if (left) {
                newX -= playerNum.tileSize;
                direction = 'left';
                playerNum.setAngle(90);
            }
            else if (right) {
                newX += playerNum.tileSize;
                direction = 'right';
                playerNum.setAngle(270);
            }
            playerNum.direction = direction;

            if (quickAbility) {
                playerNum.quickAbility.useAbility();
                this.play
            }

            if (slowAbility) {
                playerNum.slowAbility.useAbility();
            }            
            const badTile = unavailableTiles.find(tile =>
            Phaser.Math.Within(playerNum.x, tile.x, playerNum.tileSize / 2) &&
            Phaser.Math.Within(playerNum.y, tile.y, playerNum.tileSize / 2)
        );
         

        if ((newX != playerNum.x  || newY != playerNum.y) && playerNum.isAlive) {

            let occupied = false;
            const tileSize = playerNum.tileSize;

            this.players.forEach(p => {
                if (p === playerNum) return; // ignorar al propio jugador

                const otherTileX = Math.round(p.x + p.tileSize / 2);
                const otherTileY = Math.round(p.y + p.tileSize / 2);
                const targetTileX = Math.round(newX + tileSize / 2);
                const targetTileY = Math.round(newY + tileSize / 2);

                if (otherTileX === targetTileX && otherTileY === targetTileY) {
                    occupied = true;
                }
            });

            if (!occupied) {
                playerNum.update(newX, newY, this.fallingPlatforms, direction);
            }
        }
            
        // comprobar si el jugador está encima
        if (badTile && playerNum.isAlive) {
            const randomTile = Phaser.Utils.Array.GetRandom(availableTiles);
            playerNum.receiveDamage(randomTile.x, randomTile.y); // si la tile esta ocupada, el jugador recibe daño
            return;
        }
        
        if (this.pendingDestroys) {
        this.pendingDestroys = this.pendingDestroys.filter(sprite => {
            if (this.elapsed >= sprite.destroyAt) {
                sprite.destroy();
                return false;
            }
        return true;
    });
}

        if (playerNum.id === 'player1') {
            this.scoreLivesOne();
        } else if (playerNum.id === 'player2') {
            this.scoreLivesTwo();
        }

        if (playerNum.isDead) { // si un jugador ha muerto, vamos a la pantalla de victoria
            this.music.stop();
            this.scene.stop();

            if(playerNum.id === 'player1') {
                this.scene.start('endScene', 
                { winner: '            Jugador 2' }); // cambiar a pantalla de victoria
            } else {
                this.scene.start('endScene', 
                { winner: "            Jugador 1" }); // cambiar a pantalla de victoria
            }
            
        }
        });
    }
}