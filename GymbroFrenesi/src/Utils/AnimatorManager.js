const CHARACTER_CONFIG = {
    legDay: {
        texture: "charLegsSprite",   
        anims: {
            walk: { sheet: 'PiernaWalk',  start: 0, end: 3, rate: 8, repeat: -1 },
            jump: { sheet: 'PiernaSalto', start: 0, end: 1, rate: 4, repeat: 0 },
            fall: { sheet: 'PiernaRIP',   start: 0, end: 0, rate: 1, repeat: 0 },
            idle: { sheet: 'PiernaWalk',  start: 0, end: 0, rate: 1, repeat: 0 },
        }
    },  

    armDay: {
        texture: "charArmsSprite",
        anims: {
            walk: { sheet: 'BrazoWalk',  start: 0, end: 3, rate: 8, repeat: -1 },
            jump: { sheet: 'BrazoSalto', start: 0, end: 1, rate: 4, repeat: 0 },
            fall: { sheet: 'BrazoRIP',   start: 0, end: 1, rate: 1, repeat: 0 },
            idle: { sheet: 'BrazoWalk',  start: 0, end: 0, rate: 1, repeat: 0 },
        }
    },

    coreDay: {
        texture: "charCoreSprite",
        anims: {
            walk: { sheet: 'CoreWalk',  start: 0, end: 3, rate: 8, repeat: -1 },
            jump: { sheet: 'CoreSalto', start: 0, end: 1, rate: 4, repeat: 0 },
            fall: { sheet: 'CoreWalk',  start: 0, end: 0, rate: 1, repeat: 0 },
            idle: { sheet: 'CoreWalk',  start: 0, end: 0, rate: 1, repeat: 0 },
        }
    },
    mewingDay: {
        texture: "charMewingSprite",
        anims: {
            walk: { sheet: 'MewingWalk',  start: 0, end: 3, rate: 8, repeat: -1 },
            jump: { sheet: 'MewingSalto', start: 0, end: 1, rate: 4, repeat: 0 },
            fall: { sheet: 'MewingRIP',   start: 0, end: 0, rate: 1, repeat: 0 },
            idle: { sheet: 'MewingWalk',  start: 0, end: 0, rate: 1, repeat: 0 },
        }
    }
};

function registerAnimations(scene, charKey) {
    const config = CHARACTER_CONFIG[charKey];
    const animationKeys = {};

    Object.entries(config.anims).forEach(([action, anim]) => {
        const key = `${charKey}_${action}`;

        if (!scene.anims.exists(key)) {
            scene.anims.create({
                key,
                frames: scene.anims.generateFrameNumbers(anim.sheet, {
                    start: anim.start,
                    end: anim.end
                }),
                frameRate: anim.rate,
                repeat: anim.repeat
            });
        }

        animationKeys[action] = key;
    });

    return animationKeys;
}

export { CHARACTER_CONFIG, registerAnimations };