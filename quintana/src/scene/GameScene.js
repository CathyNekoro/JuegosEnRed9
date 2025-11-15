import Phaser from "phaser";
import { Paddle } from "../entities/Paddle.js";
import { CommandProcessor } from "../commands/CommandProcessor.js";
import { PauseGameCommand } from "../commands/PauseGameCommand.js";
import { MovePaddleCommand } from "../commands/MovePaddleCommand.js";

export class GameScene extends Phaser.Scene{
    constructor() {
        super('GameScene')
    }

    init() {
        this.players = new Map();
        this.inputsMapping = [];
        this.ball = null;
        this.isPaused = false;
        this.escWasDown = false;
        this.playing = false;
        this.processor = new CommandProcessor();
    } 

    create() {
        for (let i = 0; i < 17;i++){
            this.add.rectangle(400, i * 50 + 25, 10, 30, 0xffffff);
        }

        // Score texts
        this.scoreLeft = this.add.text(100, 50, '0', {
            fontSize: '48px',
            color: '#00ff00'
        })

        this.scoreRight = this.add.text(700, 50, '0', {
            fontSize: '48px',
            color: '#00ff00'
        })

        this.createBounds();
        this.createBall();
        this.launchBall();
        this.setUpPLayers();

        this.players.forEach(paddle => {
            this.physics.add.collider(this.ball, paddle.sprite);
        });

        this.player1 = this.players.get('player1');
        this.player2 = this.players.get('player2');

        this.physics.add.collider(this.player1.sprite, this.player2.sprite);

        this.physics.add.overlap(this.ball, this.leftGoal, this.scoreRightGoal, null, this);
        this.physics.add.overlap(this.ball, this.rightGoal, this.scoreLeftGoal, null, this);
        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }

    setUpPLayers() {
        const leftPaddle = new Paddle(this, 'player1', 50, 300);
        const rightPaddle = new Paddle(this, 'player2', 750, 300);
        this.players.set('player1', leftPaddle);
        this.players.set('player2', rightPaddle);

        const InputConfig = [
            {
                playerId: 'player1',
                upKey: 'W',
                downKey: 'S',
                leftKey: 'A',
                rightKey: 'D',
            }, 
            {
                playerId: 'player2',
                upKey: 'UP',
                downKey: 'DOWN',
                leftKey: 'LEFT',
                rightKey: 'RIGHT',
            }
        ];
        this.inputsMapping = InputConfig;
        this.inputsMapping = this.inputsMapping.map(config => {
            return {
                playerId: config.playerId,
                upKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.upKey]),
                downKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.downKey]),
                leftKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.leftKey]),
                rightKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.rightKey]),
            }
        });
    }

    scoreRightGoal() {
        if (!this.playing) return;

        this.playing = false;
        const player2 = this.players.get('player2');
        player2.score += 1;
        this.scoreRight.setText(player2.score.toString());
 
        if (player2.score >= 2) {
            this.endGame("player2");
        } else {
            this.resetBall();
        }
    }

    scoreLeftGoal() {
        if (!this.playing) return;

        this.playing = false;
        const player1 = this.players.get('player1');
        player1.score += 1;
        this.scoreLeft.setText(player1.score.toString());

        if (player1.score >= 2) {
            this.endGame("player1");
        } else {
            this.resetBall();
        }
    }

    endGame(winnerId) {
        this.ball.setVelocity(0, 0);
        this.players.forEach(paddle => {
            paddle.sprite.setVelocity(0, 0);
        });
        this.physics.pause();

        const winnerText = winnerId === 'player1' ? 'Left Player Wins!' : 'Right Player Wins!';
        this.add.text(400, 250, winnerText,{
            fontSize: '64px',
            color: '#00ff00'
        }).setOrigin(0.5);

        const menuBtn = this.add.text(400, 350, 'Return to Menu',{
            fontSize: '32px',
            color: '#ffffff'
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => menuBtn.setColor('#cccccc'))
        .on('pointerout', () => menuBtn.setColor('#ffffff'))
        .on('pointerdown', () => {
            this.scene.start('MenuScene');
        });
    }

    resetBall() {
        this.ball.setVelocity(0, 0);
        this.ball.setPosition(400, 300);
        this.time.delayedCall(1000, () => {
            this.launchBall();
        });
    }

    createBounds() {
        this.leftGoal = this.physics.add.sprite(0, 300, null);
        this.leftGoal.setDisplaySize(10, 600);
        this.leftGoal.body.setSize(10, 600);
        this.leftGoal.setImmovable(false);
        this.leftGoal.setVisible(false);

        this.rightGoal = this.physics.add.sprite(800, 300, null);
        this.rightGoal.setDisplaySize(10, 600);
        this.rightGoal.body.setSize(10, 600);
        this.rightGoal.setImmovable(false);
        this.rightGoal.setVisible(false);
    }

    createBall() {
        const graphics = this.add.graphics();
        graphics.fillStyle(0xffffff);
        graphics.fillCircle(8, 8, 8);
        graphics.generateTexture('ball', 16, 16);
        graphics.destroy();

        this.ball = this.physics.add.image(400, 300, 'ball');
        this.ball.setCollideWorldBounds(true);
        this.ball.setBounce(1);
    }

    launchBall() {
        const angle = Phaser.Math.Between(-30, 30);
        const speed = 0; // 400
        const direction = Math.random() < 0.5 ? 1 : -1; 
        this.playing = true;

        this.ball.setVelocity(
            Math.cos(Phaser.Math.DegToRad(angle)) * speed * direction,
            Math.sin(Phaser.Math.DegToRad(angle)) * speed
        )
    }

    setPauseState(isPaused) {
        this.isPaused = isPaused;

        if (this.isPaused) {
            this.scene.launch('PauseScene', {originalScene: 'GameScene'});
            this.scene.pause();
        }
    }

    resume() {
        this.isPaused = false;
    }

    togglePause() {
        const newPausedState = !this.isPaused;
        //this.setPauseState(newPausedState);
        this.processor.process(
            new PauseGameCommand(this, newPausedState)
        )
    }

    update() { //time, delta

        if (this.escKey.isDown) {
            this.togglePause();
        }
        
        this.inputsMapping.forEach(mapping => {
            const paddle = this.players.get(mapping.playerId);
            const otherPaddle = mapping.playerId === 'player1' ? this.player2 : this.player1;
            let direction = null;
            
            if (mapping.upKeyObj.isDown) {
                direction = 'up';
                //paddle.sprite.setVelocityY(-paddle.baseSpeed);
            } else if (mapping.downKeyObj.isDown) {
                direction = 'down';
                //paddle.sprite.setVelocityY(+paddle.baseSpeed);
            } else if (mapping.leftKeyObj.isDown) {
                direction = 'left';
                //paddle.sprite.setVelocityX(-paddle.baseSpeed);
            } else if (mapping.rightKeyObj.isDown) {
                direction = 'right';
                //paddle.sprite.setVelocityX(+paddle.baseSpeed);
            } else {
                direction = 'stop';
                //paddle.sprite.setVelocityY(0);
            }

            if (this.physics.collide(paddle.sprite, otherPaddle.sprite)) {
                if (direction === 'up' && paddle.sprite.y > otherPaddle.sprite.y) {
                    direction = 'stop';
                } else if (direction === 'down' && paddle.sprite.y < otherPaddle.sprite.y) {
                    direction = 'stop';
                } else if (direction === 'left' && paddle.sprite.x > otherPaddle.sprite.x) {
                    direction = 'stop';
                } else if (direction === 'right' && paddle.sprite.x < otherPaddle.sprite.x) {
                    direction = 'stop';
                }
            }

            this.processor.process(
                new MovePaddleCommand(paddle, direction)
            );
        });
    }
}
