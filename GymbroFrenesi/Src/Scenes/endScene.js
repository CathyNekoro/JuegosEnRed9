export default class endScene extends Phaser.Scene 
{
    constructor() 
    {
        super({ key: "endScene" });
    }

    init(data) {
        this.winner = data.winner;
        this.loser = data.loser;
    }

    preload(){
        this.load.image('fondo', '../Assets/Img/fondoSelecPersonajes.png');
    }

    create() 
    {
        this.add.image(0, 0, 'fondo').setOrigin(0, 0);

        // poner el ganador y perdedor en pantalla
        let winnerText  = this.winner;
        let loserText  = this.loser;
        
        this.textEnd = this.add.text(325, 50, `Ganador: ${winnerText}\nPerdedor: ${loserText}`, {
            fontSize: '64px',     
            strokeThickness: 20,            
            color: '#000000',
            align: 'center',
        });

        // boton para volver al menu principal
        const returnButton = this.add.text(600, 500, 'Volver al Menú', {
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