const CHARACTER_CONFIG = {
    legDay: {
        texture: "charLegsSprite",   
        color: 0x87000F,
        colorHex: '#87000F',
        anims: {
            walk: { sheet: 'PiernaWalk',  start: 0, end: 3, rate: 8, repeat: -1 },
            jump: { sheet: 'PiernaSalto', start: 0, end: 1, rate: 1, repeat: 0 },
            fall: { sheet: 'PiernaRIP',   start: 0, end: 0, rate: 1, repeat: 0 },
            idle: { sheet: 'PiernaWalk',  start: 0, end: 0, rate: 1, repeat: 0 },
        },
        selectionAnims: {
            preview: { sheet: 'pierna', start: 0, end: 8, rate: 6, repeat: 0 },
        }
    },  

    armDay: {
        texture: "charArmsSprite",
        color: 0x1D5384,
        colorHex: '#1D5384',
        anims: {

            walk: { sheet: 'BrazoWalk',  start: 0, end: 3, rate: 8, repeat: -1 },
            jump: { sheet: 'BrazoSalto', start: 0, end: 1, rate: 4, repeat: 0 },
            fall: { sheet: 'BrazoRIP',   start: 0, end: 0, rate: 1, repeat: 0 },
            idle: { sheet: 'BrazoWalk',  start: 0, end: 0, rate: 1, repeat: 0 },
        },
        selectionAnims: {
            preview: { sheet: 'brazo', start: 0, end: 6, rate: 6, repeat: 0 },
        }
    },

    coreDay: {
        texture: "charCoreSprite",
        color: 0x346F44,
        colorHex: '#346F44',
        anims: {
            walk: { sheet: 'CoreWalk',  start: 0, end: 3, rate: 8, repeat: -1 },
            jump: { sheet: 'CoreSalto', start: 0, end: 1, rate: 4, repeat: 0 },
            fall: { sheet: 'CoreRIP',  start: 0, end: 0, rate: 1, repeat: 0 },
            idle: { sheet: 'CoreWalk',  start: 0, end: 0, rate: 1, repeat: 0 },
        },
        selectionAnims: {
            preview: { sheet: 'core', start: 0, end: 4, rate: 8, repeat: 0 },
        }
    },
    mewingDay: {
        texture: "charMewingSprite",
        color: 0xB1984E,
        colorHex:'#B1984E',
        anims: {
            walk: { sheet: 'MewingWalk',  start: 0, end: 3, rate: 8, repeat: -1 },
            jump: { sheet: 'MewingSalto', start: 0, end: 1, rate: 4, repeat: 0 },
            fall: { sheet: 'MewingRIP',   start: 0, end: 0, rate: 1, repeat: 0 },
            idle: { sheet: 'MewingWalk',  start: 0, end: 0, rate: 1, repeat: 0 },
        },
        selectionAnims: {
            preview: { sheet: 'mewing', start: 0, end: 13, rate: 7, repeat: 0 },
        }
    }
};

function registerAnimations(scene, charKey, group = 'anims') {
    const config = CHARACTER_CONFIG[charKey];
    const animData = config[group];
    if (!animData) return {};

    const animationKeys = {};

    Object.entries(animData).forEach(([action, anim]) => {
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