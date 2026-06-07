const CHARACTER_CONFIG = {
    legDay: {
        texture: "charLegsSprite",   
        color: 0x87000F,
        colorHex: '#87000F',
        anims: {
            walk: { sheet: 'PiernaWalk',  start: 0, end: 3, rate: 8, repeat: -1 },
            ability: { sheet: 'PiernaHab', start: 0, end: 1, rate: 1, repeat: 0 },
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
            ability: { sheet: 'BrazoHab', start: 0, end: 1, rate: 4, repeat: 0 },
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
            ability: { sheet: 'CoreHab', start: 0, end: 1, rate: 4, repeat: 0 },
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
            ability: { sheet: 'MewingHab', start: 0, end: 1, rate: 4, repeat: 0 },
            fall: { sheet: 'MewingRIP',   start: 0, end: 0, rate: 1, repeat: 0 },
            idle: { sheet: 'MewingWalk',  start: 0, end: 0, rate: 1, repeat: 0 },
        },
        selectionAnims: {
            preview: { sheet: 'mewing', start: 0, end: 13, rate: 7, repeat: 0 },
        }
    },
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
const DEV_CONFIG = {
    cathy: { sheet: 'Cathy', start: 0, end: 1, rate: 2, repeat: -1 },
    alex:  { sheet: 'popAnim',  start: 0, end: 5, rate: 8, repeat: -1 },
    axlin: { sheet: 'axlinAnim', start: 0, end: 5, rate: 8, repeat: -1 }
};

function registerDevAnimations(scene, devKey) {
    const config = DEV_CONFIG[devKey];
    if (!config) return null;

    const key = `dev_${devKey}`;
    if (!scene.anims.exists(key)) {
        scene.anims.create({
            key,
            frames: scene.anims.generateFrameNumbers(config.sheet, {
                start: config.start,
                end: config.end
            }),
            frameRate: config.rate,
            repeat: config.repeat
        });
    }
    return key;
}

export { CHARACTER_CONFIG, registerDevAnimations, registerAnimations };