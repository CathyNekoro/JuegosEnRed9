
export default class noConnectionScene extends Phaser.Scene {
    constructor() {
        super({ key: "noConnectionScene" });
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Overlay semi-transparente que cubre toda la pantalla
        this.add.rectangle(0, 0, width, height, 0xffffff, 0.85).setOrigin(0, 0);

         // Mensaje principal
        this.add.text(width / 2, height / 2 - 80, "Sin conexión con el servidor", {
            fontFamily: "something",
            fontSize: "100px",
            color: "#000000",
            align: "center"
        }).setOrigin(0.5);

        // Mensaje secundario
        this.add.text(width / 2, height / 2 + 20, "Reintentando", {
            fontFamily: "something",
            fontSize: "80px",
            color: "#000000"
        }).setOrigin(0.5);

        // Animación de puntos
        this.dotsText = this.add.text(width / 2, height / 2 + 100, "", {
            fontFamily: "something",
            fontSize: "80px",
            color: "#881212"
        }).setOrigin(0.5);

        let dots = 0;
        this.dotsTimer = this.time.addEvent({
            delay: 500,
            loop: true,
            callback: () => {
                dots = (dots + 1) % 4;
                this.dotsText.setText('.'.repeat(dots));
            }
        });
    }
}