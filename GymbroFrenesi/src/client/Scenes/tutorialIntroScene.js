import titleButton from "../UI/titleButton.js";
import charSelectButton from "../UI/charSelectButton.js";
import { CHARACTER_CONFIG, registerAnimations } from "../Utils/AnimatorManager.js";

export default class tutorialIntroScene extends Phaser.Scene
{
    constructor()
    {
        super({key: "tutorialIntroScene"});
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
        
        this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.width,  0x000000).setOrigin(0,0); //color provisional
        
        const buttonSize = 100;
        const buttonMargin = 20;

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

        // textos de introducción
        this.titleTextLocal = this.add.text(this.cameras.main.centerX, 80, 
            "Controles Básicos:\nMultijugador Local:\nJugador 1: WASD para moverse, 'F' para habilidad lenta, 'G' para habilidad rápida.\nJugador 2: Flechas para moverse, ',' para habilidad lenta, '.' para habilidad rápida.", 
        {
            fontFamily: "Bubble",
            fontSize: "60px",
            align: "center",
            wordWrap: { width: 2200 }
        });
        this.titleTextLocal.setOrigin(0.5, 0);

        this.titleTextOnline = this.add.text(this.cameras.main.centerX, 350, 
            "Multijugador Online:\nWASD para moverse, 'F' para habilidad lenta, 'G' para habilidad rápida.", 
        {
            fontFamily: "Bubble",
            fontSize: "60px",
            align: "center",
            wordWrap: { width: 2200 }
        });
        this.titleTextOnline.setOrigin(0.5, 0);

        this.titleTextInstructions = this.add.text(this.cameras.main.centerX, 500, 
            "Tienes 3 vidas. El objetivo es sobrevivir derrotando al oponente con tus habilidades.\n¡Buena suerte!", 
        {
            fontFamily: "Bubble",
            fontSize: "60px",
            align: "center",
            wordWrap: { width: 2200 }
        });
        this.titleTextInstructions.setOrigin(0.5, 0);

        this.titleTextSelect = this.add.text(this.cameras.main.centerX, 660, "Selecciona un personaje para más detalles.", 
        {
            fontFamily: "Bubble",
            fontSize: "60px",
            align: "center"
        });
        this.titleTextSelect.setOrigin(0.5, 0);

        // crear un array de botones vacío y pushear los correspondentes a cada personaje
        this.buttons = [];

        this.buttons.push(this.createCharButton(600, 1100, "legDay"));
        this.buttons.push(this.createCharButton(1050, 1100, "armDay"));
        this.buttons.push(this.createCharButton(1500, 1100, "coreDay"));
        this.buttons.push(this.createCharButton(1950, 1100, "mewingDay"));

        //keys de las animaciones de selección
        const charKeys = ['legDay', 'armDay', 'coreDay', 'mewingDay'];
        this.selectionAnimKeys = {};

        charKeys.forEach(key => { 
            this.selectionAnimKeys[key] = registerAnimations(this, key, 'selectionAnims');
        });
        
        //Animacion pierna
        this.previewSprite1 = this.add.sprite(600, 1100, 'pierna');
        this.previewSprite1.setScale(0.6);
    
        this.buttons[0].on('pointerover', () => {
            this.previewSprite1.setVisible(true);
            this.previewSprite1.play(this.selectionAnimKeys['legDay'].preview);
        });

        this.buttons[0].on('pointerdown', () => {
            this.previewSprite1 = this.add.sprite(600, 1100, 'pierna');
            this.previewSprite1.setTint(0x6E6E6E)
        });

     
        //Animacion brazos
        this.previewSprite2 = this.add.sprite(1050, 1100, 'brazo');
        this.previewSprite2.setScale(0.6);
        
        this.buttons[1].on('pointerover', () => {
            this.previewSprite2.setVisible(true);
            this.previewSprite2.play(this.selectionAnimKeys['armDay'].preview)
        });

        this.buttons[1].on('pointerdown', () => {
            this.previewSprite2 = this.add.sprite(1050, 1100, 'brazo');
            this.previewSprite2.setTint(0x6E6E6E)
        });
        
        //Animacion core
        this.previewSprite3 = this.add.sprite(1500, 1100, 'core');
        this.previewSprite3.setScale(0.6);
        
        this.buttons[2].on('pointerover', () => {
            this.previewSprite3.setVisible(true);
            this.previewSprite3.play(this.selectionAnimKeys['coreDay'].preview);
        });

        this.buttons[2].on('pointerdown', () => {
            this.previewSprite3 = this.add.sprite(1500, 1100, 'core');
            this.previewSprite3.setTint(0x6E6E6E)
        });

        //Animacion mewing
        this.previewSprite4 = this.add.sprite(1950, 1100, 'mewing');
        this.previewSprite4.setScale(0.6);

        this.buttons[3].on('pointerover', () => {
            this.previewSprite4.setVisible(true);
            this.previewSprite4.play(this.selectionAnimKeys['mewingDay'].preview);
        });

        this.buttons[3].on('pointerdown', () => {
            this.previewSprite4 = this.add.sprite(1950, 950, 'mewing');
            this.previewSprite4.setTint(0x6E6E6E)
        });
    }

////////// 

    createCharButton(x, y, charKey) 
    {
        const btn = new charSelectButton(
            this,
            x,
            y,
            "",
            () => {
                this.onCharClicked(charKey);
            }
        );

        btn.charKey = charKey;
        return btn;
    }

    onCharClicked(charKey) 
    {
        this.scene.start("tutorialCharactersScene", {
            selectedChar: charKey
        });
        this.scene.stop();
    }  
}
