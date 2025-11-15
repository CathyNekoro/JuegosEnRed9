import Phaser from "phaser";

export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene')
    }

    create() {
        this.add.text(400,100, 'PONG GAME',
        {   fontSize: '64px',
            color: '#ffffffff'
        }).setOrigin(0.5);

        const localBtn = this.add.text(400, 300, 'Local Play', {
            fontSize: '24px', color: '#1dd627ff'
        }).setOrigin(0.5)
        .setInteractive({useHandCursor: true})
        .on('pointover', () => localBtn.setStyle({fill: '#e7b14dff'}))
        .on('pointout', () => localBtn.setStyle({fill: '#1dd627ff'}))
        .on('pointerdown', () =>{
            this.scene.start('GameScene');
        });

    }
}