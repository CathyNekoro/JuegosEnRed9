const quickCooldown = 6000; // 6 segundos de cooldown
const slowCooldown = 12000; // 12 segundos de cooldown

export default class Abilities
{
    constructor(player, scene, id, type, abilityType){

        this.player = player;
        this.scene = scene;
        
        this.id = id; // identificador unico de la habilidad
        this.type = type; // tipo del judador: leg, arm, pec, mog
        this.abilityType = abilityType; // slowAbility o quickAbility
        this.skillOneCooldown = slowCooldown;
        this.skillTwoCooldown = quickCooldown;
        this.isOnCooldown = false;
        this.cooldownTimer = null;
    }


    useAbility(){
        
        console.log(this.player.type);
        console.log(this.abilityType);
        console.log("in useAbility");

        if(!this.player.isAlive) return;
        if(this.isOnCooldown) return;

        if(this.abilityType === "quickAbility"){
            if(this.type === 'legDay'){
                this.legQuickAbility();
            } else if(this.type === 'armDay'){
                this.armQuickAbility();
            } else if(this.type === 'coreDay'){
                this.pecQuickAbility();
            } else if(this.type === 'mewingDay'){
                this.mogQuickAbility();
            }
        }

        if(this.abilityType === "slowAbility"){
            if(this.type === 'legDay'){
              this.legSlowAbility();
            } else if(this.type === 'armDay'){
               this.armSlowAbility();
            } else if(this.type === 'coreDay'){
                this.pecSlowAbility();
            } else if(this.type === 'mewingDay'){
                this.mogSlowAbility();
            }
        }
        
    }
    
    legQuickAbility(){

        // saltar 2 casillas en la direccion elegida

        console.log("in legQuickAbility");

        let newX = this.player.x;
        let newY = this.player.y;
        const direction = this.player.direction;
        const tileSize = this.player.tileSize;
        let occupied = false;

        // moverse 1 casilla en la direccion del jugador
        if (direction === 'up') {
            newY -= this.player.tileSize; // 1 tile de movimiento
        }
        else if (direction === 'down') {
            newY += this.player.tileSize;
        }
        else if (direction === 'left') {
            newX -= this.player.tileSize;
        }
        else if (direction === 'right') {
            newX += this.player.tileSize;
        }

        // comprobar si esta ocupada 
        const targetTileX = Math.round(newX + tileSize / 2);
        const targetTileY = Math.round(newY + tileSize / 2);

        this.scene.players.forEach(p => {
            const otherTileX = Math.round(p.x + p.tileSize / 2);
            const otherTileY = Math.round(p.y + p.tileSize / 2);
            if (otherTileX === targetTileX && otherTileY === targetTileY)
                occupied = true;
        });

	    // moverse 1 casilla en la direccion del jugador
        if (direction === 'up') {
            newY -= this.player.tileSize; // 2 tiles de movimiento en total
        }
        else if (direction === 'down') {
            newY += this.player.tileSize;
        }
        else if (direction === 'left') {
            newX -= this.player.tileSize;
        }
        else if (direction === 'right') {
            newX += this.player.tileSize;
        }

        const targetTileX2 = Math.round(newX + tileSize / 2);
        const targetTileY2 = Math.round(newY + tileSize / 2);

        // comprobar si esta ocupada otra vez
        this.scene.players.forEach(p => {
            const otherTileX = Math.round(p.x + p.tileSize / 2);
            const otherTileY = Math.round(p.y + p.tileSize / 2);
            if (otherTileX === targetTileX2 && otherTileY === targetTileY2)
                occupied = true;
        });

        // mover si no esta ocupada
        if (!occupied) {
            this.player.update(newX, newY, this.player.map, direction);
        }
    }

    legSlowAbility(){

        // saltar 2 por encima de jugadores

        let newX = this.player.x;
        let newY = this.player.y;
        const direction = this.player.direction;

        // moverse 2 casillas en la direccion del jugador
        if (direction === 'up') {
            newY -= this.player.tileSize * 2; // 2 tiles de movimiento
        }
        else if (direction === 'down') {
            newY += this.player.tileSize * 2;
        }
        else if (direction === 'left') {
            newX -= this.player.tileSize * 2;
        }
        else if (direction === 'right') {
            newX += this.player.tileSize * 2;
        }

        // comprobar si esta ocupada 
        const tileSize = this.player.tileSize;
        const targetTileX = Math.round(newX + tileSize / 2);
        const targetTileY = Math.round(newY + tileSize / 2);
        let occupied = false;

        this.scene.players.forEach(p => {
            const otherTileX = Math.round(p.x + p.tileSize / 2);
            const otherTileY = Math.round(p.y + p.tileSize / 2);
            if (otherTileX === targetTileX && otherTileY === targetTileY)
                occupied = true;
        });

        // mover si no esta ocupada
        if (!occupied) {
            this.player.update(newX, newY, this.player.map, direction);
        }
    }

    armQuickAbility(){
        
        // empujon de casilla en la direccion elegida al jugador enemigo

        const direction = this.player.direction;
        const tileSize = this.player.tileSize;

        // calcular la tile delante del jugador
        let frontTileX = Math.round(this.player.x + tileSize / 2);
        let frontTileY = Math.round(this.player.y + tileSize / 2);

        if (direction === 'up') {
            frontTileY -= tileSize;
        }
        else if (direction === 'down') {
            frontTileY += tileSize;
        }
        else if (direction === 'left') {
            frontTileX -= tileSize;
        }
        else if (direction === 'right') {
            frontTileX += tileSize;
        }

        // ver si hay un enemigo en dicha casilla
        let targetEnemy = null;
        this.scene.players.forEach(p => {
            if (p.id !== this.player.id) { // comprobar que no es el mismo jugador
                const otherTileX = Math.round(p.x + tileSize / 2);
                const otherTileY = Math.round(p.y + tileSize / 2);
                if (otherTileX === frontTileX && otherTileY === frontTileY) {
                    targetEnemy = p;
                }
            }
        });

        // si hay un enemigo empujarlo
        if (targetEnemy) {
            let newX = targetEnemy.x;
            let newY = targetEnemy.y;
            let pushDirection = direction;

            // calcular la direccion de empuje basado en las posiciones del jugador y el enemigo
            const attackerTileX = Math.round(this.player.x + tileSize / 2);
            const attackerTileY = Math.round(this.player.y + tileSize / 2);
            const enemyTileX = Math.round(targetEnemy.x + tileSize / 2);
            const enemyTileY = Math.round(targetEnemy.y + tileSize / 2);

            // determinar la direccion de empuje
            if (enemyTileY < attackerTileY) {
                pushDirection = 'up';
                newY -= tileSize;
            }
            else if (enemyTileY > attackerTileY) {
                pushDirection = 'down';
                newY += tileSize;
            }
            else if (enemyTileX < attackerTileX) {
                pushDirection = 'left';
                newX -= tileSize;
            }
            else if (enemyTileX > attackerTileX) {
                pushDirection = 'right';
                newX += tileSize;
            }

            // comprobar que la tile a la que se emupja no esta ocupada, por si acaso queremos implementar mas jugadores
            const pushedTileX = Math.round(newX + tileSize / 2);
            const pushedTileY = Math.round(newY + tileSize / 2);
            let occupied = false;

            this.scene.players.forEach(p => {
                if (p.id !== targetEnemy.id) { // comprobar otros jugadores
                    const otherTileX = Math.round(p.x + tileSize / 2);
                    const otherTileY = Math.round(p.y + tileSize / 2);
                    if (otherTileX === pushedTileX && otherTileY === pushedTileY) {
                        occupied = true;
                    }
                }
            });

            // empujar al enemigo a dicha tile
            if (!occupied) {
                targetEnemy.update(newX, newY, this.player.map, pushDirection);
            } 
        }

    }

    armSlowAbility(){

        // empujon de 2 casillas en la direccion elegida al jugador enemigo

        const direction = this.player.direction;
        const tileSize = this.player.tileSize;

        // calcular la tile delante del jugador
        let frontTileX = Math.round(this.player.x + tileSize / 2);
        let frontTileY = Math.round(this.player.y + tileSize / 2);

        if (direction === 'up') {
            frontTileY -= tileSize;
        }
        else if (direction === 'down') {
            frontTileY += tileSize;
        }
        else if (direction === 'left') {
            frontTileX -= tileSize;
        }
        else if (direction === 'right') {
            frontTileX += tileSize;
        }

        // ver si hay un enemigo en dicha casilla
        let targetEnemy = null;
        this.scene.players.forEach(p => {
            if (p.id !== this.player.id) { // comprobar que no es el mismo jugador
                const otherTileX = Math.round(p.x + tileSize / 2);
                const otherTileY = Math.round(p.y + tileSize / 2);
                if (otherTileX === frontTileX && otherTileY === frontTileY) {
                    targetEnemy = p;
                }
            }
        });

        // si hay un enemigo empujarlo
        if (targetEnemy) {
            let newX = targetEnemy.x;
            let newY = targetEnemy.y;
            let pushDirection = direction;

            // calcular la direccion de empuje basado en las posiciones del jugador y el enemigo
            const attackerTileX = Math.round(this.player.x + tileSize / 2);
            const attackerTileY = Math.round(this.player.y + tileSize / 2);
            const enemyTileX = Math.round(targetEnemy.x + tileSize / 2);
            const enemyTileY = Math.round(targetEnemy.y + tileSize / 2);

            // determinar la direccion de empuje
            if (enemyTileY < attackerTileY) {
                pushDirection = 'up';
                newY -= tileSize * 2;
            }
            else if (enemyTileY > attackerTileY) {
                pushDirection = 'down';
                newY += tileSize * 2;
            }
            else if (enemyTileX < attackerTileX) {
                pushDirection = 'left';
                newX -= tileSize * 2;
            }
            else if (enemyTileX > attackerTileX) {
                pushDirection = 'right';
                newX += tileSize * 2;
            }

            // comprobar que la tile a la que se emupja no esta ocupada, por si acaso queremos implementar mas jugadores
            const pushedTileX = Math.round(newX + tileSize / 2);
            const pushedTileY = Math.round(newY + tileSize / 2);
            let occupied = false;

            this.scene.players.forEach(p => {
                if (p.id !== targetEnemy.id) { // Check other players
                    const otherTileX = Math.round(p.x + tileSize / 2);
                    const otherTileY = Math.round(p.y + tileSize / 2);
                    if (otherTileX === pushedTileX && otherTileY === pushedTileY) {
                        occupied = true;
                    }
                }
            });

            // empujar al enemigo si la tile no esta ocupada
            if (!occupied) {
                targetEnemy.update(newX, newY, this.player.map, pushDirection);
            }
        }
    }
}