import { SocketClient } from "../services/SocketClient.js";

export default class waitingRoomScene extends Phaser.Scene {
    constructor() {
        super({ key: "waitingRoomScene" });
    }

    create() {
        const cx = this.cameras.main.width / 2;
        const cy = this.cameras.main.height / 2;

        // Fondo
        this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x111111)
            .setOrigin(0, 0);

        // Título
        this.add.text(cx, cy - 200, "Esperando rival", {
            fontFamily: "curiosness",
            fontSize: '100px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Texto animado de Buscando
        this.statusText = this.add.text(cx, cy, "Buscando rival", {
            fontFamily: "curiosness",
            fontSize: '60px',
            color: '#cccccc'
        }).setOrigin(0.5);

        let dots = 0;
        this.dotsTimer = this.time.addEvent({
            delay: 500,
            loop: true,
            callback: () => {
                dots = (dots + 1) % 4;
                this.statusText.setText("Buscando rival" + '.'.repeat(dots));
            }
        });

        // Botón cancelar
        this.add.text(cx, cy + 300, "Cancelar", {
            fontFamily: "curiosness",
            fontSize: '60px',
            color: '#ffffff',
            backgroundColor: '#aa3333',
            padding: { x: 30, y: 15 }
        })
        .setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', () => {
            SocketClient.emit('leaveQueue');
            this.scene.start("accountRegScene");
        });

        //Listeners de eventos del server 
        this.handleMatchFound = (data) => {
             console.log("[waitingRoom] matchFound recibido:", JSON.stringify(data));
            this.scene.start('charSelectionMulti', {
                roomId: data.roomId,
                yourId: data.yourId,
                players: data.players,
                currentTurn: data.currentTurn   
            });
        };

        this.handleQueueJoined = () => {
            console.log("[waitingRoom] En cola, esperando otro jugador...");
        };

        SocketClient.on('matchFound', this.handleMatchFound);
        SocketClient.on('queueJoined', this.handleQueueJoined);

        // Cleanup al salir
        this.events.on('shutdown', () => {
            SocketClient.off('matchFound', this.handleMatchFound);
            SocketClient.off('queueJoined', this.handleQueueJoined);
            if (this.dotsTimer) this.dotsTimer.remove();
        });

        // Anunciar al server que entramos en cola
        SocketClient.emit('joinQueue');
    }
}