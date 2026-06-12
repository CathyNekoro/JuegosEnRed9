import Abilities from "./Abilities.js";

export default class Player extends Phaser.GameObjects.Sprite
{
    constructor(scene, id, type, x, y, config)
    {
        super(scene, x*config.tileSize-config.tileSize/2, y*config.tileSize-config.tileSize/2, config.texture_key);

            this.id=id;
            this.tileSize = config.tileSize;
            this.map = config.map;
            this.moveDuration = config.moveDuration || 150;

            this.isMoving = false;
            this.direction = "down";

            this.lives = config.lives || 3;
            this.isAlive = true;                //le quedan vidas (no tiene pq estar en la escena)
            this.isDead = false;               //No le quedan vidas

            this.type = type;
            this.quickAbility = new Abilities(this, scene, id, type, "quickAbility");
            this.slowAbility = new Abilities(this, scene, id, type, "slowAbility");

            this.walkingKey = config.animationKeys.walk;
            this.jumpingKey = config.animationKeys.jump;
            this.fallingKey = config.animationKeys.fall;
            this.idleingKey = config.animationKeys.idle;

            this.setScale(0.5);

            this.play(this.idleingKey);

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

    isPositionOccupiedByOther(x, y) {
    if (!this.scene.players) return false;
    for (const p of this.scene.players.values()) {
        if (p === this || !p.isAlive) continue;
        if (Phaser.Math.Within(p.x, x, this.tileSize / 2) &&
            Phaser.Math.Within(p.y, y, this.tileSize / 2)) {
            return true;
        }
    }
    return false;
}

findAlternativeSafeTile(preferredX, preferredY) {
    if (!this.map) return null;

    // Tiles válidas: no caídas y no ocupadas por otro jugador
    const candidates = this.map.getChildren().filter(tile =>
        !tile.fallen &&
        !this.isPositionOccupiedByOther(tile.x, tile.y)
    );
    if (candidates.length === 0) return null;

    // Búsqueda determinista
    candidates.sort((a, b) => {
        const distA = Math.abs(a.x - preferredX) + Math.abs(a.y - preferredY);
        const distB = Math.abs(b.x - preferredX) + Math.abs(b.y - preferredY);
        if (distA !== distB) return distA - distB;
        if (a.x !== b.x) return a.x - b.x;
        return a.y - b.y;
    });
    return candidates[0];
}
    moveTo(targetX, targetY)
    {
        this.isMoving = true;
        this.x = targetX;
        this.y = targetY;

        // Sólo reproducir la anim si NO está ya en walking (evita restart visible)
        if (this.scene.anims.exists(this.walkingKey)) {
            const playing = this.anims.currentAnim?.key === this.walkingKey && this.anims.isPlaying;
            if (!playing) {
                this.play(this.walkingKey);
            }
        }

        // Cancelar tween anterior si seguía corriendo (evita stacking de onComplete)
        if (this.moveTween) this.moveTween.stop();

        this.moveTween = this.scene.tweens.add({
            targets: this,
            x: this.x,
            y: this.y,
            duration: this.moveDuration,
            onComplete: () => {
                this.isMoving = false;
                this.stop();
                this.moveTween = null;
            }
        });
    }

    receiveDamage(x,y){
        if(this.isAlive){
            this.lives -= 1;
            if(this.scene.anims.exists(this.fallingKey)){
                
            this.play(this.fallingKey);
            this.scene.sound.play('fallSound', { volume: 0.8 });
            this.scene.time.delayedCall(250, () => {
                this.deathSpin();
            });
            
        }
            

            if(this.lives <= 0){
                this.die();
            } else {
                
                this.isAlive = false;
                
                this.scene.time.delayedCall(1046, () => { // 2 segundos para reaparecer
                    this.setVisible(false);
                    this.setActive(false);
                    this.respawn(x,y);
                });
                
            }
        }return
    }

    die() {
        this.isDead = true;
        this.isAlive = false;
        this.setVisible(false);
        this.setActive(false);
    }

    respawn(x, y) {
        if (this.isPositionOccupiedByOther(x, y)) {
            const safe = this.findAlternativeSafeTile(x, y);
            if (safe) {
                x = safe.x;
                y = safe.y;
            }
        }
        this.x=x;
        this.y=y;
        this.isAlive = true;
        this.direction = "down";
        this.setVisible(true);
        this.setActive(true);   
        this.play(this.idleingKey);
    }
    
    deathSpin() {
        this.scene.tweens.add({
            targets: this,
            angle: 360,
            scale: 0,
            alpha: 0,
            duration: 800,
            ease: 'Power2',
            onComplete: () => {
                this.angle = 0;
                this.scale = 0.5;
                this.alpha = 1;
            }
        });
    }
}

