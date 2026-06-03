import titleButton from "../UI/titleButton.js";
const SPACING_BUTTONS_X=450+30;
const SPACING_BUTTONS=150+30;


export default class accountRegScene extends Phaser.Scene 
{
  constructor() 
  {
    super({ key: "accountRegScene" });
  }

  preload() 
  {
    this.load.audio('selecMusic', 'Assets/sounds/djartmusic-i-love-my-8-bit-game-console-301272.mp3');
  }

  create() 
  {
    const centerX = this.cameras.main.width / 2;
    const firstRowY = this.cameras.main.height / 2 - 200;
    const secondRowY = this.cameras.main.height / 2 + 400;
    const startX = centerX - SPACING_BUTTONS_X;

    const buttonSize = 100;
    const buttonMargin = 20;

    this.isConnected = false;

    if(!this.music|| !this.music.isPlaying){
    this.music = this.sound.add('selecMusic', { loop: true, volume: 0.4 });
    this.music.play();}

    // boton de salida
    this.backButton = new titleButton(
        this,
        buttonSize / 2 + buttonMargin,
        buttonSize / 2 + buttonMargin,
        "<",
        () => {
            this.scene.start("titleScene");
        },
        buttonSize,
        buttonSize
    );

    this.userText = this.add.text(650, 200, "Usuario: ", 
    {
        fontFamily: "Bubble",
        fontSize: "70px",
    });

    this.passText = this.add.text(650, 300, "Contraseña: ", 
    {
        fontFamily: "Bubble",
        fontSize: "70px",
    });

    this.statusText = this.add.text(this.cameras.main.width - 300, 25, "Desconectado", 
    {
        fontFamily: "Bubble",
        fontSize: "50px",
    });

    // circulo de estado (rojo = desconectado, verde = conectado)
    this.statusCircle = this.add.circle(this.cameras.main.width - 330, 50, 20, 0xff0000);

    // text inputs para usuario y contraseña
    this.userInput = this.add.dom(this.userText.x + 800, 235).createFromHTML(
      '<input type="text" style="width: 800px; height: 70px; font-size: 50px;" placeholder="Enter username">'
    );

    this.passInput = this.add.dom(this.passText.x + 800, 335).createFromHTML(
      '<input type="password" style="width: 800px; height: 70px; font-size: 50px;" placeholder="Enter password">'
    );

    // botones cuenta (primera fila)
    this.buttonSignOut = new titleButton(
      this,
      startX,
      firstRowY,
      "Sign Out",
      () => {
        // !!! insertar logica de signout !!!
        // rojo al hacer signout 
        this.statusCircle.setFillStyle(0xff0000);
        this.statusText.setText("Desconectado");
        this.isConnected = false;

        // deshabilitar api-rest y async si la desconexion sale bien
        if (!this.isConnected) {
            this.setButtonEnabled(this.buttonAPI, false);
            this.setButtonEnabled(this.buttonAsync, false);
        }  
      },
    );

    this.buttonRegister = new titleButton(
      this,
      startX + SPACING_BUTTONS_X,
      firstRowY,
      "Register",
      () => {
        /*
        logica de register
        */
      },
    );

    this.buttonLogIn = new titleButton(
      this,
      startX + SPACING_BUTTONS_X * 2,
      firstRowY,
      "Log In",
      () => {
        // !!! insertar logica de login !!!
        // verde al hacer login 
        this.statusCircle.setFillStyle(0x00ff00);
        this.statusText.setText("Conectado");
        this.isConnected = true;

        // habilitar api-rest y async si la conexion sale bien
        if (this.isConnected) {
            this.setButtonEnabled(this.buttonAPI, true);
            this.setButtonEnabled(this.buttonAsync, true);
        }
      },
    );

    // personalizar boton login para que resalte
    this.buttonLogIn.background.clear();
    this.buttonLogIn.background.fillStyle(0x4169e1, 0.8);
    this.buttonLogIn.background.fillRoundedRect(-200, -75, 400, 150, 50);
    this.buttonLogIn.background.lineStyle(2, 0xffffff);

    this.buttonLogIn.on('pointerover', () => {
        this.buttonLogIn.background.clear();
        this.buttonLogIn.background.fillStyle(0xadd8e6, 0.8);
        this.buttonLogIn.background.fillRoundedRect(-200, -75, 400, 150, 50);
        this.buttonLogIn.background.lineStyle(2, 0xffffff);
    });

    this.buttonLogIn.on('pointerout', () => {
        this.buttonLogIn.background.clear();
        this.buttonLogIn.background.fillStyle(0x4169e1, 0.8);
        this.buttonLogIn.background.fillRoundedRect(-200, -75, 400, 150, 50);
        this.buttonLogIn.background.lineStyle(2, 0xffffff);
    });

    // botones jugar (segunda fila)
    this.buttonLocal = new titleButton(
      this,
      startX,
      secondRowY,
      "Jugar \n Local",
      () => {
        this.scene.launch("charSelection");
        this.scene.stop();
      },
    );

    this.buttonAPI = new titleButton(
      this,
      startX + SPACING_BUTTONS_X,
      secondRowY,
      "Jugar \n API-Rest",
      () => {
        if (this.isConnected) {
          /* 
          logica api rest 
          */
          this.scene.launch("charSelection");
          this.scene.stop();
        }
      },
    );

    this.buttonAsync = new titleButton(
      this,
      startX + SPACING_BUTTONS_X * 2,
      secondRowY,
      "Jugar \n Async",
      () => {
        if (this.isConnected) {
          /* 
          logica async 
          */
          this.scene.launch("charSelection");
          this.scene.stop();
        }
      },
    );

    // deshabilitar habilitar api-rest y async inicliamente hasta que el usuario se conecte
    this.setButtonEnabled(this.buttonAPI, false);
    this.setButtonEnabled(this.buttonAsync, false);
  }

  setButtonEnabled(button, enabled) {
    if (enabled) {
      button.setInteractive({ useHandCursor: true });
      button.alpha = 1;
    } else {
      button.disableInteractive();
      button.alpha = 0.5;
    }
  }
}
