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
        this.load.spritesheet('PiernaSalto', 'Assets/Img/personajes/Pierna/JumpRojo.png', {
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
        this.load.spritesheet('BrazoSalto', 'Assets/Img/personajes/Brazo/JumpAzul.png', {
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
        this.load.spritesheet('MewingSalto', 'Assets/Img/personajes/Mewing/jumpAmarillo.png', {
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
        this.load.spritesheet('CoreSalto', 'Assets/Img/personajes/Core/jumpGreen.png', {
            frameWidth: 500,
            frameHeight: 500
        });
        this.load.spritesheet('CoreRIP', 'Assets/Img/personajes/Core/fallGreen.png', {
            frameWidth: 500,
            frameHeight: 500
        });
    }

    create()
    {  

        this.startTime = Math.round(new Date() / 1000);   

        // fondo provisional
        this.add.image(0, 0, "level_1").setOrigin(0, 0)

        // personajes
        if(!this.anims.exists("AndarPierna")){
            this.anims.create({
            key: 'AndarPierna',
            frames: this.anims.generateFrameNumbers('PiernaWalk', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
            });
        }
        if(!this.anims.exists("SaltarPierna")){
            this.anims.create({
            key: 'SaltarPierna',
            frames: this.anims.generateFrameNumbers('PiernaSalto', { start: 0, end: 1 }),
            frameRate: 4,
            repeat: 0
            });
        }
        if(!this.anims.exists("CaerPierna")){
            this.anims.create({
            key: 'CaerPierna',
            frames: this.anims.generateFrameNumbers('PiernaRIP', { start: 0, end: 0 }),
            frameRate: 1,
            repeat: 0
            });
        }
        if(!this.anims.exists("IdlePierna")){
            this.anims.create({
            key: 'IdlePierna',
            frames: this.anims.generateFrameNumbers('PiernaWalk', { start: 0, end: 0 }),
            frameRate: 1,
            repeat: 0
            });
        }
        if(!this.anims.exists("AndarBrazo")){
            this.anims.create({
            key: 'AndarBrazo',
            frames: this.anims.generateFrameNumbers('BrazoWalk', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
            });
        }
        if(!this.anims.exists("SaltarBrazo")){
            this.anims.create({
            key: 'SaltarBrazo',
            frames: this.anims.generateFrameNumbers('BrazoJump', { start: 0, end: 1 }),
            frameRate: 4,
            repeat: 0
            });
        }
        if(!this.anims.exists("CaerBrazo")){
            this.anims.create({
            key: 'CaerBrazo',
            frames: this.anims.generateFrameNumbers('BrazoRIP', { start: 0, end: 1 }),
            frameRate: 1,
            repeat: 0
            });
        }
        if(!this.anims.exists("IdleBrazo")){
            this.anims.create({
            key: 'IdleBrazo',
            frames: this.anims.generateFrameNumbers('BrazoWalk', { start: 0, end: 0 }),
            frameRate: 1,
            repeat: 0
            });
        }
        if(!this.anims.exists("AndarMewing")){
            this.anims.create({
            key: 'AndarMewing',
            frames: this.anims.generateFrameNumbers('MewingWalk', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
            });
        }
        if(!this.anims.exists("SaltarMewing")){
            this.anims.create({
            key: 'SaltarMewing',
            frames: this.anims.generateFrameNumbers('MewingSalto', { start: 0, end: 1 }),
            frameRate: 4,
            repeat: 0
            });
        }
        if(!this.anims.exists("CaerMewing")){
            this.anims.create({
            key: 'CaerMewing',
            frames: this.anims.generateFrameNumbers('MewingRIP', { start: 0, end: 0 }),
            frameRate: 1,
            repeat: 0
            });
        }
        if(!this.anims.exists("IdleMewing")){
            this.anims.create({
            key: 'IdleMewing',
            frames: this.anims.generateFrameNumbers('MewingWalk', { start: 0, end: 0 }),
            frameRate: 1,
            repeat: 0
            });
        }
        if(!this.anims.exists("AndarCore")){
            this.anims.create({
            key: 'AndarCore',
            frames: this.anims.generateFrameNumbers('CoreWalk', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
            });
        }
        if(!this.anims.exists("SaltarCore")){
            this.anims.create({
            key: 'SaltarCore',
            frames: this.anims.generateFrameNumbers('CoreSalto', { start: 0, end: 1 }),
            frameRate: 4,
            repeat: 0
            });
        }
        if(!this.anims.exists("CaerCore")){
            this.anims.create({
            key: 'CaerCore',
            frames: this.anims.generateFrameNumbers('CoreWalk', { start: 0, end: 0 }),
            frameRate: 1,
            repeat: 0
            });
        }
        if(!this.anims.exists("IdleCore")){
            this.anims.create({
            key: 'IdleCore',
            frames: this.anims.generateFrameNumbers('CoreWalk', { start: 0, end: 0 }),
            frameRate: 1,
            repeat: 0
            });
        }
        // configuraciones de animaciones
        const animationKeysLegs = {
            walk: "AndarPierna", 
            jump: "SaltarPierna",
            fall: "CaerPierna",
            idle: "IdlePierna",
        }
        const animationKeysArms = {
            walk: "AndarBrazo", 
            jump: "SaltarBrazo",
            fall: "CaerBrazo",
            idle: "IdleBrazo",
        }
        const animationKeysCore = {
            walk: "AndarCore", 
            jump: "SaltarCore",
            fall: "CaerCore",
            idle: "IdleCore",
        }
        const animationKeysMewing = {
            walk: "AndarMewing", 
            jump: "SaltarMewing",
            fall: "CaerMewing",
            idle: "IdleMewing",
        }

        // textos vidas
        this.livesOne = this.add.text(140, 80, '3', {
            fontSize: '120px',
            strokeThickness: 20, 
            color: '#ff0000ff'
        });

        this.livesTwo = this.add.text(2300, 80, '3', {
            fontSize: '120px',
            strokeThickness: 20, 
            color: '#0000ff'
        });

        this.abilityOnePlayerOne = this.add.text(325, 50, 'J1 - F: L', {
            fontSize: '64px',
            strokeThickness: 20, 
            color: '#ff0000ff'
        });

        this.abilityTwoPlayerOne = this.add.text(320, 140, 'J1 - G: L', {
            fontSize: '64px',
            strokeThickness: 20, 
            color: '#ff0000ff'
        });

        this.abilityOnePlayerTwo = this.add.text(1800, 50, 'J2 - NP1: L', {
            fontSize: '64px',
            strokeThickness: 20, 
            color: '#0000ff'
        });

        this.abilityTwoPlayerTwo = this.add.text(1800, 140, 'J2 - NP2: L', {
            fontSize: '64px',
            strokeThickness: 20, 
            color: '#0000ff'
        });

        this.timer = this.add.text(1000, 50, '2:00', {
            fontSize: '200px',     
            strokeThickness: 20,            
            color: '#000000'
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
        
        let p1AnimationKeys = "";
        switch (this.player1Key){
            case "legDay":
                p1AnimationKeys = animationKeysLegs;
                break;
            case "armDay":
                p1AnimationKeys = animationKeysArms;
                break;
            case "coreDay":
                p1AnimationKeys = animationKeysCore;
                break;
            case "mewingDay":
                p1AnimationKeys = animationKeysMewing;
                break;
        }
        
        
        // definicion y creacion del jugador uno
        var config = {
            texture_key: p1Texture,
            tileSize: tileSize,
            map: this.fallingPlatforms,
            lives: 3,
            animationKeys: p1AnimationKeys
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
        
        let p2AnimationKeys = "";
        switch (this.player2Key){
            case "legDay":
                p2AnimationKeys = animationKeysLegs;
                break;
            case "armDay":
                p2AnimationKeys = animationKeysArms;
                break;
            case "coreDay":
                p2AnimationKeys = animationKeysCore;
                break;
            case "mewingDay":
                p2AnimationKeys = animationKeysMewing;
                break;
        }

        // definicion y creacion del jugador dos
        var config = {
            texture_key: p2Texture,
            tileSize: tileSize,
            map: this.fallingPlatforms,
            lives: 3,
            animationKeys: p2AnimationKeys
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

            if(this.player1.lives > this.player2.lives) {
                this.scene.start('endScene', 
                { winner: this.player1Key, loser: this.player2Key }); // cambiar a pantalla de victoria
            } else if(this.player1.lives < this.player2.lives) {
                this.scene.start('endScene', 
                { winner: this.player2Key, loser: this.player1Key }); // cambiar a pantalla de victoria
            } else {
                this.scene.start('endScene', 
                { winner: this.player1Key, loser: this.player2Key }); // cambiar a pantalla de victoria
            } 

            this.scene.stop();

        } else {
            // calcular el tiempo restante
            let currentTime = Math.round(Date.now() / 1000);
            let elapsed = currentTime - this.startTime;
            let remaining = 120 - elapsed;
            
            // actualizar el temporizador en pantalla
            let minutes = Math.floor(remaining / 60);
            let seconds = remaining % 60;
            this.timer.setText(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        }

        // cooldowns jugador 1
        if (this.player1.quickAbility) {
            const remaining = this.player1.quickAbility.getCooldownRemaining();
            if (remaining > 0) {
                const seconds = Math.ceil(remaining / 1000);
                this.abilityOnePlayerOne.setText(`J1 - F: ${seconds}s`);
                this.abilityOnePlayerOne.setColor('#ff6666');
            } else {
                this.abilityOnePlayerOne.setText('J1 - F: L');
                this.abilityOnePlayerOne.setColor('#ff0000');
            }
        }
        
        if (this.player1.slowAbility) {
            const remaining = this.player1.slowAbility.getCooldownRemaining();
            if (remaining > 0) {
                const seconds = Math.ceil(remaining / 1000);
                this.abilityTwoPlayerOne.setText(`J1 - G: ${seconds}s`);
                this.abilityTwoPlayerOne.setColor('#ff6666');
            } else {
                this.abilityTwoPlayerOne.setText('J1 - G: L');
                this.abilityTwoPlayerOne.setColor('#ff0000');
            }
        }
        
        // cooldowns jugador 2
        if (this.player2.quickAbility) {
            const remaining = this.player2.quickAbility.getCooldownRemaining();
            if (remaining > 0) {
                const seconds = Math.ceil(remaining / 1000);
                this.abilityOnePlayerTwo.setText(`J2 - , : ${seconds}s`);
                this.abilityOnePlayerTwo.setColor('#6666ff');
            } else {
                this.abilityOnePlayerTwo.setText('J2 - , : L');
                this.abilityOnePlayerTwo.setColor('#0000ff');
            }
        }
        
        if (this.player2.slowAbility) {
            const remaining = this.player2.slowAbility.getCooldownRemaining();
            if (remaining > 0) {
                const seconds = Math.ceil(remaining / 1000);
                this.abilityTwoPlayerTwo.setText(`J2 - . : ${seconds}s`);
                this.abilityTwoPlayerTwo.setColor('#6666ff');
            } else {
                this.abilityTwoPlayerTwo.setText('J2 - . : L');
                this.abilityTwoPlayerTwo.setColor('#0000ff');
            }
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

        if (playerNum.isDead) { // si un jugador ha muerto, vamos a la pantalla de victoria
            
            if(playerNum.id === 'player1') {
                this.scene.start('endScene', 
                { winner: 'Jugador 2' }); // cambiar a pantalla de victoria
            } else {
                this.scene.start('endScene', 
                { winner: "Jugador 1" }); // cambiar a pantalla de victoria
            }
            
        

        }
        });
    }
}