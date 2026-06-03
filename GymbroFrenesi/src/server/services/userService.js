/**
 * Servicio de gestión de usuarios usando closures
 * Este servicio mantiene el estado de los usuarios en memoria
 * y proporciona métodos para realizar operaciones CRUD
 */
import crypto from 'crypto';

export function createUserService() {
    // Estado privado
    let users = [];
    let nextId = 1;

    // === Helpers privados ===
    function hashPassword(password) {
        return crypto.createHash('sha256').update(password).digest('hex');
    }

    function stripPassword(user) {
        // Nunca devolvemos el hash fuera del service
        const { passwordHash, ...rest } = user;
        return rest;
    }

    // === API pública ===

    function createUser(userData) {
        const { nickName, password, favoriteChar = null } = userData;

        // Validación nombre
        if (!nickName || typeof nickName !== 'string' || nickName.trim().length === 0) {
            throw new Error('El nickName es obligatorio');
        }
        // Validación contraseña
        if (!password || typeof password !== 'string') {
            throw new Error('La contraseña es obligatoria');
        }

        // Comprobar duplicado
        if (users.find(u => u.nickName === nickName)) {
            throw new Error('El nickName ya está registrado');
        }
        //crear user
        const newUser = {
            id: String(nextId++),
            nickName: nickName.trim(),
            passwordHash: hashPassword(password),
            favoriteChar,
            maxScore: 0,
            totalWins: 0,
            bestTime: null,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        return stripPassword(newUser);
    }
    
    function getUserByNickName(nickName) {
        const user = users.find(u => u.nickName === nickName);
        return user ? stripPassword(user) : null;
    }

    function verifyPassword(nickName, password) {
        const user = users.find(u => u.nickName === nickName);
        if (!user) return false;
        return user.passwordHash === hashPassword(password);
    }

    function getAllUsers() {
        return users.map(stripPassword);
    }

    function updateUser(nickName, updates) {
        const user = users.find(u => u.nickName === nickName);
        if (!user) return null;

        // Whitelist: nunca dejamos cambiar nickName, id, passwordHash, createdAt desde aquí
        const allowed = ['favoriteChar', 'maxScore', 'totalWins', 'bestTime'];
        for (const key of allowed) {
            if (updates[key] !== undefined) user[key] = updates[key];
        }
        return stripPassword(user);
    }

    function deleteUser(nickName) {
        const index = users.findIndex(u => u.nickName === nickName);
        if (index === -1) return false;
        users.splice(index, 1);
        return true;
    }

    function getTopUsers(limit = 10) {
        return getAllUsers()
            .sort((a, b) => b.maxScore - a.maxScore)
            .slice(0, limit);
    }

    return {
        createUser,
        getUserByNickName,
        verifyPassword,
        getAllUsers,
        updateUser,
        deleteUser,
        getTopUsers
    };
}