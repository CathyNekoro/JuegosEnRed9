import { Api } from "../services/Api.js";
import { Session } from "../services/Session.js";
const OFFSET_X=95;

export default class endScene extends Phaser.Scene 
{
    constructor() 
    {
        super({ key: "endScene" });
    }

    init(data) {
        this.winnerId = data.winner; 
        this.elapsedSecs = data.elapsedSecs;
        this.player1Char = data.player1Char;
        this.player2Char = data.player2Char
    }

    preload(){
        this.load.image('final', 'Assets/Img/escenarios/victoryScreen.png');
        document.fonts.load('1em "curiosness"');
        this.load.audio('endMusic', 'Assets/sounds/FinalMemeSong.mp3');
    }

    create() 
    {
        const fondo = this.add.image(0 + OFFSET_X, 0, "final").setOrigin(0, 0);
        this.music = this.sound.add('endMusic', { loop: true, volume: 0.4 });
        this.music.play();
        // al atualizar meter los fondos de Alex según la key. se puden usar los colores tmb guardados en la key del jugador- mirar en lvl 1 la interfaz cómo lo hace
        let winnerText  = this.winner;
        
        
        this.textEnd = this.add.text(100 + OFFSET_X ,400, winnerText, {
            fontSize: '200px',     
            fontStroke: 2,           
            color: '#FCFEB4',
            align: 'center',
            fontFamily: "curiosness"
        });

        // boton para volver al menu principal
        const returnButton = this.add.text(100 + OFFSET_X, 1300, 'Volver al Menú', {
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

        this.updateStatsIfLoggedIn();
    }

    async updateStatsIfLoggedIn() {
        if (!Session.isLoggedIn()) {
            console.log('[endScene] Sin sesión, no se envían stats');
            return;
        }

        const user = Session.getUser();
        const userWon = this.winnerId === 'player1';   // P1 = usuario logueado

        // favoriteChar siempre se actualiza (refleja con qué jugaste más recientemente)
        const updates = {
            favoriteChar: this.player1Char
        };

        if (userWon) {
            // Sólo cuenta victoria si ganó P1
            updates.totalWins = (user.totalWins || 0) + 1;

            // bestTime: el tiempo más rápido en ganar. Sólo se actualiza si es mejor
            if (user.bestTime == null || this.elapsedSecs < user.bestTime) {
                updates.bestTime = this.elapsedSecs;
            }
        }

        console.log("ANTES", updates);
        const result = await Api.updateUserStats(user.nickName, updates);
console.log("DESPUÉS", result);

        if (result.ok) {
            console.log('[endScene] Stats actualizadas:', updates);
            Session.setUser(result.user);   // refrescar usuario en memoria
        } else {
            console.error('[endScene] Error actualizando stats:', result);
        }
    }
    
    
    update(){}
}