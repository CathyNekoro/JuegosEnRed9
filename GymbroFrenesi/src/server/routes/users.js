/**
 * Rutas para la gestión de usuarios
 * Define los endpoints HTTP y los conecta con el controlador
 *
 * Patrón: Inyección de dependencias - recibe el controlador como parámetro
 */
import express from 'express';

export function createUsersRouter(userController) {
    const router = express.Router();
    router.post('/users', userController.register);
    router.post('/login', userController.login);
    router.get('/users', userController.getAllUsers);                 
    router.get('/users/:nickName', userController.getUserByNickName);
    router.put('/users/:nickName', userController.updateUser);
    router.delete('/users/:nickName', userController.deleteUser);
    
    return router;
}
