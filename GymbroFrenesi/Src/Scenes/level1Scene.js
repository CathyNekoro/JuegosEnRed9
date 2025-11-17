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
        this.player= new Player(this, tile.x, tile.y, config);
        
    }

    update()
    {
        let newX = this.player.x;
        let newY = this.player.y;

        const up    = Phaser.Input.Keyboard.JustDown(this.p1Keys.up);
        
        const down  = Phaser.Input.Keyboard.JustDown(this.p1Keys.down);
        const left  = Phaser.Input.Keyboard.JustDown(this.p1Keys.left);
        const right = Phaser.Input.Keyboard.JustDown(this.p1Keys.right);   
       
        if (up)  {newY -= 150;}
        else if (down)  newY += 150;
        else if (left)  newX -= 150;
        else if (right) newX += 150;

        if(this.player.x != newX || this.player.y != newY) 

        this.player.update(newX, newY);    
    }
}