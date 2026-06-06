/* Mantiene el usuario logueado actualmente en memoria.
* No persiste entre recargas de página — si refrescas, te toca volver a hacer login.
*/

export function createSession() {
    let currentUser = null;

    return {
        setUser(user) {
            currentUser = user;
            console.log(`[Session] Usuario logueado: ${user.nickName}`);
        },

        getUser() {
            return currentUser;
        },

        getNickName() {
            return currentUser ? currentUser.nickName : null;
        },

        isLoggedIn() {
            return currentUser !== null;
        },

        clear() {
            console.log(`[Session] Logout`);
            currentUser = null;
        }
    };
}
export const Session = createSession();