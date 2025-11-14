class Button extends Phaser.GameObjects.Container {
  /**
   * Constructor de Button
   * @param {Scene} scene - escena en la que aparece
   * @param {number} x - coordenada x
   * @param {number} y - coordenada y
   * @param {string} text - texto que aparece en el boton
   * @param {callback} callback - función en la que se va a llamar al pulsar el boton con el click izq
   * @param {number} color - color base del boton
   * @param {number} alpha - transparencia del color base
   * @param {number} selectionColor - color del boton cuando el cursor esta encima
   * @param {number} width - anchura del boton
   * @param {number} height - altura del boton
   * @param {number} radius - radio del borde de la caja del boton
   */

    constructor(
        scene,
        x,
        y,
        text,
        callback,
        color = 0xf3d301,
        alpha = 1,
        selectionColor = 0xffffff,
        width = 200,
        height = 70,
        radius = 0) 
    {
        super(scene, x, y);

        if (radius > 0) 
        {
            // Usar Graphics para bordes redondeados
            this.background = scene.add.graphics();
            this.background.fillStyle(color, alpha);
            this.background.lineStyle(2, 0xffffff); // opcional borde
            this.background.fillRoundedRect(
                -width / 2,
                -height / 2,
                width,
                height,
                radius
            );
        } 
        
        else 
        {
            // Rectangle normal
            this.background = scene.add.rectangle(0, 0, width, height, color, alpha);
            this.background.setOrigin(0.5, 0.5);
        }

        const fontSize = height * 0.45;
        this.label = scene.add.text(0, 0, text, 
        {
            fontFamily: "chlorinap",
            fontSize: `${fontSize}px`,
            fill: "#000",
            letterSpacing: 10,
        });


        this.label.setOrigin(0.5, 0.5);

        // Agregar el fondo y el texto al contenedor
        this.add(this.background);
        this.add(this.label);

        // Hacer que el botón sea interactivo
        this.setSize(width, height);
        this.setInteractive({ useHandCursor: true });

        // Agregar el evento del clic
        this.on("pointerdown", (pointer) => 
        {
            if (pointer.leftButtonDown()) 
            {
                callback();
            }
        });
        
        this.on("pointerover", () => 
        {
            if (radius > 0) 
            {
                // Limpiar y redibujar
                this.background.clear();
                this.background.fillStyle(selectionColor);
                this.background.fillRoundedRect(
                    -width / 2,
                    -height / 2,
                    width,
                    height,
                    radius
                );
            } 
        else 
        {
            this.background.setFillStyle(selectionColor);
        }
        });

        this.on("pointerout", () => 
        {
            if (radius > 0) 
            {
                // Limpiar y redibujar
                this.background.clear();
                this.background.fillStyle(selectionColor, alpha);
                this.background.fillRoundedRect(
                -width / 2,
                -height / 2,
                width,
                height,
                radius
                );
            } 
            else 
            {
                this.background.setFillStyle(selectionColor, alpha);
            }
        });

        // Agregar el botón a la escena
        scene.add.existing(this);
    }

    gradient(colorStop1, color1, colorStop2, color2)
    {
        const text = this.label;
        const ctx = text.context;
        
        const gradient = ctx.createLinearGradient(0, 0, text.width, 0);
        gradient.addColorStop(colorStop1, color1); //
        gradient.addColorStop(colorStop2, color2); //"#7A52A0"

        // Aplicarlo al texto 
        text.setFill(gradient);
        text.dirty = true; // refresca el canvas

    }
}
export default Button;
