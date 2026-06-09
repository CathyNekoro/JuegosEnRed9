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
        this.skillOneCooldown = quickCooldown;
        this.skillTwoCooldown = slowCooldown;
        this.isOnCooldown = false;
        this.cooldownEndTime = 0;
        this.cooldownTimer = null;
        this.abilityKey = `${type}_ability`; // sleccionar animacion basada en el tipo del personaje
    }


    useAbility() {
    if (!this.player.isAlive) return;

    if (this.isOnCooldown) {
        const remaining = this.getCooldownRemaining();
        if (remaining > 0) return;
        this.isOnCooldown = false;
    }

    if(this.scene.anims.exists(this.abilityKey) && !'coreDay_ability') {
        this.player.play(this.abilityKey); // reproducir animacion
        this.player.once('animationcomplete', () => {
            if(this.player.isAlive && this.scene.anims.exists(this.player.idleingKey)) {
                this.player.play(this.player.idleingKey); // volver a animacion idle
            }
        });
    }

    this.scene.sound.play(`sfx_${this.type}`, { volume: 0.8 });

    if (this.abilityType === "quickAbility") {
        if (this.type === 'legDay') this.legQuickAbility();
        else if (this.type === 'armDay') this.armQuickAbility();
        else if (this.type === 'coreDay') this.coreQuickAbility();
        else if (this.type === 'mewingDay') this.mewingQuickAbility();
        this.startCooldown(this.skillOneCooldown);
    }

    if (this.abilityType === "slowAbility") {
        if (this.type === 'legDay') this.legSlowAbility();
        else if (this.type === 'armDay') this.armSlowAbility();
        else if (this.type === 'coreDay') this.coreSlowAbility();
        else if (this.type === 'mewingDay') this.mewingSlowAbility();
        this.startCooldown(this.skillTwoCooldown);
    }
}

    startCooldown(duration) {
    this.isOnCooldown = true;
    this.cooldownStartElapsed = this.scene.elapsed;
    this.cooldownDuration = duration;

    this.cooldownTimer = this.scene.time.delayedCall(duration, () => {
        this.isOnCooldown = false;
    });
}

    getCooldownRemaining() {
    if (!this.isOnCooldown) return 0;
    const passed = this.scene.elapsed - this.cooldownStartElapsed;
    return Math.max(0, this.cooldownDuration - passed);
}
    
    legQuickAbility(){

        // saltar 2 casillas en la direccion elegida
        
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

    coreQuickAbility(){
        
        // carga en linea recta empujando a un jugador que se encuentre hacia los laterales y parandose tras el impacto, pero se cae si hay un agujero
         

        const direction = this.player.direction;
        const tileSize = this.player.tileSize;

        // limites reales del mapa
        const minTileX = tileSize * 2;   
        const minTileY = tileSize * 2;
        const maxTileX = (this.scene.map.width - 2)*tileSize;   
        const maxTileY = (this.scene.map.height - 1)*tileSize; 

        let chargeX = this.player.x;
        let chargeY = this.player.y;
        let targetEnemy = null;
        let enemyOriginalX = null;
        let enemyOriginalY = null;

        // moverse en linea recta hasta chocar contra un enemigo
        while (!targetEnemy && this.player.isAlive) {

            let anteriorX = chargeX;
            let anteriorY = chargeY;
            
            this.player.isMoving=false;

            // calcular la siguiente posicion
            if (direction === 'up') {
                chargeY -= tileSize;
            }
            else if (direction === 'down') {
                chargeY += tileSize;
            }
            else if (direction === 'left') {
                chargeX -= tileSize;
            }
            else if (direction === 'right') {
                chargeX += tileSize;
            }

            const tileX = Math.round(chargeX + tileSize / 2);
            const tileY = Math.round(chargeY + tileSize / 2);

            // comprobar si hay un enemigo en dicha posicion
            this.scene.players.forEach(p => {
                if (p.id !== this.player.id) {
                    const otherTileX = Math.round(p.x + tileSize / 2);
                    const otherTileY = Math.round(p.y + tileSize / 2);
                    if (otherTileX === tileX && otherTileY === tileY) {
                        targetEnemy = p;
                        enemyOriginalX = p.x;
                        enemyOriginalY = p.y;
                    }
                }
            });

            // comprobar si hay un agujero
            const children = this.scene.fallingPlatforms.getChildren();
           
            var unavailableTiles = children.filter(p => p.fallen); // array de tiles ya no válidas

            const badTile = unavailableTiles.find(tile =>
            Phaser.Math.Within(chargeX, tile.x, tileSize / 2) &&
            Phaser.Math.Within(chargeY, tile.y, tileSize / 2)
            );

            if (badTile) { //si hay una casilla caida entre medias

                this.player.update(chargeX, chargeY, this.player.map, direction);
                return; // salir de la hablidad       
            }
            
            // prevencion para no salirse del mapa
            if (!targetEnemy) {

                // si la próxima casilla sale del mapa entonces dejar de cargar 
                if (chargeX < minTileX || chargeX > maxTileX || chargeY < minTileY || chargeY > maxTileY) {
                    chargeX = anteriorX;
                    chargeY = anteriorY; 
                    break;
                }
            }
        }

        // empujar al enemigo si se encuentra a uno y mover al jugador a la posicion original del enimgo
        if (targetEnemy) {
            // determinar la direccion de empuje
            let pushX = targetEnemy.x;
            let pushY = targetEnemy.y;
            let pushDirection = direction;

            if (direction === 'up' || direction === 'down') {
                // izquierda o derecha
                if (targetEnemy.x > (minTileX + ((maxTileX - minTileX)/2))){
                    pushDirection = 'left';
                    pushX -= tileSize;
                } else {
                    pushDirection = 'right';
                    pushX += tileSize;
                }
            }
            else if (direction === 'left' || direction === 'right') {
                // arriba o abajo
                if (targetEnemy.y < (minTileY + ((maxTileY - minTileY)/2))){
                    pushDirection = 'down';
                    pushY += tileSize;
                } else {
                    pushDirection = 'up';
                    pushY -= tileSize;

                }
            }

            // comprobar si la tile a la que se empuja esta ocupada, por si acaso queremos implementar mas jugadores
            const pushedTileX = Math.round(pushX + tileSize / 2);
            const pushedTileY = Math.round(pushY + tileSize / 2);
            let occupied = false;

            this.scene.players.forEach(p => {
                if (p.id !== targetEnemy.id) {
                    const otherTileX = Math.round(p.x + tileSize / 2);
                    const otherTileY = Math.round(p.y + tileSize / 2);
                    if (otherTileX === pushedTileX && otherTileY === pushedTileY) {
                        occupied = true;
                    }
                }
            });

            // empujar al enemigo si la tile no esta ocupada
            if (!occupied) {
                targetEnemy.update(pushX, pushY, this.player.map, pushDirection);
            } 

            // mover al jugador a la casilla original del enemigo
            this.player.update(enemyOriginalX, enemyOriginalY, this.player.map, direction);;
        } else {
            // mover al jugado a la posicion final de la carga si no hay enemigo en el camino
            this.player.update(chargeX, chargeY, this.player.map, direction);
        }

    }

    coreSlowAbility(){
        
        // carga en linea recta empujando a un jugador que se encuentre hacia los laterales y parandose tras el impacto, pero no se cae si hay un agujero
        const direction = this.player.direction;
        const tileSize = this.player.tileSize;

        // limites reales del mapa
        const minTileX = tileSize * 2;   
        const minTileY = tileSize * 2;
        const maxTileX = (this.scene.map.width - 2)*tileSize;   
        const maxTileY = (this.scene.map.height - 1)*tileSize; 

        let chargeX = this.player.x;
        let chargeY = this.player.y;
        let targetEnemy = null;
        let enemyOriginalX = null;
        let enemyOriginalY = null;

        // moverse en linea recta hasta chocar contra un enemigo
        while (!targetEnemy) {
            
            let anteriorX = chargeX;
            let anteriorY = chargeY;

            this.player.isMoving=false;

            // calcular la siguiente posicion
            if (direction === 'up') {
                chargeY -= tileSize;
            }
            else if (direction === 'down') {
                chargeY += tileSize;
            }
            else if (direction === 'left') {
                chargeX -= tileSize;
            }
            else if (direction === 'right') {
                chargeX += tileSize;
            }

            const tileX = Math.round(chargeX + tileSize / 2);
            const tileY = Math.round(chargeY + tileSize / 2);

            // comprobar si hay un enemigo en dicha posicion
            this.scene.players.forEach(p => {
                if (p.id !== this.player.id) {
                    const otherTileX = Math.round(p.x + tileSize / 2);
                    const otherTileY = Math.round(p.y + tileSize / 2);
                    if (otherTileX === tileX && otherTileY === tileY) {
                        targetEnemy = p;
                        enemyOriginalX = p.x;
                        enemyOriginalY = p.y;
                    }
                }
            });

            // prevencion para no salirse del mapa
            if (!targetEnemy) {

                // si la próxima casilla sale del mapa entonces dejar de cargar 
                if (chargeX < minTileX || chargeX > maxTileX || chargeY < minTileY || chargeY > maxTileY) {
                    chargeX = anteriorX;
                    chargeY = anteriorY; 
                    break;
                }
                
            }
        }

        // empujar al enemigo si se encuentra a uno y mover al jugador a la posicion original del enimgo
        if (targetEnemy) {

            // determinar la direccion de empuje
            let pushX = targetEnemy.x;
            let pushY = targetEnemy.y;
            let pushDirection = direction;

            if (direction === 'up' || direction === 'down') {
                // izquierda o derecha
                if (targetEnemy.x > (minTileX + ((maxTileX - minTileX)/2))){
                    pushDirection = 'left';
                    pushX -= tileSize;
                } else {
                    pushDirection = 'right';
                    pushX += tileSize;
                }
            }
            else if (direction === 'left' || direction === 'right') {
                // arriba o abajo
                if (targetEnemy.y < (minTileY + ((maxTileY - minTileY)/2))){
                    pushDirection = 'down';
                    pushY += tileSize;
                } else {
                    pushDirection = 'up';
                    pushY -= tileSize;
                }
            }

            // comprobar si la tile a la que se empuja esta ocupada, por si acaso queremos implementar mas jugadores
            const pushedTileX = Math.round(pushX + tileSize / 2);
            const pushedTileY = Math.round(pushY + tileSize / 2);
            let occupied = false;

            this.scene.players.forEach(p => {
                if (p.id !== targetEnemy.id) {
                    const otherTileX = Math.round(p.x + tileSize / 2);
                    const otherTileY = Math.round(p.y + tileSize / 2);
                    if (otherTileX === pushedTileX && otherTileY === pushedTileY) {
                        occupied = true;
                    }
                }
            });
            
            // empujar al enemigo si la tile no esta ocupada
            if (!occupied) {
                targetEnemy.update(pushX, pushY, this.player.map, pushDirection);
            } 

            // mover al jugador a la casilla original del enemigo
            this.player.update(enemyOriginalX, enemyOriginalY, this.player.map, direction);
        } else {
            // mover al jugado a la posicion final de la carga si no hay enemigo en el camino
            this.player.update(chargeX, chargeY, this.player.map, direction);
        }
    }

    mewingQuickAbility(){
        
        // flashear las 8 casillas adyacentes al enemigo, utilizando el logo1.png para el efecto visual

        const tileSize = this.player.tileSize;

        // encontrar a los enemigos y flashear las casillas adyacentes
        this.scene.players.forEach(enemy => {
            if (enemy.id !== this.player.id) {
                const enemyTileX = Math.round(enemy.x + tileSize / 2);
                const enemyTileY = Math.round(enemy.y + tileSize / 2);

                // definir las 8 casillas adyacentes
                const adjacentTiles = [];
                for (let dx = -1; dx <= 1; dx++) {
                    for (let dy = -1; dy <= 1; dy++) {
                        // saltarse la casilla central
                        if (dx === 0 && dy === 0) continue;
                        adjacentTiles.push({
                            x: enemyTileX + dx * tileSize,
                            y: enemyTileY + dy * tileSize
                        });
                    }
                }

                // flashear las casillas adyacentes
                adjacentTiles.forEach(tile => {

                    // comprobar que la tile esta dentro de la zona de juego
                    const tileGridX = Math.round((tile.x) / tileSize);
                    const tileGridY = Math.round((tile.y) / tileSize);
                    const targetTile = this.scene.map.getTileAt(tileGridX - 1, tileGridY - 1);
                    if (!targetTile) return; // saltarse tiles fuera del mapa

                    // crear el efecto de flash
                    const flashSprite = this.scene.add.sprite(tile.x - tileSize, tile.y - tileSize, "flash");
                    flashSprite.setOrigin(0, 0);
                    flashSprite.setScale(tileSize / flashSprite.width, tileSize / flashSprite.height);

                    // destruir el efecto de flash tras 2 segundos
                    flashSprite.destroyAt = this.scene.elapsed + 2000;
                    if (!this.scene.pendingDestroys) this.scene.pendingDestroys = [];
                    this.scene.pendingDestroys.push(flashSprite);
                });

            }
        });
    }

    mewingSlowAbility(){

        // flashear las 24 casillas alrededor del jugador, utilizando el logo1.png para el efecto visual

        const tileSize = this.player.tileSize;

        // encontrar a los enemigos y flashear las casillas adyacentes
        this.scene.players.forEach(enemy => {
            if (enemy.id !== this.player.id) {
                const enemyTileX = Math.round(enemy.x + tileSize / 2);
                const enemyTileY = Math.round(enemy.y + tileSize / 2);

                // definir las 24 casillas adyacentes
                const adjacentTiles = [];
                for (let dx = -2; dx <= 2; dx++) {
                    for (let dy = -2; dy <= 2; dy++) {
                        // saltarse la casilla central
                        if (dx === 0 && dy === 0) continue;
                        adjacentTiles.push({
                            x: enemyTileX + dx * tileSize,
                            y: enemyTileY + dy * tileSize
                        });
                    }
                }

                // flashear las casillas adyacentes
                adjacentTiles.forEach(tile => {

                    // comprobar que la tile esta dentro de la zona de juego
                    const tileGridX = Math.round((tile.x) / tileSize);
                    const tileGridY = Math.round((tile.y) / tileSize);
                    const targetTile = this.scene.map.getTileAt(tileGridX - 1, tileGridY - 1);
                    if (!targetTile) return; // saltarse tiles fuera del mapa

                    // crear el efecto de flash
                    const flashSprite = this.scene.add.sprite(tile.x - tileSize, tile.y - tileSize, "flash");
                    flashSprite.setOrigin(0, 0);
                    flashSprite.setScale(tileSize / flashSprite.width, tileSize / flashSprite.height);

                    // destruir el efecto de flash tras 2 segundos
                     flashSprite.destroyAt = this.scene.elapsed + 2000;
                    if (!this.scene.pendingDestroys) this.scene.pendingDestroys = [];
                    this.scene.pendingDestroys.push(flashSprite);
                });
            }
        });
    }





}