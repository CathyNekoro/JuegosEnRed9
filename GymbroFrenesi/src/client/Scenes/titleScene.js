import titleButton from "../UI/titleButton.js";
const SPACING_BUTTONS=150+30;

export default class pantallaInicio extends Phaser.Scene 
{
  constructor() 
  {
    super({ key: "titleScene" });
  }

  preload() 
  {
    this.load.image("pantallaInicio", "../Assets/Img/pantallaInicio1.png");
    this.load.audio('selecMusic', 'Assets/sounds/djartmusic-i-love-my-8-bit-game-console-301272.mp3');
  }

  create() 
  {
    //fondo
    this.add.image(0, 0, "pantallaInicio").setOrigin(0, 0);

    if(!this.music|| !this.music.isPlaying){
    this.music = this.sound.add('selecMusic', { loop: true, volume: 0.4 });
    this.music.play();}

    ////botón JUGAR//// 
    this.buttonPlay = new titleButton(
      this,
      this.cameras.main.width / 2-150,
      this.cameras.main.height / 2 + 250,
      "Jugar",
      () => {
        this.scene.launch("charSelection");
        this.scene.stop();
      },
    );

    this.buttonPlay = new titleButton(
      this,
      this.cameras.main.width / 2-150,
      this.buttonPlay.y + SPACING_BUTTONS,
      "Tutorial",
      () => {
        this.scene.launch("tutorialIntroScene");
        this.scene.stop();
      },
    );

    this.buttonCredits = new titleButton(
      this,
      this.cameras.main.width / 2 -150,
      this.buttonPlay.y + SPACING_BUTTONS,
      "Créditos",
      () => {
          this.scene.launch("creditsScene");
          this.scene.stop();
      },
    );


    
  }
}
