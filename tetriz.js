import * as drawTools from "./draw_tools.js";
import Position from "./structs/position.js";
import Shape from "./shape.js";
import * as leaderboard from "./leaderboard.js";
let delta_time = 0;
let last_time = 0;
let drop_counter = 0;
const drop_interval = 500;
let game_over = false;

const debug_positions = [];

const rows = 20;
const columns = 10;

const shape_types = ["T", "L", "J", "O", "Z", "S", "I"];

const current_shapes = [];
let active_shape;
const spawn_position = new Position(4, -1);
const game_state = new Map();

let current_leaderboard;

let current_score = 0;

const score_element = document.getElementById("cur-score");
const level_element = document.getElementById("level");

init_state(game_state);

const canvas = document.getElementById("game_canvas");
let ctx;
const fx_canvas = document.getElementById("fx_canvas");
let fxctx;
if (canvas.getContext) {
  ctx = canvas.getContext("2d");
  drawTools.init_tools(canvas.width, canvas.height, columns, rows);
  drawTools.set_ctx(ctx);
  fxctx = fx_canvas.getContext("2d");
  drawTools.set_fxctx(fxctx);

  draw();
}
//init fx ctx
leaderboard.refresh_leaderboard();
// leaderboard.add_highscore("cam", 420);
game_loop();

function game_loop(current_time) {
  if (last_time === 0) {
    last_time = current_time;
    delta_time = 0;
    requestAnimationFrame(game_loop);
    return;
  }

  delta_time = current_time - last_time;
  if (Number.isNaN(delta_time)) {
    delta_time = 0;
  }
  last_time = current_time;
  drop_counter += Number.parseFloat(delta_time);

  if (active_shape == null) {
    active_shape = spawn_shape();
  }

  if (drop_counter > drop_interval) {
    if (move_shape(0, 1, active_shape) === false) {
      remove_full_lines(check_lines(0, rows));
      for (const point of active_shape.points) {
        if (
          point.x + active_shape.pos.x === 4 &&
          active_shape.pos.y + point.y === 0
        ) {
          game_over = true;
        }
      }

      active_shape = null;
    }
    sync_state(game_state, current_shapes);
    drop_counter = 0;
  }

  updateScore();
  draw();
  if (game_over === false) {
    requestAnimationFrame(game_loop);
  } else {
    handle_game_over();
  }
}

function handle_game_over() {
  if (leaderboard.determine_high_score(current_score) === true) {
    let name = prompt("Please enter a name for your highscore! : ", "name");
    console.log(name);
    if (name.length !== 0 && name !== null) {
      leaderboard.add_highscore(name, current_score);
      alert("Highscore added!");
    }

    const again = confirm("Do you want to play again?");
    if (again === true) {
      start_game();
    }
  } else {
    const again = confirm("Do you want to play again?");
    if (again === true) {
      start_game();
    }
  }
}
function start_game() {
  current_score = 0;
  init_state(game_state);
  current_shapes.length = 0;
  game_over = false;
  draw();
  requestAnimationFrame(game_loop);
}
function updateScore() {
  score_element.innerText = current_score;
}

function init_state(state) {
  for (let x = 0; x < columns; x++) {
    for (let y = 0; y < rows; y++) {
      state.set(new Position(x, y).to_string(), "X");
    }
  }
}

function sync_state(state, shapes) {
  init_state(state);
  for (let i = 0; i < shapes.length; i++) {
    for (let j = 0; j < shapes[i].points.length; j++) {
      state.set(
        shapes[i].points[j].add(shapes[i].pos).to_string(),
        shapes[i].type,
      );
    }
  }
}
function add_shape(type, pos) {
  const new_shape = new Shape(type, pos);
  current_shapes.push(new_shape);
  return new_shape;
}
function spawn_shape() {
  const randI = Math.floor(Math.random() * 7);
  const new_shape = add_shape(
    shape_types[randI],
    new Position(spawn_position.x, spawn_position.y),
  );
  return new_shape;
}

function move_shape(dirx, diry, shape) {
  if (check_move(shape, dirx, diry) === false) {
    const destx = shape.pos.x + dirx;
    const desty = shape.pos.y + diry;
    shape.pos.move(destx, desty);
    return true;
  }
  return false;
}

function rotate_shape(shape) {
  if (check_rot(shape) === false) {
    shape.rotate_points();
    return true;
  }
  return false;
}

function check_rot(shape) {
  const rot_points = shape.get_rotated_points();

  for (let i = 0; i < rot_points.length; i++) {
    const destx = rot_points[i].x + shape.pos.x;
    const desty = rot_points[i].y + shape.pos.y;
    //Hit bounds check
    if (!game_state.has(`${destx},${desty}`)) {
      return true;
    }
    //Check if cell is empty
    if (game_state.get(`${destx},${desty}`) !== "X") {
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

function check_move(shape, dirx, diry) {
  for (let i = 0; i < shape.points.length; i++) {
    const destx = shape.pos.x + dirx + shape.points[i].x;
    const desty = shape.pos.y + diry + shape.points[i].y;

    if (!game_state.has(`${destx},${desty}`)) {
      return true;
    }

    if (game_state.get(`${destx},${desty}`) !== "X") {
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
function check_lines(ystart, yend) {
  const full_lines = [];
  for (let y = ystart; y < yend; y++) {
    let line_full = true;
    for (let x = 0; x < columns; x++) {
      if (game_state.get(`${x},${y}`) === "X") {
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

function remove_full_lines(full_lines) {
  if (full_lines.length === 0) {
    return;
  }
  drawTools.flash_line_anim(full_lines[0]);
  delete_line(full_lines[0]);
  shift_lines(full_lines[0], 1);
  current_score += 1;

  if (full_lines.length > 1) {
    remove_full_lines(full_lines.slice(1));
  }
}

function delete_line(y) {
  let points_del = 0;
  for (let i = 0; i < current_shapes.length; i++) {
    for (let j = 0; j < current_shapes[i].points.length; j++) {
      if (current_shapes[i].points[j].y + current_shapes[i].pos.y === y) {
        current_shapes[i].remove_point(current_shapes[i].points[j]);
        points_del += 1;
        j += -1;
      }
    }
  }
}
function shift_lines(ystart, amount) {
  const moved = [];
  for (let i = 0; i < current_shapes.length; i++) {
    for (let j = 0; j < current_shapes[i].points.length; j++) {
      if (current_shapes[i].points[j].y + current_shapes[i].pos.y < ystart) {
        if (!moved.includes(current_shapes[i].points[j])) {
          current_shapes[i].points[j].y += amount;
          moved.push(current_shapes[i].points[j]);
        }
      }
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawTools.draw_state(game_state);

  drawTools.draw_grid(canvas.width, canvas.height, columns, rows);
}

window.addEventListener(
  "keypress",
  (e) => {
    switch (e.key) {
      case "a":
        //A : Move left
        move_shape(-1, 0, active_shape);
        sync_state(game_state, current_shapes);
        draw();
        break;
      case "d":
        //D Move right
        move_shape(1, 0, active_shape);
        sync_state(game_state, current_shapes);
        draw();
        break;
      case "s":
        //Move Down
        if (move_shape(0, 1, active_shape) === false) {
          active_shape = null;
          remove_full_lines(check_lines(0, rows));
        }
        current_score += 1;
        sync_state(game_state, current_shapes);
        draw();
        break;
      case "e":
        //Rotate
        rotate_shape(active_shape);
        sync_state(game_state, current_shapes);
        break;
      default:
        return;
    }
  },
  true,
);
