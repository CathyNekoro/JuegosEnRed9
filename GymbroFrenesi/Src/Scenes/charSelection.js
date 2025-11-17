import titleButton from "../Button/titleButton.js";

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
        this.exitButton = new titleButton(
        this,
        buttonSize / 2 + buttonMargin,
        buttonSize / 2 + buttonMargin,
        "<",
        () => {
            this.scene.start("level1Scene");
            this.scene.stop();
        },
        buttonSize,
        buttonSize
        );
    }

    update(time, dt)
    {

    }
}

