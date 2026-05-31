/**
 * Rutas para la gestión de mensajes
 * Define los endpoints HTTP y los conecta con el controlador
 *
 * Patrón: Inyección de dependencias - recibe el controlador como parámetro
 */

import express from 'express';

export function createMessageRoutes(messageController) {
  const router = express.Router();

  // POST /api/messages - Enviar un nuevo mensaje
  router.post('/', messageController.create);

  // GET /api/messages - Obtener mensajes
  // Acepta query params: ?limit=N o ?since=timestamp
  router.get('/', messageController.getMessages);

  return router;
}
