import titleButton from "../Button/titleButton.js";

export default class creditsScene extends Phaser.Scene 
{
    constructor() {
    super({ key: "creditsScene" });
  }

  preload(){}

    create()
    {
        this.background = this.add.rectangle(0, 0, 2360, 1423,  0xFF9729); //color provisional
        this.background.setOrigin(0,0);
        
        //boton salida (quizas cree un botón salida o retroceder hijo de clase boton AUN no lo se)
        const buttonSize = 100;
        const buttonMargin = 20;
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
    }
}
