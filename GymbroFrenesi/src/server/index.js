import express from 'express';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';

import { createConnectionService } from './services/connectionService.js';
import { createConnectionController } from './controllers/connectionController.js';
import { createConnectionsRouter } from './routes/connections.js';

import { createUserService } from './services/userService.js';
import { createUserController } from './controllers/userController.js';
import { createUsersRouter } from './routes/users.js';

// Recrear __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;

app.use(express.json()); 

// === Instanciamos los services y controllers (inyección de dependencias) ===
const connectionService = createConnectionService();
const connectionController = createConnectionController(connectionService);
const userService = createUserService();                       
const userController = createUserController(userService); 

// === Estáticos del cliente ===
app.use(express.static(path.join(__dirname, '..', '..', 'dist')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..','dist', 'index.html'));
});

// === Routers REST ===
app.use('/', createConnectionsRouter(connectionController));
app.use('/', createUsersRouter(userController));      

// === Sockets (Fase 4, lo dejamos como estaba) ===
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado:', socket.id);
  socket.on('ping-servidor', () => {
    console.log('Ping recibido de', socket.id);
    socket.emit('pong-cliente');
  });
  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});