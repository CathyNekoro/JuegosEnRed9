export function createSocketService() {
  const sockets = new Map(); // socketId : { nickName }
  const userSockets = new Map(); // nickName : socketId

  return {
    registerSocket(socketId, nickName) {
      sockets.set(socketId, { nickName });
      userSockets.set(nickName, socketId);
      console.log(`[Socket] Autenticado: ${nickName} (${socketId})`);
    },

    unregisterSocket(socketId) {
      const userInfo = sockets.get(socketId);
      if (userInfo) {
        console.log(
          `[Socket] Desconectado: ${userInfo.nickName} (${socketId})`,
        );
        userSockets.delete(userInfo.nickName);
        sockets.delete(socketId);
      }
    },

    getUserBySocketId(socketId) {
      return sockets.get(socketId) || null;
    },

    getSocketIdByNickName(nickName) {
      return userSockets.get(nickName) || null;
    },

    getAllConnectedUsers() {
      return Array.from(sockets.values());
    },
  };
}
