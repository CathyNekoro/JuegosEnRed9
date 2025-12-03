import titleButton from "../Button/titleButton.js";

export default class creditsScene extends Phaser.Scene 
{
    constructor() {
    super({ key: "creditsScene" });
  }

  preload(){}

    create()
    {
        this.background = this.add.rectangle(0, 0, 2360, 1423,  0x656B59); //color provisional
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

        const font1 = this.add.text(100,300, "KARINA DIANA HINCU Correo \n universidad:kd.hincu.2023@alumnos.urjc.es Github: CathyNekoro \n AXLIN LUENGO ORDÓÑEZ \n Correo universidad: a.luengoo.2023@alumnos.urjc.es Github: CuentaGH \n ALEXANDRA ALINA POP \n Correo universidad: aa.pop.2022@alumnos.urjc.es Github:JediAlex18 \n Fuente: Something-exquisite-caps:  anasfonts").setScale(2).setFontFamily("something");
    
    }
}
