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

}