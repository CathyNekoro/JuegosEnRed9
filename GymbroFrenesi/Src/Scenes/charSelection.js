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
        this.load.image('personajes', '../Assets/Img/personajes.png')
    }

    create() 
    {
        this.add.image(0, 0, 'personajes').setOrigin(0, 0);
        //boton salida (quizas cree un botón salida o retroceder hijo de clase boton AUN no lo se)
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
            this.scene.stop();
        },
        buttonSize,
        buttonSize
        );

        // boton de seleccion personaje 1
        this.exitButton = new charSelectButton(
        this,
        325,
        805,
        "",
        () => {
            this.scene.start("level1Scene");
            this.scene.stop();
        });

        // boton de seleccion personaje 2
        this.exitButton = new charSelectButton(
        this,
        815,
        805,
        "",
        () => {
            this.scene.start("level1Scene");
            this.scene.stop();
        });

        // boton de seleccion personaje 3
        this.exitButton = new charSelectButton(
        this,
        1292,
        805,
        "",
        () => {
            this.scene.start("level1Scene");
            this.scene.stop();
        });

        // boton de seleccion personaje 4
        this.exitButton = new charSelectButton(
        this,
        1781,
        805,
        "",
        () => {
            this.scene.start("level1Scene");
            this.scene.stop();
        });

        
    }

    update(time, dt)
    {

    }
}

