import { CHARACTER_CONFIG, registerAnimations } from "../Utils/AnimatorManager.js";

export default class HUD {
    constructor(scene, player1Key, player2Key) {
        this.scene = scene;

        this.p1Color = CHARACTER_CONFIG[player1Key].color;
        this.p2Color = CHARACTER_CONFIG[player2Key].color;
        this.p1Hex = CHARACTER_CONFIG[player1Key].colorHex;
        this.p2Hex = CHARACTER_CONFIG[player2Key].colorHex;

        // --- Barras de habilidad J1 ---
        
this.p1Bars = this.createAbilityBars(500, 50, this.p1Color, 'F', 'G');
this.p2Bars = this.createAbilityBars(1650, 50, this.p2Color, ',', '.');
      }

    createAbilityBars(x, y, color, quickKey, slowKey) {
        const barWidth = 400;
        const barHeight = 60;
        const spacing = barHeight*2;
       
        

        // Habilidad rápida
        const quickBg = this.scene.add.graphics();
        quickBg.fillStyle(0x333333, 0.8);
        quickBg.fillRoundedRect(x, y, barWidth, barHeight, 6);
        const quickFill = this.scene.add.graphics();

        // Habilidad lenta
        const slowBg = this.scene.add.graphics();
        slowBg.fillStyle(0x333333, 0.8);
        slowBg.fillRoundedRect(x, y + spacing, barWidth, barHeight, 6);
        const slowFill = this.scene.add.graphics();

        //texto og
        const quickLabel = this.scene.add.text(x + barWidth / 2, y + barHeight / 2, quickKey, {
            fontSize: '50px',
            fontFamily: 'something',
            color: '#ffffff'
        }).setOrigin(0.5, 0.5).setVisible(false);

        const slowLabel = this.scene.add.text(x + barWidth / 2, (y + spacing) + barHeight / 2, slowKey, {
            fontSize: '50px',
            fontFamily: 'something',
            color: '#ffffff'
        }).setOrigin(0.5, 0.5).setVisible(false);
                return {
                    quick: { fill: quickFill, label: quickLabel, x, y, width: barWidth, height: barHeight },
                    slow:  { fill: slowFill, label: slowLabel, x, y: y + spacing, width: barWidth, height: barHeight },
                    color
                };
            }

 updateBar(bar, ability, totalCooldown, color) {
    const remaining = ability.getCooldownRemaining();
    let progress = 1;

    if (remaining > 0) {
        progress = 1 - (remaining / totalCooldown);

        // Si estaba pulsando, parar
        if (bar.pulseTween) {
            bar.pulseTween.stop();
            bar.label.setVisible(false);
            bar.pulseTween = null;
            bar.fill.setAlpha(1);
        }
    }

    // Redibujar la barra
    bar.fill.clear();
    bar.fill.fillStyle(color, 1);
    bar.fill.fillRoundedRect(
        bar.x, bar.y,
        bar.width * progress,
        bar.height,
        6
    );

    // Si acaba de llenarse y no tiene ya un pulso activo
    if (progress >= 1 && !bar.pulseTween) {
        bar.label.setVisible(true);
        bar.pulseTween = this.scene.tweens.add({
            targets: bar.fill,
            alpha: 0.4,
            duration: 400,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
}

    update(player1, player2, startTime) {

        // --- Barras ---
        this.updateBar(this.p1Bars.quick, player1.quickAbility, 6000, this.p1Color);
        this.updateBar(this.p1Bars.slow,  player1.slowAbility, 12000, this.p1Color);
        this.updateBar(this.p2Bars.quick, player2.quickAbility, 6000, this.p2Color);
        this.updateBar(this.p2Bars.slow,  player2.slowAbility, 12000, this.p2Color);

    }

   
}