import Position from "./structs/position.js";

export default class Shape {
  pos;
  type;
  id;
  points;

  constructor(type, pos) {
    this.type = type;
    this.pos = pos;
    this.init_points(type);
  }

  rotate_points() {
    for (let i = 0; i < this.points.length; i++) {
      const orig_x = this.points[i].x;
      this.points[i].x = this.points[i].y * -1;
      this.points[i].y = orig_x;
    }
  }

  get_rotated_points() {
    const rot_points = [];
    for (let i = 0; i < this.points.length; i++) {
      const rotated_pos = new Position(this.points[i].y * -1, this.points[i].x);
      rot_points.push(rotated_pos);
    }
    return rot_points;
  }

  remove_point(pos) {
    for (let i = 0; i < this.points.length; i++) {
      if (pos.is_equal(this.points[i])) {
        this.points.splice(i, 1);
      }
    }
  }
  init_points(type) {
    switch (type) {
      case "I":
        this.points = [
          new Position(0, 0),
          new Position(0, 1),
          new Position(0, 2),
          new Position(0, 3),
        ];
        break;
      case "O":
        this.points = [
          new Position(0, 0),
          new Position(1, 0),
          new Position(0, 1),
          new Position(1, 1),
        ];
        break;
      case "T":
        this.points = [
          new Position(0, 0),
          new Position(-1, 0),
          new Position(1, 0),
          new Position(0, 1),
        ];
        break;
      case "J":
        this.points = [
          new Position(0, 0),
          new Position(0, 1),
          new Position(0, 2),
          new Position(-1, 2),
        ];
        break;
      case "L":
        this.points = [
          new Position(0, 0),
          new Position(0, 1),
          new Position(0, 2),
          new Position(1, 2),
        ];
        break;
      case "S":
        this.points = [
          new Position(0, 0),
          new Position(1, 0),
          new Position(0, 1),
          new Position(-1, 1),
        ];
        break;
      case "Z":
        this.points = [
          new Position(0, 0),
          new Position(-1, 0),
          new Position(0, 1),
          new Position(1, 1),
        ];
        break;
      default:
        break;
    }
  }
}
