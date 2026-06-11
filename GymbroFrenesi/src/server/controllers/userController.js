/**
 * Controlador de usuarios usando closures
 * Este controlador maneja las peticiones HTTP relacionadas con usuarios
 * y utiliza el userService para las operaciones de datos
 *
 * Patrón: Inyección de dependencias - recibe el servicio como parámetro
**/


  export function createUserController(userService) {
    return {
      // POST /users
      register(req, res) {
          const { nickName, password, favoriteChar } = req.body;

          try {
              const user = userService.createUser({ nickName, password, favoriteChar });
              console.log(`Usuario registrado: ${user.nickName}`);
              res.status(201).json({ ok: true, user });
          } catch (err) {
              // Errores de validación o duplicado: 400 Bad Request
              res.status(400).json({ ok: false, error: err.message });
          }
      },

      login(req, res) {
          const { nickName, password } = req.body;

          if (!nickName || !password) {
              return res.status(400).json({ 
                  ok: false, 
                  error: 'Faltan nickName o password' 
              });
          }

          if (!userService.verifyPassword(nickName, password)) {
              // Mismo mensaje tanto si el usuario no existe como si la contraseña está mal. Si los mensajes son distintos, un atacante puede saber qué nicks existen.
              return res.status(401).json({ 
                  ok: false, 
                  error: 'Credenciales incorrectas' 
              });
          }

          const user = userService.getUserByNickName(nickName);
          console.log(`Login OK: ${user.nickName}`);
          res.json({ ok: true, user });
      },

      // GET /users
      getAllUsers(req, res) {
          const users = userService.getAllUsers();
          res.json({ ok: true, users });
      },

      // GET /users/:nickName
      getUserByNickName(req, res) {
          const { nickName } = req.params;   // sale de la URL, no del body
          const user = userService.getUserByNickName(nickName);

          if (!user) {
              return res.status(404).json({ 
                  ok: false, 
                  error: 'Usuario no encontrado' 
              });
          }

          res.json({ ok: true, user });
      },

        /**
       * PUT /api/users/:id - Actualizar un usuario
       */
        updateUser(req, res) {
        const { nickName } = req.params;
        const updates = req.body;

        const updated = userService.updateUser(nickName, updates);
        if (!updated) {
            return res.status(404).json({ 
                ok: false, 
                error: 'Usuario no encontrado' 
            });
        }

        console.log(`Usuario actualizado: ${nickName}`);
        res.json({ ok: true, user: updated });
    },
    // DELETE /users/:nickName
    deleteUser(req, res) {
        const { nickName } = req.params;
        const deleted = userService.deleteUser(nickName);

        if (!deleted) {
            return res.status(404).json({ 
                ok: false, 
                error: 'Usuario no encontrado' 
            });
        }

        console.log(`Usuario eliminado: ${nickName}`);
        res.json({ ok: true, deleted: nickName }); 
    }
  };

  // Exponer la API pública del controlador
  return {
    create,
    getAll,
    getById,
    update,
    remove
  };
}
