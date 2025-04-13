import * as drawTools from './draw_tools.js';
import Position from './structs/position.js';
import Shape from './shape.js';

const rows = 20;
const columns =10;


let id_count = 0;
const current_shapes = [];
const game_state = new Map();

init_state(game_state);
add_shape("T", new Position(4,7));
move_shape(2,1,current_shapes[0]);

sync_state(game_state, current_shapes);
print_state(game_state);


const canvas = document.getElementById("canvas");
let ctx;
if(canvas.getContext) {
ctx = canvas.getContext("2d");
  drawTools.init_tools(canvas.width,canvas.height, columns, rows);
  drawTools.set_ctx(ctx); 
  print_f("Yolza");

  draw();
}


function init_state(state) {
  for (let x = 0; x < columns ; x++) {
    for (let y = 0; y < rows; y++) {
      let new_pos = new Position(x, y);
      state.set(new_pos.to_string(), "X");
    }
    
  }
}
function sync_state(state, shapes){
  for (const shape of shapes) {
    for(const point of shape.points) {

      state.set(point.add(shape.pos).to_string(), shape.type);
    }
  }

}

function add_shape(type, pos){
  id_count++;
  let new_shape = new Shape(type,pos);
  new_shape.id = id_count;
  current_shapes.push(new_shape);
}

function move_shape(dirx, diry, shape){
    let destx = shape.pos.x + dirx;
    let desty = shape.pos.y + diry; 
  if(true) { 
    let dest_pos = `${destx},${desty}`;
    game_state.set(shape.pos.to_string(), "X");
    
    game_state.set(dest_pos, shape.type );
    shape.pos.move(destx, desty);


  }
}



function print_state(state) { 
  const out = [];
  console.log(`Printing state.....\n`)
  for (const [key,value] of state){
    out.push(`${key} : ${value}`);
  }
  out.join("\n");
  console.log(out);
}

function print_f(string) {
  console.log(string)
}

function draw() {
  drawTools.draw_grid(canvas.width,canvas.height,columns,rows);
  drawTools.draw_state(game_state);
}




