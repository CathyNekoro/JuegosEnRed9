import titleButton from "../UI/titleButton.js";

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

        const Karina = this.add.text(100,300, "KARINA DIANA HINCU Correo \n universidad:kd.hincu.2023@alumnos.urjc.es Github: CathyNekoro").setScale(2).setFontFamily("curiosness").setColor("#5B0073");
        const Alex= this.add.text(100, Karina.y+150, "ALEXANDRA ALINA POP \n Correo universidad: aa.pop.2022@alumnos.urjc.es Github:JediAlex18 ").setScale(2).setFontFamily("something");
        const Axlin= this.add.text(100, Alex.y+150, " AXLIN LUENGO ORDÓÑEZ \n Correo universidad: a.luengoo.2023@alumnos.urjc.es Github: CuentaGH").setScale(2).setFontFamily("something")
       
        const Jaime= this.add.text(100, Axlin.y+200, "Créditos especiales a Jaime Nieto Méndez por toda su ayuda en el desarrollo, te queremos guapo @K, @A").setScale(2).setFontFamily("something");
         const fuentes= this.add.text(100, Jaime.y+100, "Fuentes: \n Something-exquisite-caps: anasfonts \n Curiosness DEMO: bogstav").setScale(2);
        //const Alex= this.add.text(100, font1.y, "").setScale(2).setFontFamily("something");
    }
}
