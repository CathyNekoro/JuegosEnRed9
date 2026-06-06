import { keepAlive } from "../services/KeepAlive.js";

function formatUptime(ms) {
    const totalSecs = Math.floor(ms / 1000);
    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    if (hours > 0) return `${hours}h ${mins}m ${secs}s`;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
}

export default class serverTime extends Phaser.Scene {
    constructor() {
        super({ key: "serverTime" });
    }

    create() {
        // Contador de conectados
        this.serverCountText = this.add.text(
            this.cameras.main.width - 30,
            30,
            `Servidor: ${keepAlive.getCount()} conectados`,
            {
                fontFamily: "something",
                fontSize: '32px',
                color: '#ffffff',
                backgroundColor: '#00000088',
                padding: { x: 12, y: 6 }
            }
        ).setOrigin(1, 0);

        // Uptime
        this.uptimeText = this.add.text(
            this.cameras.main.width - 30,
            90,
            `Activo: ${formatUptime(keepAlive.getUptime())}`,
            {
                fontFamily: "something",
                fontSize: '32px',
                color: '#ffffff',
                backgroundColor: '#00000088',
                padding: { x: 12, y: 6 }
            }
        ).setOrigin(1, 0);

        // Listener para actualizar el conteo
        this.handleCountChanged = (count) => {
            if (this.serverCountText && this.serverCountText.active) {
                this.serverCountText.setText(`Servidor: ${count} conectados`);
            }
        };
        keepAlive.on('countChanged', this.handleCountChanged);

        // Timer para uptime
        this.uptimeTimer = this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => {
                if (this.uptimeText && this.uptimeText.active) {
                    this.uptimeText.setText(`Activo: ${formatUptime(keepAlive.getUptime())}`);
                }
            }
        });

        // Limpieza (por si en algún momento decides parar la escena)
        this.events.on('shutdown', () => {
            keepAlive.off('countChanged', this.handleCountChanged);
            if (this.uptimeTimer) this.uptimeTimer.remove();
        });
    }
}