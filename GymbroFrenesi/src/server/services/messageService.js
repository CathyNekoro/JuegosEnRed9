/**
 * Servicio de gestión de mensajes usando closures
 *
 * TODO:
 * Implementar este servicio siguiendo el patrón usado en userService.js
 *
 * Requisitos:
 * - Usar closures para mantener estado privado
 * - Mantener un array de mensajes en memoria
 * - Cada mensaje debe tener: {id, email, message, timestamp}
 * - IMPORTANTE: Verificar que el email existe usando userService.getUserByEmail()
 *   antes de crear un mensaje
 */

export function createMessageService(userService) {
  // TODO: Declarar variables privadas
  // - Array de mensajes
  // - Contador para IDs

  /**
   * Crea un nuevo mensaje
   * @param {string} nickName - nick del usuario que envía
   * @param {string} message - Contenido del mensaje
   * @returns {Object} Mensaje creado
   * @throws {Error} Si el nick no existe
   */
  function createMessage(nickName, message) {
    // TODO: Implementar
    // 1. Verificar que el usuario existe (userService.getUserByEmail)
    // 2. Si no existe, lanzar error
    // 3. Crear objeto mensaje con id, email, message, timestamp
    // 4. Agregar a la lista
    // 5. Retornar el mensaje creado
    throw new Error('createMessage() no implementado - TODO para estudiantes');
  }

  /**
   * Obtiene los últimos N mensajes
   * @param {number} limit - Cantidad de mensajes a retornar
   * @returns {Array} Array de mensajes
   */
  function getRecentMessages(limit = 50) {
    // TODO: Implementar
    // Retornar los últimos 'limit' mensajes, ordenados por timestamp
    throw new Error('getRecentMessages() no implementado - TODO para estudiantes');
  }

  /**
   * Obtiene mensajes desde un timestamp específico
   * @param {string} since - Timestamp ISO
   * @returns {Array} Mensajes nuevos desde ese timestamp
   */
  function getMessagesSince(since) {
    // TODO: Implementar
    // Filtrar mensajes cuyo timestamp sea mayor que 'since'
    throw new Error('getMessagesSince() no implementado - TODO para estudiantes');
  }

  // Exponer la API pública del servicio
  return {
    createMessage,
    getRecentMessages,
    getMessagesSince
  };
}
