import { Api } from "./services/Api.js";
import { keepAlive } from "./services/KeepAlive.js";


 window.Api = Api;
 window.keepAlive = keepAlive;

import pantallaInicio from "./Scenes/titleScene.js";
import charSelection from "./Scenes/charSelection.js";
import creditsScene from "./Scenes/creditsScene.js";
import level1Scene from "./Scenes/level1Scene.js";
import endScene from "./Scenes/endScene.js";
import pauseScene from "./Scenes/pauseScene.js";
import tutorialIntroScene from "./Scenes/tutorialIntroScene.js";
import tutorialCharacterScene from "./Scenes/tutorialCharacterScene.js";
import accountRegScene from "./Scenes/accountRegScene.js";
import noConnectionScene from "./Scenes/noConnectionScene.js";
import serverTime from "./Scenes/serverTime.js";
import waitingRoomScene from "./Scenes/waitingRoomScene.js";
import charSelectionMulti from "./Scenes/charSelectionMulti.js";
import level1Multi from "./Scenes/level1Multi.js";

let config = {
  type: Phaser.AUTO,
  parent: "juego", //ID del elemento del DOM en el que se anidará el Canvas que genere Phaser, si no, por defecto, irá al final del body
  width: 2550,
  height: 1500,
  pixelArt: true,
  backgroundColor: "#d5d5d",
  scale: {
    autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
    mode: Phaser.Scale.FIT,
    min: {
      width: 328,
      height: 188,
    },
    max: {
      width: 2550,
      height: 1500,
    },
    zoom: 1,
  },
  scene: [
    pantallaInicio,
    charSelection,
    creditsScene,
    level1Scene,
    endScene,
    pauseScene,
    tutorialIntroScene,
    tutorialCharacterScene,
    accountRegScene,
    noConnectionScene,
    serverTime,
    waitingRoomScene,
    charSelectionMulti,
    level1Multi,
  ], //Aquí metemos todas las escenas que tendrá nuestro juego (su clase, luego cambiaremos de una a otra mediante el id)
  physics: {
    default: "arcade", //Tenemos físicas simple, arcade
    arcade: {
      gravity: { y: 200 }, //Tenemos gravedad, podemos modificarla para aumentar su fuera o disminuirla
      debug: false, // Aquí indicamos si queremos que Phaser pinte los cuerpos y fuerzas de los objetos con físicas
    },
    checkCollision: {
      up: true,
      down: true,
      left: true,
      right: true,
    },
  },
  dom: {
    createContainer: true,
  },
  title: "Gymbro Frenesi",
  version: "1.0.0",
};

const game = new Phaser.Game(config);

keepAlive.start();

game.scene.start("serverTime");
game.scene.bringToTop("serverTime");

let pausedScenes = [];

keepAlive.on("disconnected", () => {
  pausedScenes = [];
  const activeScenes = game.scene.getScenes(true);
  activeScenes.forEach((scene) => {
    const key = scene.scene.key;
    if (key !== "noConnectionScene") {
      pausedScenes.push(key);
      scene.scene.pause();
    }
  });
  if (!game.scene.isActive("noConnectionScene")) {
    const pantalla = game.scene.getScene("noConnectionScene");
    pantalla.scene.start();
    pantalla.scene.bringToTop();
  }
});

keepAlive.on("connected", () => {
  if (game.scene.isActive("noConnectionScene")) {
    game.scene.stop("noConnectionScene");
  }
  pausedScenes.forEach((key) => {
    const sceneObj = game.scene.getScene(key);
    if (sceneObj && sceneObj.scene.isPaused()) {
      sceneObj.scene.resume();
    }
  });
  pausedScenes = [];
});
