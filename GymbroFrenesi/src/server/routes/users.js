/**
 * Rutas para la gestión de usuarios
 * Define los endpoints HTTP y los conecta con el controlador
 *
 * Patrón: Inyección de dependencias - recibe el controlador como parámetro
 */

import express from 'express';

export function createUserRoutes(userController) {
  const router = express.Router();

  // POST /api/users - Crear nuevo usuario
  router.post('/', userController.create);

  // GET /api/users - Obtener todos los usuarios
  router.get('/', userController.getAll);

  // GET /api/users/:id - Obtener un usuario por ID
  router.get('/:id', userController.getById);

  // PUT /api/users/:id - Actualizar un usuario
  router.put('/:id', userController.update);

  // DELETE /api/users/:id - Eliminar un usuario
  router.delete('/:id', userController.remove);

  return router;
}
