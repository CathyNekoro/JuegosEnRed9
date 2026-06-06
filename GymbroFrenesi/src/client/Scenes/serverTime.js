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
        

        // Uptime
        this.uptimeText = this.add.text(
            this.cameras.main.width-200,
            this.cameras.main.height-100,
            `Activo: ${formatUptime(keepAlive.getUptime())}`,
            {
                fontFamily: "Bubble",
                fontSize: '40px',
                color: '#ffffff',
                backgroundColor: '#0000009d',
                padding: { x: 12, y: 6 }
            }
        ).setOrigin(1, 0);
        
        // Timer para uptime
        this.uptimeTimer = this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => {
                if (this.uptimeText && this.uptimeText.active) {
                    this.uptimeText.setText(`Server time: ${formatUptime(keepAlive.getUptime())}`);
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