import Phaser from "phaser";

export class PauseScene extends Phaser.Scene {
    constructor() {
        super('PauseScene');
    }

    create(data) {
        this.add.rectangle(400, 300, 0, 0, 0, 0.1);

        const resumeBtn = this.add.text(400, 320, 'Resume', {
            fontSize: '32px',
            color: '#00ff00'
        }).setOrigin(0.5)
        .setInteractive({useHandCursor: true})
        .on('pointover', () => resumeBtn.setStyle({fill: '#00ff88'}))
        .on('pointout', () => resumeBtn.setStyle({fill: '#00ff00'}))
        .on('pointerdown', () =>{
            this.scene.stop();
            this.scene.resume(data.originalScene);
            this.scene.get(data.originalScene).resume();
        });

        const menuBtn = this.add.text(400, 400, 'Return to Menu', {
            fontSize: '32px',
            color: '#ffffff'
        }).setOrigin(0.5)
        .setInteractive({useHandCursor: true})
        .on('pointover', () => menuBtn.setStyle({fill: '#ff8888'}))
        .on('pointout', () => menuBtn.setStyle({fill: '#ffffff'}))
        .on('pointerdown', () =>{
            this.scene.stop(data.originalScene);
            this.scene.start('MenuScene');
        });
    }

    


}