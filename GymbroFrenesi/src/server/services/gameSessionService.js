const GAME_DURATION_MS = 120000;  // 2 minutos
const INITIAL_LIVES = 3;

export function createGameSessionService(io) {
    const sessions = new Map();  

    function startSession(roomId, initialFallen) {
        let session = sessions.get(roomId);
        if (!session) {
            session = {
                roomId,
                tilesFallen: [...initialFallen],
                readyCount: 1,
                dropInterval: null,
                endTimeout: null,
                phase: 'waiting',                                     // 'waiting' | 'playing' | 'ended'
                lives: { player1: INITIAL_LIVES, player2: INITIAL_LIVES },
                startTime: null
            };
            sessions.set(roomId, session);
            console.log(`[GameSession] ${roomId} creada (${initialFallen.length} tiles)`);
        } else {
            session.readyCount++;
        }
        return session;
    }

    // Arranca la partida: caída de tiles + timeout global 
    function startGame(roomId) {
        const session = sessions.get(roomId);
        if (!session || session.phase !== 'waiting') return;

        session.phase = 'playing';
        session.startTime = Date.now();

        // Aviso a clientes (por si quieren resetear su elapsed local)
        io.to(roomId).emit('gameSessionStarted', {
            startTime: session.startTime,
            duration: GAME_DURATION_MS
        });

        // Drops cada 2s
        session.dropInterval = setInterval(() => {
            const candidates = [];
            for (let i = 0; i < session.tilesFallen.length; i++) {
                if (!session.tilesFallen[i]) candidates.push(i);
            }
            if (candidates.length === 0) {
                clearInterval(session.dropInterval);
                session.dropInterval = null;
                return;
            }
            const idx = candidates[Math.floor(Math.random() * candidates.length)];
            session.tilesFallen[idx] = true;
            io.to(roomId).emit('tileFalling', { tileIndex: idx });
            console.log(`[GameSession] ${roomId}: cae tile ${idx}`);
        }, 2000);

        // Fin por tiempo
        session.endTimeout = setTimeout(() => {
            endByTime(roomId);
        }, GAME_DURATION_MS);

        console.log(`[GameSession] ${roomId}: partida arrancada`);
    }

    function pickSafeTileIndex(roomId) {
        const session = sessions.get(roomId);
        if (!session) return null;
        const candidates = [];
        for (let i = 0; i < session.tilesFallen.length; i++) {
            if (!session.tilesFallen[i]) candidates.push(i);
        }
        if (candidates.length === 0) return null;
        return candidates[Math.floor(Math.random() * candidates.length)];
    }

    /**
     * Decrementa la vida de un jugador y, si llega a 0, finaliza la partida.
     * Devuelve { lives, dead } o null si la sesión no está en juego.
     */
    function applyDamage(roomId, playerSlot) {
        const session = sessions.get(roomId);
        if (!session || session.phase !== 'playing') return null;

        session.lives[playerSlot]--;
        const remaining = session.lives[playerSlot];
        console.log(`[GameSession] ${roomId}: ${playerSlot} pierde vida (le quedan ${remaining})`);

        if (remaining <= 0) {
            const winner = playerSlot === 'player1' ? 'player2' : 'player1';
            // Damos un pequeño retraso para que el cliente pueda mostrar la animación de RIP
            setTimeout(() => endByDeath(roomId, winner, playerSlot), 1500);
            return { lives: remaining, dead: true };
        }
        return { lives: remaining, dead: false };
    }

    function endByTime(roomId) {
        const session = sessions.get(roomId);
        if (!session || session.phase !== 'playing') return;
        session.phase = 'ended';
        cleanupTimers(session);

        const p1 = session.lives.player1;
        const p2 = session.lives.player2;
        let winner;
        if (p1 > p2) winner = 'player1';
        else if (p2 > p1) winner = 'player2';
        else winner = 'tie';

        io.to(roomId).emit('gameOver', {
            winner,
            reason: 'time',
            lives: session.lives,
            elapsedMs: Date.now() - session.startTime
        });
        setTimeout(() => { if (sessions.has(roomId)) closeSession(roomId); }, 5000);
        console.log(`[GameSession] ${roomId} → gameOver por tiempo, winner=${winner}`);
    }

    function endByDeath(roomId, winner, loser) {
        const session = sessions.get(roomId);
        if (!session || session.phase !== 'playing') return;
        session.phase = 'ended';
        cleanupTimers(session);

        io.to(roomId).emit('gameOver', {
        
            winner,
            reason: 'death',
            lives: session.lives,
            elapsedMs: Date.now() - session.startTime
        });
        setTimeout(() => { if (sessions.has(roomId)) closeSession(roomId); }, 5000);
        console.log(`[GameSession] ${roomId} → gameOver por muerte de ${loser}, winner=${winner}`);
    }

    function cleanupTimers(session) {
        if (session.dropInterval) { clearInterval(session.dropInterval); session.dropInterval = null; }
        if (session.endTimeout)   { clearTimeout(session.endTimeout); session.endTimeout = null; }
    }

    function closeSession(roomId) {
        const session = sessions.get(roomId);
        if (!session) return;
        cleanupTimers(session);
        sessions.delete(roomId);
        console.log(`[GameSession] ${roomId} cerrada`);
    }

    return {
        startSession,
        startGame,
        pickSafeTileIndex,
        applyDamage,
        closeSession
    };
}