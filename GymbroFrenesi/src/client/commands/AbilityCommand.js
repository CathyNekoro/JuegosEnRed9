import { Command } from "./Command.js";

export class AbilityCommand extends Command {
    constructor(player, abilityType) {
        super();
        this.player = player;
        this.abilityType = abilityType;  // 'quick' | 'slow'
    }

    execute() {
        if (!this.player.isAlive) return;
        if (this.abilityType === 'quick')      this.player.quickAbility.useAbility();
        else if (this.abilityType === 'slow')  this.player.slowAbility.useAbility();
    }

    serialize() {
        return {
            type: 'ability',
            abilityType: this.abilityType
        };
    }
}