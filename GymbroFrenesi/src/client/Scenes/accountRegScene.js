import titleButton from "../UI/titleButton.js";
import { Api } from "../services/Api.js";
import { Session } from "../services/Session.js";
import { SocketClient } from "../services/SocketClient.js";

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
    this.load.image('basuraIcono', 'Assets/Img/basura.png')
  }

  create() 
  {
    this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height,  0x0d0d0d).setOrigin(0,0);
    console.log("isLoggedIn:", Session.isLoggedIn());
console.log("user:", Session.getUser());
    const centerX = this.cameras.main.width / 2;
    const firstRowY = this.cameras.main.height / 2 - 200;
    const secondRowY = this.cameras.main.height / 2 + 400;
    const startX = centerX - SPACING_BUTTONS_X;

    const buttonSize = 100;
    const buttonMargin = 20;

    this.isConnected = false;

//helpers
const setLoggedInUI = () => {
    this.statusCircle.setFillStyle(0x00ff00);
    this.statusText.setText("Conectado");
    this.isConnected = true;
    
    this.setButtonEnabled(this.buttonAPI, true);
    this.setButtonEnabled(this.buttonAsync, true); 
    this.setButtonEnabled(this.buttonDelete, true);
    this.setButtonEnabled(this.buttonLocal, false)
};

const setLoggedOutUI = () => {
    this.statusCircle.setFillStyle(0xff0000);
    this.statusText.setText("Desconectado");
    this.isConnected = false;
    this.setButtonEnabled(this.buttonAPI, false);
    this.setButtonEnabled(this.buttonAsync, false);
    this.setButtonEnabled(this.buttonDelete, false);
    this.setButtonEnabled(this.buttonLocal, true)
};

    //botón de borrar
    this.buttonDelete = new titleButton(
    this,
    startX + SPACING_BUTTONS_X * 3 - 300,
    this.cameras.main.height/6+40,
    "",
    async () => {
        const user = Session.getUser();
        if (!user) {
            showFeedback("Inicia sesión primero");
            return;
        }

        const result = await Api.deleteUser(user.nickName);

        if (result.ok) {
          Session.clear();
          SocketClient.disconnect();
          setLoggedOutUI();                                                
          showFeedback(`Cuenta "${user.nickName}" eliminada`, "#cccccc");
          this.userInput.getChildByName('username').value = '';
          this.passInput.getChildByName('password').value = '';
    } else {
            showFeedback(result.error || "Error al borrar cuenta");
        }
    },
    100,
);
  const papelera = this.add.image(0, 0, 'basuraIcono').setScale(0.3);
  this.buttonDelete.add(papelera);

// Mover el texto un poco a la derecha para que no se solape
this.buttonDelete.label.setX(40);

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
      '<input name="username" type="text" maxlength="8" style="width: 800px; height: 70px; font-size: 50px;" placeholder="Enter username">'
    );

    this.passInput = this.add.dom(this.passText.x + 800, 335).createFromHTML(
      '<input name="password" style="width: 800px; height: 70px; font-size: 50px;" placeholder="Enter password">'
    );

    this.events.on('pause', () => {
      this.userInput.setVisible(false);
      this.passInput.setVisible(false);
    });
    this.events.on('resume', () => {
        this.userInput.setVisible(true);
        this.passInput.setVisible(true);
    });

    this.feedbackText = this.add.text(650, 420, "", {
    fontFamily: "Bubble",
    fontSize: "40px",
    color: "#ff0000"
    });

    const readCredentials = () => ({
    nickName: this.userInput.getChildByName('username').value.trim(),
    password: this.passInput.getChildByName('password').value
    });

    const showFeedback = (message, color = "#ff0000") => {
        this.feedbackText.setColor(color);
        this.feedbackText.setText(message);
    };


    // botones cuenta (primera fila)
    this.buttonSignOut = new titleButton(
      this,
      startX,
      firstRowY,
      "Sign Out",
      () => {
        if(!this.isConnected)
          { 
            showFeedback("Sesión sin iniciar", "#f80000");
            return
          }
        Session.clear();
        SocketClient.disconnect(); 
        setLoggedOutUI();                                                 
        showFeedback("Sesión cerrada", "#cccccc");
    },
    );

    this.buttonRegister = new titleButton(
      this,
      startX + SPACING_BUTTONS_X,
      firstRowY,
      "Register",
      async () => {
          const { nickName, password } = readCredentials();

          if (!nickName || !password) {
              showFeedback("Rellena usuario y contraseña");
              return;
          }

          const result = await Api.register(nickName, password);

          if (result.ok) {
              showFeedback("Cuenta creada — ya puedes hacer login", "#00cc00");
          } else {
              showFeedback(result.error || "Error en el registro");
          }
      },
    );

    this.buttonLogIn = new titleButton(
      this,
      startX + SPACING_BUTTONS_X * 2,
      firstRowY,
      "Log In",
      async () => {
        const { nickName, password } = readCredentials();

        if (!nickName || !password) {
            showFeedback("Rellena usuario y contraseña");
            return;
        }

        const result = await Api.login(nickName, password);
        if(this.isConnected){showFeedback("¡Sesión ya iniciada!", "#ffffff")
          return;
        }
        if (result.ok) {
            Session.setUser(result.user);
            SocketClient.connect(result.user.nickName);
            setLoggedInUI();                                              
            showFeedback(`¡Hola ${result.user.nickName}!`, "#00cc00");
        } else {
            showFeedback(result.error || "Credenciales incorrectas");
        }
    },
    );

    // personalizar boton login para que resalte
    this.buttonLogIn.background.clear();
    this.buttonLogIn.background.fillStyle(0x366a8a, 0.5);
    this.buttonLogIn.background.fillRoundedRect(-200, -75, 400, 150, 50);
    this.buttonLogIn.background.lineStyle(2, 0xffffff);

    this.buttonLogIn.on('pointerover', () => {
        this.buttonLogIn.background.clear();
        this.buttonLogIn.background.fillStyle(0x366a8a, 0.8);
        this.buttonLogIn.background.fillRoundedRect(-200, -75, 400, 150, 50);
        this.buttonLogIn.background.lineStyle(2, 0xffffff);
    });

    this.buttonLogIn.on('pointerout', () => {
        this.buttonLogIn.background.clear();
        this.buttonLogIn.background.fillStyle(0x366a8a, 0.5);
        this.buttonLogIn.background.fillRoundedRect(-200, -75, 400, 150, 50);
        this.buttonLogIn.background.lineStyle(2, 0xffffff);
    });

    // botones jugar (segunda fila)
    this.buttonLocal = new titleButton(
      this,
      startX,
      secondRowY,
      "Offline \n single",
      () => {
        this.scene.launch("charSelection");
        this.scene.stop();
      },
    );

    this.buttonAPI = new titleButton(
      this,
      startX + SPACING_BUTTONS_X,
      secondRowY,
      "Online \n single",
      () => {
        if (this.isConnected) {
          
          this.scene.launch("charSelection");
          this.scene.stop();
          console.log("isLoggedIn:", Session.isLoggedIn());
          console.log("user:", Session.getUser());
        }
      },
    );

    this.buttonAsync = new titleButton(
      this,
      startX + SPACING_BUTTONS_X * 2,
      secondRowY,
      "Online \n multi",
      () => {
        if (this.isConnected) {
            this.scene.start("waitingRoomScene");
            this.scene.stop();
        }    
      },
    );

    // deshabilitar habilitar api-rest y async inicliamente hasta que el usuario se conecte
    this.setButtonEnabled(this.buttonAPI, false);
    this.setButtonEnabled(this.buttonAsync, false);

    // Si ya hay sesión activa, restaurar la UI a estado logueado
    if (Session.isLoggedIn()) {
        setLoggedInUI();
        this.userInput.getChildByName('username').value = Session.getNickName();
        if (!SocketClient.isConnected()) {
          SocketClient.connect(Session.getNickName());
        }
    } else {
        setLoggedOutUI();  // estado por defecto explícito
    }
    
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
