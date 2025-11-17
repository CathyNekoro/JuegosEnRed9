const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Servir archivos estáticos (tu juego) desde la raíz del proyecto
app.use(express.static(path.join(__dirname, '..')));

// Ruta raíz -> index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Aquí irá la lógica de multijugador a futuro
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado:', socket.id);

  // Ejemplo de canal de prueba. Lo puedes dejar para ver que funciona:
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

