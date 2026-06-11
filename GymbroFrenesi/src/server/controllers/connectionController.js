/**
 * Controller para gestionar las conexiones de usuarios
 */
export function createConnectionController(connectionService) {
  return {
    getConnected(req, res) {
      const sessionId = req.ip || req.connection.remoteAddress;
      const count = connectionService.updateConnection(sessionId);
      res.json({ connected: count });
    },

    getConnected(req, res) {
      const sessionId = req.ip || req.connection.remoteAddress;
      const count = connectionService.updateConnection(sessionId);
      res.json({
        connected: count,
        uptime: connectionService.getUptime(),
      });
    },
  };
}
