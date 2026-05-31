/**
 * Controlador de mensajes usando closures
 *
 * TODO:
 * Implementar este controlador siguiendo el patrón usado en userController.js
 *
 * Requisitos:
 * - Usar closures para encapsular las funciones
 * - Recibir el servicio como parámetro (inyección de dependencias)
 * - Manejar errores apropiadamente
 * - Usar códigos de estado HTTP correctos
 * - Validar datos de entrada
 */

export function createMessageController(messageService) {
  /**
   * POST /api/messages - Enviar un nuevo mensaje
   * Body: {email, message}
   */
  async function create(req, res, next) {
    try {
      // TODO: Implementar
      // 1. Extraer email y message del body
      // 2. Validar que ambos campos estén presentes
      // 3. Llamar a messageService.createMessage()
      // 4. Retornar 201 con el mensaje creado
      // 5. Si el email no existe, retornar 400 con error descriptivo
      throw new Error('create() no implementado - TODO para estudiantes');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/messages - Obtener mensajes
   * Query params: ?limit=N o ?since=timestamp
   */
  async function getMessages(req, res, next) {
    try {
      // TODO: Implementar
      // 1. Revisar si hay query param 'since'
      //    - Si existe, llamar a messageService.getMessagesSince()
      // 2. Si no hay 'since', revisar query param 'limit'
      //    - Llamar a messageService.getRecentMessages(limit)
      // 3. Retornar 200 con los mensajes
      throw new Error('getMessages() no implementado - TODO para estudiantes');
    } catch (error) {
      next(error);
    }
  }

  // Exponer la API pública del controlador
  return {
    create,
    getMessages
  };
}
