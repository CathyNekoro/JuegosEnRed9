const API_BASE = '/api';

export function createApi() {
    /**
     * Helper común para hacer cualquier petición.
     * Devuelve un objeto coherente con la forma { ok, ...data } siempre,
     * incluso cuando hay error de red o el server responde 4xx/5xx.
     */
    async function request(path, options = {}) {
        const url = `${API_BASE}${path}`;
        const config = {
            headers: { 'Content-Type': 'application/json' },
            ...options
        };

        try {
            const response = await fetch(url, config);

            // DELETE con 204: respuesta vacía, no parseable como JSON
            if (response.status === 204) {
                return { ok: true };
            }

            const data = await response.json();

            // Si el server respondió con 4xx/5xx, conservamos el body
            // y añadimos el status para que la escena sepa qué pasó
            if (!response.ok) {
                return { ok: false, status: response.status, ...data };
            }

            return data;
        } catch (err) {
            // Esto sólo entra si NO se pudo contactar con el server
            // (red caída, server apagado, CORS, etc.). Lo marcamos
            // específicamente para que KeepAlive.js lo detecte.
            return { 
                ok: false, 
                networkError: true, 
                error: 'No se pudo contactar con el servidor' 
            };
        }
    }

    return {
        // === Usuarios ===
        register(nickName, password, favoriteChar = null) {
            return request('/users', {
                method: 'POST',
                body: JSON.stringify({ nickName, password, favoriteChar })
            });
        },

        login(nickName, password) {
            return request('/login', {
                method: 'POST',
                body: JSON.stringify({ nickName, password })
            });
        },

        getUser(nickName) {
            return request(`/users/${nickName}`);
        },

        getAllUsers() {
            return request('/users');
        },

        updateUserStats(nickName, stats) {
            return request(`/users/${nickName}`, {
                method: 'PUT',
                body: JSON.stringify(stats)
            });
        },

        deleteUser(nickName) {
            return request(`/users/${nickName}`, {
                method: 'DELETE'
            });
        },

        // === Conexión (keep-alive) ===
        getConnectedCount() {
            return request('/connected');
        },

        // === Leaderboard ===
        getLeaderboard(limit = 10) {
            return request(`/leaderboard?limit=${limit}`);
        }
    };
}

// Instancia singleton lista para usar
export const Api = createApi();