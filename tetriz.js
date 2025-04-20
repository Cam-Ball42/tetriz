import * as drawTools from './draw_tools.js';
import Position from './structs/position.js';
import Shape from './shape.js';
let delta_time = 0;
let last_time = 0;
let drop_counter = 0;
let drop_interval = 500;

const debug_positions = [];

const rows = 20;
const columns = 10;

const shape_types = ["T", "L", "J", "O", "Z", "S", "I"];

let id_count = 0;
const current_shapes = [];
let active_shape;
const game_state = new Map();

init_state(game_state);
active_shape = spawn_shape();
//active_shape = add_shape("Z", new Position(4, 2));


sync_state(game_state, current_shapes);
print_state(game_state);

game_loop();

const canvas = document.getElementById("canvas");
let ctx;
if (canvas.getContext) {
  ctx = canvas.getContext("2d");
  drawTools.init_tools(canvas.width, canvas.height, columns, rows);
  drawTools.set_ctx(ctx);
  print_f("Yolza");

  draw();
}

function game_loop(current_time) {

  if (last_time == 0) {
    last_time = current_time;
    delta_time = 0;
    requestAnimationFrame(game_loop);
    return;
  }

  delta_time = current_time - last_time;
  if (isNaN(delta_time)) {
    delta_time = 0;
  }
  last_time = current_time;
  drop_counter += parseFloat(delta_time);

  if (active_shape == null) {
    active_shape = spawn_shape();
  }

  if (drop_counter > drop_interval) {
    if (move_shape(0, 1, active_shape) == false) {
      console.log(check_lines(0,rows));
      active_shape = null;
    }
    sync_state(game_state, current_shapes);
    drop_counter = 0;

  }
  draw();
  requestAnimationFrame(game_loop);

}

function init_state(state) {
  for (let x = 0; x < columns; x++) {
    for (let y = 0; y < rows; y++) {
      let new_pos = new Position(x, y);
      state.set(new_pos.to_string(), "X");
    }

  }
}

function sync_state(state, shapes) {
  init_state(state);
  for (let i = 0; i < shapes.length; i++) {
    for (let j = 0; j < shapes[i].points.length; j++) {
      state.set(shapes[i].points[j].add(shapes[i].pos).to_string(), shapes[i].type);
    }
  }
}
function add_shape(type, pos) {
  id_count++;
  let new_shape = new Shape(type, pos);
  new_shape.id = id_count;
  current_shapes.push(new_shape);
  return new_shape;
}
function spawn_shape() {
  let randI = Math.floor(Math.random() * 7);
  const new_shape = add_shape(shape_types[randI], new Position(5, 1));
  return new_shape;
}


function move_shape(dirx, diry, shape) {
  if (check_move(shape, dirx, diry) == false) {
    let destx = shape.pos.x + dirx;
    let desty = shape.pos.y + diry;
    shape.pos.move(destx, desty);
    return true;
  }
  else {
    return false;
  }
}

function rotate_shape(shape) {
  if (check_rot(shape) == false) {
    shape.rotate_points();
    return true;
  }
  else {
    return false;
  }
}

function check_rot(shape) {
  let has_hit = false;
  let rot_points = shape.get_rotated_points();

  for (let i = 0; i < rot_points.length;i++){

    const destx = rot_points[i].x + shape.pos.x;
    const desty = rot_points[i].y + shape.pos.y;

    if (!game_state.has(`${destx},${desty}`)){
      return true;
    }

    if(game_state.get(`${destx},${desty}`) != "X") {

      let is_self = false;
      for(let j =0; j < shape.points.length;j++){
        if(shape.points[j].x + shape.pos.x == destx &&
          shape.points[j].y + shape.pos.y == desty){
          is_self = true;
          break;
        }
      }

      if(is_self==false){
        console.log("hit self");
        return true;
      }

    }
  }
  return false;
}

function check_move(shape, dirx, diry) {
  let has_hit = false;

  for (let i = 0; i < shape.points.length; i++) {

    const destx = shape.pos.x + dirx + shape.points[i].x;
    const desty = shape.pos.y + diry + shape.points[i].y;

    if (!game_state.has(`${destx},${desty}`)) {
      console.log(`${shape.type} hit bounds at ${destx}, ${desty}`);
      return true;
    }

    if (game_state.get(`${destx},${desty}`) != "X") {
      //Check for self hit
      let is_self = false;

      for (let j = 0; j < shape.points.length; j++) {
        if (shape.points[j].x + shape.pos.x == destx &&
          shape.points[j].y + shape.pos.y == desty) {
          is_self = true;
          break;
        }
      }
      if (is_self == false) {
        return true;
      }

    }

  }
  return has_hit;
}

function check_lines(ystart,yend){
  let full_lines = [];
  for(let y = ystart; y < yend; y++){
    let line_full = true;
    for (let x = 0; x < columns; x++){
      if (game_state.get(`${x},${y}`) == "X" ){
        line_full = false;
        break;
      }
    }
    if (line_full == true){
      full_lines.push(y);
      delete_line(y);
    }
  }
  if (full_lines.length > 0) {
    console.log(`ystart: ${Math.max(...full_lines)}`);
    shift_lines(Math.max(...full_lines), full_lines.length);
  }
  return full_lines;
}

function delete_line(y){
  let points_del = 0;
  for(let i =0; i < current_shapes.length;i++){
    for(let j =0; j < current_shapes[i].points.length; j++){
      if(current_shapes[i].points[j].y + current_shapes[i].pos.y == y){
        current_shapes[i].remove_point(current_shapes[i].points[j]);
        points_del += 1;
        j += -1;
      }
    }
  }
  console.log(`points_del: ${points_del}`);
}

//TODO find appropriate y_end;
//Also pretty sure a bug is happening after shapes get 'split'
function shift_lines(ystart, amount){
  const moved = []
  for(let i =0; i < current_shapes.length;i++){
    for(let j =0; j < current_shapes[i].points.length;j++){
      if(current_shapes[i].points[j].y + current_shapes[i].pos.y < ystart) {
        console.log(amount);
        if (!moved.includes(current_shapes[i])){
          current_shapes[i].pos.y += amount; 
          moved.push(current_shapes[i]);
          
        }
        
      }
    }
  }

}
function print_state(state) {
  const out = [];
  console.log(`Printing state.....\n`)
  for (const [key, value] of state) {
    out.push(`${key} : ${value}`);
  }
  out.join("\n");
  console.log(out);
}

function print_f(string) {
  console.log(string)
}


function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawTools.draw_state(game_state);

  drawTools.draw_grid(canvas.width, canvas.height, columns, rows);
}

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "a":
      //A : Move left
      console.log("A Pressed");
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
      if (move_shape(0, 1, active_shape) == false) {
        console.log(check_lines(0,rows));
        active_shape = null;
      }
      sync_state(game_state, current_shapes);
      draw();
      break;
    case "e":
      //Rotate
      rotate_shape(active_shape);
      sync_state(game_state, current_shapes);
      break;
    default:
      console.log("default");
      return;
  }
},
  true,
)



