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
    }

    create()
    {  
        //fondo provisional
        this.add.image(0, 0, "level_1").setOrigin(0, 0)

        //tilemap
        const tileSize = 150;
        this.map = this.make.tilemap({ key: "tilemap", tileHeight: tileSize, tileWidth: tileSize });
        this.tileset = this.map.addTilesetImage("Encimera1", "Encimeratx") 
        var fondo = this.map.createLayer("Capa de patrones 1", this.tileset); 
        var tile = fondo.getTileAt(7,5);
        var tile2 = fondo.getTileAt(7,7);

        var config = {
            texture_key: "player1Sprite",
            tileSize: tileSize,
            map: this.map,

        }
        this.p1Keys = {
            up:    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            down:  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            left:  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        };
        this.player1= new Player(this, 'player1', tile.x, tile.y, config);

        
        var config = {
            texture_key: "player1Sprite",
            tileSize: tileSize,
            map: this.map,

        }
        
        this.p2Keys = {
            up:    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
            down:  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
            left:  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
        };
        this.player2= new Player(this, 'player2', tile2.x, tile2.y, config);
        
        this.players = new Map();
        this.players.set('player1', this.player1);
        this.players.set('player2', this.player2);
        
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

    update()
    {
        this.inputMappings.forEach(mapping => {
            const playerNum = this.players.get(mapping.playerId);
            if (!playerNum) return;

            const up    = Phaser.Input.Keyboard.JustDown(mapping.upKeyObj);
            const down  = Phaser.Input.Keyboard.JustDown(mapping.downKeyObj);
            const left  = Phaser.Input.Keyboard.JustDown(mapping.leftKeyObj);
            const right = Phaser.Input.Keyboard.JustDown(mapping.rightKeyObj);

            let newX = playerNum.x;
            let newY = playerNum.y;

            if (up) newY -= playerNum.tileSize;
            else if (down) newY += playerNum.tileSize;
            else if (left) newX -= playerNum.tileSize;
            else if (right) newX += playerNum.tileSize;

            if (newX != playerNum.x || newY != playerNum.y) {
                playerNum.update(newX, newY);
            }
        });
    }
}