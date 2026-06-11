export function createConnectionService() {
  // Map: sessionId -> timestamp del último ping
  const connectedSessions = new Map();
  const startedAt = Date.now();

  const CONNECTION_TIMEOUT = 5000; // 5 segundos sin pingar = desconectado
  const CLEANUP_INTERVAL = 2000; // limpiamos cada 2s

  // Limpieza periódica de sesiones inactivas
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [sessionId, lastSeen] of connectedSessions) {
      if (now - lastSeen > CONNECTION_TIMEOUT) {
        connectedSessions.delete(sessionId);
        console.log(`Cliente desconectado (timeout): ${sessionId}`);
      }
    }
  }, CLEANUP_INTERVAL);

  return {
    /**
     * Registrar o actualizar la conexión de una sesión
     */
    updateConnection(sessionId) {
      // Si es la primera vez que vemos esta sesión, loggearlo
      if (!connectedSessions.has(sessionId)) {
        console.log(`Cliente conectado: ${sessionId}`);
      }
      connectedSessions.set(sessionId, Date.now());
      return connectedSessions.size;
    },

    getConnectedCount() {
      return connectedSessions.size;
    },

    stopCleanup() {
      clearInterval(cleanupInterval);
    },

    getUptime() {
      return Date.now() - startedAt;
    },
  };
}
