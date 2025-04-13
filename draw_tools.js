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
function roundedRect(x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x, y + radius);
  ctx.arcTo(x, y + height, x + radius, y + height, radius);
  ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
  ctx.arcTo(x + width, y, x + width - radius, y, radius);
  ctx.arcTo(x, y, x, y + radius, radius);
  ctx.stroke();
  ctx.fill();
}

export function draw_square(x, y, type){
  ctx.lineWidth = 1.5;
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
  //ctx.fillRect(x, y, cell_width, cell_height, 90);
  roundedRect(x,y,cell_width,cell_height,5);
}

export function draw_state(state){
 
  for (const [key,value] of state) {
    if (value != 'X'){
      let pos= key.split(",");
      
      draw_square(parseInt(pos[0]) * cell_width, parseInt(pos[1]) * cell_height, value);
      
    }

  } 
    
  
}
