import titleButton from "../Button/titleButton.js";
const SPACING_BUTTONS=200+30;
export default class pantallaInicio extends Phaser.Scene {
  constructor() {
    super({ key: "titleScene" });
  }

  preload() {
    this.load.image("pantallaInicio", "../Assets/Img/pantallaInicio.png");
  }

  create() {
    //fondo
    this.add.image(0, 0, "pantallaInicio").setOrigin(0, 0);

    ////botón JUGAR//// 
    this.buttonPlay = new titleButton(
        this,
        this.cameras.main.width / 2,
        this.cameras.main.height / 2 + 150,
        "Jugar",
        () => {
            this.scene.launch("charSelection");
            this.scene.stop();
        },
    );

     this.buttonCredits = new titleButton(
        this,
        this.cameras.main.width / 2,
        this.buttonPlay.y + SPACING_BUTTONS,
        "Créditos",
        () => {
            this.scene.launch("creditsScene");
            this.scene.stop();
        },
    );
  }

}
