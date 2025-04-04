import * as drawTools from './draw_tools.js';
import Position from './structs/position.js';
import Shape from './shape.js';

const rows = 20;
const columns =10;



const current_shapes = [];
const game_state = new Map();

init_state(game_state);
let test_shape = new Shape("T", new Position(5, 10), 3);
add_shape(test_shape);

sync_state(game_state, current_shapes);
print_state(game_state);

console.log(test_shape.pos.x);


const canvas = document.getElementById("canvas");
let ctx;
if(canvas.getContext) {
  ctx = canvas.getContext("2d");
  drawTools.set_ctx(ctx); 
  print_f("Yolza");

  draw();
}

//TODO change way co-ords are stored
function init_state(state) {
  for (let x = 0; x < columns ; x++) {
    for (let y = 0; y < rows; y++) {
      let new_pos = new Position(x, y);
      state.set(new_pos, "X");
    }
    
  }
}
function sync_state(state, shapes){
  for (const shape of shapes) {
    for(const point of shape.points) {
      state.set(point, shape.type)
    }
  }

}

function add_shape(shape){
  current_shapes.push(shape);
}

function print_state(state) { 
  const out = [];
  console.log(`Printing state.....\n`)
  for (const [key,value] of state){
    out.push("$")
  }
  
  
}

function print_f(string) {
  console.log(string)
}


function draw() {
  drawTools.draw_grid(canvas.width,canvas.height,columns,rows);
  drawTools.draw_state(game_state);
  
}




