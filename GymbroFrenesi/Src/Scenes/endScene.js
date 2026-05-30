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
        this.load.image("final", "Assets/Img/escenarios/victoryScreen.png");
        document.fonts.load('1em "curiosness"');
    }

    create() 
    {
        const fondo = this.add.image(0, 0, "final").setOrigin(0, 0);

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
            this.scene.start('titleScene');
        });
    }

    update(){
        
    }
}