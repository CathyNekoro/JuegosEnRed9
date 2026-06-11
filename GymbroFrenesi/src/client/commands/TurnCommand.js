import { Command } from "./Command.js";

export class TurnCommand extends Command {
    constructor(player, direction) {
        super();
        this.player = player;
        this.direction = direction;
    }

    execute() {
        if (!this.player.isAlive) return false;

        switch (this.direction) {
            case 'up':    this.player.setAngle(180); break;
            case 'down':  this.player.setAngle(0);   break;
            case 'left':  this.player.setAngle(90);  break;
            case 'right': this.player.setAngle(270); break;
        }
        this.player.direction = this.direction;
        return true;
    }

    serialize() {
        return { type: 'turn', direction: this.direction };
    }
}