/**
 * Servicio de gestión de usuarios usando closures
 * Este servicio mantiene el estado de los usuarios en memoria
 * y proporciona métodos para realizar operaciones CRUD
 */
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, '..', 'data', 'users.json');

export function createUserService() {
    // Estado privado
    let users = [];
    let nextId = 1;

    function loadFromDisk() {
        try {
            if (fs.existsSync(DATA_FILE)) {
                const raw = fs.readFileSync(DATA_FILE, 'utf-8');
                const data = JSON.parse(raw);
                users = data.users || [];
                nextId = data.nextId || (users.length+1);
                console.log(`[userService] Cargados ${users.length} usuarios desde disco`);
            } else {
                console.log('[userService] users.json no existe aún, empezamos vacíos');
            }
        } catch (err) {
            // Si el JSON está corrupto, empezamos vacíos sin reventar el server
            console.error('[userService] Error cargando users.json:', err.message);
            users = [];
            nextId = 1;
        }
    }

    function persist() {
        try {
            // Asegurarse de que la carpeta data/ existe
            const dir = path.dirname(DATA_FILE);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            const data = { users, nextId };
            fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
        } catch (err) {
            console.error('[userService] Error guardando users.json:', err.message);
        }
    }

    // Cargar al inicializar el service
    loadFromDisk();


    //  Helpers privados 
    function hashPassword(password) {
        return crypto.createHash('sha256').update(password).digest('hex');
    }

    function stripPassword(user) {
        // Nunca devolvemos el hash fuera del service
        const { passwordHash, ...rest } = user;
        return rest;
    }

    //  API pública 

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
            totalWins: 0,
            bestTime: null,
            createdAt: new Date().toISOString()
        };
        users.push(newUser);
        persist();
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
        const allowed = ['favoriteChar', 'totalWins', 'bestTime'];
        for (const key of allowed) {
            if (updates[key] !== undefined) user[key] = updates[key];
        }
        persist();
        return stripPassword(user);
    }

    function deleteUser(nickName) {
        const index = users.findIndex(u => u.nickName === nickName);
        if (index === -1) return false;
        users.splice(index, 1);
        persist();
        return true;
    }

    function getTopUsers(limit = 10) {
        return getAllUsers()
            .sort((a, b) => b.totalWins - a.totalWins)
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