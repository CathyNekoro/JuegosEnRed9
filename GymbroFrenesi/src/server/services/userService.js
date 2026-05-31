/**
 * Servicio de gestión de usuarios usando closures
 * Este servicio mantiene el estado de los usuarios en memoria
 * y proporciona métodos para realizar operaciones CRUD
 */

export function createUserService() {
  // Estado privado: almacén de usuarios
  let users = [];
  let nextId = 1;

  /**
   * Crea un nuevo usuario
   * @param {Object} userData - { nickname, winningRounds}
   * @returns {Object} Usuario creado
   */
  function createUser(userData) {
    // 1. Validar que el email no exista ya
    const existingUser = users.find(u => u.nickName === userData.nickName);
    if (existingUser) {
      throw new Error('El nombre ya está registrado');
    }

    // 2. Crear objeto usuario con id único y createdAt
    const newUser = {
      id: String(nextId),
      nickName: userData.nickName,
      winningRounds: userData.winningRounds,
      createdAt: new Date().toISOString()
    };

    // 3. Agregar a la lista de usuarios
    users.push(newUser);

    // 4. Incrementar nextId
    nextId++;

    // 5. Retornar el usuario creado
    return newUser;
  }

  /**
   * Obtiene todos los usuarios
   * @returns {Array} Array de usuarios
   */
  function getAllUsers() {
    // TODO: Implementar
    // Retornar una copia del array de usuarios
    throw new Error('getAllUsers() no implementado');
  }

  /**
   * Busca un usuario por ID
   * @param {string} id - ID del usuario
   * @returns {Object|null} Usuario encontrado o null
   */
  function getUserById(id) {
    const user = users.find(u => u.id === id);
    return user || null;
  }

  /**
   * Busca un usuario por nickname
   * @param {string} nickName - Nombre del usuario
   * @returns {Object|null} Usuario encontrado o null
   */
  function getUserByNickName(nickName) {
    // TODO: Implementar
    // Buscar y retornar el usuario por email, o null si no existe
    // IMPORTANTE: Esta función será usada por el chat para verificar emails
    throw new Error('getUserByNickName() no implementado');
  }

  /**
   * Actualiza un usuario
   * @param {string} id - ID del usuario
   * @param {Object} updates - Campos a actualizar
   * @returns {Object|null} Usuario actualizado o null si no existe
   */
  function updateUser(id, updates) {
    // TODO: Implementar
    // 1. Buscar el usuario por id
    // 2. Si no existe, retornar null
    // 3. Actualizar solo los campos permitidos (name, avatar, level)
    // 4. NO permitir actualizar id, email, o createdAt
    // 5. Retornar el usuario actualizado
    throw new Error('updateUser() no implementado');
  }

  /**
   * Elimina un usuario
   * @param {string} id - ID del usuario
   * @returns {boolean} true si se eliminó, false si no existía
   */
  function deleteUser(id) {
    // TODO: Implementar
    // 1. Buscar el índice del usuario
    // 2. Si existe, eliminarlo del array
    // 3. Retornar true si se eliminó, false si no existía
    throw new Error('deleteUser() no implementado');
  }

  // Exponer la API pública del servicio
  return {
    createUser,
    getAllUsers,
    getUserById,
    getUserByEmail,
    updateUser,
    deleteUser
  };
}
