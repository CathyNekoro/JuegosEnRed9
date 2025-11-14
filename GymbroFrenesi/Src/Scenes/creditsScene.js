import titleButton from "../Button/titleButton.js";

export default class creditsScene extends Phaser.Scene 
{
    constructor() {
    super({ key: "creditsScene" });
  }

  preload(){}

    create()
    {
        const buttonSize = 100;
        const buttonMargin = 20;
        this.exitButton = new titleButton(
        this,
        buttonSize / 2 + buttonMargin,
        buttonSize / 2,
        "<",
        () => {
            this.scene.launch("titleScene");
            this.scene.stop();
        },
        buttonSize,
        buttonSize
        );
    }
}