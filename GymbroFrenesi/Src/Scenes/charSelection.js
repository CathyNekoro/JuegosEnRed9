export default class charSelection extends Phaser.Scene
{
    constructor()
    {
        super({key: 'charSelection'});
    }
    
    preload()
    {
        this.load.image('personajes', '../Assets/Img/personajes.png')
    }

    create() 
    {
        this.add.image(0, 0, 'personajes').setOrigin(0, 0);
    }

    update(time, dt)
    {

    }
}