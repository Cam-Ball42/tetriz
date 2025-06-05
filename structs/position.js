export default class position {
  x;
  y;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  from_string(str = "0,0)") {
    const pos = str.split(",");
    return new position(Number.parseInt(pos[0]), Number.parseInt(pos[1]));
  }

  to_string() {
    return `${this.x},${this.y}`;
  }

  is_equal(position) {
    if (position.y === this.y && position.x === this.x) {
      return true;
    }
  }

  move(destx, desty) {
    this.x = destx;
    this.y = desty;
  }

  get_x() {
    return this.x;
  }

  get_y() {
    return this.y;
  }

  add(_position) {
    const result = new position();
    result.x = this.x + _position.x;
    result.y = this.y + _position.y;
    return result;
  }

  add_to_self(x, y) {
    this.x = x;
    this.y = y;
  }
}
