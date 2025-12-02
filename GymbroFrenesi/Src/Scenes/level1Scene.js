import Player from "../Players/Player.js"

const CHARACTER_CONFIG = {
    legDay: {
        texture: "charLegsSprite",   
    },
    armDay: {
        texture: "charArmsSprite",
    },
    coreDay: {
        texture: "charCoreSprite",
    },
    mewingDay: {
        texture: "charMewingSprite",
    }
};
const tileSize = 150;


export default class level_1 extends Phaser.Scene 
{
    constructor()
    {
        super({key: "level1Scene"})

        this.startTime = new Date() / 1000;       
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

        this.load.image("charLegsSprite", "Assets/Img/personajes/legsPlaceholder.png");
        this.load.image("charArmsSprite", "Assets/Img/personajes/armsPlaceholder.png");
        this.load.image("charCoreSprite", "Assets/Img/personajes/corePlaceholder.png");
        this.load.image("charMewingSprite", "Assets/Img/personajes/mewingPlaceholder.png");

        // Cargar habilidades
        this.load.image("flash", "Assets/Img/flash.png");
    }

    create()
    {  
        // fondo provisional
        this.add.image(0, 0, "level_1").setOrigin(0, 0)

        // textos vidas
        this.livesOne = this.add.text(100, 50, '0', {
            fontSize: '64px',
            color: '#ff0000ff'
        });

        this.livesTwo = this.add.text(700, 50, '0', {
            fontSize: '64px',
            color: '#ff0000ff'
        });

        this.timer = this.add.text(100, 150, '0', {
            fontSize: '64px',
            color: '#ff0000ff'
        });

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

        const p1Texture = CHARACTER_CONFIG[this.player1Key].texture;
        const p2Texture = CHARACTER_CONFIG[this.player2Key].texture;
        
        // definicion y creacion del jugador uno
        var config = {
            texture_key: p1Texture,
            tileSize: tileSize,
            map: this.fallingPlatforms,
            lives: 330,
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
        
        // definicion y creacion del jugador dos
        var config = {
            texture_key: p2Texture,
            tileSize: tileSize,
            map: this.fallingPlatforms,
            lives: 330,
        }
        this.p2Keys = {
            up:    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
            down:  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
            left:  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT), 
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
            quickAbility: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_ONE),
            slowAbility: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_TWO),
        };
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
                quickAbilityKey: 'NUMPAD_ONE',
                slowAbilityKey: 'NUMPAD_TWO',
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
        const candidates = this.fallingPlatforms.getChildren().filter(p => !p.fallen);
        if (candidates.length === 0) return;

        const chosen = Phaser.Utils.Array.GetRandom(candidates);

        // Marcamos estado
        chosen.fallen = true;

        // Efecto visible / colisión
        chosen.setVisible(false);
        chosen.body.checkCollision.none = true;
    }

    // actualizacion de vidas en pantalla
    scoreLivesOne() {
        const playerOne = this.players.get('player1');
        this.livesOne.setText(playerOne.lives.toString());
    }

    scoreLivesTwo() {
        const playerTwo = this.players.get('player2');
        this.livesTwo.setText(playerTwo.lives.toString());
    }

    

    //deteccion de movimiento sin importar el jugador
    update()
    {   
        if (Math.round(Date.now() / 1000) >= this.startTime + 120) {
            // volver al menu tras que se acabe el tiempo
            this. scene.start('titleScene'); // cambiar a pantalla de victoria
            this.scene.stop();
        } else {
            // calcular el tiempo restante
            let currentTime = Math.round(Date. now() / 1000);
            let elapsed = currentTime - this.startTime;
            let remaining = 120 - elapsed;
            
            // actualizar el temporizador en pantalla
            let minutes = Math.floor(remaining / 60);
            let seconds = remaining % 60;
            this. timer.setText(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        }

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
            }    
            else if (down) {
                newY += playerNum.tileSize;
                direction = 'down';
            }
            else if (left) {
                newX -= playerNum.tileSize;
                direction = 'left';
            }
            else if (right) {
                newX += playerNum.tileSize;
                direction = 'right';
            }

            if (quickAbility) {
                playerNum.quickAbility.useAbility();
            }

            if (slowAbility) {
                playerNum.slowAbility.useAbility();
            }            

            // Array de sprites del grupo
            const children = this.fallingPlatforms.getChildren();

           
            var unavailableTiles = children.filter(p => p.fallen); // array de tiles ya no válidas
            var availableTiles= children.filter(p => !p.fallen)     //arr de tiles válidas

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
            playerNum.receiveDamage(); // si la tile esta ocupada, el jugador recibe daño
            if (unavailableTiles.length < 91) {
                

                // posición real en píxeles
                const respawnX = randomTile.x;
                const respawnY = randomTile.y;
            
                playerNum.update(respawnX, respawnY, this.fallingPlatforms, direction);
                    
            }   
            return;
        }
    
        if (playerNum.id === 'player1') {
            this.scoreLivesOne();
        } else if (playerNum.id === 'player2') {
            this.scoreLivesTwo();
        }

        if (playerNum.isDead) { // si un jugador ha muerto, volvemos a la pantalla de inicio
            this.scene.start('titleScene'); // cambiar a pantalla de victioria
            this.scene.stop();
        }
        });
    }
}