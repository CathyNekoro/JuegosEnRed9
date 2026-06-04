import titleButton from "../UI/titleButton.js";
import { CHARACTER_CONFIG, registerAnimations } from "../Utils/AnimatorManager.js";

// informacion de personajes
const CHARACTER_INFO = {
    legDay: {
        name: "Leg Day",
        description: "El especialista en piernas",
        intro:  "Un experto en movimiento rápido y evasión. " +
                "Sus habilidades se centran en el desplazamiento táctico por el campo de batalla.",
        quickAbility: "Salto Rápido: Salta 2 casillas en la dirección que esta mirando LegDay. No podras saltar por encima de jugadores.",
        slowAbility: "Salto Alto: Salta 2 casillas en la dirección que esta mirando LegDay y por encima de jugadores.",
        stats: "Especialidad: Movimiento"
    },
    armDay: {
        name: "Arm Day",
        description: "El especialista en brazos",
        intro:  "Un maestro del control del campo. " +
                "Sus habilidades se centran en mantener la distancia y controlar a tus enemigos.",
        quickAbility: "Empujón: Si ArmDay tiene un enemigo delante, empuja a dicho enemigo una casilla en la dirección en la que esta mirando ArmDay.",
        slowAbility: "Empujón Fuerte: Si ArmDay tiene un enemigo delante, empuja a dicho enemigo dos casillas en la dirección en la que esta mirando ArmDay.",
        stats: "Especialidad: Ataque"
    },
    coreDay: {
        name: "Core Day",
        description: "El especialista en pecho y abdominales",
        intro:  "Un prodigio en todo o nada. " +
                "Sus habilidades se centran en movimientos forzosos que obligab al enemigo a actuar y mantenerse en alerta.",
        quickAbility: "Impacto Rápido: " +
        "CoreDay carga en línea recta empujando a un personaje hacia los laterales de su trayectoria " +
        "o chocandose con una pared del escenario si no hay otro jugador en su camino. " +
        "Se caera si hay un agujero en su camino.",
        slowAbility: "Impacto Alto: " +
        "CoreDay carga en línea recta empujando a un personaje hacia los laterales de su trayectoria " + 
        "o chocandose con una pared del escenario si no hay otro jugador en su camino. " +
        "No se caera si hay un agujero en su camino, excepto si la última casilla no es valida.",
        stats: "Especialidad: Defensa"
    },
    mewingDay: {
        name: "Mewing Day",
        description: "El especialista en mogging",
        intro:  "Un artista de técnicas ninja. " +
                "Sus habilidades se centran en hacer al enemigo dudar de sus movimientos.",
        quickAbility: "Bomba de Humo: produce un destello alrededor del otro jugador que le impide ver con claridad las 8 casillas adyacentes a sí durante un par de segundos",
        slowAbility: "Ventisca Final: produce un destello alrededor del otro jugador que le impide ver con claridad las 24 casillas adyacentes a sí durante un par de segundos",
        stats: "Especialidad: Comodín"
    }
};

const CHAR_KEYS = ['legDay', 'armDay', 'coreDay', 'mewingDay'];

export default class tutorialCharactersScene extends Phaser.Scene
{
    constructor()
    {
        super({key: "tutorialCharactersScene"});
    }
    
    preload()
    {
        this.load.spritesheet('pierna', '../Assets/Img/personajes/legDaySelec.png', {frameWidth:444, frameHeight: 1140});
        this.load.spritesheet('brazo', '../Assets/Img/personajes/armDaySelec.png', {frameWidth:444, frameHeight: 1140});
        this.load.spritesheet('core', '../Assets/Img/personajes/coreDaySelec.png', {frameWidth:444, frameHeight: 1140});
        this.load.spritesheet('mewing', '../Assets/Img/personajes/mewingDaySelec.png', {frameWidth:444, frameHeight: 1140});
        document.fonts.load('1em "Bubble"');
    }

    create(data) 
    {
        document.body.style.backgroundColor = "black";
        
        // index de personaje seleccionado
        this.currentCharIndex = CHAR_KEYS.indexOf(data.selectedChar);
        if (this.currentCharIndex === -1) this.currentCharIndex = 0;
        
        const buttonSize = 100;
        const buttonMargin = 20;

        // boton de salida
        this.backButton = new titleButton(
            this,
            buttonSize / 2 + buttonMargin,
            buttonSize / 2 + buttonMargin,
            "<",
            () => {
                this.scene.start("tutorialIntroScene");
            },
            buttonSize,
            buttonSize
        );

        // botton izquierda, array -1
        this.leftButton = new titleButton(
            this,
            buttonSize / 2 + buttonMargin,
            this.cameras.main.centerY,
            "<",
            () => {
                this.changeCharacter(-1);
            },
            buttonSize,
            buttonSize
        );

        // botton derecha, array +1
        this.rightButton = new titleButton(
            this,
            this.cameras.main.width - (buttonSize / 2 + buttonMargin),
            this.cameras.main.centerY,
            ">",
            () => {
                this.changeCharacter(1);
            },
            buttonSize,
            buttonSize
        );

        this.displayCharacter();
    }

    displayCharacter() 
    {
        // borrar informacion anterior
        if (this.nameText) this.nameText.destroy();
        if (this.descText) this.descText.destroy();
        if (this.introText) this.introText.destroy();
        if (this.quickText) this.quickText.destroy();
        if (this.quickDescText) this.quickDescText.destroy();
        if (this.slowText) this.slowText.destroy();
        if (this.slowDescText) this.slowDescText.destroy();
        if (this.statsText) this.statsText.destroy();
        if (this.previewSprite) this.previewSprite.destroy();

        const selectedChar = CHAR_KEYS[this.currentCharIndex];
        const charInfo = CHARACTER_INFO[selectedChar];
        const charSpriteName = selectedChar === 'legDay' ? 'pierna' : 
                               selectedChar === 'armDay' ? 'brazo' : 
                               selectedChar === 'coreDay' ? 'core' : 
                               selectedChar === 'mewingDay' ? 'mewing' : 'pierna';
        
        // sprite personaje
        this.previewSprite = this.add.sprite(600, this.cameras.main.centerY, charSpriteName);
        //this.previewSprite.setScale(0.8);
        this.previewSprite.setInteractive();
        
        // seleccionar animacion correcta
        const selectionAnimKeys = registerAnimations(this, selectedChar, 'selectionAnims');
 
        this.previewSprite.on('pointerover', () => {
            this.previewSprite.setVisible(true);
            if (selectionAnimKeys.preview) {
                this.previewSprite.play(selectionAnimKeys.preview);
            }
        });

       

        // textos de introduccion
        this.nameText = this.add.text(900, 180, charInfo.name, 
        {
            fontFamily: "Bubble",
            fontSize: "90px",
            align: "left",
            color: "#FFFFFF"
        });

        this.descText = this.add.text(900, 280, charInfo.description, 
        {
            fontFamily: "Bubble",
            fontSize: "50px",
            align: "left",
            color: "#CCCCCC"
        });

        this.introText = this.add.text(900, 380, charInfo.intro, 
        {
            fontFamily: "Bubble",
            fontSize: "50px",
            align: "left",
            color: "#AAAAAA",
            wordWrap: { width: 1300 }
        });

        this.quickText = this.add.text(900, 600, "Habilidad Rápida (6s cooldown):", 
        {
            fontFamily: "Bubble",
            fontSize: "40px",
            color: "#FFFF00"
        });

        this.quickDescText = this.add.text(900, 670, charInfo.quickAbility, 
        {
            fontFamily: "Bubble",
            fontSize: "50px",
            color: "#FFFFFF",
            wordWrap: { width: 1300 }
        });

        this.slowText = this.add.text(900, 920, "Habilidad Lenta (12s cooldown):", 
        {
            fontFamily: "Bubble",
            fontSize: "40px",
            color: "#FF0080"
        });

        this.slowDescText = this.add.text(900, 990, charInfo.slowAbility, 
        {
            fontFamily: "Bubble",
            fontSize: "50px",
            color: "#FFFFFF",
            wordWrap: { width: 1300 }
        });

        this.statsText = this.add.text(900, 1275, charInfo.stats, 
        {
            fontFamily: "Bubble",
            fontSize: "50px",
            color: "#88FF88"
        });
    }

    changeCharacter(direction) 
    {
        this.currentCharIndex += direction;

        // wrap around de los indices
        if (this.currentCharIndex >= CHAR_KEYS.length) {
            this.currentCharIndex = 0;
        } else if (this.currentCharIndex < 0) {
            this.currentCharIndex = CHAR_KEYS.length - 1;
        }
        this.displayCharacter();
    }
}
