import titleButton from "../UI/titleButton.js";
import { registerDevAnimations } from "../Utils/AnimatorManager.js";

const OFFSET_Y = 100;

export default class creditsScene extends Phaser.Scene {
  constructor() {
    super({ key: "creditsScene" });
  }

  preload() {
    document.fonts.load('1em "something"');
    document.fonts.load('1em "Horsemen"');
    this.load.spritesheet("Cathy", "Assets/Img/credits/CathyNekoro.png", {
      frameWidth: 512,
      frameHeight: 512,
    });
    this.load.spritesheet("alexAnim", "Assets/Img/credits/Pop.png", {
      frameWidth: 2048,
      frameHeight: 2048,
    });
    this.load.image("Axlin", "Assets/Img/credits/lacito.png");
  }

  create() {
    this.background = this.add
      .rectangle(
        0,
        0,
        this.cameras.main.width,
        this.cameras.main.height,
        0x000000,
      )
      .setOrigin(100, 100);

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
      buttonSize,
    );

    const Karina = this.add
      .text(100, 200, "KARINA DIANA HINCU")
      .setScale(2)
      .setFontFamily("Horsemen")
      .setColor("#5B0073");
    const infoK = this.add
      .text(
        100,
        550 + OFFSET_Y,
        "programación y arte - restLESS!! T-T\nGithub: CathyNekoro \nCorreo: kd.hincu.2023@alumnos.urjc.es ",
      )
      .setScale(2)
      .setFontFamily("something")
      .setColor("#5B0073");

    //poner funetes de letra dif para cada una
    const Alex = this.add
      .text(900, 200, " ALEXANDRA ALINA POP ")
      .setScale(2)
      .setFontFamily("Horsemen")
      .setColor("#00aeff");
    const infoA1 = this.add
      .text(
        870,
        550 + OFFSET_Y,
        "arte \nGithub:JediAlex18 \nCorreo: aa.pop.2022@alumnos.urjc.es",
      )
      .setScale(2)
      .setFontFamily("something")
      .setColor("#00aeff");

    const Axlin = this.add
      .text(1600, 200, " AXLIN LUENGO ORDoNEZ")
      .setScale(2)
      .setFontFamily("Horsemen")
      .setColor("#fb90ff");
    const infoA2 = this.add
      .text(
        1600,
        550 + OFFSET_Y,
        "programación \nGithub: CuentaGH \nCorreo: a.luengoo.2023@alumnos.urjc.es",
      )
      .setScale(2)
      .setFontFamily("something")
      .setColor("#fb90ff");

    //animaciones
    const cathyAnimKey = registerDevAnimations(this, "cathy");
    this.add.sprite(400, 450, "cathyAnim").play(cathyAnimKey).setScale(0.7);

    //Anims resto
    const alexAnimKey = registerDevAnimations(this, "alex");
    this.add.sprite(1200, 450, "alexAnim").play(alexAnimKey).setScale(0.18);

    this.add.image(1950, 450, "Axlin").setScale(0.9);

    const Jaime = this.add
      .text(
        300,
        900,
        "Agradecimientos especiales a Janime555 por todo su apoyo en el desarrollo, te queremos guapo.",
      )
      .setScale(2)
      .setFontFamily("something");
    const fuentes = this.add
      .text(
        100,
        Jaime.y + 100,
        "Fuentes: \n Something-exquisite-caps: anasfonts \n Curiosness DEMO: bogstav \n Horsemen Demo: The Branded Quotes \n Ironik_rotis: Estelle Flores \n Bubble Bobble:  Almarkhatype \n GunnerGraffiti-Regular: Fitrah Type",
      )
      .setScale(2);
    const musica = this.add
      .text(
        1000,
        Jaime.y + 100,
        "Música: \n Intro: 'I Love My 8-bit Game Console' - DJARTMUSIC \n Partida: 'Retro Arcade Game Music'- MondaMusic \n Pantalla final: 'Phonk Edit'- SolarFLEX",
      )
      .setScale(2);
  }
}
