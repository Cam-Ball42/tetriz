let ctx;

let canvas_height;
let canvas_width;
let columns;
let rows;
let cell_height;
let cell_width;



export function set_ctx(_ctx){
  ctx = _ctx;
}
export function init_tools(_canvas_width,_canvas_height,_columns,
                              _rows){
  canvas_height = _canvas_height;
  canvas_width = _canvas_width;
  columns = _columns;
  rows = _rows;
  cell_height = canvas_height/rows;
  cell_width = canvas_width/columns;
}


export function draw_grid(){
ctx.lineWidth = 0.5;
for(let x =0; x < canvas_width; x += cell_width) {
  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x, canvas_height);
  ctx.closePath();
  ctx.stroke();
  }

for(let y =0; y <canvas_height; y += cell_height) {
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(canvas_width, y);
  ctx.closePath();
  ctx.stroke();
  }
}

export function draw_square(x, y, type){
  switch (type) {
    case "O":
      ctx.fillStyle = "yellow";
      break;
    case "T":
      ctx.fillStyle = "purple";
      break;
    case "L":
      ctx.fillStyle = "orange";
      break;
    case "I" :
      ctx.fillStyle = "aqua";
      break;
    case "S":
      ctx.fillStyle = "green";
      break;
    case "Z":
      ctx.fillStyle = "red";
      break;
    case "J":
      ctx.fillStyle = "blue";
      break;
    default:
      ctx.fillStyle= "black";
      break;
  }
  ctx.fillRect(x, y, cell_width, cell_height);
}

export function draw_state(state){
 
  for (const [key,value] of state) {
    if (value != 'X'){
      draw_square(key.x * cell_width, key.y * cell_height, value);
      
    }

  } 
    
  
}
