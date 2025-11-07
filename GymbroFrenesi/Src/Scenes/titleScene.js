
export default class pantallaInicio extends Phaser.Scene
{
    constructor()
    {
        super({key: 'pantallaInicio'});
    }
    
    preload()
    {
        this.load.image('pantallaInicio', '../Assets/Img/pantallaInicio.png')
    }

    create() 
    {
        this.add.image(0, 0, 'pantallaInicio').setOrigin(0, 0);
    }

    update(time, dt)
    {

    }
}