import pantallaInicio from './Scenes/titleScene.js';
import charSelection from './Scenes/charSelection.js'

let config = {
    type: Phaser.AUTO,
    parent: 'juego', //ID del elemento del DOM en el que se anidará el Canvas que genere Phaser, si no, por defecto, irá al final del body
    width:  2048,
    height: 1423,
    pixelArt: true,
    scale: {
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY, 
        mode: Phaser.Scale.FIT,
        min: {
            width: 328,
            height: 188
        },
        max: {
            width: 1312,
            height: 752
        },
        zoom: 1
    },
    scene: [pantallaInicio], //Aquí metemos todas las escenas que tendrá nuestro juego (su clase, luego cambiaremos de una a otra mediante el id)
    physics: {  
        default: 'arcade', //Tenemos físicas simple, arcade
        arcade: { 
            gravity: { y: 200 }, //Tenemos gravedad, podemos modificarla para aumentar su fuera o disminuirla
            debug: true // Aquí indicamos si queremos que Phaser pinte los cuerpos y fuerzas de los objetos con físicas
        },
        checkCollision: {
            up: true,
            down: true,
            left: true,
            right: true
        }
    },
    title: "Gymbro Frenesi",
    version: "1.0.0"
};

new Phaser.Game(config); 