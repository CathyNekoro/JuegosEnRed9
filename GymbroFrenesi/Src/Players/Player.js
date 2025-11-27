
export default class Player extends Phaser.GameObjects.Sprite
{
    constructor(scene, id, x, y ,config)
    {
        super(scene, x*config.tileSize-config.tileSize/2, y*config.tileSize-config.tileSize/2, config.texture_key);

            this.id=id;
            this.tileSize = config.tileSize;
            this.map = config.map;
            this.moveDuration = config.moveDuration || 150;

            this.isMoving=false;

            this.lives = config.lives || 3;
            this.isAlive = true;
            this.isDead = false;

        scene.add.existing(this);

    }

    update(newX, newY)
    {
        
        if(this.isMoving) return;

        if (!this.isWalkable(newX, newY)) return;
        
        this.moveTo(newX, newY);
        
    }

    isWalkable(targetX, targetY)
    {
        let targetTile = this.map.getTileAtWorldXY(targetX, targetY);
        if(!targetTile) return false;

        // esta gestion se hara diferente cuando haya bloques caidos (no es lo mismo chocarse contra un borde que caerse)
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
        this.lives -= 1;
        
        if(this.lives <= 0){
            this.die();
        } else {
            
            this.isAlive = false;
            this.setVisible(false);
            this.setActive(false);
            this.scene.time.delayedCall(2000, () => { // 2 segundos para reaparecer
                this.respawn();
            });
            
        }
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