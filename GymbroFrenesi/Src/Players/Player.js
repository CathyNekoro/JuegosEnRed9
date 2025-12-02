import Abilities from "./Abilities.js";

export default class Player extends Phaser.GameObjects.Sprite
{
    constructor(scene, id, type, x, y ,config)
    {
        super(scene, x*config.tileSize-config.tileSize/2, y*config.tileSize-config.tileSize/2, config.texture_key);

            this.id=id;
            this.tileSize = config.tileSize;
            this.map = config.map;
            this.moveDuration = config.moveDuration || 150;

            this.isMoving = false;
            this.direction = null;

            this.lives = config.lives || 3;
            this.isAlive = true;                //le quedan vidas (no tiene pq estar en la escena)
            this.isDead = false;               //No le quedan vidas

            this.type = type;
            this.quickAbility = new Abilities(this, scene, id, type, "quickAbility");
            this.slowAbility = new Abilities(this, scene, id, type, "slowAbility");

        scene.add.existing(this);

    }

    update(newX, newY, map, direction)
    {
        this.map = map;

        if(this.isMoving && this.isAlive) return;

        if (!this.isWalkable(newX, newY)) return;
        
        this.direction = direction;

        this.moveTo(newX, newY);
    }

    isWalkable(targetX, targetY)
    {
        let x = Math.floor(targetX/this.tileSize-2);
        let y = Math.floor(targetY/this.tileSize-2)*13;
        if(x < 0 || x >= 13 || y < 0) return false;
        let targetTile = this.map.getChildren()[x+y];
        if(!targetTile) return false;
        if(targetTile.properties && targetTile.properties.fallen) return false; 
        return true;
    }

    moveTo(targetX, targetY)
    {
        this.isMoving=true;
        this.x = targetX;
        this.y = targetY;

        let worldX = this.x;
        let worldY = this.y;

        this.scene.tweens.add({
            targets: this,
            x: worldX,
            y: worldY,
            duration: this.moveDuration,
            onComplete: () => {
                this.isMoving = false;
            }
        });
    }

    receiveDamage(){
        if(this.isAlive){
            this.lives -= 1;
            
            if(this.lives <= 0){
                this.die();
            } else {
                
                this.isAlive = false;
                this.setVisible(false);
                this.setActive(false);
                this.scene.time.delayedCall(500, () => { // 2 segundos para reaparecer
                    this.respawn();
                });
                
            }
        }return
    }

    die() {
        this.isDead = true;
        this.setVisible(false);
        this.setActive(false);
    }

    respawn() {
        
        this.isAlive = true;
        this.setVisible(true);
        this.setActive(true);
    }
}