export default class endScene extends Phaser.Scene 
{
    constructor() 
    {
        super({ key: "endScene" });
    }

    init(data) {
        this.winner = data.winner;
    }

    preload(){
        this.load.image('final', 'Assets/Img/escenarios/victoryScreen.png');
        document.fonts.load('1em "curiosness"');
        this.load.audio('endMusic', 'Assets/sounds/FinalMemeSong.mp3');
    }

    create() 
    {
        console.log("coño")
        const fondo = this.add.image(0, 0, "final").setOrigin(0, 0);
        this.music = this.sound.add('endMusic', { loop: true, volume: 0.4 });
        this.music.play();
        // poner el ganador y perdedor en pantalla
        let winnerText  = this.winner;
        
        
        this.textEnd = this.add.text(100 ,400, winnerText, {
            fontSize: '200px',     
            fontStroke: 2,           
            color: '#FCFEB4',
            align: 'center',
            fontFamily: "curiosness"
        });

        // boton para volver al menu principal
        const returnButton = this.add.text(100, 1300, 'Volver al Menú', {
            fontSize: '48px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 }
        })
        .setInteractive()
        .on('pointerdown', () => {
            this.music.stop();
            this.scene.start('titleScene');
            this.scene.stop();
        });
    }

    update(){
        
    }
}