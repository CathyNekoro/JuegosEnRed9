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
        this.load.image('finalBrazo', 'Assets/Img/escenarios/VictoriaBrazo.png');
        this.load.image('finalCore', 'Assets/Img/escenarios/VictoriaCore.png');
        this.load.image('finalMewing', 'Assets/Img/escenarios/VictoriaMewing.png');
        this.load.image('finalPierna', 'Assets/Img/escenarios/VictoriaPierna.png');
    }

    async create() 
    {
        if(this.winnerId == 'player1'){
            this.backgroundSelect(this.player1Char);
        }
        else if(this.winnerId == 'player2'){
            this.backgroundSelect(this.player2Char);
        }
        else{
           const fondo = this.add.image(this.cameras.main.width/2, this.cameras.main.height/2,  "final").setOrigin(0.5, 0.6).setScale(1.3);
            this.add.text(this.cameras.main.width/2 ,200, "EMPATE").setFontSize(175).setFontFamily("curiosness").setColor("white").setOrigin(0.5, 0.5).setStroke('black', 9);
             this.add.text(220 ,400, "Haber jugado mejor (o peor)").setFontSize(140).setFontFamily("curiosness").setColor("white").setOrigin(0, 0).setStroke('black', 9);
        }
        this.music = this.sound.add('endMusic', { loop: true, volume: 0.4 });
        this.music.play();
    
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
        await this.updateStatsIfLoggedIn();
        if(Session.isLoggedIn()){
            await this.loadAndShowLeaderboard();
        }
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
        const result = await Api.updateUserStats(user.nickName, updates);

        if (result.ok) {
            console.log('[endScene] Stats actualizadas:', updates);
            Session.setUser(result.user);   // refrescar usuario en memoria
        } else {
            console.error('[endScene] Error actualizando stats:', result);
        }
    }
    
    
    update(){}

    backgroundSelect(charKey){
        const charKeys = ['legDay', 'armDay', 'coreDay', 'mewingDay'];
        let i = 0;
        while(charKey != charKeys[i] && i < charKeys.length){
            i++;

        }
        let imagen, color; 
        switch (i){
            case 0:
                imagen = this.add.image(0 + OFFSET_X, 0, "finalPierna").setOrigin(0, 0);
                color = "#e46797";
                break;
            case 1:
                this.add.image(0 + OFFSET_X, 0, "finalBrazo").setOrigin(0, 0);
                color = "#7a99f0";
                break;
            case 2:
                this.add.image(0 + OFFSET_X, 0, "finalCore").setOrigin(0, 0);
                color = "#7fd457";
                break;
            case 3:
                this.add.image(0 + OFFSET_X, 0, "finalMewing").setOrigin(0, 0);
                color = "#ac8e3b";
                break;
            default: 
                break;
        }
        this.add.text(this.cameras.main.width/2 ,100, "WINNER: " + this.winnerId).setFontSize(167).setFontFamily("curiosness").setColor(color).setOrigin(0.5, 0.5).setStroke('black', 9);
        return imagen;
    }

    async loadAndShowLeaderboard() {
        const lbX =  this.cameras.main.width - 700;   // posición x del ranking, esquina derecha con margen
        const rect= this.add.rectangle(lbX+380, this.cameras.main.height-380, 800, 500,  0x000000, 0.6)
        // Texto de carga mientras llega la respuesta
        const loadingText = this.add.text(lbX, this.cameras.main.height-500, "Cargando ranking...", {
            fontFamily: "curiosness",
            fontSize: '60px',
            color: '#ffffff'
        });

        const result = await Api.getLeaderboard(3);
        loadingText.destroy();

        if (!result.ok) {
            this.add.text(lbX,  this.cameras.main.height-500, "Ranking no disponible", {
                fontFamily: "curiosness",
                fontSize: '60px',
                color: '#ff6666'
            });
            return;
        }

        // Título del ranking
        this.add.text(lbX, this.cameras.main.height-600, "TOP 3", {
            fontFamily: "curiosness",
            fontSize: '120px',
            color: '#FCFEB4'
        });

        const leaderboard = result.leaderboard;
        const currentUser = Session.getUser();

        if (leaderboard.length === 0) {
            this.add.text(lbX, this.cameras.main.height-500, "Sin datos todavía", {
                fontFamily: "curiosness",
                fontSize: '50px',
                color: '#cccccc'
            });
            return;
        }

        // Pintar cada entrada
        leaderboard.forEach((user, index) => {
            const y = this.cameras.main.height-500 + index * 120;
            const isMe = currentUser && currentUser.nickName === user.nickName;
            const color = isMe ? '#ffcc00' : '#ffffff';

            const wins = user.totalWins || 0;
            const bestTime = user.bestTime != null ? ` · ${user.bestTime}s` : '';
            const text = `${index + 1}. ${user.nickName}: ${wins}W${bestTime}`;

            this.add.text(lbX, y, text, {
                fontFamily: "curiosness",
                fontSize: '60px',
                color: color
            });
        });
    }
}

