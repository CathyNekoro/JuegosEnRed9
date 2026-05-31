/**
 * Controlador de usuarios usando closures
 * Este controlador maneja las peticiones HTTP relacionadas con usuarios
 * y utiliza el userService para las operaciones de datos
 *
 * Patrón: Inyección de dependencias - recibe el servicio como parámetro
 */

export function createUserController(userService) {
  /**
   * POST /api/users - Crear nuevo usuario
   */
  async function create(req, res, next) {
    try {
      // 1. Extraer datos del body: email, name, avatar, level
      const { email, name, avatar, level } = req.body;

      // 2. Validar que los campos requeridos estén presentes (email, name)
      if (!email || !name) {
        return res.status(400).json({
          error: 'Los campos email y name son obligatorios'
        });
      }

      // 3. Llamar a userService.createUser()
      const newUser = userService.createUser({ email, name, avatar, level });

      // 4. Retornar 201 con el usuario creado
      res.status(201).json(newUser);
    } catch (error) {
      // 5. Si hay error (ej: email duplicado), retornar 400
      if (error.message === 'El email ya está registrado') {
        return res.status(400).json({ error: error.message });
      }
      next(error);
    }
  }

  /**
   * GET /api/users - Obtener todos los usuarios
   */
  async function getAll(req, res, next) {
    try {
      // TODO: Implementar
      // 1. Llamar a userService.getAllUsers()
      // 2. Retornar 200 con el array de usuarios
      throw new Error('getAll() no implementado');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/users/:id - Obtener un usuario por ID
   */
  async function getById(req, res, next) {
    try {
      // 1. Extraer el id de req.params
      const { id } = req.params;

      // 2. Llamar a userService.getUserById()
      const user = userService.getUserById(id);

      // 3. Si no existe, retornar 404
      if (!user) {
        return res.status(404).json({
          error: 'Usuario no encontrado'
        });
      }

      // 4. Si existe, retornar 200 con el usuario
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/users/:id - Actualizar un usuario
   */
  async function update(req, res, next) {
    try {
      // TODO: Implementar
      // 1. Extraer el id de req.params
      // 2. Extraer los campos a actualizar del body
      // 3. Llamar a userService.updateUser()
      // 4. Si no existe, retornar 404
      // 5. Si existe, retornar 200 con el usuario actualizado
      throw new Error('update() no implementado');
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/users/:id - Eliminar un usuario
   */
  async function remove(req, res, next) {
    try {
      // TODO: Implementar
      // 1. Extraer el id de req.params
      // 2. Llamar a userService.deleteUser()
      // 3. Si no existía, retornar 404
      // 4. Si se eliminó, retornar 204 (No Content)
      throw new Error('remove() no implementado');
    } catch (error) {
      next(error);
    }
  }

  // Exponer la API pública del controlador
  return {
    create,
    getAll,
    getById,
    update,
    remove
  };
}
