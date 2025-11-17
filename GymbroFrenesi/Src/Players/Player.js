

export default class Player extends Phaser.GameObjects.Sprite
{
    constructor(scene, x, y ,config)
    {
        super(scene, x*config.tileSize-config.tileSize/2, y*config.tileSize-config.tileSize/2, config.texture_key);
        
            this.tileSize = config.tileSize;
            this.map = config.map;
            this.moveDuration = config.moveDuration || 150;

            this.isMoving=false;

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
        if(targetTile.properties && targetTile.properties.fallen) return false; //esta gestion se hara diferente cuando haya bloques caidos (no es lo mismo chocarse contra un borde que caerse)
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
}