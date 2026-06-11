import { Command } from "./Command.js";

export class AbilityCommand extends Command {
    constructor(player, abilityType, scene, isRemote = false) {
        super();
        this.player = player;
        this.abilityType = abilityType;
        this.scene = scene;
        this.isRemote = isRemote;
    }

    execute() {
        if (!this.player.isAlive) return false;

        const ability = this.abilityType === 'quick' ? this.player.quickAbility : this.player.slowAbility;
        if (!ability) return false;

        // En local, si la habilidad está en cooldown, no se emite. En remoto bypaseamos (el cooldown debería estar empezado en remoto en cuanto useAbility() corra).
        if (!this.isRemote && ability.isOnCooldown && ability.getCooldownRemaining() > 0) {
            return false;
        }

        // Resetear isMoving de todos los players para evitar que el movimiento interno de la habilidad (legQuickAbility, armQuickAbility, etc.) quede bloqueado.
        if (this.scene?.players) {
            this.scene.players.forEach(p => { p.isMoving = false; });
        }

        ability.useAbility();
        return true;
    }

    serialize() {
        return { type: 'ability', abilityType: this.abilityType };
    }
}