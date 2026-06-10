export function createRoomService() {
    const queue = [];           // jugadores esperando: [{ socketId, nickName }]
    const rooms = new Map();    // roomId → { id, players, selectionState, ... }
    let nextRoomId = 1;

    function createRoom(p1, p2) {
        const roomId = `room_${nextRoomId++}`;
        const room = {
            id: roomId,
            players: [p1, p2],
            startTime: Date.now(),
            selectionState: {
                phase: 'selecting',                                      // 'selecting' | 'playing'
                selections: { player1: null, player2: null },
                turn: 'player1'                                          // P1 elige primero
            }
        };
        rooms.set(roomId, room);
        console.log(`[Room] Creada sala ${roomId}: ${p1.nickName} vs ${p2.nickName}`);
        return room;
    }

    const service = {
        joinQueue(socketId, nickName) {
            if (queue.find(p => p.socketId === socketId)) return null;
            queue.push({ socketId, nickName });
            console.log(`[Room] ${nickName} entra en cola (cola actual: ${queue.length})`);

            if (queue.length >= 2) {
                const p1 = queue.shift();
                const p2 = queue.shift();
                return createRoom(p1, p2);
            }
            return null;
        },

        leaveQueue(socketId) {
            const idx = queue.findIndex(p => p.socketId === socketId);
            if (idx !== -1) {
                const removed = queue.splice(idx, 1)[0];
                console.log(`[Room] ${removed.nickName} sale de cola`);
            }
        },

        getRoom(roomId) {
            return rooms.get(roomId) || null;
        },

        getRoomBySocketId(socketId) {
            for (const room of rooms.values()) {
                if (room.players.some(p => p.socketId === socketId)) return room;
            }
            return null;
        },

        closeRoom(roomId) {
            if (rooms.has(roomId)) {
                console.log(`[Room] Cerrada sala ${roomId}`);
                rooms.delete(roomId);
            }
        },

        /**
         * Registra la selección de personaje de un jugador.
         * Devuelve { ok, gameReady, room, error }
         */
        selectCharacter(socketId, character) {
            const room = service.getRoomBySocketId(socketId);
            if (!room) return { ok: false, error: 'No estás en ninguna sala' };
            if (room.selectionState.phase !== 'selecting') return { ok: false, error: 'Selección ya cerrada' };

            const playerSlot = room.players[0].socketId === socketId ? 'player1' : 'player2';
            const otherSlot = playerSlot === 'player1' ? 'player2' : 'player1';

            if (room.selectionState.turn !== playerSlot) return { ok: false, error: 'No es tu turno' };
            if (room.selectionState.selections[playerSlot] !== null) return { ok: false, error: 'Ya elegiste' };
            if (room.selectionState.selections[otherSlot] === character) return { ok: false, error: 'Personaje ya elegido' };

            room.selectionState.selections[playerSlot] = character;
            console.log(`[Room] ${room.id}: ${playerSlot} eligió ${character}`);

            const bothPicked = room.selectionState.selections.player1 && room.selectionState.selections.player2;
            if (bothPicked) {
                room.selectionState.phase = 'playing';
            } else {
                room.selectionState.turn = otherSlot;
            }

            return { ok: true, gameReady: bothPicked, room };
        }
    };

    return service;
}