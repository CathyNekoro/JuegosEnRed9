import { Command } from "./Command.js";

export class MovePaddleCommand extends Command {
    constructor(paddle, direction) {
        super();
        this.paddle = paddle;
        this.direction = direction;
    }

    execute() {
        const speed = this.paddle.baseSpeed;
        if (this.direction === 'up') {
            this.paddle.sprite.setVelocityY(-speed);
        } else if (this.direction === 'down') {
            this.paddle.sprite.setVelocityY(+speed);
        } else if (this.direction === 'left') {
            this.paddle.sprite.setVelocityX(-speed);
        } else if (this.direction === 'right') {
            this.paddle.sprite.setVelocityX(+speed);
        } else {
            this.paddle.sprite.setVelocityY(0);
            this.paddle.sprite.setVelocityX(0);
        }
    }
}