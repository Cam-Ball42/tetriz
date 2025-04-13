export default class position {
  x;
  y;

  constructor (x =0, y=0) {
    this.x = x;
    this.y = y;
  }

  from_string (str = '0,0)') {
    let pos = str.split(',');
    return new position(parseInt(pos[0]),parseInt(pos[1]))
  }

  to_string() {
    return(`${this.x},${this.y}`)
  }

  is_equal(position) {
    if (position.y ==this.y && position.x == this.x) {
      return true;
    } else {
      return false;
    }
  }

  move(destx, desty){
    this.x = destx;
    this.y = desty;
  }


  add(_position){
    const result = new position();
    result.x = this.x + _position.x;
    result.y = this.y + _position.y;
    return result;
  }
}
