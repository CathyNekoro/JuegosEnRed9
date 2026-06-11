import { SocketClient } from "../services/SocketClient.js";
import { MoveCommand } from "./MoveCommand.js";
import { AbilityCommand } from "./AbilityCommand.js";
import { TurnCommand } from "./TurnCommand.js";

export class CommandProcessor {
    constructor() {
        this.players = new Map();
        this.gameScene = null;
    }

    setPlayers(players) {
        this.players = players;
    }

    setGameScene(gameScene) {
        this.gameScene = gameScene;
    }

    // Comandos LOCALES: ejecutan y se envían por socket 
    process(command) {
    const applied = command.execute();
    if (applied) {
        SocketClient.emit('playerCommand', command.serialize());
    }
}

    // Comandos REMOTOS (recibidos por socket): reconstruimos y ejecutamos 
   processRemote(playerId, data) {
    const player = this.players.get(playerId);
    if (!player) {
        console.warn(`[CommandProcessor] Player no encontrado: ${playerId}`);
        return;
    }

    let command;
    switch (data.type) {
        case 'turn':
            command = new TurnCommand(player, data.direction);
            break;
        case 'move':
            command = new MoveCommand(player, data.direction, this.gameScene);
            break;
        case 'ability':
            command = new AbilityCommand(player, data.abilityType, this.gameScene, true);
            break;
        default:
            console.warn('[CommandProcessor] Tipo desconocido:', data.type);
            return;
    }
    command.execute();
}
}