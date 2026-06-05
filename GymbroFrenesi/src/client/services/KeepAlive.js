import { Api } from './Api.js';

export function createKeepAlive(options = {}) {
    const interval = options.interval || 3000;              // 3 segundos
    const failuresBeforeDisconnect = options.failures || 2; // 2 fallos seguidos = caído

    // === Estado privado ===
    let timerId = null;
    let isConnected = true;       // asumimos conectado al arrancar
    let consecutiveFailures = 0;
    let lastCount = 0;

    const listeners = {
        connected: [],
        disconnected: [],
        countChanged: []
    };

    // === Helpers ===
    function emit(event, data) {
        listeners[event].forEach(fn => {
            try {
                fn(data);
            } catch (err) {
                console.error(`[KeepAlive] Error en listener de '${event}':`, err);
            }
        });
    }

    async function ping() {
        const response = await Api.getConnectedCount();

        if (response.networkError) {
            // Fallo de red: el server no responde
            consecutiveFailures++;
            if (consecutiveFailures >= failuresBeforeDisconnect && isConnected) {
                isConnected = false;
                console.warn('[KeepAlive] Conexión con el servidor perdida');
                emit('disconnected');
            }
        } else if (response.connected !== undefined) {
            // Respuesta correcta del server
            consecutiveFailures = 0;

            if (!isConnected) {
                isConnected = true;
                console.log('[KeepAlive] Conexión restablecida');
                emit('connected');
            }

            if (response.connected !== lastCount) {
                lastCount = response.connected;
                emit('countChanged', response.connected);
            }
        }
    }

    return {
        start() {
            if (timerId !== null) return;  
            ping();  // primer ping inmediato, sin esperar el primer intervalo
            timerId = setInterval(ping, interval);
            console.log('[KeepAlive] Iniciado');
        },

        stop() {
            if (timerId !== null) {
                clearInterval(timerId);
                timerId = null;
                console.log('[KeepAlive] Detenido');
            }
        },

        isConnected() {
            return isConnected;
        },

        getCount() {
            return lastCount;
        },

        on(event, callback) {
            if (listeners[event]) listeners[event].push(callback);
        },

        off(event, callback) {
            if (!listeners[event]) return;
            const i = listeners[event].indexOf(callback);
            if (i !== -1) listeners[event].splice(i, 1);
        }
    };
}

// Singleton listo para usar
export const keepAlive = createKeepAlive();