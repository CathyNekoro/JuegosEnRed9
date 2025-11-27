import Player from "../Players/Player.js"

export default class level_1 extends Phaser.Scene 
{
    constructor()
    {
       super({key: "level1Scene"})
    }

    preload()
    {
        this.load.image("level_1", "Assets/Img/escenarios/encimera.png");

        // Cargar tileset
        this.load.image("Encimeratx", "Assets/Img/escenarios/encimeratx.png");

        // Cargar mapa JSON
        this.load.tilemapTiledJSON("tilemap", "Assets/maps/mapTile.json");

        this.load.image("player1Sprite", "Assets/Img/pene.png");
        this.load.image("player2Sprite", "Assets/Img/musculo_raton.png");
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

        // tilemap
        const tileSize = 150;
        this.map = this.make.tilemap({ key: "tilemap", tileHeight: tileSize, tileWidth: tileSize });
        this.tileset = this.map.addTilesetImage("Encimera1", "Encimeratx") 
        var fondo = this.map.createLayer("Capa de patrones 1", this.tileset); 
        var tile = fondo.getTileAt(7,5);
        var tile2 = fondo.getTileAt(7,7);

        // definicion y creacion del jugador uno
        var config = {
            texture_key: "player1Sprite",
            tileSize: tileSize,
            map: this.map,
            lives: 3,

        }
        this.p1Keys = {
            up:    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            down:  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            left:  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        };
        this.player1= new Player(this, 'player1', tile.x, tile.y, config);

        // definicion y creacion del jugador dos
        var config = {
            texture_key: "player2Sprite",
            tileSize: tileSize,
            map: this.map,
            lives: 3,

        }
        
        this.p2Keys = {
            up:    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
            down:  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
            left:  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
        };
        this.player2= new Player(this, 'player2', tile2.x, tile2.y, config);
        
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
            },
            {
                playerId: 'player2',
                upKey: 'UP',
                leftKey: 'LEFT',
                downKey: 'DOWN',
                rightKey: 'RIGHT',
            }
        ]
        
        this.inputMappings = InputConfig.map(config => {
            return {
                playerId : config.playerId,
                upKeyObj : this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.upKey]),
                leftKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.leftKey]),
                downKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.downKey]),
                rightKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.rightKey]),
            }
        });

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

    // deteccion de movimiento sin importar el jugador
    update()
    {
        this.inputMappings.forEach(mapping => {
            const playerNum = this.players.get(mapping.playerId);

            const up    = Phaser.Input.Keyboard.JustDown(mapping.upKeyObj);
            const down  = Phaser.Input.Keyboard.JustDown(mapping.downKeyObj);
            const left  = Phaser.Input.Keyboard.JustDown(mapping.leftKeyObj);
            const right = Phaser.Input.Keyboard.JustDown(mapping.rightKeyObj);

            let newX = playerNum.x;
            let newY = playerNum.y;

            let oldX = playerNum.x;
            let oldY = playerNum.y;

            if (up) newY -= playerNum.tileSize; // tamaño del movimiento
            else if (down) newY += playerNum.tileSize;
            else if (left) newX -= playerNum.tileSize;
            else if (right) newX += playerNum.tileSize;

            if ((newX != playerNum.x  || newY != playerNum.y) && playerNum.isAlive) {
                const tileSize = playerNum.tileSize; // obtencion de la tile para la comprobacion
                const targetTileX = Math.round(newX + tileSize / 2);
                const targetTileY = Math.round(newY + tileSize / 2);
                let occupied = false;
                this.players.forEach(p => {
                    const otherTileX = Math.round(p.x + p.tileSize / 2);
                    const otherTileY = Math.round(p.y + p.tileSize / 2);
                    if (otherTileX === targetTileX && otherTileY === targetTileY) // comprobando que la tile objetivo no este ocupada por otro jugador
                        occupied = true;
                });
                if (!occupied) {
                    playerNum.update(newX, newY); // movimiento del jugador si la tile no esta ocupada
                } else {
                    playerNum.receiveDamage(); // si la tile esta ocupada, el jugador recibe daño
                    if (playerNum.id === 'player1') {
                        this.scoreLivesOne();
                    } else if (playerNum.id === 'player2') {
                        this.scoreLivesTwo();
                    }

                    playerNum.update(oldX, oldY); // el jugador permanece en su posicion original 
                }
            }

            if (playerNum.isDead) { // si un jugador ha muerto, volvemos a la pantalla de inicio
                this.scene.start('titleScene'); // cambiar a pantalla de victioria
            }
        });
    }
}