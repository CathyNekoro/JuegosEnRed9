import { Command } from "./Command.js";

export class MoveCommand extends Command {
    constructor(player, direction, scene) {
        super();
        this.player = player;
        this.direction = direction;
        this.scene = scene;
    }

    execute() {
        if (!this.player.isAlive) return false;

        // Calcular target y aplicar dirección + ángulo (SIEMPRE, aunque luego no se mueva)
        let newX = this.player.x;
        let newY = this.player.y;
        switch (this.direction) {
            case 'up':    newY -= this.player.tileSize; this.player.setAngle(180); break;
            case 'down':  newY += this.player.tileSize; this.player.setAngle(0);   break;
            case 'left':  newX -= this.player.tileSize; this.player.setAngle(90);  break;
            case 'right': newX += this.player.tileSize; this.player.setAngle(270); break;
        }
        this.player.direction = this.direction;

        // ¿Ocupado por el otro jugador?
        let occupied = false;
        this.scene.players.forEach(p => {
            if (p === this.player) return;
            const otherTileX = Math.round(p.x + p.tileSize / 2);
            const otherTileY = Math.round(p.y + p.tileSize / 2);
            const targetTileX = Math.round(newX + this.player.tileSize / 2);
            const targetTileY = Math.round(newY + this.player.tileSize / 2);
            if (otherTileX === targetTileX && otherTileY === targetTileY) occupied = true;
        });

        if (!occupied) {
            this.player.isMoving = false;   // bypass del tween-stalled guard
            this.player.update(newX, newY, this.scene.fallingPlatforms, this.direction);
        }
        // Siempre return true para que la dirección se emita, ocupado o no
        return true;
    }

    serialize() {
        return { type: 'move', direction: this.direction };
    }
}