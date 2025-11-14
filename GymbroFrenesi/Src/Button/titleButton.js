import Button from "./button.js";

class titleButton extends Button
{
    constructor(
        scene,
        x,
        y,
        text,
        callback,
        width = 400,
        height = 150,
        color = 0x220e17,
        alpha = 0.8,
        selectionColor = 0x220e17,
        
        radius = 50
    ){
        super(
            scene,
            x,
            y,
            text,
            callback,
            color,
            alpha,
            selectionColor,
            width,
            height,
            radius,
        );
        
        this.label.setFontFamily("something");

        super.gradient(0, "#B64E8B", 0.5, "#7A52A0");
    }
    
}
export default titleButton;