import titleButton from "../UI/titleButton.js";

export default class pauseScene extends Phaser.Scene 
{
    constructor() {
        super({ key: "pauseScene"});
    }

     preload(){}  
     
     create() {
        this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.7).setOrigin(0, 0);

        const buttonSize = 700;
        const buttonMargin = 200;

        //botón volver
        this.exitButton = new titleButton(
        this,
        this.cameras.main.width / 2,
        this.cameras.main.height / 2-150,
        "Continuar",
        () => {
            this.time.paused = false;
            this.sound.resumeAll("level1Scene");
            this.scene.resume("level1Scene");
            this.scene.stop();
        },
        buttonSize,
        buttonMargin
        );

        //botón salir
        this.exitButton = new titleButton(
        this,
        this.cameras.main.width / 2,
        this.cameras.main.height / 2 + buttonMargin,
        "Salir",
        () => {
            this.scene.start("titleScene");
            this.scene.stop();
            this.scene.stop('level1Scene'); 
        },
        buttonSize,
        buttonMargin
        );
     }

     update(){}
}

