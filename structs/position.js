export default class position {
  x;
  y;

  constructor (x =0, y=0) {
    this.x = x;
    this.y = y;
  }

  to_string() {
    return(`X: ${this.x}, Y: ${this.y}`)
  }

  is_equal(position) {
    if (position.y ==this.y && position.x == this.x) {
      return true;
    } else {
      return false;
    }
  }
}
