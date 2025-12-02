const quickCooldown = 6000; // 6 segundos de cooldown
const slowCooldown = 12000; // 12 segundos de cooldown

export default class Abilities
{
    constructor(player, scene, id, type, abilityType){

        this.player = player;
        this.scene = scene;
        
        this.id = id; // identificador unico de la habilidad
        this.type = type; // tipo del judador: leg, arm, pec, mog
        this.abilityType = abilityType; // slowAbility o quickAbility
        this.skillOneCooldown = slowCooldown;
        this.skillTwoCooldown = quickCooldown;
        this.isOnCooldown = false;
        this.cooldownTimer = null;
    }


    useAbility(){

        if(this.abilityType === "quickAbility"){
            if(this.type === 'leg'){
                this.legQuickAbility();
            } else if(this.type === 'arm'){
                this.armQuickAbility();
            } else if(this.type === 'pec'){
                this.pecQuickAbility();
            } else if(this.type === 'mog'){
                this.mogQuickAbility();
            }
        }

        if(this.abilityType === "slowAbility"){
            if(this.type === 'leg'){
              this.legSlowAbility();
            } else if(this.type === 'arm'){
               this.armSlowAbility();
            } else if(this.type === 'pec'){
                this.pecSlowAbility();
            } else if(this.type === 'mog'){
                this.mogSlowAbility();
            }
        }
        
    }    
}