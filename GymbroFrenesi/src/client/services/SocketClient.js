import { io } from 'socket.io-client';

/**
 * Wrapper del cliente de socket.io. Gestiona la conexión y expone
 * métodos para emitir/escuchar eventos.
 */
export function createSocketClient() {
    let socket = null;

    return {
        connect(nickName) {
            if (socket && socket.connected) {
                console.warn('[SocketClient] Ya hay conexión activa');
                return socket;
            }

            socket = io({
                auth: { nickName }
            });

            socket.on('connect', () => {
                console.log(`[SocketClient] Conectado como ${nickName} (id: ${socket.id})`);
            });

            socket.on('disconnect', (reason) => {
                console.log(`[SocketClient] Desconectado: ${reason}`);
            });

            socket.on('connect_error', (err) => {
                console.error('[SocketClient] Error de conexión:', err.message);
            });

            return socket;
        },

        disconnect() {
            if (socket) {
                socket.disconnect();
                socket = null;
                console.log('[SocketClient] Desconexión manual');
            }
        },

        isConnected() {
            return socket !== null && socket.connected;
        },

        emit(event, data) {
            if (!socket || !socket.connected) {
                console.warn(`[SocketClient] Sin conexión, no se emite '${event}'`);
                return false;
            }
            socket.emit(event, data);
            return true;
        },

        on(event, callback) {
            if (!socket) {
                console.warn(`[SocketClient] Sin socket, no se escucha '${event}'`);
                return;
            }
            socket.on(event, callback);
        },

        off(event, callback) {
            if (!socket) return;
            socket.off(event, callback);
        }
    };
}

export const SocketClient = createSocketClient();