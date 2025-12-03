import titleButton from "../Button/titleButton.js";
import charSelectButton from "../Button/charSelectButton.js";
//import level_1 from "./level1Scene.js";

export default class charSelection extends Phaser.Scene
{
    constructor()
    {
        super({key: "charSelection"});
    }
    
    preload()
    {
        this.load.image('fondo', '../Assets/Img/fondoSelecPersonajes.png');
        this.load.spritesheet('pierna', '../Assets/Img/personajes/legDaySelec.png', {frameWidth:444, frameHeight: 1140});
        this.load.spritesheet('brazo', '../Assets/Img/personajes/armDaySelec.png', {frameWidth:444, frameHeight: 1140});
        this.load.spritesheet('core', '../Assets/Img/personajes/coreDaySelec.png', {frameWidth:444, frameHeight: 1140});
        this.load.spritesheet('mewing', '../Assets/Img/personajes/mewingDaySelec.png', {frameWidth:444, frameHeight: 1140});
    }

    create() 
    {
        
        this.add.image(0, 0, 'fondo').setOrigin(0, 0);

        const buttonSize = 100;
        const buttonMargin = 20;
        
        //SETTING player 1
        this.currentPlayer = 1;
        this.selected = { p1: null, p2: null };

        // Texto arriba indicando de quién es el turno
        this.turnText = this.add.text(200, 100, "Jugador 1: elige personaje", 
        {
            fontFamily: "something",
            fontSize: "40px",
            color: "#ffffff"
        });

        // boton de salida
        this.exitButton = new titleButton(
        this,
        buttonSize / 2 + buttonMargin,
        buttonSize / 2 + buttonMargin,
        "<",
        () => {
            this.scene.start("titleScene");
            this.scene.stop();
        },
        buttonSize,
        buttonSize
        );

        this.buttons = [];

        this.buttons.push(this.createCharButton(325, 805, "legDay"));
        this.buttons.push(this.createCharButton(815, 805, "armDay"));
        this.buttons.push(this.createCharButton(1292, 805, "coreDay"));
        this.buttons.push(this.createCharButton(1781, 805, "mewingDay"));


        //ANIMACION PIERNAS
         if(!this.anims.exists("legDaySelec")){
            this.anims.create({
                key:'legDaySelec',
                frames: this.anims.generateFrameNumbers('pierna', {start: 0, end: 8}),
                frameRate: 6,
                repeat: 0
            });
        }
         this.previewSprite1 = this.add.sprite(325, 805, 'pierna');
          
         this.buttons[0].on('pointerover', () => {
            this.previewSprite1.setVisible(true);
            this.previewSprite1.play('legDaySelec');
        });

        this.buttons[0].on('pointerdown', () => {
            this.previewSprite1.setVisible(false);
            this.previewSprite1 = this.add.sprite(325, 805, 'pierna');
        });

    
        //ANIMACION BRAZOS
        if(!this.anims.exists("armDaySelec")){
            this.anims.create({
                key:'armDaySelec',
                frames: this.anims.generateFrameNumbers('brazo', {start: 0, end: 4}),
                frameRate: 6,
                repeat: 0
            });
       }
            this.previewSprite2 = this.add.sprite(815, 805, 'brazo');
            
            this.buttons[1].on('pointerover', () => {
                this.previewSprite2.setVisible(true);
                this.previewSprite2.play('armDaySelec');
            });

            this.buttons[1].on('pointerdown', () => {
                this.previewSprite2.setVisible(false);
                this.previewSprite2 = this.add.sprite(815, 805, 'brazo');
                
            });
        
        //ANIMACION CORE
        if(!this.anims.exists("coreDaySelec")){
            this.anims.create({
                key:'coreDaySelec',
                frames: this.anims.generateFrameNumbers('core', {start: 0, end: 4}),
                frameRate: 8,
                repeat: 0
            });
        }
            this.previewSprite3 = this.add.sprite(1292, 805, 'core');
            
            this.buttons[2].on('pointerover', () => {
                this.previewSprite3.setVisible(true);
                this.previewSprite3.play('coreDaySelec');
            });

            this.buttons[2].on('pointerdown', () => {
                this.previewSprite3.setVisible(false);
                this.previewSprite3 = this.add.sprite(1292, 805, 'core');
                
            });

        //ANIMACION MEWING
         if(!this.anims.exists("mewingDaySelec")){
            this.anims.create({
                key:'mewingDaySelec',
                frames: this.anims.generateFrameNumbers('mewing', {start: 0, end: 13}),
                frameRate: 7,
                repeat: 0
            });
        }
            this.previewSprite4 = this.add.sprite(1781, 805, 'mewing');
            
            this.buttons[3].on('pointerover', () => {
                this.previewSprite4.setVisible(true);
                this.previewSprite4.play('mewingDaySelec');
            });

            this.buttons[3].on('pointerdown', () => {
                this.previewSprite4.setVisible(false);
                this.previewSprite4 = this.add.sprite(1781, 805, 'mewing');
                
            });

    }
        

//////////

       

    createCharButton(x, y, charKey) {
        const btn = new charSelectButton(
            this,
            x,
            y,
            "",
            () => {
                this.onCharClicked(btn);
                
            }
        );

    // Guardamos info extra en el botón:
    btn.charKey = charKey;   // quién es (legDay, horus, etc.)
    btn.locked = false;      // si está bloqueado para el jugador 2

    return btn;
    }

    //////////////
    onCharClicked(btn) {
    // Si está bloqueado (ya elegido por J1), no se puede volver a elegir
    if (btn.locked) {
        return;
    }

    if (this.currentPlayer === 1) {
        // 🟦 Turno J1
        this.selected.p1 = btn.charKey;

        // Bloqueamos este botón para que J2 no lo pueda usar
        btn.locked = true;
        btn.disableInteractive();
        btn.setAlpha(0.4); // efecto visual de "grisado"

        // Pasamos al turno del J2
        this.currentPlayer = 2;
        this.turnText.setText("Jugador 2: elige personaje");
    }
    else {
      
        this.selected.p2 = btn.charKey;

        
        btn.locked = true;
        btn.disableInteractive();
        btn.setAlpha(0.4);

        
        this.scene.start("level1Scene", {
            player1: this.selected.p1,
            player2: this.selected.p2
        });
        
        this.scene.stop();
        
    }
}
    
   
}

