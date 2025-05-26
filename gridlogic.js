import Position from "./structs/position.js";
import Shape from "./shape.js";
import * as drawTools from "./draw_tools.js";

export default class Grid {
  current_shapes;
  active_shape;

  game_state = new Map();
  spawn_position = new Position(4, -1);

  rows;
  columns;

  shape_types;
  constructor() {
    this.current_shapes = [];
    this.active_shape = null;
    this.game_state = new Map();
    this.spawn_position = new Position(4, -1);
    this.rows = 20;
    this.columns = 10;
    this.shape_types = ["T", "L", "J", "O", "Z", "S", "I"];
  }
  init_state() {
    for (let x = 0; x < this.columns; x++) {
      for (let y = 0; y < this.rows; y++) {
        this.game_state.set(new Position(x, y).to_string(), "X");
      }
    }
  }

  get_state() {
    return this.game_state;
  }

  sync_state() {
    this.init_state(this.game_state);
    for (let i = 0; i < this.current_shapes.length; i++) {
      for (let j = 0; j < this.current_shapes[i].points.length; j++) {
        this.game_state.set(
          this.current_shapes[i].points[j]
            .add(this.current_shapes[i].pos)
            .to_string(),
          this.current_shapes[i].type,
        );
      }
    }
  }
  add_shape(type, pos) {
    const new_shape = new Shape(type, pos);
    this.current_shapes.push(new_shape);
    return new_shape;
  }
  spawn_shape() {
    const randI = Math.floor(Math.random() * 7);
    const new_shape = this.add_shape(
      this.shape_types[randI],
      new Position(this.spawn_position.x, this.spawn_position.y),
    );
    return new_shape;
  }

  move_shape(dirx, diry, shape) {
    if (this.check_move(shape, dirx, diry) === false) {
      const destx = shape.pos.x + dirx;
      const desty = shape.pos.y + diry;
      shape.pos.move(destx, desty);
      return true;
    }
    return false;
  }

  rotate_shape(shape) {
    if (this.check_rot(shape) === false) {
      shape.rotate_points();
      return true;
    }
    return false;
  }

  check_rot(shape) {
    const rot_points = shape.get_rotated_points();

    for (let i = 0; i < rot_points.length; i++) {
      const destx = rot_points[i].x + shape.pos.x;
      const desty = rot_points[i].y + shape.pos.y;
      //Hit bounds check
      if (!this.game_state.has(`${destx},${desty}`)) {
        return true;
      }
      //Check if cell is empty
      if (this.game_state.get(`${destx},${desty}`) !== "X") {
        let is_self = false;
        for (let j = 0; j < shape.points.length; j++) {
          //Check if cell is self
          if (
            shape.points[j].x + shape.pos.x === destx &&
            shape.points[j].y + shape.pos.y === desty
          ) {
            is_self = true;
            break;
          }
        }

        if (is_self === false) {
          return true;
        }
      }
    }
    return false;
  }

  check_move(shape, dirx, diry) {
    for (let i = 0; i < shape.points.length; i++) {
      const destx = shape.pos.x + dirx + shape.points[i].x;
      const desty = shape.pos.y + diry + shape.points[i].y;

      if (!this.game_state.has(`${destx},${desty}`)) {
        return true;
      }

      if (this.game_state.get(`${destx},${desty}`) !== "X") {
        //Check for self hit
        let is_self = false;

        for (let j = 0; j < shape.points.length; j++) {
          if (
            shape.points[j].x + shape.pos.x === destx &&
            shape.points[j].y + shape.pos.y === desty
          ) {
            is_self = true;
            break;
          }
        }
        if (is_self === false) {
          return true;
        }
      }
    }
    return false;
  }
  check_lines(ystart, yend) {
    const full_lines = [];
    for (let y = ystart; y < yend; y++) {
      let line_full = true;
      for (let x = 0; x < this.columns; x++) {
        if (this.game_state.get(`${x},${y}`) === "X") {
          line_full = false;
          break;
        }
      }
      if (line_full === true) {
        full_lines.push(y);
      }
    }
    return full_lines;
  }

  remove_full_lines(full_lines) {
    if (full_lines.length === 0) {
      return;
    }
    drawTools.flash_line_anim(full_lines[0]);
    this.delete_line(full_lines[0]);
    this.shift_lines(full_lines[0], 1);

    if (full_lines.length > 1) {
      this.remove_full_lines(full_lines.slice(1));
    }
  }

  delete_line(y) {
    let points_del = 0;
    for (let i = 0; i < this.current_shapes.length; i++) {
      for (let j = 0; j < this.current_shapes[i].points.length; j++) {
        if (
          this.current_shapes[i].points[j].y + this.current_shapes[i].pos.y ===
          y
        ) {
          this.current_shapes[i].remove_point(this.current_shapes[i].points[j]);
          points_del += 1;
          j += -1;
        }
      }
    }
  }
  shift_lines(ystart, amount) {
    const moved = [];
    for (let i = 0; i < this.current_shapes.length; i++) {
      for (let j = 0; j < this.current_shapes[i].points.length; j++) {
        if (
          this.current_shapes[i].points[j].y + this.current_shapes[i].pos.y <
          ystart
        ) {
          if (!moved.includes(this.current_shapes[i].points[j])) {
            this.current_shapes[i].points[j].y += amount;
            moved.push(this.current_shapes[i].points[j]);
          }
        }
      }
    }
  }

  set_active_shape(shape) {
    this.active_shape = shape;
  }
}
