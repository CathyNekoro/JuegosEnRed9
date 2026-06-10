import express from "express";
import path from "path";
import http from "http";
import { Server } from "socket.io";
import { fileURLToPath } from "url";

import { createConnectionService } from "./services/connectionService.js";
import { createConnectionController } from "./controllers/connectionController.js";
import { createConnectionsRouter } from "./routes/connections.js";

import { createUserService } from "./services/userService.js";
import { createUserController } from "./controllers/userController.js";
import { createUsersRouter } from "./routes/users.js";

import { createLeaderboardController } from "./controllers/leaderboardController.js";
import { createLeaderboardRouter } from "./routes/leaderboard.js";

import { createSocketService } from "./services/socketService.js";
import { createRoomService } from "./services/roomService.js";
// Recrear __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;

app.use(express.json());

//  Instanciamos los services y controllers (inyección de dependencias) 
const connectionService = createConnectionService();
const connectionController = createConnectionController(connectionService);
const userService = createUserService();
const userController = createUserController(userService);

const leaderboardController = createLeaderboardController(userService);

const socketService = createSocketService();
const roomService = createRoomService();

//  Estáticos del cliente 
app.use(express.static(path.join(__dirname, "..", "..", "dist")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "dist", "index.html"));
});

//  Routers REST 
app.use("/api", createConnectionsRouter(connectionController));
app.use("/api", createUsersRouter(userController));
app.use("/api", createLeaderboardRouter(leaderboardController));
//  Sockets (Fase 4, lo dejamos como estaba) 
io.on("connection", (socket) => {
  const nickName = socket.handshake.auth?.nickName;

  if (!nickName) {
    console.warn(
      `[Socket] Conexión sin autenticación, rechazada: ${socket.id}`,
    );
    socket.disconnect();
    return;
  }

  const user = userService.getUserByNickName(nickName);
  if (!user) {
    console.warn(`[Socket] Usuario no encontrado, rechazado: ${nickName}`);
    socket.disconnect();
    return;
  }

  socketService.registerSocket(socket.id, nickName);

  socket.on("leaveRoom", () => {
    const room = roomService.getRoomBySocketId(socket.id);
    if (room) {
      socket.to(room.id).emit("opponentLeft", { reason: "opponent_quit" });
      roomService.closeRoom(room.id);
    }
  });

  //  Matchmaking 
  socket.on("joinQueue", () => {
    const room = roomService.joinQueue(socket.id, nickName);

    if (room) {
      const [p1, p2] = room.players;
      const matchData = {
        roomId: room.id,
        players: {
          player1: { nickName: p1.nickName },
          player2: { nickName: p2.nickName },
        },
        currentTurn: "player1",
      };

      io.to(p1.socketId).emit("matchFound", {
        ...matchData,
        yourId: "player1",
      });
      io.to(p2.socketId).emit("matchFound", {
        ...matchData,
        yourId: "player2",
      });

      io.sockets.sockets.get(p1.socketId)?.join(room.id);
      io.sockets.sockets.get(p2.socketId)?.join(room.id);
    } else {
      socket.emit("queueJoined");
    }
  });

  socket.on("selectCharacter", ({ character }) => {
    console.log(`[server] selectCharacter de ${nickName}: ${character}`);
    const result = roomService.selectCharacter(socket.id, character);

    if (!result.ok) {
      console.log(`[server] selección rechazada: ${result.error}`);
      socket.emit("selectionRejected", { reason: result.error });
      return;
    }

    const { room, gameReady } = result;

    if (gameReady) {
      const [p1, p2] = room.players;
      const gameData = {
        roomId: room.id,
        players: {
          player1: {
            nickName: p1.nickName,
            character: room.selectionState.selections.player1,
          },
          player2: {
            nickName: p2.nickName,
            character: room.selectionState.selections.player2,
          },
        },
      };
      io.to(p1.socketId).emit("gameStart", { ...gameData, yourId: "player1" });
      io.to(p2.socketId).emit("gameStart", { ...gameData, yourId: "player2" });
      console.log(
        `[Room] ${room.id} → gameStart: ${gameData.players.player1.character} vs ${gameData.players.player2.character}`,
      );
    } else {
      io.to(room.id).emit("selectionUpdated", {
        selections: room.selectionState.selections,
        currentTurn: room.selectionState.turn,
      });
    }
  });

  socket.on("leaveQueue", () => {
    roomService.leaveQueue(socket.id);
    socket.emit("queueLeft");
  });

  //  Desconexión 
  socket.on("disconnect", () => {
    // Sacar de la cola si estaba esperando
    roomService.leaveQueue(socket.id);

    // Si estaba en una sala activa, avisar al rival
    const room = roomService.getRoomBySocketId(socket.id);
    if (room) {
      socket.to(room.id).emit("opponentLeft", { reason: "disconnect" });
      roomService.closeRoom(room.id);
    }

    socketService.unregisterSocket(socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
