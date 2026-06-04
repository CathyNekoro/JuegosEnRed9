import titleButton from "../UI/titleButton.js";
import charSelectButton from "../UI/charSelectButton.js";
import { CHARACTER_CONFIG, registerAnimations } from "../Utils/AnimatorManager.js";

export default class charSelection extends Phaser.Scene
{
    constructor()
    {
        super({key: "charSelection"});
    }
    
    preload()
    {
        this.load.spritesheet('pierna', '../Assets/Img/personajes/legDaySelec.png', {frameWidth:444, frameHeight: 1140});
        this.load.spritesheet('brazo', '../Assets/Img/personajes/armDaySelec.png', {frameWidth:444, frameHeight: 1140});
        this.load.spritesheet('core', '../Assets/Img/personajes/coreDaySelec.png', {frameWidth:444, frameHeight: 1140});
        this.load.spritesheet('mewing', '../Assets/Img/personajes/mewingDaySelec.png', {frameWidth:444, frameHeight: 1140});
        document.fonts.load('1em "Bubble"');
        
    }

    create() 
    {
        
        document.body.style.backgroundColor = "black";
        

        const buttonSize = 100;
        const buttonMargin = 20;
        
        //SETTING player 1
        this.currentPlayer = 1;
        this.selected = { p1: null, p2: null };

        // Texto arriba indicando de quién es el turno
        this.turnText = this.add.text(200, 110, "Jugador 1: elige personaje", 
        {
            fontFamily: "Bubble",
            fontSize: "70px",
          
            
        });

        // boton de salida
        this.exitButton = new titleButton(
        this,
        buttonSize / 2 + buttonMargin,
        buttonSize / 2 + buttonMargin,
        "<",
        () => {
            this.scene.start("titleScene");
            
        },
        buttonSize,
        buttonSize
        );

        // crear un array de botones vacío y pushear los correspondentes a cada personaje
        this.buttons = [];

        this.buttons.push(this.createCharButton(325, 805, "legDay"));
        this.buttons.push(this.createCharButton(815, 805, "armDay"));
        this.buttons.push(this.createCharButton(1292, 805, "coreDay"));
        this.buttons.push(this.createCharButton(1781, 805, "mewingDay"));

        //keys de las animaciones de selección
        const charKeys = ['legDay', 'armDay', 'coreDay', 'mewingDay'];
        this.selectionAnimKeys = {};

        charKeys.forEach(key => { 
            this.selectionAnimKeys[key] = registerAnimations(this, key, 'selectionAnims');
        });
        
        //Animación pierna
        this.previewSprite1 = this.add.sprite(325, 805, 'pierna');
    
         this.buttons[0].on('pointerover', () => {
            this.previewSprite1.setVisible(true);
            this.previewSprite1.play(this.selectionAnimKeys['legDay'].preview);
        });

        this.buttons[0].on('pointerdown', () => {
            
            this.previewSprite1 = this.add.sprite(325, 805, 'pierna');
            this.previewSprite1.setTint(0x6E6E6E)
        });

     
        //ANIMACION BRAZOS armDaySelec
        this.previewSprite2 = this.add.sprite(815, 805, 'brazo');
        
        this.buttons[1].on('pointerover', () => {
            this.previewSprite2.setVisible(true);
            this.previewSprite2.play(this.selectionAnimKeys['armDay'].preview)
        });

        this.buttons[1].on('pointerdown', () => {
            this.previewSprite2 = this.add.sprite(815, 805, 'brazo');
            this.previewSprite2.setTint(0x6E6E6E)
            
        });
        
        //ANIMACION CORE
        this.previewSprite3 = this.add.sprite(1292, 805, 'core');
        
        this.buttons[2].on('pointerover', () => {
            this.previewSprite3.setVisible(true);
            this.previewSprite3.play(this.selectionAnimKeys['coreDay'].preview);
        });

        this.buttons[2].on('pointerdown', () => {
            this.previewSprite3 = this.add.sprite(1292, 805, 'core');
            this.previewSprite3.setTint(0x6E6E6E)
            
        });

        //Mewing animation
        this.previewSprite4 = this.add.sprite(1781, 805, 'mewing');
        
        this.buttons[3].on('pointerover', () => {
            this.previewSprite4.setVisible(true);
            this.previewSprite4.play(this.selectionAnimKeys['mewingDay'].preview);
        });

        this.buttons[3].on('pointerdown', () => {
            
            this.previewSprite4 = this.add.sprite(1781, 805, 'mewing');
            this.previewSprite4.setTint(0x6E6E6E)
            
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
    btn.charKey = charKey;   // guardar qué personaje has seleccionado
    btn.locked = false;      // si está bloqueado para el jugador 2

    return btn;
    }

    //////////////
    onCharClicked(btn) {
    // Si está bloqueado (ya elegido por J1), no se puede volver a elegir
    if (btn.locked) {
        return;
    }

    //gestionar turno
    if (this.currentPlayer === 1) {
        // 🟦 Turno J1
        this.selected.p1 = btn.charKey;

        // Bloqueamos este botón para que J2 no lo pueda usar
        btn.locked = true;
        btn.disableInteractive(); 

        // Pasamos al turno del J2
        this.currentPlayer = 2;
        this.turnText.setText("Jugador 2: elige personaje");
    }
    else {
      
        this.selected.p2 = btn.charKey;
        btn.locked = true;
        btn.disableInteractive();
        this.sound.stopByKey('selecMusic');
//implementar contador?

        this.scene.start("level1Scene", {
            player1: this.selected.p1,
            player2: this.selected.p2
        });
        
        
        this.scene.stop();
        
    }
}  
}

