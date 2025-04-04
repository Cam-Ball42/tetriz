import * as drawTools from './draw_tools.js';
import Shape from './shape.js';


const canvas = document.getElementById("canvas");
let ctx;
if(canvas.getContext) {
  ctx = canvas.getContext("2d");
  drawTools.set_ctx(ctx); 
  print_f("Yolza");

  draw();
}

const game_state = new Map();
init_state(game_state);
let test_shape = new Shape("T", "2,2", 3);
add_shape(test_shape);
drawTools.draw_state(game_state);

//TODO change way co-ords are stored
function init_state(state) {
  for (let x = 0; x < 10 ; x++) {
    for (let y = 0; y < 24; y++) {
      state.set(`${x},${y}`, "X");
    }
    
  }
}

function add_shape(shape){
  game_state.set(`${shape.pos}`, `${shape.type}`)
}

function print_state(state) { 
  console.log(state);
  
}

function print_f(string) {
  console.log(string)
}


function draw() {
  drawTools.draw_grid(canvas.width,canvas.height,20);
  
}




