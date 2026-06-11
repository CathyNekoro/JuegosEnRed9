import Button from "./button.js";

class charSelectButton extends Button {
  constructor(
    scene,
    x,
    y,
    text,
    callback,
    width = 444,
    height = 1140,
    color = 0x000000,
    alpha = 0.1,
    selectionColor = 0x111111,
    selectionAlpha = 0.3,

    radius = 1,
  ) {
    super(
      scene,
      x,
      y,
      text,
      callback,
      color,
      alpha,
      selectionColor,
      selectionAlpha,
      width,
      height,
      radius,
    );

    this.label.setFontFamily("something");
  }
}
export default charSelectButton;
